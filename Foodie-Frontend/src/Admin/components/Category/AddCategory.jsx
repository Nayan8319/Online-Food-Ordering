import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import "bootstrap/dist/css/bootstrap.min.css";

const AddCategory = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    isActive: true,
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (form.imageUrl && isValidImageUrl(form.imageUrl)) {
      setImagePreviewUrl(form.imageUrl);
    } else if (form.imageUrl && isBase64(form.imageUrl)) {
      setImagePreviewUrl(form.imageUrl);
    } else {
      setImagePreviewUrl(null);
    }
  }, [imageFile, form.imageUrl]);

  function isBase64(str) {
    return /^data:image\/(png|jpeg|jpg|gif|bmp);base64,/.test(str);
  }

  function isValidImageUrl(url) {
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  function base64toFile(base64String, filename) {
    const arr = base64String.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "imageUrl" && value) {
      setImageFile(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setForm((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return Swal.fire("Missing Name", "Category name is required.", "warning");
    }

    if (!imageFile && !form.imageUrl.trim()) {
      return Swal.fire(
        "Image Required",
        "Please upload an image file or provide an online image URL or Base64 string.",
        "warning"
      );
    }

    try {
      const token = localStorage.getItem("token");
      let payload;
      let headers;

      if (imageFile) {
        payload = new FormData();
        payload.append("name", form.name);
        payload.append("isActive", form.isActive.toString());
        payload.append("image", imageFile);

        headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        };
      } else if (isBase64(form.imageUrl)) {
        const fileFromBase64 = base64toFile(form.imageUrl, "imageFromBase64.png");
        payload = new FormData();
        payload.append("name", form.name);
        payload.append("isActive", form.isActive.toString());
        payload.append("image", fileFromBase64);

        headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        };
      } else if (isValidImageUrl(form.imageUrl)) {
        payload = {
          name: form.name,
          isActive: form.isActive,
          imageUrl: form.imageUrl,
        };
        headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
      } else {
        return Swal.fire(
          "Invalid Image",
          "Invalid image input. Please upload a file, provide a valid URL, or Base64 image.",
          "error"
        );
      }

      await axios.post("http://localhost:5110/api/Category", payload, { headers });

      await Swal.fire("Success", "Category created successfully!", "success");
      navigate("/admin/Categories");
    } catch (error) {
      console.error("Error creating category", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create category. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Add new category</h2>
        <button
          type="submit"
          form="categoryForm"
          className="btn btn-dark"
          disabled={!form.name.trim()}
        >
          Publish category
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        id="categoryForm"
        className="row g-4"
        encType="multipart/form-data"
      >
        {/* Left side */}
        <div className="col-md-6">
          <h5>Basic information</h5>

          <label className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter a category name..."
            required
          />

          <div className="form-check form-switch mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="isActiveSwitch"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="isActiveSwitch">
              Is Active
            </label>
          </div>
        </div>

        {/* Right side */}
        <div className="col-md-6">
          <h5>Category image</h5>
          <div
            className="border border-secondary rounded p-4 text-center"
            style={{ minHeight: "300px" }}
          >
            <label
              htmlFor="uploadImg"
              className="d-block mb-2"
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-cloud-arrow-up" style={{ fontSize: "2rem" }}></i>
              <br />
              <strong>Click to upload</strong> or drag and drop
              <br />
              <small>SVG, PNG, JPG or GIF (MAX. 800×400px)</small>
            </label>
            <input
              type="file"
              id="uploadImg"
              accept="image/*"
              className="d-none"
              onChange={handleImageUpload}
            />

            {imagePreviewUrl && (
              <div className="mt-3">
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: "200px" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    Swal.fire("Error", "Invalid image URL/Base64. Please check and try again.", "error");
                  }}
                />
              </div>
            )}

            <hr />

            <label htmlFor="onlineImageUrl" className="form-label mt-3">
              Or enter online image URL or Base64 image string
            </label>
            <textarea
              id="onlineImageUrl"
              name="imageUrl"
              className="form-control"
              placeholder="Paste image URL or Base64 string here"
              value={form.imageUrl}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;

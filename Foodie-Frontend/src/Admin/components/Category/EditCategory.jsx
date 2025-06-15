import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    isActive: true,
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrlError, setImageUrlError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5110/api/Category/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          name: res.data.name,
          isActive: res.data.isActive,
          imageUrl: res.data.imageUrl || "",
        });
        setLoading(false);
      } catch (error) {
        Swal.fire("Error", "Failed to load category data.", "error");
        navigate("/admin/Categories");
      }
    };
    fetchCategory();
  }, [id, navigate]);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (form.imageUrl && isBase64(form.imageUrl)) {
      setImagePreviewUrl(form.imageUrl);
    } else if (form.imageUrl && isValidImageUrl(form.imageUrl)) {
      setImagePreviewUrl(form.imageUrl);
    } else if (form.imageUrl && form.imageUrl.startsWith("/CategoryImages/")) {
      setImagePreviewUrl(`http://localhost:5110${form.imageUrl}`);
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

  function isValidImageInput(input) {
    if (!input) return false;
    input = input.trim();
    return (
      input.startsWith("/CategoryImages/") ||
      isValidImageUrl(input) ||
      isBase64(input)
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "imageUrl") {
      setImageFile(null);
      if (value.trim() === "" || isValidImageInput(value)) {
        setImageUrlError("");
      } else {
        setImageUrlError(
          "Invalid input: must be a relative path (/CategoryImages/...), full URL, or Base64 image."
        );
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    setImageUrlError("");
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedImageUrl = form.imageUrl.trim();

    if (!form.name.trim()) {
      Swal.fire("Validation Error", "Category name is required.", "warning");
      return;
    }

    if (!imageFile && !trimmedImageUrl) {
      Swal.fire(
        "Validation Error",
        "Please upload an image file or provide a valid image URL/Base64.",
        "warning"
      );
      return;
    }

    if (trimmedImageUrl && !isValidImageInput(trimmedImageUrl)) {
      Swal.fire(
        "Validation Error",
        "Invalid image input. Provide a relative path, full URL, or Base64 image.",
        "warning"
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let payload;
      let headers;

      if (imageFile) {
        payload = new FormData();
        payload.append("Name", form.name);
        payload.append("IsActive", form.isActive.toString());
        payload.append("ImageUrl", "");
        payload.append("image", imageFile);

        headers = { Authorization: `Bearer ${token}` };
      } else if (isBase64(trimmedImageUrl)) {
        const fileFromBase64 = base64toFile(trimmedImageUrl, "imageFromBase64.png");
        payload = new FormData();
        payload.append("Name", form.name);
        payload.append("IsActive", form.isActive.toString());
        payload.append("ImageUrl", "");
        payload.append("image", fileFromBase64);

        headers = { Authorization: `Bearer ${token}` };
      } else {
        payload = {
          Name: form.name,
          IsActive: form.isActive,
          ImageUrl: trimmedImageUrl,
        };
        headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        };
      }

      await axios.put(`http://localhost:5110/api/Category/${id}`, payload, {
        headers,
      });

      Swal.fire("Success", "Category updated successfully!", "success").then(() =>
        navigate("/admin/Categories")
      );
    } catch (error) {
      console.error("Error updating category", error);
      Swal.fire("Error", error.response?.data || "Failed to update category.", "error");
    }
  };

  if (loading) {
    return Swal.fire({
      title: "Loading...",
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
    });
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Edit category</h2>
        <button
          type="submit"
          form="categoryForm"
          className="btn btn-dark"
          disabled={!form.name.trim() || imageUrlError !== ""}
        >
          Update category
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        id="categoryForm"
        className="row g-4"
        encType="multipart/form-data"
      >
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
              <img
                src={imagePreviewUrl}
                alt="Category preview"
                className="img-fluid rounded mt-3"
                style={{ maxHeight: "200px" }}
              />
            )}

            <hr />

            <label htmlFor="imageUrl" className="form-label mt-3">
              Or enter an online image URL, Base64 string, or relative path
            </label>
            <input
              type="text"
              className="form-control"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="e.g., https://example.com/image.png or /CategoryImages/image.png"
            />
            {imageUrlError && (
              <small className="text-danger">{imageUrlError}</small>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // category id from URL

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
    // Load category data by id
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
        alert("Failed to load category data.");
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
      // Prepend backend origin for preview
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
      setImageFile(null); // clear image file if URL/Base64 typed manually

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
      alert("Category name is required.");
      return;
    }

    if (!imageFile && !trimmedImageUrl) {
      alert(
        "Please upload an image file or provide an online image URL or Base64 string."
      );
      return;
    }

    if (trimmedImageUrl && !isValidImageInput(trimmedImageUrl)) {
      alert(
        "Invalid image input. Must be a relative path (/CategoryImages/...), full URL, or Base64 image."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let payload;
      let headers;

      if (imageFile) {
        // Send multipart/form-data with file upload
        payload = new FormData();
        payload.append("Name", form.name);
        payload.append("IsActive", form.isActive.toString());
        payload.append("ImageUrl", ""); // empty because image file sent
        payload.append("image", imageFile);

        headers = {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type manually for multipart/form-data; let axios handle it
        };
      } else if (isBase64(trimmedImageUrl)) {
        // Convert base64 to file and send as multipart/form-data
        const fileFromBase64 = base64toFile(trimmedImageUrl, "imageFromBase64.png");
        payload = new FormData();
        payload.append("Name", form.name);
        payload.append("IsActive", form.isActive.toString());
        payload.append("ImageUrl", "");
        payload.append("image", fileFromBase64);

        headers = {
          Authorization: `Bearer ${token}`,
        };
      } else if (trimmedImageUrl) {
        // Send JSON payload with image URL or relative path
        payload = {
          Name: form.name,
          IsActive: form.isActive,
          ImageUrl: trimmedImageUrl,
        };
        headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        };
      } else {
        alert(
          "Invalid image input. Please upload a file, provide a valid URL, or Base64 image."
        );
        return;
      }

      await axios.put(`http://localhost:5110/api/Category/${id}`, payload, {
        headers,
      });

      alert("Category updated successfully!");
      navigate("/admin/Categories");
    } catch (error) {
      console.error("Error updating category", error);
      alert(error.response?.data || "Failed to update category. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;

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

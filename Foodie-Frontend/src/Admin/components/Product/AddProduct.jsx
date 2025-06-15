import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "sweetalert2/dist/sweetalert2.min.css";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    isActive: true,
    imageUrl: "",
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const isBase64 = (str) =>
    /^data:image\/(png|jpeg|jpg|gif|bmp);base64,/.test(str);

  const isValidImageUrl = (url) => {
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const base64toFile = (base64String, filename) => {
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
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5110/api/Category", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        Swal.fire("Error", "Failed to load categories. Please refresh.", "error");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (
      form.imageUrl &&
      (isValidImageUrl(form.imageUrl) || isBase64(form.imageUrl))
    ) {
      setImagePreviewUrl(form.imageUrl);
    } else {
      setImagePreviewUrl(null);
    }
  }, [imageFile, form.imageUrl]);

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
    if (file) {
      setImageFile(file);
      setForm((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      Swal.fire("Validation Error", "Product name is required.", "warning");
      return;
    }

    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      Swal.fire("Validation Error", "Valid product price is required.", "warning");
      return;
    }

    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 0) {
      Swal.fire("Validation Error", "Valid product quantity is required.", "warning");
      return;
    }

    if (!form.categoryId) {
      Swal.fire("Validation Error", "Please select a category.", "warning");
      return;
    }

    if (!imageFile && !form.imageUrl.trim()) {
      Swal.fire(
        "Validation Error",
        "Please upload an image file or provide a valid image URL or Base64 string.",
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
        payload.append("name", form.name);
        payload.append("description", form.description);
        payload.append("price", form.price);
        payload.append("quantity", form.quantity);
        payload.append("categoryId", form.categoryId);
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
        payload.append("description", form.description);
        payload.append("price", form.price);
        payload.append("quantity", form.quantity);
        payload.append("categoryId", form.categoryId);
        payload.append("isActive", form.isActive.toString());
        payload.append("image", fileFromBase64);

        headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        };
      } else if (isValidImageUrl(form.imageUrl)) {
        payload = {
          name: form.name,
          description: form.description,
          price: form.price,
          quantity: form.quantity,
          categoryId: form.categoryId,
          isActive: form.isActive,
          imageUrl: form.imageUrl,
        };

        headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
      } else {
        Swal.fire(
          "Validation Error",
          "Invalid image input. Please upload a valid file, URL or Base64.",
          "warning"
        );
        return;
      }

      await axios.post("http://localhost:5110/api/Menu", payload, { headers });

      Swal.fire("Success", "Product created successfully!", "success").then(() => {
        navigate("/admin/Product");
      });
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create product. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Add new Menu</h2>
        <button
          type="submit"
          form="productForm"
          className="btn btn-dark"
          disabled={!form.name.trim()}
        >
          Publish Menu
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        id="productForm"
        className="row g-4"
        encType="multipart/form-data"
      >
        <div className="col-md-6">
          <h5>Basic information</h5>

          <label className="form-label">Menu item Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label className="form-label mt-3">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />

          <label className="form-label mt-3">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={form.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />

          <label className="form-label mt-3">Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min="0"
            required
          />

          <label className="form-label mt-3">Category</label>
          <select
            className="form-select"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.categoryId || cat.id} value={cat.categoryId || cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="form-check form-switch mt-3">
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
          <h5>Menu image</h5>
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
                    Swal.fire("Error", "Invalid image URL or Base64", "error");
                  }}
                />
              </div>
            )}

            <hr />

            <label htmlFor="onlineImageUrl" className="form-label mt-3">
              Or enter online image URL or Base64 string
            </label>
            <textarea
              id="onlineImageUrl"
              name="imageUrl"
              className="form-control"
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

export default AddProduct;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    isActive: true,
    imageUrl: "", // URL or Base64 string
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Utility: check if string is a base64 image string
  const isBase64 = (str) =>
    /^data:image\/(png|jpeg|jpg|gif|bmp);base64,/.test(str);

  // Utility: check if string is a valid URL (http or https)
  const isValidImageUrl = (url) => {
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Convert Base64 string to File object
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

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5110/api/Category", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        alert("Failed to load categories. Please refresh.");
      }
    };

    fetchCategories();
  }, []);

  // Update image preview when imageFile or form.imageUrl changes
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

  // Handle input changes for all form fields
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

  // Handle image file upload input
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setForm((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name.trim()) {
      alert("Product name is required.");
      return;
    }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      alert("Valid product price is required.");
      return;
    }
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 0) {
      alert("Valid product quantity is required.");
      return;
    }
    if (!form.categoryId) {
      alert("Please select a category.");
      return;
    }
    if (!imageFile && !form.imageUrl.trim()) {
      alert("Please upload an image file or provide an online image URL or Base64 string.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let payload;
      let headers;

      if (imageFile) {
        // Use FormData for image file upload
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
        // Convert Base64 to File then FormData
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
        // Send JSON with imageUrl only
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
        alert(
          "Invalid image input. Please upload a file, provide a valid URL, or Base64 image."
        );
        return;
      }

      await axios.post("http://localhost:5110/api/Menu", payload, { headers });

      alert("Product created successfully!");
      navigate("/admin/Product");
    } catch (error) {
      console.error("Error creating product:", error);
      alert(
        error.response?.data?.message || "Failed to create product. Please try again."
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Add new product</h2>
        <button
          type="submit"
          form="productForm"
          className="btn btn-dark"
          disabled={!form.name.trim()}
        >
          Publish product
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        id="productForm"
        className="row g-4"
        encType="multipart/form-data"
      >
        {/* Left column: Basic info */}
        <div className="col-md-6">
          <h5>Basic information</h5>

          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />

          <label className="form-label mt-3">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={3}
          />

          <label className="form-label mt-3">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
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
            placeholder="Enter quantity"
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

        {/* Right column: Image upload & URL */}
        <div className="col-md-6">
          <h5>Product image</h5>
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
                    alert("Invalid image URL/Base64. Please check and try again.");
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

export default AddProduct;

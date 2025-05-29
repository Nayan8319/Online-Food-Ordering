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
    imageUrl: "", // to hold online image URL if provided
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5110/api/Category", {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Clear online URL if user uploads file
    setForm((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleOnlineImageChange = (e) => {
    const url = e.target.value;
    setForm((prev) => ({ ...prev, imageUrl: url }));

    // Clear file if user inputs URL
    if (url) setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that either file or URL is provided
    if (!imageFile && !form.imageUrl) {
      alert("Please upload an image file or enter an online image URL.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (imageFile) {
        // Upload with file (multipart/form-data)
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("quantity", form.quantity);
        formData.append("categoryId", form.categoryId);
        formData.append("isActive", form.isActive);
        formData.append("imageFile", imageFile); // Adjust key if needed

        await axios.post("http://localhost:5110/api/Menu", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Upload with online image URL (JSON body)
        await axios.post(
          "http://localhost:5110/api/Menu",
          { ...form },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      alert("Product created!");
      navigate("/admin/Product");
    } catch (error) {
      console.error("Error creating product", error);
      alert("Failed to create product.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Add new product</h2>
        <button type="submit" form="productForm" className="btn btn-dark">
          Publish product
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

          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter a product title..."
            required
          />

          <label className="form-label mt-3">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter a product description..."
            required
          />

          <label className="form-label mt-3">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01" // <-- This allows decimals to 2 decimal places
          />

          <label className="form-label mt-3">Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            min="0"
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
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>

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
          <h5>Product images</h5>
          <div
            className="border border-secondary rounded p-4 text-center"
            style={{ minHeight: "300px" }}
          >
            <label
              htmlFor="uploadImg"
              className="d-block mb-2"
              style={{ cursor: "pointer" }}
            >
              <i
                className="bi bi-cloud-arrow-up"
                style={{ fontSize: "2rem" }}
              ></i>
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
            {imageFile && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}

            <hr />

            <label htmlFor="onlineImageUrl" className="form-label mt-3">
              Or enter online image URL
            </label>
            <input
              type="url"
              id="onlineImageUrl"
              name="imageUrl"
              className="form-control"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={handleOnlineImageChange}
            />
            {form.imageUrl && !imageFile && (
              <div className="mt-3">
                <img
                  src={form.imageUrl}
                  alt="Online preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: "200px" }}
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

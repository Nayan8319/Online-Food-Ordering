import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EditProduct = () => {
  const { id } = useParams(); // product id
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
  const [loading, setLoading] = useState(true);
  const [imageUrlError, setImageUrlError] = useState("");

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const [productRes, categoryRes] = await Promise.all([
          axios.get(`http://localhost:5110/api/Menu/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5110/api/Category", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setForm({
          name: productRes.data.name,
          description: productRes.data.description,
          price: productRes.data.price,
          quantity: productRes.data.quantity,
          categoryId: productRes.data.categoryId,
          isActive: productRes.data.isActive,
          imageUrl: productRes.data.imageUrl || "",
        });

        setCategories(categoryRes.data);
        setLoading(false);
      } catch (error) {
        alert("Failed to load product or categories.");
        navigate("/admin/Products");
      }
    };

    fetchProductAndCategories();
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
    } else if (form.imageUrl && form.imageUrl.startsWith("/MenuImages/")) {
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
      input.startsWith("/MenuImages/") ||
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
          "Invalid input: must be a relative path (/MenuImages/...), full URL, or Base64 image."
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

    if (!form.name.trim() || !form.price || !form.quantity || !form.categoryId) {
      alert("All fields are required.");
      return;
    }

    if (!imageFile && !trimmedImageUrl) {
      alert("Please provide an image.");
      return;
    }

    if (trimmedImageUrl && !isValidImageInput(trimmedImageUrl)) {
      alert("Invalid image input.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let payload;
      let headers;

      if (imageFile) {
        payload = new FormData();
        payload.append("Name", form.name);
        payload.append("Description", form.description);
        payload.append("Price", form.price);
        payload.append("Quantity", form.quantity);
        payload.append("CategoryId", form.categoryId);
        payload.append("IsActive", form.isActive.toString());
        payload.append("ImageUrl", "");
        payload.append("image", imageFile);
        headers = { Authorization: `Bearer ${token}` };
      } else if (isBase64(trimmedImageUrl)) {
        const fileFromBase64 = base64toFile(trimmedImageUrl, "image.png");
        payload = new FormData();
        payload.append("Name", form.name);
        payload.append("Description", form.description);
        payload.append("Price", form.price);
        payload.append("Quantity", form.quantity);
        payload.append("CategoryId", form.categoryId);
        payload.append("IsActive", form.isActive.toString());
        payload.append("ImageUrl", "");
        payload.append("image", fileFromBase64);
        headers = { Authorization: `Bearer ${token}` };
      } else {
        payload = {
          Name: form.name,
          Description: form.description,
          Price: form.price,
          Quantity: form.quantity,
          CategoryId: form.categoryId,
          IsActive: form.isActive,
          ImageUrl: trimmedImageUrl,
        };
        headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        };
      }

      await axios.put(`http://localhost:5110/api/Menu/${id}`, payload, {
        headers,
      });

      alert("Product updated successfully!");
      navigate("/admin/Product");
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.response?.data || "Failed to update product.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Edit Product</h2>
        <button
          type="submit"
          form="productForm"
          className="btn btn-dark"
          disabled={!form.name.trim() || imageUrlError !== ""}
        >
          Update Product
        </button>
      </div>

      <form
        id="productForm"
        className="row g-4"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="col-md-6">
          <h5>Product Info</h5>
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label className="form-label mt-3">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={form.description}
            onChange={handleChange}
            required
          />

          <label className="form-label mt-3">Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={form.price}
            onChange={handleChange}
            required
          />

          <label className="form-label mt-3">Quantity</label>
          <input
            type="number"
            name="quantity"
            className="form-control"
            value={form.quantity}
            onChange={handleChange}
            required
          />

          <label className="form-label mt-3">Category</label>
          <select
            name="categoryId"
            className="form-select"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
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
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              id="isActiveSwitch"
            />
            <label className="form-check-label" htmlFor="isActiveSwitch">
              Is Active
            </label>
          </div>
        </div>

        <div className="col-md-6">
          <h5>Product Image</h5>
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
                alt="Preview"
                className="img-fluid rounded mt-3"
                style={{ maxHeight: "200px" }}
              />
            )}

            <hr />

            <label className="form-label">Or provide URL/Base64/relative path</label>
            <input
              type="text"
              className="form-control"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="e.g. /MenuImages/img.png or full URL"
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

export default EditProduct;

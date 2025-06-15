import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const EditMenu = () => {
  const { id } = useParams();
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
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [menuRes, categoryRes] = await Promise.all([
          axios.get(`http://localhost:5110/api/Menu/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5110/api/Category", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setForm({
          name: menuRes.data.name,
          description: menuRes.data.description,
          price: parseFloat(menuRes.data.price).toFixed(2),
          quantity: menuRes.data.quantity.toString(),
          categoryId: menuRes.data.categoryId,
          isActive: menuRes.data.isActive,
          imageUrl: menuRes.data.imageUrl || "",
        });

        setCategories(categoryRes.data);
        setLoading(false);
      } catch (err) {
        Swal.fire("Error", "Failed to load menu or categories", "error");
        navigate("/admin/Menu");
      }
    };

    fetchData();
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

  const isValidImageInput = (input) => {
    if (!input) return false;
    input = input.trim();
    return (
      input.startsWith("/MenuImages/") ||
      isValidImageUrl(input) ||
      isBase64(input)
    );
  };

  const base64toFile = (base64String, filename) => {
    const arr = base64String.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if ((name === "price" || name === "quantity") && value !== "") {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue < 0) {
        setValidationErrors((prev) => ({
          ...prev,
          [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} must be 0 or more`,
        }));
      } else {
        setValidationErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }

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
          "Invalid input: must be /MenuImages/, URL, or Base64 image."
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, price, quantity, categoryId, imageUrl } = form;

    if (!name.trim() || price === "" || quantity === "" || categoryId === "") {
      Swal.fire("Validation Error", "All fields are required.", "warning");
      return;
    }

    const numericPrice = parseFloat(price);
    const numericQuantity = parseInt(quantity);

    if (isNaN(numericPrice) || numericPrice < 0 || numericQuantity < 0) {
      Swal.fire("Validation Error", "Price and quantity must be non-negative.", "error");
      return;
    }

    const trimmedImageUrl = imageUrl.trim();

    if (!imageFile && !trimmedImageUrl) {
      Swal.fire("Validation Error", "Please provide an image.", "warning");
      return;
    }

    if (trimmedImageUrl && !isValidImageInput(trimmedImageUrl)) {
      Swal.fire("Validation Error", "Invalid image input.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let payload;
      let headers;

      if (imageFile || isBase64(trimmedImageUrl)) {
        const imageToUpload = imageFile
          ? imageFile
          : base64toFile(trimmedImageUrl, "menuImage.png");

        payload = new FormData();
        payload.append("Name", name);
        payload.append("Description", form.description);
        payload.append("Price", numericPrice);
        payload.append("Quantity", numericQuantity);
        payload.append("CategoryId", categoryId);
        payload.append("IsActive", form.isActive.toString());
        payload.append("ImageUrl", "");
        payload.append("image", imageToUpload);

        headers = { Authorization: `Bearer ${token}` };
      } else {
        payload = {
          Name: name,
          Description: form.description,
          Price: numericPrice,
          Quantity: numericQuantity,
          CategoryId: categoryId,
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

      Swal.fire("Success", "Menu updated successfully!", "success").then(() =>
        navigate("/admin/menu")
      );
    } catch (error) {
      console.error("Update Error:", error);
      Swal.fire(
        "Error",
        error.response?.data || "Failed to update menu.",
        "error"
      );
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Edit Menu</h2>
        <button
          type="submit"
          form="menuForm"
          className="btn btn-dark"
          disabled={
            !form.name.trim() ||
            imageUrlError !== "" ||
            validationErrors.price ||
            validationErrors.quantity
          }
        >
          Update Menu
        </button>
      </div>

      <form
        id="menuForm"
        className="row g-4"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="col-md-6">
          <h5>Menu Info</h5>

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
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
          {validationErrors.price && (
            <small className="text-danger">{validationErrors.price}</small>
          )}

          <label className="form-label mt-3">Quantity</label>
          <input
            type="number"
            name="quantity"
            className="form-control"
            min="0"
            value={form.quantity}
            onChange={handleChange}
            required
          />
          {validationErrors.quantity && (
            <small className="text-danger">{validationErrors.quantity}</small>
          )}

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
          <h5>Menu Image</h5>
          <div
            className="border border-secondary rounded p-4 text-center"
            style={{ minHeight: "300px" }}
          >
            <label htmlFor="uploadImg" className="d-block mb-2" style={{ cursor: "pointer" }}>
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

export default EditMenu;

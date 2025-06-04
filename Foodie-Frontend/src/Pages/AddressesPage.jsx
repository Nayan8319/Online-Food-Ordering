import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [newAddress, setNewAddress] = useState({
    street: "", // Building and Street
    city: "",
    state: "",
    zipCode: "",
  });

  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("User is not logged in.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5110/api/address/allAddress", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAddresses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load addresses.");
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateAddress = () => {
    const { street, city, state, zipCode } = newAddress;
    if (!street || !city || !state || !zipCode) {
      setError("Please fill all fields.");
      return;
    }

    if (editingId === null) {
      // Add new address
      axios
        .post("http://localhost:5110/api/address/add", newAddress, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setAddresses((prev) => [...prev, res.data]);
          setNewAddress({ street: "", city: "", state: "", zipCode: "" });
          setError("");
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to add address.");
        });
    } else {
      // Update existing address
      axios
        .put(
          `http://localhost:5110/api/address/update/${editingId}`,
          newAddress,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setAddresses((prev) =>
            prev.map((addr) =>
              addr.addressId === editingId ? { ...addr, ...newAddress } : addr
            )
          );
          setNewAddress({ street: "", city: "", state: "", zipCode: "" });
          setEditingId(null);
          setError("");
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to update address.");
        });
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    axios
      .delete(`http://localhost:5110/api/address/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setAddresses((prev) => prev.filter((addr) => addr.addressId !== id));
        if (editingId === id) {
          setNewAddress({ street: "", city: "", state: "", zipCode: "" });
          setEditingId(null);
        }
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to delete address.");
      });
  };

  const handleEdit = (addr) => {
    setNewAddress({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
    });
    setEditingId(addr.addressId);
    setError("");
  };

  const handleCancelEdit = () => {
    setNewAddress({ street: "", city: "", state: "", zipCode: "" });
    setEditingId(null);
    setError("");
  };

  if (loading)
    return <div className="container mt-5">Loading addresses...</div>;

  return (
    <section className="address_section layout_padding">
      <div className="container">
        <h2 className="mb-4">Manage Addresses</h2>
        <button
          className="btn btn-outline-primary mb-3"
          onClick={() => navigate("/profile")} // Replace '/profile' with your actual profile route
        >
          ← Back to Profile
        </button>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Add/Edit Address Form - on top */}
        <div className="card p-4 mb-4">
          <h4>{editingId === null ? "Add New Address" : "Update Address"}</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="street" className="form-label">
                Building & Street
              </label>
              <input
                type="text"
                className="form-control"
                id="street"
                name="street"
                placeholder="Enter building and street"
                value={newAddress.street}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="city" className="form-label">
                City
              </label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                placeholder="City"
                value={newAddress.city}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="state" className="form-label">
                State
              </label>
              <input
                type="text"
                className="form-control"
                id="state"
                name="state"
                placeholder="State"
                value={newAddress.state}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="zipCode" className="form-label">
                Zip Code
              </label>
              <input
                type="text"
                className="form-control"
                id="zipCode"
                name="zipCode"
                placeholder="Zip Code"
                value={newAddress.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-3">
            <button
              className="btn btn-primary me-2"
              onClick={handleAddOrUpdateAddress}
            >
              {editingId === null ? "Add Address" : "Update Address"}
            </button>
            {editingId !== null && (
              <button className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Existing Addresses */}
        {addresses.length === 0 ? (
          <p>No addresses found.</p>
        ) : (
          <div className="list-group">
            {addresses.map((addr) => (
              <div
                key={addr.addressId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>Building & Street:</strong> {addr.street}
                  <br />
                  <strong>City:</strong> {addr.city}
                  <br />
                  <strong>State:</strong> {addr.state}
                  <br />
                  <strong>Zip Code:</strong> {addr.zipCode}
                </div>
                <div>
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => handleEdit(addr)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(addr.addressId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AddressPage;

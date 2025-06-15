import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      Swal.fire("Error", "User is not logged in.", "error");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5110/api/address/allAddress", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAddresses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "Failed to load addresses.", "error");
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "zipCode") {
      // Allow only digits
      if (!/^\d*$/.test(value)) return;
    }

    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateAddress = () => {
    const { street, city, state, zipCode } = newAddress;
    if (!street || !city || !state || !zipCode) {
      Swal.fire("Warning", "Please fill all fields.", "warning");
      return;
    }

    if (zipCode.length < 5 || zipCode.length > 6) {
      Swal.fire("Warning", "Zip Code must be 5 or 6 digits.", "warning");
      return;
    }

    if (editingId === null) {
      axios
        .post("http://localhost:5110/api/address/add", newAddress, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAddresses((prev) => [...prev, res.data]);
          setNewAddress({ street: "", city: "", state: "", zipCode: "" });
          Swal.fire("Success", "✅ Address added successfully!", "success");
        })
        .catch((err) => {
          console.error(err);
          Swal.fire("Error", "❌ Failed to add address.", "error");
        });
    } else {
      axios
        .put(
          `http://localhost:5110/api/address/update/${editingId}`,
          newAddress,
          {
            headers: { Authorization: `Bearer ${token}` },
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
          Swal.fire("Success", "✅ Address updated successfully!", "success");
        })
        .catch((err) => {
          console.error(err);
          Swal.fire("Error", "❌ Failed to update address.", "error");
        });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This address will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5110/api/address/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setAddresses((prev) =>
              prev.filter((addr) => addr.addressId !== id)
            );
            if (editingId === id) {
              setNewAddress({ street: "", city: "", state: "", zipCode: "" });
              setEditingId(null);
            }
            Swal.fire("Deleted!", "✅ Address has been deleted.", "success");
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Error", "❌ Failed to delete address.", "error");
          });
      }
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
  };

  const handleCancelEdit = () => {
    setNewAddress({ street: "", city: "", state: "", zipCode: "" });
    setEditingId(null);
  };

  if (loading)
    return <div className="container mt-5">Loading addresses...</div>;

  return (
    <section className="address_section layout_padding">
      <div className="container">
        <h2 className="mb-4">Manage Addresses</h2>
        <button
          className="btn btn-outline-primary mb-3"
          onClick={() => navigate("/profile")}
        >
          ← Back to Profile
        </button>

        {/* Address Form */}
        <div className="card p-4 mb-4">
          <h4>{editingId === null ? "Add New Address" : "Update Address"}</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Building & Street</label>
              <input
                type="text"
                className="form-control"
                name="street"
                placeholder="Enter building and street"
                value={newAddress.street}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                name="city"
                placeholder="City"
                value={newAddress.city}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                name="state"
                placeholder="State"
                value={newAddress.state}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Zip Code</label>
              <input
                type="text"
                className="form-control"
                name="zipCode"
                placeholder="Zip Code"
                maxLength={6}
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

        {/* Address List */}
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

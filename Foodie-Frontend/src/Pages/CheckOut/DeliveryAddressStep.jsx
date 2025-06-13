import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryAddressStep = ({ address, setAddress, onSaveSuccess }) => {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const API_BASE = "http://localhost:5110/api/address";
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${API_BASE}/allAddress`, {
          headers,
        });
        setSavedAddresses(response.data || []);
      } catch (err) {
        setError("Failed to fetch addresses");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleAddressSelect = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    if (selectedId === 0) {
      setAddress({ street: "", city: "", state: "", zip: "", addressId: null });
      setIsEditing(true);
      return;
    }

    const selected = savedAddresses.find((a) => a.addressId === selectedId);
    if (selected) {
      setAddress({
        street: selected.street,
        city: selected.city,
        state: selected.state,
        zip: selected.zipCode,
        addressId: selected.addressId,
      });
      setIsEditing(false);
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSaveToBackend = async () => {
    const { street, city, state, zip, addressId } = address;
    if (!street || !city || !state || !zip) {
      alert("Please fill all fields.");
      return;
    }

    setSaving(true);
    try {
      if (addressId) {
        // UPDATE existing address
        await axios.put(
          `${API_BASE}/update/${addressId}`,
          { street, city, state, zipCode: zip },
          { headers }
        );
        alert("Address updated successfully.");
      } else {
        // CREATE new address
        const res = await axios.post(
          `${API_BASE}/add`,
          { street, city, state, zipCode: zip },
          { headers }
        );
        const newAddress = res.data;
        setAddress({
          street: newAddress.street,
          city: newAddress.city,
          state: newAddress.state,
          zip: newAddress.zipCode,
          addressId: newAddress.addressId,
        });
        alert("Address added successfully.");
      }

      // Refresh the address list
      const refreshed = await axios.get(`${API_BASE}/allAddress`, { headers });
      setSavedAddresses(refreshed.data || []);

      // Save selected to localStorage for checkout
      localStorage.setItem("selectedAddress", JSON.stringify(address));
      onSaveSuccess?.(address.addressId || 0);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save address.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSelectedAddress = () => {
    if (!address.addressId) {
      alert("Please select or add an address.");
      return;
    }
    localStorage.setItem("selectedAddress", JSON.stringify(address));
    alert("Selected address saved locally.");
    onSaveSuccess?.(address.addressId);
  };

  if (loading) return <p>Loading addresses...</p>;

  return (
    <div className="card p-4 w-100">
      <h4>Delivery Address</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      {savedAddresses.length > 0 && (
        <>
          <div className="mb-3 d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <label className="form-label">Select Saved Address</label>
              <select
                className="form-select"
                onChange={handleAddressSelect}
                value={address.addressId || 0}
                disabled={saving}
              >
                <option value={0}>-- Add New Address --</option>
                {savedAddresses.map((addr) => (
                  <option key={addr.addressId} value={addr.addressId}>
                    {`${addr.street}, ${addr.city}, ${addr.state} - ${addr.zipCode}`}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-warning mt-4"
              onClick={handleEditClick}
              disabled={saving}
            >
              Edit Address
            </button>
          </div>

          <div className="mb-3 d-flex gap-2 align-items-end">
            <button
              className="btn btn-success"
              onClick={handleSaveSelectedAddress}
              disabled={saving}
            >
              Save Selected Address
            </button>
          </div>
        </>
      )}

      <div className="mb-3">
        <label className="form-label">Street</label>
        <input
          className="form-control"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          readOnly={!isEditing}
        />
      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">City</label>
          <input
            className="form-control"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            readOnly={!isEditing}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">State</label>
          <input
            className="form-control"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            readOnly={!isEditing}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Zip</label>
          <input
            className="form-control"
            value={address.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
            readOnly={!isEditing}
          />
        </div>
      </div>

      <div>
        <button
          className="btn btn-primary"
          onClick={handleSaveToBackend}
          disabled={saving || !isEditing}
        >
          {saving ? "Saving..." : address.addressId ? "Update Address" : "Add Address"}
        </button>
      </div>
    </div>
  );
};

export default DeliveryAddressStep;

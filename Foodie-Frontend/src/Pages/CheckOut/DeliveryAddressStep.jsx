import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryAddressStep = ({ address, setAddress, onSaveSuccess }) => {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const API_BASE = "http://localhost:5110/api/address";

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // Try loading saved addresses from localStorage first
        const localAddresses = localStorage.getItem("savedAddresses");
        if (localAddresses) {
          setSavedAddresses(JSON.parse(localAddresses));
          setLoading(false);
          return;
        }

        // Otherwise fetch from API
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/allAddress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedAddresses(response.data || []);
        // Save fetched addresses in localStorage
        localStorage.setItem("savedAddresses", JSON.stringify(response.data || []));
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

  const handleSaveToLocal = () => {
    const { street, city, state, zip, addressId } = address;
    if (!street || !city || !state || !zip) {
      alert("Please fill all fields.");
      return;
    }
    setSaving(true);

    // Save the selectedAddress separately (for checkout or whatever)
    localStorage.setItem("selectedAddress", JSON.stringify(address));

    // Update savedAddresses list - add new or update existing
    setSavedAddresses((prev) => {
      let updated;
      if (addressId) {
        // Update existing address in list
        updated = prev.map((a) =>
          a.addressId === addressId
            ? { ...a, street, city, state, zipCode: zip }
            : a
        );
      } else {
        // Add new address - generate a fake new id here, you can replace with backend id if saved there
        const newId = prev.length > 0 ? Math.max(...prev.map((a) => a.addressId)) + 1 : 1;
        updated = [
          ...prev,
          { addressId: newId, street, city, state, zipCode: zip }
        ];
        // Also update the address with the new id
        setAddress({ street, city, state, zip, addressId: newId });
      }
      // Save updated list to localStorage
      localStorage.setItem("savedAddresses", JSON.stringify(updated));
      return updated;
    });

    alert("Address saved locally.");
    setIsEditing(false);
    onSaveSuccess?.(addressId || 0);
    setSaving(false);
  };

  const handleSaveSelectedAddress = () => {
    if (!address.addressId) {
      alert("Please select a saved address or add new.");
      return;
    }
    setSaving(true);
    localStorage.setItem("selectedAddress", JSON.stringify(address));
    alert("Selected address saved locally.");
    setIsEditing(false);
    onSaveSuccess?.(address.addressId);
    setSaving(false);
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
          onClick={handleSaveToLocal}
          disabled={saving || !isEditing}
        >
          {saving ? "Saving..." : "Save Address"}
        </button>
      </div>
    </div>
  );
};

export default DeliveryAddressStep;

import React from "react";

const AddressList = ({ addresses }) => {
  return (
    <div className="mb-3">
      <h5 className="mb-3">Addresses</h5>
      {addresses.length > 0 ? (
        <div className="row">
          {addresses.map((addr, index) => (
            <div key={addr.addressId} className="col-md-6 mb-3">
              <div className="card shadow-sm border-info">
                <div className="card-header bg-info text-white fw-bold">
                  {index === 0 ? "Home" : "Other"}
                </div>
                <div className="card-body">
                  <p className="mb-1">
                    <strong>Building & Street:</strong> {addr.street}
                  </p>
                  <p className="mb-1">
                    <strong>City:</strong> {addr.city}
                  </p>
                  <p className="mb-1">
                    <strong>State:</strong> {addr.state}
                  </p>
                  <p className="mb-1">
                    <strong>Zip Code:</strong> {addr.zipCode}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No addresses available.</p>
      )}
    </div>
  );
};

export default AddressList;

import React from "react";
import { useNavigate } from "react-router-dom";

const UserInformation = ({ userData, setShowEditModal, setShowPasswordModal }) => {
  const navigate = useNavigate();

  // Assuming base URL for image location
  const baseUrl = "http://localhost:5110"; // Adjust to your actual base URL

  // Handle image URL properly
  const imageUrl = userData.imageUrl.startsWith('http') 
    ? userData.imageUrl // If URL is already full, use it as is
    : `${baseUrl}${userData.imageUrl}`; // Otherwise, prepend the base URL

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="card-title mb-4 d-flex flex-wrap gap-3">
              <div className="image-container text-center me-4">
                <img
                  src={imageUrl} // Use the processed image URL
                  alt="Profile"
                  style={{ width: "150px", height: "150px" }}
                  className="img-thumbnail"
                />
                <div className="pt-2 d-grid gap-2">
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      setShowEditModal(true);
                    }}
                  >
                    <i className="fa fa-pencil"></i> Edit Details
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    <i className="fa fa-lock"></i> Change Password
                  </button>
                </div>
              </div>

              <div className="userData mt-3">
                <h2 style={{ fontWeight: "bold" }}>{userData.name}</h2>
                <h6>@{userData.username}</h6>
                <h6>{userData.email}</h6>
                <h6>Joined on: {userData.createdDate}</h6>
                <div className="d-grid mt-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/addresses")}
                  >
                    Manage Addresses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInformation;

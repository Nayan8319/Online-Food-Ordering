import React from "react";
import { useNavigate } from "react-router-dom";
import { resolveImageUrl } from "../../utils/imageUtils";

const UserInformation = ({ userData, setShowEditModal, setShowPasswordModal }) => {
  const navigate = useNavigate();
  const imageUrl = resolveImageUrl(userData.imageUrl);

const handleLogout = () => {
  localStorage.clear();              // Clear stored data
  window.location.href = "/login";  // Force full page reload to login
};

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="card-title mb-4 d-flex flex-wrap gap-3">
              <div className="image-container text-center me-4">
                <img
                  src={imageUrl}
                  alt="Profile"
                  style={{ width: "150px", height: "150px" }}
                  className="img-thumbnail"
                />
                <div className="pt-2 d-grid gap-2">
                  <button className="btn btn-warning" onClick={() => setShowEditModal(true)}>
                    <i className="fa fa-pencil"></i> Edit Details
                  </button>
                  <button className="btn btn-outline-danger" onClick={() => setShowPasswordModal(true)}>
                    <i className="fa fa-lock"></i> Change Password
                  </button>
                </div>
              </div>

              <div className="userData mt-3">
                <h2 style={{ fontWeight: "bold" }}>{userData.name}</h2>
                <h6>@{userData.username}</h6>
                <h6>{userData.email}</h6>
                <h6>Joined on: {userData.createdDate}</h6>
                <div className="d-grid mt-3 gap-2">
                  <button className="btn btn-primary" onClick={() => navigate("/addresses")}>
                    Manage Addresses
                  </button>
                  <button className="btn btn-danger" onClick={handleLogout}>
                    <i className="fa fa-sign-out"></i> Logout
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

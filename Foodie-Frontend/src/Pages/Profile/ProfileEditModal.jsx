import React, { useEffect } from "react";
import { resolveImageUrl } from "../../utils/imageUtils";

const ProfileEditModal = ({
  showEditModal,
  setShowEditModal,
  editForm,
  setEditForm,
  selectedFile,
  setSelectedFile,
  previewUrl,
  setPreviewUrl,
  handleProfileUpdate,
  editLoading,
  editError,
  userData,
}) => {
  const handleImageInputChange = (e) => {
    const value = e.target.value;
    setEditForm({ ...editForm, imageUrl: value });
    setPreviewUrl(value);
    setSelectedFile(null);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    if (showEditModal) {
      setEditForm({
        name: userData?.name || "",
        username: userData?.username || "",
        mobile: userData?.mobile || "",
        imageUrl: userData?.imageUrl || "",
      });
      setPreviewUrl(userData?.imageUrl || null);
      setSelectedFile(null);
    }
  }, [showEditModal, setEditForm, userData, setPreviewUrl, setSelectedFile]);

  return (
    showEditModal && (
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Profile</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowEditModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {editError && <div className="alert alert-danger">{editError}</div>}

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Full Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Username"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              />

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Mobile Number"
                value={editForm.mobile}
                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
              />

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter Image URL, Base64, or Path URL"
                value={editForm.imageUrl || ""}
                onChange={handleImageInputChange}
              />

              <input
                type="file"
                accept="image/*"
                className="form-control mb-2"
                onChange={handleFileInputChange}
              />

              {previewUrl && (
                <div className="mb-3 text-center">
                  <img
                    src={resolveImageUrl(previewUrl)}
                    alt="Preview"
                    style={{ maxWidth: "150px", maxHeight: "150px" }}
                    className="img-thumbnail"
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={editLoading}
                onClick={handleProfileUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProfileEditModal;

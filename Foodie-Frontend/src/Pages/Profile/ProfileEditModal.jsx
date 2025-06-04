import React, { useEffect } from "react";

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
  userData, // New prop for user data
}) => {

  // Handle Image URL, Base64, or Path input change
  const handleImageInputChange = (e) => {
    const value = e.target.value;
    setEditForm({ ...editForm, imageUrl: value });

    // If the input is a valid URL or Base64, set it as preview
    setPreviewUrl(value);
    setSelectedFile(null); // Clear the file input if URL or Base64 is used
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file)); // Preview the selected file
    } else {
      setPreviewUrl(null); // Clear the preview if no file is selected
    }
  };

  // Function to handle image URL, Path, or Base64 to show preview
  const getImagePreview = (url) => {
    // If it's a relative path, combine it with the base URL
    if (url && !url.startsWith('http')) {
      return `/base-path${url}`; // Replace '/base-path' with the actual server path
    }
    return url; // If it's an absolute URL or Base64, just return it
  };

  useEffect(() => {
    if (showEditModal) {
      // Populate editForm with user data when the modal is shown
      setEditForm({
        name: userData?.name || "",
        username: userData?.username || "",
        mobile: userData?.mobile || "",
        imageUrl: userData?.imageUrl || "",
      });
      setPreviewUrl(userData?.imageUrl || null); // Set the preview if imageUrl is present
      setSelectedFile(null); // Clear any selected file on modal open
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

              {/* Name */}
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Full Name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />

              {/* Username */}
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Username"
                value={editForm.username}
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
              />

              {/* Mobile Number */}
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Mobile Number"
                value={editForm.mobile}
                onChange={(e) =>
                  setEditForm({ ...editForm, mobile: e.target.value })
                }
              />

              {/* Image URL, Base64, or Path Input */}
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter Image URL, Base64, or Path URL"
                value={editForm.imageUrl || ''}
                onChange={handleImageInputChange}
              />

              {/* File Upload Input */}
              <input
                type="file"
                accept="image/*"
                className="form-control mb-2"
                onChange={handleFileInputChange}
              />

              {/* Image Preview */}
              {previewUrl && (
                <div className="mb-3 text-center">
                  <img
                    src={getImagePreview(previewUrl)} // Handle relative paths or URLs
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

import React, { useEffect } from "react";
// import { resolveImageUrl } from "../../utils/imageUtils"; // Optional helper

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
  const BASE_URL = "http://localhost:5110"; // ✅ Your backend base URL

  // Convert relative URLs to full image URLs
  const resolveImage = (url) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:image/")) return url;
    if (url.startsWith("/")) return `${BASE_URL}${url}`;
    return null;
  };

  // 🔁 Reset form when modal opens
  useEffect(() => {
    if (showEditModal && userData) {
      setEditForm({
        name: userData.name || "",
        username: userData.username || "",
        mobile: userData.mobile || "",
        imageUrl: userData.imageUrl || "",
      });

      setPreviewUrl(resolveImage(userData.imageUrl));
      setSelectedFile(null);
    }
  }, [setEditForm, setPreviewUrl, setSelectedFile, showEditModal, userData]);

  // 📷 Manual image input
  const handleImageInputChange = (e) => {
    const value = e.target.value.trim();
    setEditForm({ ...editForm, imageUrl: value });

    if (value.startsWith("data:image/") || value.startsWith("http") || value.startsWith("/")) {
      setPreviewUrl(resolveImage(value));
    } else {
      setPreviewUrl(null);
    }

    setSelectedFile(null);
  };

  // 📁 File upload handler
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // base64 preview
      };
      reader.readAsDataURL(file);
      setEditForm({ ...editForm, imageUrl: "" }); // Clear manual field
    }
  };

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
              <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} />
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
                placeholder="Enter Image URL or Base64 string"
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
                    src={previewUrl}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxWidth: "150px", maxHeight: "150px" }}
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={editLoading}
                onClick={() => handleProfileUpdate(editForm, selectedFile)}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProfileEditModal;

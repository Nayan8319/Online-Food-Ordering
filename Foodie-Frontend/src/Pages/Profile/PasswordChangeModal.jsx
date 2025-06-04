import React from "react";

const PasswordChangeModal = ({
  showPasswordModal,
  setShowPasswordModal,
  passwordForm,
  setPasswordForm,
  passwordError,
  handlePasswordChange,
}) => {
  return (
    showPasswordModal && (
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Change Password</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowPasswordModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {passwordError && (
                <div className="alert alert-danger">{passwordError}</div>
              )}
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Current Password"
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, current: e.target.value })
                }
              />
              <input
                type="password"
                className="form-control mb-2"
                placeholder="New Password"
                value={passwordForm.new}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, new: e.target.value })
                }
              />
              <input
                type="password"
                className="form-control"
                placeholder="Confirm New Password"
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirm: e.target.value })
                }
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePasswordChange}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default PasswordChangeModal;

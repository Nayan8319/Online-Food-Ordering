import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

const PasswordChangeModal = ({
  showPasswordModal,
  setShowPasswordModal,
  passwordForm,
  setPasswordForm,
  passwordError,
  handlePasswordChange,
}) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = (field, value) => {
    setPasswordForm({ ...passwordForm, [field]: value });

    if (field === "new") {
      if (value.length > 0 && value.length < 8) {
        setValidationError("New password must be at least 8 characters.");
      } else {
        setValidationError("");
      }
    }
  };

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
              {validationError && (
                <div className="alert alert-warning">{validationError}</div>
              )}
              {/* Current Password */}
              <div className="mb-2">
                <label className="form-label">Current Password</label>
                <div className="input-group">
                  <input
                    type={showCurrent ? "text" : "password"}
                    className="form-control"
                    placeholder="Current Password"
                    value={passwordForm.current}
                    onChange={(e) =>
                      handleChange("current", e.target.value)
                    }
                  />
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrent(!showCurrent)}
                      edge="end"
                    >
                      {showCurrent ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                </div>
              </div>

              {/* New Password */}
              <div className="mb-2">
                <label className="form-label">New Password</label>
                <div className="input-group">
                  <input
                    type={showNew ? "text" : "password"}
                    className="form-control"
                    placeholder="New Password"
                    value={passwordForm.new}
                    onChange={(e) => handleChange("new", e.target.value)}
                  />
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNew(!showNew)}
                      edge="end"
                    >
                      {showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm New Password"
                  value={passwordForm.confirm}
                  onChange={(e) =>
                    handleChange("confirm", e.target.value)
                  }
                />
              </div>
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
                disabled={passwordForm.new.length < 8}
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

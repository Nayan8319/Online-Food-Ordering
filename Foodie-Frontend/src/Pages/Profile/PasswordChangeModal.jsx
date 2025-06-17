import React, { useState } from "react";
import {
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  Button,
} from "@mui/material";

const PasswordChangeModal = ({
  showPasswordModal,
  setShowPasswordModal,
  passwordForm,
  setPasswordForm,
  passwordError,
  setPasswordError,
  handlePasswordChange,
}) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = (field, value) => {
    setPasswordForm({ ...passwordForm, [field]: value });

    if (field === "new") {
      if (value.length > 0 && value.length < 8) {
        setValidationError("New password must be at least 8 characters.");
      } else if (value === passwordForm.current) {
        setValidationError("New password must be different from current password.");
      } else {
        setValidationError("");
      }
    }
  };

  const handleClose = () => {
    setShowPasswordModal(false);
    setPasswordError("");
    setValidationError("");
    setPasswordForm({ current: "", new: "", confirm: "" });
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
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title">Change Password</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
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
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel htmlFor="current-password">Current Password</InputLabel>
                <OutlinedInput
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={passwordForm.current}
                  onChange={(e) => handleChange("current", e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrent(!showCurrent)}
                        edge="end"
                      >
                        {showCurrent ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Current Password"
                />
              </FormControl>

              {/* New Password */}
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel htmlFor="new-password">New Password</InputLabel>
                <OutlinedInput
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={passwordForm.new}
                  onChange={(e) => handleChange("new", e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNew(!showNew)}
                        edge="end"
                      >
                        {showNew ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="New Password"
                />
              </FormControl>

              {/* Confirm New Password */}
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel htmlFor="confirm-password">
                  Confirm New Password
                </InputLabel>
                <OutlinedInput
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={passwordForm.confirm}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirm: e.target.value })
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirm(!showConfirm)}
                        edge="end"
                      >
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm New Password"
                />
              </FormControl>
            </div>

            <div className="modal-footer">
              <Button
  onClick={handleClose}
  variant="outlined"
  color="secondary"
  sx={{ mr: 2 }}
>
  Cancel
</Button>
<Button
  onClick={handlePasswordChange}
  variant="contained"
  color="primary"
  disabled={
    passwordForm.new.length < 8 ||
    validationError !== "" ||
    !passwordForm.current ||
    !passwordForm.confirm
  }
>
  Save
</Button>

            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default PasswordChangeModal;

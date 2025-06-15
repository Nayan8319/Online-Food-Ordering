import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import Swal from "sweetalert2";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  TextField,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPassError, setNewPassError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const showAlert = (type, text) => {
    Swal.fire({
      icon: type,
      title: text,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleEmailSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5110/api/Auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.text();
      if (res.ok) {
        showAlert("success", "OTP sent to your email.");
        setStep(2);
      } else {
        showAlert("error", data || "Failed to send OTP.");
      }
    } catch {
      showAlert("error", "Something went wrong.");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5110/api/Auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email),
      });

      const data = await response.text();
      if (response.ok) {
        showAlert("success", "OTP resent to your email.");
      } else {
        showAlert("error", data || "Failed to resend OTP.");
      }
    } catch {
      showAlert("error", "Error resending OTP.");
    }
    setLoading(false);
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5110/api/Auth/verify-forgot-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.text();
      if (res.ok) {
        showAlert("success", "OTP verified successfully.");
        setStep(3);
      } else {
        showAlert("error", data || "Invalid OTP.");
      }
    } catch {
      showAlert("error", "Error verifying OTP.");
    }
    setLoading(false);
  };

  const validatePasswords = () => {
    let valid = true;
    setNewPassError("");
    setConfirmPassError("");

    if (newPassword.length < 8) {
      setNewPassError("Password must be at least 8 characters.");
      valid = false;
    }

    if (confirmPassword !== newPassword) {
      setConfirmPassError("Passwords do not match.");
      valid = false;
    }

    return valid;
  };

  const handleResetPassword = async () => {
    if (!validatePasswords()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5110/api/Auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.text();
      if (res.ok) {
        showAlert("success", "Password reset successfully.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        showAlert("error", data || "Failed to reset password.");
      }
    } catch {
      showAlert("error", "Error resetting password.");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 20,
          marginBottom: 20,
          paddingTop: 4,
          paddingBottom: 4,
          paddingX: 4,
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h5" align="center">
              Forgot Password
            </Typography>
          </Grid>

          {step === 1 && (
            <Grid item xs={12} width="100%">
              <TextField
                label="Registered Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                variant="outlined"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleEmailSubmit}
                disabled={loading || !email}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </Grid>
          )}

          {step === 2 && (
            <Grid item xs={12} width="100%">
              <Typography align="center" mb={2}>
                Enter the verification code sent to your email
              </Typography>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleOtpSubmit();
                }}
              >
                <Box display="flex" justifyContent="center" mb={2}>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderInput={(props) => (
                      <input
                        {...props}
                        inputMode="numeric"
                        style={{
                          width: isSmallScreen ? "2.5rem" : "3rem",
                          height: isSmallScreen ? "2.5rem" : "3rem",
                          fontSize: isSmallScreen ? "1.5rem" : "2rem",
                          margin: "0 0.3rem",
                          borderRadius: 4,
                          border: "1px solid #ced4da",
                          textAlign: "center",
                        }}
                      />
                    )}
                    separator={<span>-</span>}
                    shouldAutoFocus
                    isInputNum
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => setStep(1)}
                >
                  Change Email
                </Button>
                <Typography variant="body2" align="center" mt={2}>
                  Didn’t get the code?{" "}
                  <Button variant="text" size="small" onClick={handleResendOtp} disabled={loading}>
                    Resend OTP
                  </Button>
                </Typography>
              </form>
            </Grid>
          )}

          {step === 3 && (
            <Grid item xs={12} width="100%">
              <TextField
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={!!newPassError}
                helperText={newPassError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!confirmPassError}
                helperText={confirmPassError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default ForgotPassword;

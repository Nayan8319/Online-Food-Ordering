import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import OtpInput from "react-otp-input";
import {
  Avatar,
  Button,
  CssBaseline,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const pendingUser = JSON.parse(localStorage.getItem("pendingUser"));

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return setError("Please enter OTP");

    const verifyData = { ...pendingUser, otp };

    try {
      const response = await fetch("http://localhost:5110/api/Auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verifyData),
      });

      if (response.ok) {
        alert("Registration successful!");
        localStorage.removeItem("pendingUser");
        navigate("/login");
      } else {
        const data = await response.text();
        setError(data || "OTP verification failed");
      }
    } catch (err) {
      setError("Error verifying OTP");
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("pendingUser");
    navigate("/register");
  };

  const handleResendOtp = async () => {
    if (!pendingUser || !pendingUser.email) {
      return setError("Email not found. Please register again.");
    }

    try {
      const response = await fetch("http://localhost:5110/api/Auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingUser.email),
      });

      if (response.ok) {
        alert("OTP resent to your email.");
      } else {
        const data = await response.json();
        setError(data.errors?.email || "Failed to resend OTP.");
      }
    } catch (error) {
      setError("An error occurred while resending OTP.");
    }
  };

  if (!pendingUser) {
    return (
      <p>
        User info not found. Please <Link to="/register">register again</Link>.
      </p>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Grid
          container
          justifyContent="center"
          sx={{
            backgroundColor: "#f5f5f5",
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            textAlign: "center",
          }}
        >
          <Grid item xs={12}>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main", mx: "auto" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              OTP Verification
            </Typography>
            <Typography variant="body1" marginBottom={3} sx={{ mt: 1 }}>
              Enter the verification code sent to your email
            </Typography>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  backgroundColor: "#fdecea",
                  color: "#b71c1c",
                  p: 2,
                  my: 1,
                }}
              >
                {error}
              </Paper>
            </Grid>
          )}

          <Grid item xs={12}>
            <form onSubmit={handleOtpSubmit}>
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
                      margin: "0 0.3rem",
                      fontSize: isSmallScreen ? "1.5rem" : "2rem",
                      borderRadius: 4,
                      border: "1px solid #ced4da",
                      textAlign: "center",
                    }}
                  />
                )}
                separator={<span>-</span>}
              />
              <Box sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                  Verify
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            </form>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="body2">
              Didn't receive OTP?{" "}
              <Button size="small" color="primary" onClick={handleResendOtp}>
                Resend OTP
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default VerifyOtpPage;
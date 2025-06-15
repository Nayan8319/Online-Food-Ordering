import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const validate = () => {
    const errorMessages = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      errorMessages.email = "Email is required";
      isValid = false;
    }

    if (!password) {
      errorMessages.password = "Password is required";
      isValid = false;
    }

    setErrors(errorMessages);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const loginData = { email, password };

    try {
      const response = await fetch("http://localhost:5110/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.roleName);
        localStorage.setItem("userId", data.userId);

        if (data.roleName === "Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
          window.location.reload();
        }
      } else {
        setMessage(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("An error occurred while logging in.");
    }
  };

  return (
    <section className="book_section layout_padding">
      <div className="container">
        <div className="heading_container">
          {message && (
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
          )}
          <h2>Login</h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <img
              src="/images/login.png"
              alt="Login"
              width="400"
              height="200"
              className="img-thumbnail"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <form onSubmit={handleLogin} className="w-100">
              <div className="mb-3">
                <label className="form-label mb-1">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email && "is-invalid"}`}
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-1">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label mb-1">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-danger small"
                    style={{ textDecoration: "none" }}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${errors.password && "is-invalid"}`}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="input-group-text bg-white"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <div className="invalid-feedback d-block">
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="btn_box d-flex justify-content-center align-items-center mb-3 mt-3">
                <button
                  type="submit"
                  className="btn btn-success rounded-pill text-white px-4 me-3"
                >
                  Login
                </button>
                <span className="text-info">
                  New User?{" "}
                  <Link to="/register" className="badge badge-info">
                    Register Here..
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;

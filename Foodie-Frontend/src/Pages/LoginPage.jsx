import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in (token exists in localStorage)
    if (localStorage.getItem("token")) {
      // If logged in, redirect to home page (or any page you want)
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const validate = () => {
    const errorMessages = { email: "", password: "" };
    let valid = true;

    if (!email) {
      errorMessages.email = "Email is required";
      valid = false;
    }

    if (!password) {
      errorMessages.password = "Password is required";
      valid = false;
    }

    setErrors(errorMessages);
    return valid;
  };

const handleLogin = async (e) => {
  e.preventDefault();

  if (!validate()) {
    return;
  }

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
      // Store token and role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.roleName); // "Admin" or "User"
      localStorage.setItem("userId", data.userId);

      // Redirect based on role
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
                <input
                  type="email"  // Email input type for proper validation
                  className="form-control"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>
              <div className="btn_box d-flex justify-content-center align-items-center">
                <button
                  type="submit"
                  className="btn btn-success rounded-pill text-white px-4"
                  style={{ marginRight: "10px" }}
                >
                  Login
                </button>
                <span className="pl-3 text-info">
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
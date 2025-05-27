import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Handle Image Upload and Preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form fields
  const validateForm = () => {
    if (!name || !username || !mobile || !email || !password) {
      setErrorMessage("All fields are required");
      return false;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    // Validate mobile number format (simple validation for 10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form fields before submitting
    if (!validateForm()) {
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5110/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          mobile,
          email,
          password,
          imageUrl, // Include image URL if set
        }),
      });
  
      if (response.ok) {
        localStorage.setItem(
          "pendingUser",
          JSON.stringify({ name, username, mobile, email, password, imageUrl })
        );
        alert("OTP sent to your email. Please verify to complete registration.");
        navigate("/verify-otp");
      } else {
        const data = await response.text();
        setErrorMessage(data || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while sending OTP. Please try again.");
    }
  };
  

  return (
    <section className="book_section layout_padding">
      <div className="container">
        <div className="heading_container text-center">
          <h2>User Registration</h2>
          {errorMessage && (
            <div className="alert alert-danger text-center">{errorMessage}</div>
          )}
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit} className="form_container">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageUpload}
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    width="100"
                    height="100"
                  />
                )}
              </div>

              <div className="d-flex justify-content-center align-items-center mb-3">
                <button
                  type="submit"
                  className="btn btn-success rounded-pill px-4"
                  style={{ marginRight: "10px" }}
                >
                  Register
                </button>
                <span className="pl-3">
                  Already registered?{" "}
                  <Link to="/login" className="badge badge-info">
                    Login here..
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

export default RegisterPage;
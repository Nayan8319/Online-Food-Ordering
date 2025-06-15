import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const validateForm = () => {
    let validationErrors = {};
    if (!name) validationErrors.name = "Name is required";
    if (!username) validationErrors.username = "Username is required";

    if (!mobile) {
      validationErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(mobile)) {
      validationErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!email) {
      validationErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      validationErrors.email = "Enter a valid email address";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    } else if (password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

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
          imageUrl,
        }),
      });

      if (response.ok) {
        localStorage.setItem(
          "pendingUser",
          JSON.stringify({ name, username, mobile, email, password, imageUrl })
        );

        await Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "OTP sent to your email. Please verify to complete registration.",
        });

        navigate("/verify-otp");
      } else {
        const data = await response.text();
        await Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: data || "Something went wrong.",
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while sending OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="book_section layout_padding">
      <div className="container">
        <div className="heading_container text-center">
          <h2>User Registration</h2>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit} className="form_container">
              <div className="mb-3">
                {errors.name && <div className="text-danger">{errors.name}</div>}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                {errors.username && (
                  <div className="text-danger">{errors.username}</div>
                )}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                {errors.mobile && (
                  <div className="text-danger">{errors.mobile}</div>
                )}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <div className="mb-3">
                {errors.email && (
                  <div className="text-danger">{errors.email}</div>
                )}
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                {errors.password && (
                  <div className="text-danger">{errors.password}</div>
                )}
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
                    className="mt-2"
                  />
                )}
              </div>

              <div className="d-flex justify-content-center align-items-center mb-3">
                <button
                  type="submit"
                  className="btn btn-success rounded-pill px-4"
                  disabled={loading}
                  style={{ marginRight: "10px" }}
                >
                  {loading ? "Registering..." : "Register"}
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

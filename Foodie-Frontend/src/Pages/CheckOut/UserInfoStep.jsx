import React, { useEffect, useState } from "react";
import axios from "axios";

const UserInfoStep = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_PROFILE = "http://localhost:5110/api/Auth/profile"; // Adjust base URL/path as needed

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const response = await axios.get(API_PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        setError(
          err.response?.data || err.message || "Failed to fetch user profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div>Loading user info...</div>;

  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );

  return (
    <div className="card p-4 mb-3">
      <h4>User Info</h4>
      <p>
        <strong>Username:</strong> {user.username || user.Username || user.Name}
      </p>
      <p>
        <strong>Email:</strong> {user.email || user.Email}
      </p>
      <p>
        <strong>Phone:</strong> {user.mobile || user.Mobile}
      </p>
    </div>
  );
};

export default UserInfoStep;

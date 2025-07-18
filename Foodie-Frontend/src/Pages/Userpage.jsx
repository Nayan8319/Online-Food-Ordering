import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import UserInformation from "./Profile/UserInformation";
import Tabs from "./Profile/Tabs";
import PasswordChangeModal from "./Profile/PasswordChangeModal";
import ProfileEditModal from "./Profile/ProfileEditModal";
import AddressList from "./Profile/AddressList";
import OrderHistory from "./Profile/OrderHistory";

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    mobile: "",
    imageUrl: "",
  });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setProfileError("User is not logged in.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5110/api/Auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData({
          imageUrl: res.data.imageUrl || "/UserImages/default.jpg",
          name: res.data.name,
          username: res.data.username,
          mobile: res.data.mobile,
          email: res.data.email,
          createdDate: new Date(res.data.createdDate).toLocaleDateString(),
        });

        const addressRes = await axios.get(
          "http://localhost:5110/api/address/allAddress",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAddresses(addressRes.data || []);
      } catch (error) {
        console.error(error);
        setProfileError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handlePasswordChange = () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      setPasswordError("All fields are required.");
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }

    axios
      .post(
        "http://localhost:5110/api/Auth/change-password",
        {
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Password Changed",
          text: "You will be logged out now.",
          timer: 2500,
          showConfirmButton: false,
        }).then(() => {
          localStorage.removeItem("token");
          navigate("/login");
          window.location.reload();
          

        });
      })
      .catch((err) => {
        setPasswordError(err.response?.data || "Failed to change password.");
      });
  };

  const handleProfileUpdate = async () => {
    setEditLoading(true);
    setEditError("");
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("username", editForm.username);
      formData.append("mobile", editForm.mobile);
      if (selectedFile) {
        formData.append("imageFile", selectedFile);
      } else if (editForm.imageUrl) {
        formData.append("imageUrl", editForm.imageUrl);
      }

      const res = await axios.put(
        "http://localhost:5110/api/Auth/edit-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: res.data || "Your profile has been updated.",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => window.location.reload());
    } catch (error) {
      setEditError(error.response?.data || "Failed to update profile.");
    } finally {
      setEditLoading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container mt-5">
        <p className="text-danger">{profileError}</p>
      </div>
    );
  }

  return (
    <section className="book_section layout_padding">
      <div className="container">
        <div className="heading_container">
          <h2>User Information</h2>
        </div>

        <UserInformation
          userData={userData}
          setShowEditModal={setShowEditModal}
          setShowPasswordModal={setShowPasswordModal}
        />

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="tab-content ml-1">
          {activeTab === "basicInfo" && (
            <div className="tab-pane fade show active">
              <div className="row">
                <div className="col-sm-3 col-md-2 col-5">
                  <strong>Full Name</strong>
                </div>
                <div className="col-md-8 col-6">{userData.name}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3 col-md-2 col-5">
                  <strong>Username</strong>
                </div>
                <div className="col-md-8 col-6">{userData.username}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3 col-md-2 col-5">
                  <strong>Mobile No.</strong>
                </div>
                <div className="col-md-8 col-6">{userData.mobile}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3 col-md-2 col-5">
                  <strong>Email Addr.</strong>
                </div>
                <div className="col-md-8 col-6">{userData.email}</div>
              </div>
              <hr />
              <AddressList addresses={addresses} />
            </div>
          )}

          {activeTab === "orderHistory" && (
            <div className="tab-pane fade show active">
              <OrderHistory token={token} />
            </div>
          )}
        </div>
      </div>

    <PasswordChangeModal
  showPasswordModal={showPasswordModal}
  setShowPasswordModal={setShowPasswordModal}
  passwordForm={passwordForm}
  setPasswordForm={setPasswordForm}
  passwordError={passwordError}
  setPasswordError={setPasswordError} 
  handlePasswordChange={handlePasswordChange}
/>


      <ProfileEditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editForm={editForm}
        setEditForm={setEditForm}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        handleProfileUpdate={handleProfileUpdate}
        editLoading={editLoading}
        editError={editError}
        userData={userData}
      />
    </section>
  );
};

export default UserProfile;

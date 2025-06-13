import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Topbar from "../Admin/components/Topbar";
import Sidebar from "../Admin/components/SideBar";
import ProfileEditModal from "../Pages/Profile/ProfileEditModal";
import { isAdmin, getToken } from "../utils/auth";

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    mobile: "",
    imageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token || !isAdmin()) {
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = getToken();
      const res = await fetch("http://localhost:5110/api/Auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Profile not found");

      const data = await res.json();

      setUserData({
        imageUrl: data.imageUrl || "/UserImages/default.jpg",
        name: data.name,
        username: data.username,
        mobile: data.mobile,
        email: data.email,
        createdDate: new Date(data.createdDate).toLocaleDateString(),
      });
    } catch (error) {
      console.error("Failed to load profile data", error);
    }
  };

  useEffect(() => {
    if (showEditModal && userData) {
      setEditForm({
        name: userData.name || "",
        username: userData.username || "",
        mobile: userData.mobile || "",
        imageUrl: userData.imageUrl || "",
      });
      setPreviewUrl(userData.imageUrl || null);
      setSelectedFile(null);
    }
  }, [showEditModal, userData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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

      const token = getToken();
      const res = await fetch("http://localhost:5110/api/Auth/edit-profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      let result;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        result = await res.text(); // fallback for plain text
      }

      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: result.message || result || "Your profile was updated successfully.",
          confirmButtonText: "OK",
        });

        await fetchUserData(); // refresh the data
        setShowEditModal(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        setEditError(result.message || result || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setEditError("Something went wrong.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <Topbar
        onEditProfileClick={() => setShowEditModal(true)}
        onLogout={handleLogout}
        onToggleSidebar={() => setCollapsed(!collapsed)}
        userData={userData}
      />

      <div className="d-flex" style={{ height: "calc(100vh - 60px)" }}>
        <Sidebar collapsed={collapsed} />
        <div className="flex-grow-1 p-3 bg-light" style={{ overflowY: "auto" }}>
          {children}
        </div>
      </div>

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
    </div>
  );
};

export default AdminLayout;

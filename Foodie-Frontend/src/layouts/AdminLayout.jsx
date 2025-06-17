import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Topbar from "../Admin/components/Topbar";
import Sidebar from "../Admin/components/SideBar";
import ProfileEditModal from "../Pages/Profile/ProfileEditModal";
import { isAdmin, getToken } from "../utils/auth";
import LoadingPage from "../Admin/pages/LoadingPage";

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      const token = getToken();
      const res = await fetch("http://localhost:5110/api/Auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Profile not found");

      const data = await res.json();

      // Prefix image path if not full URL
      const imagePath = data.imageUrl
        ? data.imageUrl.startsWith("http")
          ? data.imageUrl
          : `/UserImages/${data.imageUrl.replace(/^\/?UserImages\//, "")}`
        : "/UserImages/default.jpg";

      setUserData({
        imageUrl: imagePath,
        name: data.name,
        username: data.username,
        mobile: data.mobile,
        email: data.email,
        createdDate: new Date(data.createdDate).toLocaleDateString(),
      });
    } catch (error) {
      console.error("Failed to load profile data", error);
    } finally {
      setLoading(false);
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

      const contentType = res.headers.get("content-type");
      const result = contentType?.includes("application/json")
        ? await res.json()
        : await res.text();

      if (res.ok) {
        Swal.fire("Success", result.message || "Profile updated", "success");
        await fetchUserData();
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

  if (loading || !userData) return <LoadingPage />;

  return (
    <div className="admin-layout">
      <Topbar
        onEditProfileClick={() => setShowEditModal(true)}
        onLogout={handleLogout}
        onToggleSidebar={() => setCollapsed(!collapsed)}
        userData={userData} // ✅ Ensure imageUrl passed here
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

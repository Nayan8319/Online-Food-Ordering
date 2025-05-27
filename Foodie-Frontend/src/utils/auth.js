// /utils/auth.js

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.Role || payload.role || null;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

export const isAdmin = () => getUserRole() === "Admin";

export const isUser = () => getUserRole() === "User";
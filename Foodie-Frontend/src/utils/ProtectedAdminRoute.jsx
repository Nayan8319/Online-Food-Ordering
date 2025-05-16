import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUserRole } from './auth';

const ProtectedAdminRoute = ({ children }) => {
  const token = getToken();
  const role = getUserRole();

  if (!token || role !== 'Admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;

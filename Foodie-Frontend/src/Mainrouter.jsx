import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Homepage from './Pages/Homepage';
import MenuPage from './Pages/MenuPage';
import Aboutpage from './Pages/Aboutpage';
import Contact from './Pages/Contact';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import VerifyOtpPage from './Pages/VerifyOtpPage';

import AdminDashboard from './AdminPages/AdminDashboard';

import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedAdminRoute from './utils/ProtectedAdminRoute'; // optional wrapper for protection

const Mainrouter = createBrowserRouter([
  // User Routes
  {
    path: '/',
    element: <UserLayout><Homepage /></UserLayout>
  },
  {
    path: '/menu',
    element: <UserLayout><MenuPage /></UserLayout>
  },
  {
    path: '/about',
    element: <UserLayout><Aboutpage /></UserLayout>
  },
  {
    path: '/contact',
    element: <UserLayout><Contact /></UserLayout>
  },
  {
    path: '/login',
    element: <UserLayout><LoginPage /></UserLayout>
  },
  {
    path: '/register',
    element: <UserLayout><RegisterPage /></UserLayout>
  },
  {
    path: '/verify-otp',
    element: <UserLayout><VerifyOtpPage /></UserLayout>
  },

  // Admin Routes (protected)
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </ProtectedAdminRoute>
    )
  },
]);

export default Mainrouter;

import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Homepage from './Pages/Homepage';
import MenuPage from './Pages/MenuPage';
import Aboutpage from './Pages/Aboutpage';
import Contact from './Pages/Contact';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import VerifyOtpPage from './Pages/VerifyOtpPage';

import AdminDashboard from './Admin/pages/AdminDashboard';
// import CategoryPage from './Admin/pages/CategoryPage';
// import ProductPage from './Admin/pages/ProductPage';

import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

const Mainrouter = createBrowserRouter([
  // User routes
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

  // Admin routes — protected at layout level
  {
    path: '/admin/dashboard',
    element: <AdminLayout><AdminDashboard /></AdminLayout>
  },
  // {
  //   path: '/admin/categories',
  //   element: <AdminLayout><CategoryPage /></AdminLayout>
  // },
  // {
  //   path: '/admin/products',
  //   element: <AdminLayout><ProductPage /></AdminLayout>
  // },
]);

export default Mainrouter;

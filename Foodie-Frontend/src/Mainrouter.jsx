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


import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import Categories from './Admin/pages/Categories';
import Product from './Admin/pages/Product';
import Users from './Admin/pages/Users';
import Orders from './Admin/pages/Orders';
import Reports from './Admin/pages/Reports';
import AddProduct from './Admin/components/Product/AddProduct';
import EditProduct from './Admin/components/Product/EditProduct';
import AddCategory from './Admin/components/Category/AddCategory';
import EditCategory from './Admin/components/Category/EditCategory';
import SingleMenuItem from './Components/SingleMenuItem';
import Cart from './Pages/Cart';

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
    path: '/menu/:id',             // <-- single menu item route with param id
    element: <UserLayout><SingleMenuItem /></UserLayout>
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
    path: '/cart',
    element: <UserLayout><Cart /></UserLayout>
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
  {
    path: '/admin/categories',
    element: <AdminLayout><Categories /></AdminLayout>
  },
  {
  path: '/admin/Categories/add-Category',
  element: <AdminLayout><AddCategory /></AdminLayout>
  },
  {
  path: '/admin/categories/edit-Category/:id',
  element: <AdminLayout><EditCategory /></AdminLayout>
  },
  {
    path: '/admin/product',
    element: <AdminLayout><Product /></AdminLayout>
  },
  {
  path: '/admin/product/add-product',
  element: <AdminLayout><AddProduct /></AdminLayout>
  },
  {
  path: '/admin/product/edit-product/:id',
  element: <AdminLayout><EditProduct /></AdminLayout>
  },
  {
    path: '/admin/Users',
    element: <AdminLayout><Users /></AdminLayout>
  },
  {
    path: '/admin/Orders',
    element: <AdminLayout><Orders /></AdminLayout>
  },
  {
    path: '/admin/Reports',
    element: <AdminLayout><Reports /></AdminLayout>
  },
]);

export default Mainrouter;

import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HeaderComponent from './Commoncomponents/HeaderComponent';
import FooterCompo from './Commoncomponents/FooterCompo';
import Homepage from './Pages/Homepage.jsx';
import MenuPage from './Pages/MenuPage';
import Aboutpage from './Pages/Aboutpage';
import Contact from './Pages/Contact';
import GotoTopcom from './Components/GotoTopcom';
import LoginPage from './Pages/LoginPage.jsx';
import RegisterPage from './Pages/RegisterPage.jsx';
import VerifyOtpPage from './Pages/VerifyOtpPage.jsx';


const Mainrouter = createBrowserRouter([
    {
        path: "/",
        element: <>
            <HeaderComponent bgcolor='transparent' />
            <Homepage />
            <FooterCompo />
            <GotoTopcom />
        </>,
    },
    {
        path: "/menu",
        element: <>
            <HeaderComponent bgcolor='#222222' />
            <MenuPage />
            <FooterCompo />
            <GotoTopcom />
        </>
    }, {
        path: "/about",
        element: <>
            <HeaderComponent bgcolor='#222222' />
            <Aboutpage />
            <FooterCompo />
            <GotoTopcom />
        </>
    },
    {
        path: "/Contact",
        element: <>
            <HeaderComponent bgcolor='#222222' />
            <Contact />
            <FooterCompo />
            <GotoTopcom />
        </>
    },
    {
        path: "/login",
        element: <>
            <HeaderComponent bgcolor='#222222' />
            <LoginPage />
            <FooterCompo />
            <GotoTopcom />
        </>
    },
    {
        path: "/register",
        element: <>
            <HeaderComponent bgcolor='#222222' />
            <RegisterPage />
            <FooterCompo />
            <GotoTopcom />
        </>
    },
    {
        path: "/verify-otp",
        element: <>
          <HeaderComponent bgcolor='#222222' />
          <VerifyOtpPage />
          <FooterCompo />
          <GotoTopcom />
        </>
      }
]);

export default Mainrouter;

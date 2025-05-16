import React from 'react';
import HeaderComponent from '../Commoncomponents/HeaderComponent';
import FooterCompo from '../Commoncomponents/FooterCompo';
import GotoTopcom from '../Components/GotoTopcom';

const UserLayout = ({ children }) => (
  <>
    <HeaderComponent bgcolor="#222222" />
    {children}
    <FooterCompo />
    <GotoTopcom />
  </>
);

export default UserLayout;

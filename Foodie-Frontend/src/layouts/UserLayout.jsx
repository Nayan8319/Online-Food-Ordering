import React, { useEffect, useState } from 'react';
import HeaderComponent from '../Commoncomponents/HeaderComponent';
import FooterCompo from '../Commoncomponents/FooterCompo';
import GotoTopcom from '../Components/GotoTopcom';
import Loading from '../Components/Loading'; // 👈 import the custom loader

const UserLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulated loading time
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <HeaderComponent bgcolor="#222222" />
      {children}
      <FooterCompo />
      <GotoTopcom />
    </>
  );
};

export default UserLayout;

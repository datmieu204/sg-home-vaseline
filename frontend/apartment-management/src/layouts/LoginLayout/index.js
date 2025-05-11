import React from 'react';
import { Outlet } from 'react-router-dom';


const LoginLayout = () => {
  return (
    <>
      <Outlet /> {/* Render child routes like '/admin' */}
    </>
  );
};

export default LoginLayout;
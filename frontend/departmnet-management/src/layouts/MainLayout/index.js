import React from 'react';
import MenuBar from '../../Components/MenuBar/MenuBar';
import './MainLayout.css';

const MainLayout = ({ children, role }) => {
  return (
    <div className="main-layout">
      <MenuBar role={role} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
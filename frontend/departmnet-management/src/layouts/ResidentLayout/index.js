import React from 'react';
import MenuBar from '../../Components/MenuBar';

const ResidentLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <MenuBar role="resident" />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
};

export default ResidentLayout;
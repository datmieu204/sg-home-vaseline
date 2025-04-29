import React from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from '../../components/Header/Header';
import NavBar from '../../components/NavBar';
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="App">
      <div>
        <TopHeader />
        <NavBar />
        <Outlet />
      </div>
      {/* <div className="navbar-container"> */}
    </div>
    // </div>
  );
}

export default MainLayout;
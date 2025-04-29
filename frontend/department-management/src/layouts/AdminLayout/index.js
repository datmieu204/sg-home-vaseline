import React from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from '../../components/Header/Header';
import NavBar from '../../components/NavBar';
import './AdminLayout.css';

function AdminLayout() {
  return (
    <div className="App admin-app" >
      <div>
        <TopHeader />
      </div>
      <div className="navbar-container" style={{backgroundColor: '#303c54'}}>
        <NavBar />
        <div className="admin-content" style={{backgroundColor: '#303c54'}}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
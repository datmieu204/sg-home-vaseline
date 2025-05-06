// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { routesByRole, commonRoutes } from './routes'; 

const App = () => {
  const userRole = 'admin'; // Có thể thay đổi thành 'admin', 'leader', 'resident'

  const roleRoutes = routesByRole[userRole] || [];

  return (
    <Router>
      <MainLayout role={userRole}>
        <Routes>
          {/* Điều hướng mặc định */}
          <Route path="/" element={<Navigate to={`/${userRole}/tasks`} />} />

          {/* Routes theo role */}
          {roleRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {/* Routes dùng chung */}
          {commonRoutes.map((route, index) => (
            <Route key={`common-${index}`} path={route.path} element={route.element} />
          ))}

          {/* 404 fallback */}
          <Route path="*" element={<div><h1>404 - Không tìm thấy trang</h1></div>} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
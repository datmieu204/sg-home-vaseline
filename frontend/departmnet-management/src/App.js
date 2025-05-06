import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import TaskList from './Components/TaskList/TaskList';
import ReportList from './Components/ReportList/ReportList';
import NotificationList from './Components/NotificationList/NotificationList';
import ServiceList from './Components/ServiceList/ServiceList';
import AccountPage from './Components/Account/AccountPage';

// Create a wrapper component that handles role changes and navigation
const AppContent = () => {
  // In a real app, you would get this from authentication
  const [userRole, setUserRole] = useState('resident'); // 'admin', 'resident', 'employee'
  const navigate = useNavigate();
  const location = useLocation();
  const initialRender = useRef(true);
  const prevRoleRef = useRef(userRole);
  
  useEffect(() => {
    // On first render, check if we're already on a valid route
    if (initialRender.current) {
      // If we're at the root, navigate to account
      if (location.pathname === '/') {
        navigate('/account');
      }
      // Otherwise, stay on the current route
      initialRender.current = false;
      return;
    }
    
    // Only navigate if role has changed
    if (prevRoleRef.current !== userRole) {
      navigate('/account');
      prevRoleRef.current = userRole;
    }
  }, [userRole, navigate, location.pathname]);

  return (
    <Routes>
      {/* Default route redirects to account page */}
      <Route path="/" element={<Navigate to="/account" replace />} />
      
      {/* Account routes */}
      <Route path="/account" element={
        <MainLayout role={userRole}>
          <AccountPage userRole={userRole} />
        </MainLayout>
      } />
      
      {/* Task routes */}
      <Route path="/tasks" element={
        <MainLayout role={userRole}>
          <TaskList />
        </MainLayout>
      } />
      
      {/* Reports route */}
      <Route path="/reports" element={
        <MainLayout role={userRole}>
          <ReportList />
        </MainLayout>
      } />
      
      {/* Notifications route */}
      <Route path="/notifications" element={
        <MainLayout role={userRole}>
          <NotificationList />
        </MainLayout>
      } />
      
      {/* Services route */}
      <Route path="/services" element={
        <MainLayout role={userRole}>
          <ServiceList />
        </MainLayout>
      } />

      {/* Add more routes based on your menu structure */}
      <Route path="/tasks/employees" element={
        <MainLayout role={userRole}>
          <div>Employee Tasks Content</div>
        </MainLayout>
      } />

      <Route path="/accounts/employees" element={
        <MainLayout role={userRole}>
          <div>Employee Accounts Content</div>
        </MainLayout>
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
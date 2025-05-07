import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import LoginLayout from './layouts/LoginLayout';
import LoginPage from './pages/login_page';

import AdminLayout from './layouts/AdminLayout';
import EmployeeDashboard from './pages/admin/dashboard/employeeDashboard';
import ServiceDashboard from './pages/admin/dashboard/serviceDashboard';
import HouseholdDashboard from './pages/admin/dashboard/householdDashboard';
import Dashboard from './pages/admin/dashboard';
import AdminAccount from './pages/admin/account';
import './App.css';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
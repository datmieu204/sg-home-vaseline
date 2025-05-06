import React from 'react';
import { useRoutes } from 'react-router-dom';

import LoginLayout from '../layouts/LoginLayout';
import LoginPage from '../pages/login_page';

import AdminLayout from '../layouts/AdminLayout';
import EmployeeDashboard from '../pages/admin/dashboard/employeeDashboard';
import ServiceDashboard from '../pages/admin/dashboard/serviceDashboard';
import HouseholdDashboard from '../pages/admin/dashboard/householdDashboard';
import Dashboard from '../pages/admin/dashboard';

import AdminAccount from '../pages/admin/account';

function AppRoutes() {
  const routes = [
    {
      path: '/',
      element: <LoginLayout />,
      children: [
        { index: true, element: <LoginPage /> },
      ],
    },
    {
      path: '/admin',
      element: <AdminLayout />, 
      children: [
        {
          path: 'account',
          element: <AdminAccount />,
        },
        { 
          path: 'dashboard', 
          element: <Dashboard />,
          children: [
            { path: 'employeeDashboard', element: <EmployeeDashboard /> },
            { path: 'serviceDashboard', element: <ServiceDashboard /> },
            { path: 'householdDashboard', element: <HouseholdDashboard /> },
          ]
        },
        // { path: 'users', element: <UserManagement /> },
        // { path: 'reports', element: <ReportsPage /> },
      ],
    },
  ];

  const routing = useRoutes(routes);
  return routing;
}

export default AppRoutes;

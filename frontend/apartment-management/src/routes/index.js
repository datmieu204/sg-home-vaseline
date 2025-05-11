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
import OtherAccount from '../pages/admin/otherAccount';
import HouseholdAccount from '../pages/admin/otherAccount/householdAccount';
import ManagerAccount from '../pages/admin/otherAccount/managerAccount';  
import StaffAccount from '../pages/admin/otherAccount/staffAccount';


import Tasks from '../pages/admin/tasks';
import ManagerTasks from '../pages/admin/tasks/tasks_manager';
import StaffTasks from '../pages/admin/tasks/tasks_staff';


import ManagerLayout from '../layouts/ManagerLayout';
import ManagerAccount1 from '../pages/manager/account';
import ManagerOtherAccount1 from '../pages/manager/otherAccount';
import ManagerTasks1 from '../pages/manager/tasks';
import ManagerOtherTasks1 from '../pages/manager/otherTasks';
import ManagerIncidents1 from '../pages/manager/incidents';


import StaffLayout from '../layouts/StaffLayout';
import StaffRECEPLayout from '../layouts/StaffRECEPLayout';
import StaffACCTLayout from '../layouts/StaffACCTLayout';
import StaffAccount2 from '../pages/staff/account';
import StaffTasks2 from '../pages/staff/tasks';
import StaffService2 from '../pages/staff/serviceRecep';
import StaffIncidents2 from '../pages/staff/incidents';
import StaffPayment2 from '../pages/staff/paymentConfirm';
import OtherAccount2 from '../pages/staff/otherAccount';


import HouseholdLayout from '../layouts/HouseholdLayout';
import HouseholdAccount1 from '../pages/household/account';
import Notification from '../pages/household/notificationHousehold';
import ServiceHousehold from '../pages/household/servicesHousehold';
import MyService from '../pages/household/servicesHousehold/myService';
import RegisterService from '../pages/household/servicesHousehold/registerService';



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
        {
          path: 'otherAccount',
          element: <OtherAccount />,
          children: [
            {path: 'householdAccount', element: <HouseholdAccount />},
            {path: 'managerAccount', element: <ManagerAccount />},
            {path: 'staffAccount', element: <StaffAccount />},
          ]
        },
        {
          path: 'tasks',
          element: <Tasks />,
          children: [
            {path: 'managerTasks', element: <ManagerTasks />},
            {path: 'staffTasks', element: <StaffTasks />},
          ]
        },
      ],
    },
    {
      path: '/manager',
      element: <ManagerLayout />,
      children: [
        { path: 'account', element: <ManagerAccount1 /> },
        { path: 'otherAccount', element: <ManagerOtherAccount1 /> },
        { path: 'tasks', element: <ManagerTasks1 /> },
        { path: 'otherTasks', element: <ManagerOtherTasks1 /> },
        { path: 'incidents', element: <ManagerIncidents1 /> },
      ],
    },
    {
      path: '/staff',
      element: <StaffLayout />,
      children: [
        { path: 'account', element: <StaffAccount2 /> },
        { path: 'tasks', element: <StaffTasks2 /> },
        { path: 'incidents', element: <StaffIncidents2 /> },
      ],
    },
    {
      path: '/staffRECEP',
      element: <StaffRECEPLayout />,
      children: [
        { path: 'account', element: <StaffAccount2 /> },
        { path: 'tasks', element: <StaffTasks2 /> },
        { path: 'services', element: <StaffService2 /> },
        { path: 'incidents', element: <StaffIncidents2 /> },
        { path: 'otherAccount', element: <OtherAccount2 /> }
      ],
    },
    {
      path: '/staffACCT',
      element: <StaffACCTLayout />,
      children: [
        { path: 'account', element: <StaffAccount2 /> },
        { path: 'tasks', element: <StaffTasks2 /> },
        { path: 'incidents', element: <StaffIncidents2 /> },
        { path: 'payment', element: <StaffPayment2 /> },
      ],
    },
    {
      path: '/household',
      element: <HouseholdLayout />,
      children: [
        { path: 'account', element: <HouseholdAccount1 /> },
        { path: 'notifications', element: <Notification /> },
        { 
          path: 'services',
          element: <ServiceHousehold />,
          children: [
            { path: 'myService', element: <MyService /> },
            { path: 'registerService', element: <RegisterService /> },
          ],
        },
      ],
    }
  
  ];

  const routing = useRoutes(routes);
  return routing;
}

export default AppRoutes;

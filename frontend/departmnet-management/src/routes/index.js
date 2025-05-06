// routes/index.js
import React from 'react';

import TaskList from '../Components/TaskList/TaskList';
import TaskDetail from '../Components/TaskDetail/TaskDetail';
import OtherTaskList from '../Components/OtherTaskList/OtherTaskList';
import OtherTaskDetail from '../Components/OtherTaskDetail/OtherTaskDetail';
import OtherTask from '../Components/OtherTask/OtherTask';
import TaskEditing from '../Components/TaskEditing/TaskEditing';
import TaskCreating from '../Components/TaskCreating/TaskCreating';
import PaymentList from '../Components/PaymentList/PaymentList';
import PaymentConfirmation from '../Components/PaymentConfirmation/PaymentConfirmation';



import HouseholdDashboard from '../Components/dashboard/householdDashboard/HouseholdDashboard'; 
import EmployeeDashboard from '../Components/dashboard/employeeDashboard/EmployeeDashboard';
import ServiceDashboard from '../Components/dashboard/serviceDashboard/ServiceDashboard';
const DashboardPage = () => <div><h1>Dashboard</h1></div>; // Trang Dashboard chính


// Các trang placeholder
const AccountPage = () => <div><h1>Trang Tài khoản</h1></div>;
const ReportsPage = () => <div><h1>Trang Báo cáo</h1></div>;
const EmployeeTasksPage = () => <div><h1>Trang Nhiệm vụ nhân viên</h1></div>;
const NotificationsPage = () => <div><h1>Thông báo</h1></div>;
const ServicesPage = () => <div><h1>Dịch vụ</h1></div>;

const routesByRole = {
  admin: [
    { path: '/admin/account', element: <AccountPage /> },
    { path: '/admin/other-tasks', element: <OtherTask /> },
    { 
        path: '/admin/dashboard', 
        element: <DashboardPage />,
        children: [
            { path: 'households', element: <HouseholdDashboard /> },
            { path: 'employees', element: <EmployeeDashboard /> },
            { path: 'services', element: <ServiceDashboard /> },
        ]
    },
  ],
  leader: [
    { path: '/leader/account', element: <AccountPage /> },
    { path: '/leader/tasks', element: <TaskList /> },
    { path: '/leader/other-tasks', element: <OtherTaskList /> },
    { path: '/leader/reports', element: <ReportsPage /> },
    { path: '/leader/employee-tasks', element: <EmployeeTasksPage /> },
  ],
  emp: [
    { path: '/emp/account', element: <AccountPage /> },
    { path: '/emp/tasks', element: <TaskList /> },
    { path: '/emp/reports', element: <ReportsPage /> },
  ],
  resident: [
    { path: '/resident/account', element: <AccountPage /> },
    { path: '/resident/notifications', element: <NotificationsPage /> },
    { path: '/resident/services', element: <ServicesPage /> },
  ],
  finance: [
    { path: '/emp/account', element: <AccountPage /> },
    { path: '/emp/tasks', element: <TaskList /> },
    { path: '/emp/reports', element: <ReportsPage /> },
    { path: '/finance/payments', element: <PaymentList /> },
  ]
};

const commonRoutes = [
  { path: '/task/:id', element: <TaskDetail /> },
  { path: '/other-task/:id', element: <OtherTaskDetail /> },
  { path: '/edit-task', element: <TaskEditing /> },
  { path: '/add-task', element: <TaskCreating /> },
  { path: '/payment-confirmation/:id', element: <PaymentConfirmation /> },
];

export { routesByRole, commonRoutes };

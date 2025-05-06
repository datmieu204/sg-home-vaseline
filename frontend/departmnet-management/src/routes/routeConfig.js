import AdminLayout from '../layouts/AdminLayout';
import LeaderLayout from '../layouts/LeaderLayout';
import EmpLayout from '../layouts/EmpLayout';
import TaskList from '../Components/TaskList/TaskList';
import TaskDetail from '../Components/TaskDetail/TaskDetail';
import OtherTask from '../Components/OtherTask/OtherTask'; 
import React from 'react'; // Import React để tạo các trang trống


import HouseholdDashboard from '../Components/dashboard/householdDashboard/HouseholdDashboard';
import EmployeeDashboard from '../Components/dashboard/employeeDashboard/EmployeeDashboard';
import ServiceDashboard from '../Components/dashboard/serviceDashboard/ServiceDashboard';


// Các trang trống ban đầu
const AccountPage = () => <div><h1>Trang Tài khoản</h1></div>;
const OtherTask = () => <div><h1>Trang Nhiệm vụ người khác</h1></div>;
const DashboardPage = () => <div><h1>Trang Dashboard</h1></div>;

// Route configuration
export const routes = [
  { path: "/admin/account", layout: AdminLayout, component: AccountPage },
  { path: "/admin/other-tasks", layout: AdminLayout, component: OtherTask },
  { path: "/admin/other-accounts", layout: AdminLayout, component: AccountPage },
  { 
    path: "/admin/dashboard", 
    layout: AdminLayout, 
    component: DashboardPage,
    children: [
      { path: "households", layout: AdminLayout, component: HouseholdDashboard },
      { path: "employees", layout: AdminLayout, component: EmployeeDashboard },
      { path: "services", layout: AdminLayout, component: ServiceDashboard }
    ]
  },
  { path: "/leader/account", layout: LeaderLayout, component: AccountPage },
  { path: "/leader/tasks", layout: LeaderLayout, component: TaskList },
  { path: "/emp/account", layout: EmpLayout, component: AccountPage },
  { path: "/emp/tasks", layout: EmpLayout, component: TaskList },
  { path: "/task/:id", layout: EmpLayout, component: TaskDetail },
];
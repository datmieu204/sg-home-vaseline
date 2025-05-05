import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import TaskList from './Components/TaskList/TaskList';
import TaskDetail from './Components/TaskDetail/TaskDetail';
import OtherTaskList from './Components/OtherTaskList/OtherTaskList';
import OtherTaskDetail from './Components/OtherTaskDetail/OtherTaskDetail';
import OtherTask from './Components/OtherTask/OtherTask'; 
import TaskEditing from './Components/TaskEditing/TaskEditing';
import TaskCreating from './Components/TaskCreating/TaskCreating';


// Các trang placeholder (trang trống ban đầu)
const AccountPage = () => <div><h1>Trang Tài khoản</h1></div>;
const ReportsPage = () => <div><h1>Trang Báo cáo</h1></div>;
const EmployeeTasksPage = () => <div><h1>Trang Nhiệm vụ nhân viên</h1></div>;
const DashboardPage = () => <div><h1>Dashboard</h1></div>;

const App = () => {
  const userRole = 'leader'; // Có thể thay đổi thành 'admin', 'leader', 'resident'

  // Định nghĩa các routes theo role
  const routesByRole = {
    admin: [
      { path: '/admin/account', element: <AccountPage /> },
      { path: '/admin/other-tasks', element: <OtherTask /> },
      { path: '/admin/dashboard', element: <DashboardPage /> },
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
      { path: '/resident/notifications', element: <div><h1>Thông báo</h1></div> },
      { path: '/resident/services', element: <div><h1>Dịch vụ</h1></div> },
    ],
  };

  const roleRoutes = routesByRole[userRole] || [];

  return (
    <Router>
      <MainLayout role={userRole}>
        <Routes>
          {/* Điều hướng mặc định tới trang tasks */}
          <Route path="/" element={<Navigate to={`/${userRole}/tasks`} />} />

          {/* Các route cụ thể theo role */}
          {roleRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {/* Route chi tiết nhiệm vụ */}
          <Route path="/task/:id" element={<TaskDetail />} />

          {/* Route chi tiết nhiệm vụ khác */}
          <Route path="/other-task/:id" element={<OtherTaskDetail />} />

          {/* Route sửa nhiệm vụ */}
          <Route path="/edit-task" element={<TaskEditing role={userRole} />} />

          {/* Route thêm nhiệm vụ */}
          <Route path="/add-task" element={<TaskCreating role={userRole} />} />

          {/* Route fallback nếu không khớp */}
          <Route path="*" element={<div><h1>404 - Không tìm thấy trang</h1></div>} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Thêm Navigate
import MainLayout from './layouts/MainLayout';
import TaskList from './Components/TaskList/TaskList';
import TaskDetail from './Components/TaskDetail/TaskDetail';
import OtherTaskList from './Components/OtherTaskList/OtherTaskList';


const App = () => {
  const userRole = 'leader'; // Có thể thay đổi thành 'admin', 'leader', 'resident'

  return (
    <Router>
      <MainLayout role={userRole}>
        <Routes>
          {/* Route mặc định */}
          <Route path="/" element={<Navigate to={`/${userRole}/tasks`} />} />
          {/* Route danh sách nhiệm vụ */}
          <Route path="/leader/tasks" element={<TaskList />} />
          {/* Route danh sách nhiệm vụ khác */}
          <Route path="/leader/other-tasks" element={<OtherTaskList />} />
          {/* Route chi tiết nhiệm vụ */}
          <Route path="/task/:id" element={<TaskDetail />} />
          {/* Route fallback */}
          <Route path="*" element={<div><h1>404 - Không tìm thấy trang</h1></div>} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
import React from 'react';
import MainLayout from './layouts/MainLayout';
import TaskList from './Components/TaskList/TaskList';

const App = () => {
  // Giả định role được truyền vào, trong thực tế có thể lấy từ state hoặc API
  const userRole = 'admin'; // Có thể thay đổi thành 'admin', 'leader', 'resident'

  return (
    <MainLayout role={userRole}>
      <TaskList />
    </MainLayout>
  );
};

export default App;
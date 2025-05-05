import AdminLayout from '../layouts/AdminLayout';
import LeaderLayout from '../layouts/LeaderLayout';
import EmpLayout from '../layouts/EmpLayout';
import TaskList from '../Components/TaskList';

// Simulated task data
const tasks = [
  { id: 1, title: "Nhiệm vụ tuần 28/04/2025 - 04/05/2025", status: "Đang mở", deadline: "04/05/2025 lúc 23:59" },
  { id: 2, title: "Nhiệm vụ tuần 21/04/2025 - 27/04/2025", status: "Đã đóng", deadline: "27/04/2025 lúc 23:59" },
  { id: 3, title: "Nhiệm vụ tuần 14/04/2025 - 20/04/2025", status: "Đã đóng", deadline: "20/04/2025 lúc 23:59" },
  { id: 4, title: "Nhiệm vụ tuần 07/04/2025 - 13/04/2025", status: "Đã đóng", deadline: "13/04/2025 lúc 23:59" },
  { id: 5, title: "Nhiệm vụ tuần 31/03/2025 - 06/04/2025", status: "Đã đóng", deadline: "06/04/2025 lúc 23:59" },
];

// Route configuration
export const routes = [
  { path: "/admin/other-tasks", layout: AdminLayout, component: () => <TaskList tasks={tasks} title="Tất cả Nhiệm vụ người khác" /> },
  { path: "/leader/tasks", layout: LeaderLayout, component: () => <TaskList tasks={tasks} title="Tất cả Nhiệm vụ" /> },
  { path: "/emp/tasks", layout: EmpLayout, component: () => <TaskList tasks={tasks} title="Tất cả Nhiệm vụ" /> },
];
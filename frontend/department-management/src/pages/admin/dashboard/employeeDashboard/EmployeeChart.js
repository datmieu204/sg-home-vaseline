import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6F61'];

const EmployeeChart = ({ data }) => {
  const positionData = Object.entries(data.employees_by_position || {}).map(([name, value]) => ({ name, value }));
  const departmentData = Object.entries(data.employees_by_department || {}).map(([name, value]) => ({
    name: name === 'null' ? 'Không có' : name, value
  }));
  const statusData = [
    { name: 'Đang hoạt động', value: data.active_employees },
    { name: 'Không hoạt động', value: data.inactive_employees }
  ];
  const taskData = (data.employees || []).map(emp => ({
    name: emp.employee_name, in_progress: emp.in_progress_tasks, completed: emp.completed_tasks
  }));
  const scatterData = [...taskData];
  const radarData = [
    { subject: 'Manager', A: data.employees_by_position.manager ?? 0, fullMark: 10 },
    { subject: 'Staff', A: data.employees_by_position.staff ?? 0, fullMark: 10 },
    { subject: 'Head Manager', A: data.employees_by_position.head_manager ?? 0, fullMark: 10 }
  ];

  return (
    <>
      <div className="chart-container">
        <h2>Số lượng nhân viên theo vị trí</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={positionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Số lượng nhân viên theo bộ phận</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Tỷ lệ nhân viên theo trạng thái</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" label outerRadius={80} fill="#8884d8" dataKey="value">
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Công việc của nhân viên</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={taskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="in_progress" fill="#FF8042" name="Đang thực hiện" />
            <Bar dataKey="completed" fill="#00C49F" name="Đã hoàn thành" />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Mối quan hệ công việc đang thực hiện và đã hoàn thành</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="in_progress" name="Đang thực hiện" />
            <YAxis type="number" dataKey="completed" name="Đã hoàn thành" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Nhân viên" data={scatterData} fill="#8884d8" />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>So sánh số lượng theo vị trí</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar name="Số lượng" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Tooltip />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default EmployeeChart;

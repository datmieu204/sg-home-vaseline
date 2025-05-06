import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
  ScatterChart, Scatter, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6F61'];

const ServiceChart = ({ data }) => {
  const statusData = [
    { name: 'Đang hoạt động', value: data.active_services },
    { name: 'Không hoạt động', value: data.inactive_services }
  ];

  const usageData = [
    { name: 'Đang sử dụng', value: data.in_use_services },
    { name: 'Chưa sử dụng', value: data.total_services - data.in_use_services }
  ];

  const revenueData = data.services.map(service => ({
    name: service.service_name,
    revenue: service.total_revenue
  }));

  const priceData = data.services.map(service => ({
    name: service.service_name,
    price: service.price
  }));

  const householdData = data.services.map(service => ({
    name: service.service_name,
    num_households: service.num_households
  }));

  return (
    <>
      <div className="chart-container">
        <h2>Tỷ lệ dịch vụ đang hoạt động</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" label outerRadius={80} fill="#8884d8" dataKey="value">
              {statusData.map((entry, index) => (
                <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Tỷ lệ dịch vụ đang sử dụng</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={usageData} cx="50%" cy="50%" label outerRadius={80} fill="#82ca9d" dataKey="value">
              {usageData.map((entry, index) => (
                <Cell key={`cell-usage-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Doanh thu theo dịch vụ</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#FF8042" name="Doanh thu" />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Giá dịch vụ</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#00C49F" name="Giá" />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Số hộ gia đình sử dụng dịch vụ</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="category" dataKey="name" name="Dịch vụ" />
            <YAxis type="number" dataKey="num_households" name="Số hộ" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Dịch vụ" data={householdData} fill="#8884d8" />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ServiceChart;

import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6F61'];

const HouseholdChart = ({ data }) => {
  const statusData = [
    { name: 'Đang hoạt động', value: data.active_households },
    { name: 'Không hoạt động', value: data.inactive_households }
  ];

  const invoiceStatusData = Object.entries(data.invoices_by_status || {}).map(([name, value]) => ({
    name, value
  }));

  const serviceData = (data.households || []).map(h => ({
    name: h.household_name, num_services: h.num_services
  }));

  const revenueData = (data.households || []).map(h => ({
    name: h.household_name, total_revenue: h.total_revenue
  }));

  const scatterData = (data.households || []).map(h => ({
    pending: h.pending_invoices, paid: h.paid_invoices, overdue: h.overdue_invoices, name: h.household_name
  }));

  const radarData = [
    { subject: 'Pending', A: data.households.reduce((sum, h) => sum + h.pending_invoices, 0), fullMark: 10 },
    { subject: 'Paid', A: data.households.reduce((sum, h) => sum + h.paid_invoices, 0), fullMark: 10 },
    { subject: 'Overdue', A: data.households.reduce((sum, h) => sum + h.overdue_invoices, 0), fullMark: 10 }
  ];

  return (
    <>
      <div className="chart-container">
        <h2>Tình trạng hộ gia đình</h2>
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
        <h2>Trạng thái hóa đơn</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={invoiceStatusData}>
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
        <h2>Số dịch vụ theo hộ gia đình</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={serviceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="num_services" fill="#FF8042" />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Doanh thu theo hộ gia đình</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_revenue" fill="#00C49F" />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Mối quan hệ hóa đơn</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="pending" name="Chưa thanh toán" />
            <YAxis type="number" dataKey="paid" name="Đã thanh toán" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Hộ gia đình" data={scatterData} fill="#8884d8" />
            <Legend layout="horizontal" align="right" verticalAlign="top" iconSize={20} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>So sánh trạng thái hóa đơn</h2>
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

export default HouseholdChart;

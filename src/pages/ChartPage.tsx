import React from 'react';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const salesData = [
  { month: 'January', sales: 4000, lastYearSales: 3500 },
  { month: 'February', sales: 3000, lastYearSales: 2800 },
  { month: 'March', sales: 2000, lastYearSales: 2200 },
  { month: 'April', sales: 2780, lastYearSales: 2600 },
  { month: 'May', sales: 1890, lastYearSales: 2000 },
  { month: 'June', sales: 2390, lastYearSales: 2100 },
  { month: 'July', sales: 3490, lastYearSales: 3200 },
  { month: 'August', sales: 4000, lastYearSales: 3700 },
  { month: 'September', sales: 3000, lastYearSales: 2800 },
  { month: 'October', sales: 2000, lastYearSales: 2100 },
  { month: 'November', sales: 2780, lastYearSales: 2400 },
  { month: 'December', sales: 1890, lastYearSales: 2000 },
];

const userData = [
  { month: 'January', users: 1500, lastYearUsers: 1400 },
  { month: 'February', users: 1600, lastYearUsers: 1500 },
  { month: 'March', users: 2500, lastYearUsers: 2300 },
  { month: 'April', users: 3000, lastYearUsers: 2900 },
  { month: 'May', users: 2200, lastYearUsers: 2100 },
  { month: 'June', users: 1800, lastYearUsers: 1700 },
  { month: 'July', users: 2100, lastYearUsers: 2000 },
  { month: 'August', users: 3200, lastYearUsers: 3000 },
  { month: 'September', users: 2400, lastYearUsers: 2300 },
  { month: 'October', users: 2900, lastYearUsers: 2800 },
  { month: 'November', users: 2800, lastYearUsers: 2700 },
  { month: 'December', users: 2600, lastYearUsers: 2500 },
];

const ChartPage: React.FC = () => {
  return (
    <div className=" bg-slate-50 px-12 py-6 h-full ">
      <div className="mb-4">
        <div className="bg-white rounded-md   border p-4">
          <h2 className="text-base font-semibold mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#555" className="text-xs" />
              <YAxis stroke="#555" className="text-xs" />
              <Tooltip />
              <Legend />
              <Bar dataKey="lastYearSales" fill="#a6b8d4" />
              <Bar dataKey="sales" fill="#3a5676" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mb-4">
        <div className="bg-white rounded-md   border p-4">
          <h2 className="text-base font-semibold mb-4">User Registrations</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#555" className="text-xs" />
              <YAxis stroke="#555" className="text-xs" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#82ca9d" />
              <Line type="monotone" dataKey="lastYearUsers" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;

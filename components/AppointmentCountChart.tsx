import { Prisma } from '@prisma/client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

type AppointmentCountChartProps = {
    data: (Prisma.PickEnumerable<Prisma.AppointmentGroupByOutputType, "date"[]> & {
      _count: {
        id: number;
      };
    })[];
  };
  
  const AppointmentCountChart: React.FC<AppointmentCountChartProps> = ({ data }) => {
    const chartData = data.map(item => ({
      date: item.date.toISOString().split('T')[0],
      count: item._count.id
    }));
  
    return (
        <div className="h-full">
          <h3 className="text-lg font-semibold mb-4">Appointment Trends</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    };
    
    export default AppointmentCountChart;
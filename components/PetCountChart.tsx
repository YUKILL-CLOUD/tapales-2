'use client'

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Prisma } from '@prisma/client';

type PetCountChartProps = {
  data: (Prisma.PickEnumerable<Prisma.PetGroupByOutputType, "createdAt"[]> & {
    _count: {
      id: number;
    };
  })[];
};

const PetCountChart: React.FC<PetCountChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    date: item.createdAt.toISOString().split('T')[0],
    count: item._count.id
  }));

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold mb-4">Pet Registration Trends</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PetCountChart;
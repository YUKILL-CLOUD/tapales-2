import React from 'react';
import { Icon } from '@iconify/react';

interface StatCardProps {
  title: string;
  count: number;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{count}</p>
      </div>
      <Icon icon={icon} className="text-4xl text-blue-500" />
    </div>
  );
};

export default StatCard;
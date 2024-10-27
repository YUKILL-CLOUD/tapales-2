"use client";

import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export function PrescriptionStats({ stats }: { 
  stats: {
    active: number;
    completed: number;
    cancelled: number;
    topMedications: Array<{
      medication: string;
      _count: number;
    }>;
  } 
}) {
  const chartData = stats.topMedications.map(item => ({
    name: item.medication,
    total: item._count
  }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-sm font-medium">Active Prescriptions</h3>
          <p className="text-2xl font-bold">{stats.active}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium">Completed</h3>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium">Cancelled</h3>
          <p className="text-2xl font-bold">{stats.cancelled}</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Top Medications</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}


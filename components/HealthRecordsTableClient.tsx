"use client";

import { HealthRecord } from '@prisma/client';
import { Icon } from "@iconify/react";
import Link from 'next/link';
import Pagination from './Pagination';
import { ITEM_PER_PAGE } from '@/lib/settings';

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const HealthRecordsTableClient = ({ 
  healthRecords, 
  petId,
  currentPage,
  totalRecords
}: { 
  healthRecords: HealthRecord[]; 
  petId: number;
  currentPage: number;
  totalRecords: number;
}) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {healthRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.date).toISOString().split('T')[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.weight} kg</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.temperature}°C</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{truncateText(record.diagnosis, 20)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{truncateText(record.treatment, 20)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <Link href={`/list/pets/${petId}/petHealthRecord/${record.id}`}>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Icon icon="mdi:eye" width="20" height="20" />
                      </button>
                    </Link>
                    <Link href={`/list/pets/${petId}/petHealthRecord/${record.id}/edit`}>
                      <button className="text-green-600 hover:text-green-900">
                        <Icon icon="mdi:pencil" width="20" height="20" />
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={currentPage} count={totalRecords} />
    </>
  );
};

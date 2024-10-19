"use client";

import { useState } from 'react';
import { HealthRecord } from '@prisma/client';

const HealthRecordModal = ({ record, onClose }: { record: HealthRecord, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
      <h2 className="text-2xl font-bold mb-4">Health Record Details</h2>
      <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
      <p><strong>Weight:</strong> {record.weight} kg</p>
      <p><strong>Temperature:</strong> {record.temperature}°C</p>
      <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
      <p><strong>Treatment:</strong> {record.treatment}</p>
      <p><strong>Notes:</strong> {record.notes || 'N/A'}</p>
      <button
        onClick={onClose}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  </div>
);

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const HealthRecordsTable = ({ healthRecords }: { healthRecords: HealthRecord[] }) => {
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);

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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {healthRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.weight} kg</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.temperature}°C</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{truncateText(record.diagnosis, 20)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{truncateText(record.treatment, 20)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedRecord && (
        <HealthRecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </>
  );
};

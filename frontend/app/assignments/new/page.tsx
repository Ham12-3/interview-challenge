"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { assignmentApi, patientApi, medicationApi } from '../../../lib/api';
import type { CreateAssignmentDto, Patient, Medication } from '../../../types';
import { Button } from '../../../components/ui/button';

export default function CreateAssignment() {
  const router = useRouter();
  const [form, setForm] = useState<CreateAssignmentDto>({ patientId: 0, medicationId: 0, startDate: '', days: 0 });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pats, meds] = await Promise.all([patientApi.getAll(), medicationApi.getAll()]);
        setPatients(pats);
        setMedications(meds);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.patientId <= 0 || form.medicationId <= 0 || !form.startDate || form.days <= 0) {
      setError('All fields are required and must be valid');
      return;
    }
    try {
      await assignmentApi.create({ ...form, startDate: new Date(form.startDate).toISOString() });
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create assignment');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Assign Medication to Patient</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
            Patient
          </label>
          <select
            id="patientId"
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value={0}>Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="medicationId" className="block text-sm font-medium text-gray-700 mb-1">
            Medication
          </label>
          <select
            id="medicationId"
            value={form.medicationId}
            onChange={(e) => setForm({ ...form, medicationId: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value={0}>Select Medication</option>
            {medications.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (days)
          </label>
          <input
            id="days"
            type="number"
            min="1"
            value={form.days}
            onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {error && <p className="text-red-600 text-sm">{error}</p>}
        
        <Button type="submit" className="w-full">
          Create Assignment
        </Button>
      </form>
    </div>
  );
} 
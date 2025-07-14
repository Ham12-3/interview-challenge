"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { patientApi } from '../../../lib/api';
import type { CreatePatientDto } from '../../../types';
import { Button } from '../../../components/ui/button';

export default function CreatePatient() {
  const router = useRouter();
  const [form, setForm] = useState<CreatePatientDto>({ name: '', dateOfBirth: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await patientApi.create({ ...form, dateOfBirth: new Date(form.dateOfBirth).toISOString() });
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create patient');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Create New Patient</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {error && <p className="text-red-600 text-sm">{error}</p>}
        
        <Button type="submit" className="w-full">
          Create Patient
        </Button>
      </form>
    </div>
  );
} 
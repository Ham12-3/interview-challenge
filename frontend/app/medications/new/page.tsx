"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { medicationApi } from '../../../lib/api';
import type { CreateMedicationDto } from '../../../types';
import { Button } from '../../../components/ui/button';

export default function CreateMedication() {
  const router = useRouter();
  const [form, setForm] = useState<CreateMedicationDto>({ name: '', dosage: '', frequency: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await medicationApi.create(form);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create medication');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Create New Medication</h1>
      
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
          <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
            Dosage
          </label>
          <input
            id="dosage"
            type="text"
            value={form.dosage}
            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
            Frequency
          </label>
          <input
            id="frequency"
            type="text"
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {error && <p className="text-red-600 text-sm">{error}</p>}
        
        <Button type="submit" className="w-full">
          Create Medication
        </Button>
      </form>
    </div>
  );
} 
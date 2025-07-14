"use client"

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { medicationApi } from '../../../../lib/api';
import type { CreateMedicationDto } from '../../../../types';
import { Button } from '../../../../components/ui/button';

export default function EditMedication() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [form, setForm] = useState<Partial<CreateMedicationDto>>({ name: '', dosage: '', frequency: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedication = async () => {
      setLoading(true);
      try {
        const med = await medicationApi.getById(id);
        setForm({ name: med.name, dosage: med.dosage, frequency: med.frequency });
      } catch {
        setError('Failed to load medication');
      } finally {
        setLoading(false);
      }
    };
    fetchMedication();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await medicationApi.update(id, form);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update medication');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Medication</h1>
      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input id="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
          <input id="dosage" type="text" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
          <input id="frequency" type="text" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" className="w-full">Update Medication</Button>
      </form>
    </div>
  );
}
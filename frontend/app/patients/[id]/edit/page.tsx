"use client"

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { patientApi } from '../../../../lib/api';
import type { CreatePatientDto } from '../../../../types';
import { Button } from '../../../../components/ui/button';

export default function EditPatient() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [form, setForm] = useState<Partial<CreatePatientDto>>({ name: '', dateOfBirth: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      try {
        const patient = await patientApi.getById(id);
        setForm({ name: patient.name, dateOfBirth: new Date(patient.dateOfBirth).toISOString().split('T')[0] });
      } catch {
        setError('Failed to load patient');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await patientApi.update(id, { ...form, dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : undefined });
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update patient');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Patient</h1>
      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input id="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input id="dateOfBirth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" className="w-full">Update Patient</Button>
      </form>
    </div>
  );
} 
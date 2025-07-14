"use client"

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { assignmentApi, patientApi, medicationApi } from '../../../../lib/api';
import type { Patient, Medication, CreateAssignmentDto } from '../../../../types';
import { Button } from '../../../../components/ui/button';

export default function EditAssignment() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [form, setForm] = useState<Partial<CreateAssignmentDto>>({ patientId: 0, medicationId: 0, startDate: '', days: 0 });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ass, pats, meds] = await Promise.all([
          assignmentApi.getById(id),
          patientApi.getAll(),
          medicationApi.getAll()
        ]);
        setForm({
          patientId: ass.patientId,
          medicationId: ass.medicationId,
          startDate: new Date(ass.startDate).toISOString().split('T')[0],
          days: ass.days
        });
        setPatients(pats);
        setMedications(meds);
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((form.patientId ?? 0) <= 0 || (form.medicationId ?? 0) <= 0 || !form.startDate || (form.days ?? 0) <= 0) {
      setError('All fields are required and must be valid');
      return;
    }
    try {
      await assignmentApi.update(id, { ...form, startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined });
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update assignment');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Assignment</h1>
      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label htmlFor="patientId">Patient</label>
          <select id="patientId" value={form.patientId} onChange={(e) => setForm({ ...form, patientId: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md">
            <option value={0}>Select Patient</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="medicationId">Medication</label>
          <select id="medicationId" value={form.medicationId} onChange={(e) => setForm({ ...form, medicationId: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md">
            <option value={0}>Select Medication</option>
            {medications.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="startDate">Start Date</label>
          <input id="startDate" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="days">Duration (days)</label>
          <input id="days" type="number" min="1" value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md" />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <Button type="submit" className="w-full">Update Assignment</Button>
      </form>
    </div>
  );
} 
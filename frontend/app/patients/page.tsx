"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { patientApi } from '../../lib/api';
import type { Patient } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await patientApi.getAll();
        setPatients(data);
      } catch {
        setError('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
              <p className="text-lg text-gray-600 font-medium">Loading patients...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Patient Management
            </h1>
            <p className="text-gray-600 mt-2">Manage and track all patients in your system</p>
          </div>
          
          <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
            <Link href="/patients/new">
              <PlusIcon />
              <span className="ml-2">Add New Patient</span>
            </Link>
          </Button>
        </div>

        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <p className="text-red-700 font-medium">{error}</p>
            </CardContent>
          </Card>
        ) : patients.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserIcon />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No patients yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Get started by adding your first patient to the system.
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link href="/patients/new">
                  <PlusIcon />
                  <span className="ml-2">Add First Patient</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <Card key={patient.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900">{patient.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <CalendarIcon />
                        <span>Age {calculateAge(patient.dateOfBirth)}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                    <p><strong>Patient ID:</strong> #{patient.id}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
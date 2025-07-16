"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { medicationApi } from '../../lib/api';
import type { Medication } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const PillIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const DosageIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const FrequencyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const data = await medicationApi.getAll();
        setMedications(data);
      } catch {
        setError('Failed to load medications');
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600 mx-auto"></div>
              <p className="text-lg text-gray-600 font-medium">Loading medications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-green-800 bg-clip-text text-transparent">
              Medication Library
            </h1>
            <p className="text-gray-600 mt-2">Manage your drug database and medication catalog</p>
          </div>
          
          <Button asChild className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200">
            <Link href="/medications/new">
              <PlusIcon />
              <span className="ml-2">Add New Medication</span>
            </Link>
          </Button>
        </div>

        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <p className="text-red-700 font-medium">{error}</p>
            </CardContent>
          </Card>
        ) : medications.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <PillIcon />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No medications in library</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Build your medication database by adding drugs to your library.
              </p>
              <Button asChild className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                <Link href="/medications/new">
                  <PlusIcon />
                  <span className="ml-2">Add First Medication</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medications.map((medication) => (
              <Card key={medication.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl text-white">
                      <PillIcon />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900">{medication.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Medication ID: #{medication.id}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <DosageIcon />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Dosage</p>
                        <p className="text-sm text-blue-700 font-semibold">{medication.dosage}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <FrequencyIcon />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Frequency</p>
                        <p className="text-sm text-green-700 font-semibold">{medication.frequency}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
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
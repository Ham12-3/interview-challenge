"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { patientApi } from '../../../lib/api';
import type { CreatePatientDto } from '../../../types';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import Link from 'next/link';

// Premium Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CakeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 013 15.546V12a9 9 0 018.546-8.977A1.5 1.5 0 0113 4.5v3a3 3 0 01-3 3H7.5A1.5 1.5 0 016 12v3.546z" />
  </svg>
);

export default function CreatePatient() {
  const router = useRouter();
  const [form, setForm] = useState<CreatePatientDto>({ name: '', dateOfBirth: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.dateOfBirth) {
      setError('All fields are required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await patientApi.create({ ...form, dateOfBirth: new Date(form.dateOfBirth).toISOString() });
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  const age = calculateAge(form.dateOfBirth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Link href="/">
                  <ArrowLeftIcon />
                  <span className="ml-2">Back to Dashboard</span>
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
                <p className="text-sm text-gray-600 mt-1">Register a new patient in the medical management system</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <span className="text-sm text-gray-600">Patient Information</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UserIcon />
                  </div>
                  Patient Registration Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Patient Name */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label htmlFor="name" className="text-sm font-semibold text-gray-900">Full Name</label>
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <UserIcon />
                      </div>
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none"
                        placeholder="Enter patient's full name"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <InfoIcon />
                      Use the patient&apos;s legal name as it appears on official documents
                    </p>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-900">Date of Birth</label>
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <CalendarIcon />
                      </div>
                      <input
                        id="dateOfBirth"
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none"
                        required
                      />
                      {age !== null && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-gray-500 text-sm">
                          <CakeIcon />
                          <span>Age {age}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <InfoIcon />
                      This will be used to calculate age and verify patient identity
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-gray-100">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating Patient...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <CheckIcon />
                          Create Patient
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview/Info Column */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Patient Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.name || form.dateOfBirth ? (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <UserIcon />
                      <span className="font-medium text-gray-900">Patient Information</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {form.name || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Date of Birth:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {form.dateOfBirth ? new Date(form.dateOfBirth).toLocaleDateString() : 'Not specified'}
                        </span>
                      </div>
                      {age !== null && (
                        <div>
                          <span className="text-gray-600">Age:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {age} years old
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                    <UserIcon />
                    <div className="text-sm mt-2">Fill the form to see preview</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-semibold text-xs">1</span>
                  </div>
                  <div>Complete patient registration</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gray-400 font-semibold text-xs">2</span>
                  </div>
                  <div>Add medications to the system if needed</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gray-400 font-semibold text-xs">3</span>
                  </div>
                  <div>Assign medications to create treatment plan</div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <InfoIcon />
                  <div>All patient data is encrypted and secure</div>
                </div>
                <div className="flex items-start gap-2">
                  <InfoIcon />
                  <div>Information is only accessible to authorized medical staff</div>
                </div>
                <div className="flex items-start gap-2">
                  <InfoIcon />
                  <div>Patient records comply with medical privacy regulations</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
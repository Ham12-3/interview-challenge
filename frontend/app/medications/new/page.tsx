"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { medicationApi } from '../../../lib/api';
import type { CreateMedicationDto } from '../../../types';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import Link from 'next/link';

// Premium Icons
const PillIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const DosageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const FrequencyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
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

export default function CreateMedication() {
  const router = useRouter();
  const [form, setForm] = useState<CreateMedicationDto>({ name: '', dosage: '', frequency: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.dosage.trim() || !form.frequency.trim()) {
      setError('All fields are required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await medicationApi.create(form);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create medication');
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonDosages = ['250mg', '500mg', '750mg', '1g', '5mg', '10mg', '25mg', '50mg', '100mg'];
  const commonFrequencies = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'As needed'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Add New Medication</h1>
                <p className="text-sm text-gray-600 mt-1">Create a new medication with dosage and frequency information</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">1</span>
              </div>
              <span className="text-sm text-gray-600">Medication Details</span>
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
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <PillIcon />
                  </div>
                  Medication Information Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Medication Name */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label htmlFor="name" className="text-sm font-semibold text-gray-900">Medication Name</label>
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <PillIcon />
                      </div>
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white transition-all duration-200 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-50 focus:outline-none"
                        placeholder="Enter medication name (e.g., Amoxicillin)"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <InfoIcon />
                      Use the generic name when possible
                    </p>
                  </div>

                  {/* Dosage and Frequency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="dosage" className="text-sm font-semibold text-gray-900">Dosage</label>
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <DosageIcon />
                        </div>
                        <input
                          id="dosage"
                          type="text"
                          value={form.dosage}
                          onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white transition-all duration-200 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-50 focus:outline-none"
                          placeholder="e.g., 500mg"
                          required
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {commonDosages.map((dosage) => (
                          <button
                            key={dosage}
                            type="button"
                            onClick={() => setForm({ ...form, dosage })}
                            className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors duration-150"
                          >
                            {dosage}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="frequency" className="text-sm font-semibold text-gray-900">Frequency</label>
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <FrequencyIcon />
                        </div>
                        <input
                          id="frequency"
                          type="text"
                          value={form.frequency}
                          onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white transition-all duration-200 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-50 focus:outline-none"
                          placeholder="e.g., Twice daily"
                          required
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {commonFrequencies.map((frequency) => (
                          <button
                            key={frequency}
                            type="button"
                            onClick={() => setForm({ ...form, frequency })}
                            className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors duration-150"
                          >
                            {frequency}
                          </button>
                        ))}
                      </div>
                    </div>
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
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating Medication...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <CheckIcon />
                          Create Medication
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
                <CardTitle className="text-lg font-semibold text-gray-900">Medication Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.name || form.dosage || form.frequency ? (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <PillIcon />
                      <span className="font-medium text-gray-900">Medication Details</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {form.name || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Dosage:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {form.dosage || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Frequency:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {form.frequency || 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                    <PillIcon />
                    <div className="text-sm mt-2">Fill the form to see preview</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <InfoIcon />
                  <div>Use standard dosage units (mg, g, mL, etc.)</div>
                </div>
                <div className="flex items-start gap-2">
                  <InfoIcon />
                  <div>Be specific with frequency (e.g., &quot;Twice daily&quot; vs &quot;BID&quot;)</div>
                </div>
                <div className="flex items-start gap-2">
                  <InfoIcon />
                  <div>Use generic names when possible for consistency</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
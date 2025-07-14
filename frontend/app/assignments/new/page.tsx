"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { assignmentApi, patientApi, medicationApi } from '../../../lib/api';
import type { CreateAssignmentDto, Patient, Medication } from '../../../types';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import Link from 'next/link';

// Premium Icons
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PillIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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

interface CustomSelectProps {
  value: number;
  onChange: (value: number) => void;
  options: { id: number; name: string; subtitle?: string }[];
  placeholder: string;
  icon: React.ReactNode;
  renderOption?: (option: { id: number; name: string; subtitle?: string }) => React.ReactNode;
}

const CustomSelect = ({ value, onChange, options, placeholder, icon, renderOption }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOptions = options.filter(option => 
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const selectedOption = options.find(opt => opt.id === value);
  
  return (
    <div className="relative">
      <div 
        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white cursor-pointer transition-all duration-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-400">
            {icon}
          </div>
          <div className="flex-1">
            {selectedOption ? (
              <div>
                <div className="font-medium text-gray-900">{selectedOption.name}</div>
                {selectedOption.subtitle && (
                  <div className="text-sm text-gray-500">{selectedOption.subtitle}</div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">{placeholder}</div>
            )}
          </div>
          <ChevronDownIcon />
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className="p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {renderOption ? renderOption(option) : (
                    <div>
                      <div className="font-medium text-gray-900">{option.name}</div>
                      {option.subtitle && (
                        <div className="text-sm text-gray-500">{option.subtitle}</div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CreateAssignment() {
  const router = useRouter();
  const [form, setForm] = useState<CreateAssignmentDto>({ patientId: 0, medicationId: 0, startDate: '', days: 0 });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await assignmentApi.create({ ...form, startDate: new Date(form.startDate).toISOString() });
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const patientOptions = patients.map(p => ({
    id: p.id,
    name: p.name,
    subtitle: `Age ${calculateAge(p.dateOfBirth)} • ${p.assignments?.length || 0} treatments`
  }));

  const medicationOptions = medications.map(m => ({
    id: m.id,
    name: m.name,
    subtitle: `${m.dosage} • ${m.frequency}`
  }));

  const selectedPatient = patients.find(p => p.id === form.patientId);
  const selectedMedication = medications.find(m => m.id === form.medicationId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Create Treatment Assignment</h1>
                <p className="text-sm text-gray-600 mt-1">Assign medication to a patient with treatment schedule</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <span className="text-sm text-gray-600">Assignment Details</span>
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
                    <CalendarIcon />
                  </div>
                  Treatment Assignment Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Patient Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-gray-900">Select Patient</label>
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    </div>
                    <CustomSelect
                      value={form.patientId}
                      onChange={(value) => setForm({ ...form, patientId: value })}
                      options={patientOptions}
                      placeholder="Choose a patient from the list"
                      icon={<UserIcon />}
                    />
                  </div>

                  {/* Medication Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-gray-900">Select Medication</label>
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    </div>
                    <CustomSelect
                      value={form.medicationId}
                      onChange={(value) => setForm({ ...form, medicationId: value })}
                      options={medicationOptions}
                      placeholder="Choose a medication to assign"
                      icon={<PillIcon />}
                    />
                  </div>

                  {/* Treatment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="startDate" className="text-sm font-semibold text-gray-900">Start Date</label>
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <CalendarIcon />
                        </div>
                        <input
                          id="startDate"
                          type="date"
                          value={form.startDate}
                          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="days" className="text-sm font-semibold text-gray-900">Duration</label>
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <ClockIcon />
                        </div>
                        <input
                          id="days"
                          type="number"
                          min="1"
                          max="365"
                          value={form.days}
                          onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none"
                          placeholder="Enter number of days"
                          required
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          days
                        </div>
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
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating Assignment...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <CheckIcon />
                          Create Treatment Assignment
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview/Summary Column */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Assignment Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPatient ? (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <UserIcon />
                      <span className="font-medium text-gray-900">Patient</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="font-semibold">{selectedPatient.name}</div>
                      <div>Age {calculateAge(selectedPatient.dateOfBirth)}</div>
                      <div>{selectedPatient.assignments?.length || 0} existing treatments</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                    <UserIcon />
                    <div className="text-sm mt-2">No patient selected</div>
                  </div>
                )}

                {selectedMedication ? (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <PillIcon />
                      <span className="font-medium text-gray-900">Medication</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="font-semibold">{selectedMedication.name}</div>
                      <div>Dosage: {selectedMedication.dosage}</div>
                      <div>Frequency: {selectedMedication.frequency}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                    <PillIcon />
                    <div className="text-sm mt-2">No medication selected</div>
                  </div>
                )}

                {form.startDate && form.days > 0 && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <CalendarIcon />
                      <span className="font-medium text-gray-900">Treatment Schedule</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div>Start: {new Date(form.startDate).toLocaleDateString()}</div>
                      <div>Duration: {form.days} days</div>
                      <div>End: {new Date(new Date(form.startDate).getTime() + (form.days - 1) * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/patients/new">
                    <UserIcon />
                    <span className="ml-2">Add New Patient</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/medications/new">
                    <PillIcon />
                    <span className="ml-2">Add New Medication</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
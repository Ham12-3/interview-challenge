"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { assignmentApi, patientApi } from '../lib/api';
import type { AssignmentWithRemainingDays } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';

// Icons for better visual hierarchy
const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PillIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// Additional medication-specific icons
const DosageIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const FrequencyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
  </svg>
);

const DurationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.856-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
  </svg>
);

// Grouped type for display
interface GroupedAssignments {
  [patientId: number]: {
    patient: {
      id: number;
      name: string;
      dateOfBirth: string;
    };
    assignments: AssignmentWithRemainingDays[];
  };
}

export default function Home() {
  const [grouped, setGrouped] = useState<GroupedAssignments>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all patients and all assignments separately
      const [patients, assignments] = await Promise.all([
        patientApi.getAll(),
        assignmentApi.getAllWithRemainingDays()
      ]);

      // Create a grouped structure that includes all patients
      const groupedData: GroupedAssignments = {};
      
      // First, add all patients (even those without assignments)
      patients.forEach((patient) => {
        groupedData[patient.id] = {
          patient: {
            id: patient.id,
            name: patient.name,
            dateOfBirth: patient.dateOfBirth
          },
          assignments: []
        };
      });
      
      // Then, add assignments to the corresponding patients
      assignments.forEach((ass: AssignmentWithRemainingDays) => {
        if (ass.patient && groupedData[ass.patient.id]) {
          groupedData[ass.patient.id].assignments.push(ass);
        }
      });
      
      setGrouped(groupedData);
    } catch {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeletePatient = async (id: number) => {
    if (!confirm('Are you sure you want to delete this patient and all assignments?')) return;
    try {
      await patientApi.delete(id);
      fetchData();
    } catch {
      alert('Failed to delete patient');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await assignmentApi.delete(id);
      fetchData();
    } catch {
      alert('Failed to delete assignment');
    }
  };

  const toggleCardExpansion = (patientId: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(patientId)) {
      newExpanded.delete(patientId);
    } else {
      newExpanded.add(patientId);
    }
    setExpandedCards(newExpanded);
  };

  const getRemainingDaysBadge = (days: number) => {
    if (days > 7) return { variant: 'default' as const, className: 'bg-green-100 text-green-700 border-green-200' };
    if (days > 3) return { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    if (days > 0) return { variant: 'destructive' as const, className: 'bg-orange-100 text-orange-700 border-orange-200' };
    return { variant: 'destructive' as const, className: 'bg-red-100 text-red-700 border-red-200' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  const getCardAnimationClass = (patientId: number) => {
    const isExpanded = expandedCards.has(patientId);
    const isHovered = hoveredCard === patientId;
    
    let baseClass = "transition-all duration-300 ease-in-out transform min-h-fit";
    
    if (isHovered) {
      baseClass += " scale-[1.02] shadow-xl";
    } else {
      baseClass += " hover:shadow-lg";
    }
    
    if (isExpanded) {
      baseClass += " ring-2 ring-blue-200";
    }
    
    return baseClass;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Treatment Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage patient medications and track treatment progress
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/patients/new">
                  <UserIcon />
                  <span className="ml-2">Add Patient</span>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/medications/new">
                  <PillIcon />
                  <span className="ml-2">Add Medication</span>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/assignments/new">
                  <CalendarIcon />
                  <span className="ml-2">New Assignment</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading patient data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">{error}</p>
              <Button onClick={fetchData} className="mt-4" variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        ) : Object.values(grouped).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first patient and their medications.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/patients/new">
                <UserIcon />
                <span className="ml-2">Add First Patient</span>
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserIcon />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Patients</p>
                      <p className="text-2xl font-bold text-gray-900">{Object.values(grouped).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <PillIcon />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Treatments</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Object.values(grouped).reduce((total, group) => total + group.assignments.length, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <ClockIcon />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Ending Soon</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Object.values(grouped).reduce((total, group) => 
                          total + group.assignments.filter((a: AssignmentWithRemainingDays) => a.remainingDays <= 3).length, 0
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Patient Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
              {Object.values(grouped).map((group) => {
                const isExpanded = expandedCards.has(group.patient.id);
                                  const displayedAssignments = isExpanded ? group.assignments : group.assignments.slice(0, 1);
                const hasMoreAssignments = group.assignments.length > 1;
                
                return (
                  <Card 
                    key={group.patient.id} 
                    className={`${getCardAnimationClass(group.patient.id)} border-0 shadow-sm cursor-pointer flex flex-col group min-h-[400px]`}
                    onMouseEnter={() => setHoveredCard(group.patient.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {group.patient.name}
                          </CardTitle>
                          <div className="flex items-center mt-1 text-sm text-gray-600">
                            <CalendarIcon />
                            <span className="ml-1">
                              Age {calculateAge(group.patient.dateOfBirth)} • Born {formatDate(group.patient.dateOfBirth)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {group.assignments.length} treatment{group.assignments.length !== 1 ? 's' : ''}
                            </Badge>
                                                         {group.assignments.some((a: AssignmentWithRemainingDays) => a.remainingDays <= 3) && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertIcon />
                                <span className="ml-1">Urgent</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Link href={`/patients/${group.patient.id}/edit`}>
                              <EditIcon />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDeletePatient(group.patient.id)}
                          >
                            <DeleteIcon />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <div className="space-y-4 flex-1">
                        {group.assignments.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <PillIcon />
                            </div>
                            <p className="text-gray-500 text-sm mb-4">No treatments assigned</p>
                            <Button asChild variant="outline" size="sm">
                              <Link href="/assignments/new">
                                <CalendarIcon />
                                <span className="ml-2">Add Treatment</span>
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          displayedAssignments.map((assignment: AssignmentWithRemainingDays, index: number) => {
                            const badgeProps = getRemainingDaysBadge(assignment.remainingDays);
                            return (
                              <div key={assignment.id} className="treatment-card group/treatment">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                      <PillIcon />
                                      <h4 className="font-medium text-gray-900 truncate">
                                        {assignment.medication?.name ?? 'Unknown Medication'}
                                      </h4>
                                      {assignment.remainingDays <= 1 && (
                                        <AlertIcon />
                                      )}
                                    </div>
                                    <Badge variant={badgeProps.variant} className={badgeProps.className}>
                                      {assignment.remainingDays} days left
                                    </Badge>
                                  </div>
                                  
                                  <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                                        <DosageIcon />
                                        <span className="font-medium text-blue-700">{assignment.medication?.dosage ?? 'N/A'}</span>
                                      </div>
                                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                                        <FrequencyIcon />
                                        <span className="font-medium text-green-700">{assignment.medication?.frequency ?? 'N/A'}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon />
                                      <span>Started {formatDate(assignment.startDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <DurationIcon />
                                      <span>{assignment.days} days treatment duration</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-end gap-2 mt-3 opacity-0 group-hover/treatment:opacity-100 transition-opacity duration-200">
                                <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1">
                                  <Link href={`/assignments/${assignment.id}/edit`}>
                                    <EditIcon />
                                    <span>Edit</span>
                                  </Link>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                                  onClick={() => handleDelete(assignment.id)}
                                >
                                  <DeleteIcon />
                                  <span>Delete</span>
                                </Button>
                              </div>
                              
                              {index < displayedAssignments.length - 1 && (
                                <Separator className="mt-4" />
                              )}
                            </div>
                          );
                        })
                        )}
                        
                        {group.assignments.length > 0 && hasMoreAssignments && (
                          <div className="pt-4 mt-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCardExpansion(group.patient.id)}
                              className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-md"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUpIcon />
                                  <span>Show Less</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDownIcon />
                                  <span>Show {Math.max(1, group.assignments.length - displayedAssignments.length)} More</span>
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

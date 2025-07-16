"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { assignmentApi } from '../../lib/api';
import type { AssignmentWithRemainingDays } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PillIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.856-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentWithRemainingDays[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await assignmentApi.getAllWithRemainingDays();
        setAssignments(data);
      } catch {
        setError('Failed to load treatment assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const getStatusColor = (remainingDays: number) => {
    if (remainingDays <= 1) return 'bg-red-100 text-red-700 border-red-200';
    if (remainingDays <= 3) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (remainingDays <= 7) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const getProgressPercentage = (startDate: string, totalDays: number, remainingDays: number) => {
    const elapsedDays = totalDays - remainingDays;
    return Math.max(5, Math.min(95, (elapsedDays / totalDays) * 100));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 mx-auto"></div>
              <p className="text-lg text-gray-600 font-medium">Loading assignments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
              Treatment Assignments
            </h1>
            <p className="text-gray-600 mt-2">Monitor and manage all active treatment plans</p>
          </div>
          
          <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
            <Link href="/assignments/new">
              <PlusIcon />
              <span className="ml-2">New Assignment</span>
            </Link>
          </Button>
        </div>

        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <p className="text-red-700 font-medium">{error}</p>
            </CardContent>
          </Card>
        ) : assignments.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No treatment assignments</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start managing patient care by creating treatment assignments.
              </p>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Link href="/assignments/new">
                  <PlusIcon />
                  <span className="ml-2">Create First Assignment</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white">
                        <CalendarIcon />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-900 mb-2">
                          Treatment Assignment #{assignment.id}
                        </CardTitle>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <UserIcon />
                            <span className="font-medium">{assignment.patient?.name || 'Unknown Patient'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PillIcon />
                            <span className="font-medium">{assignment.medication?.name || 'Unknown Medication'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {assignment.remainingDays <= 3 && (
                        <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
                          <AlertTriangleIcon />
                          Urgent
                        </Badge>
                      )}
                      <Badge className={`font-semibold ${getStatusColor(assignment.remainingDays)}`}>
                        {assignment.remainingDays} days left
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Treatment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Medication Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Dosage:</span> <span className="font-medium text-blue-700">{assignment.medication?.dosage || 'N/A'}</span></p>
                        <p><span className="text-gray-600">Frequency:</span> <span className="font-medium text-blue-700">{assignment.medication?.frequency || 'N/A'}</span></p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Treatment Timeline</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Started:</span> <span className="font-medium text-green-700">{new Date(assignment.startDate).toLocaleDateString()}</span></p>
                        <p><span className="text-gray-600">Duration:</span> <span className="font-medium text-green-700">{assignment.days} days</span></p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Progress Status</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Remaining:</span> <span className="font-medium text-purple-700">{assignment.remainingDays} days</span></p>
                        <p><span className="text-gray-600">Progress:</span> <span className="font-medium text-purple-700">{Math.round(getProgressPercentage(assignment.startDate, assignment.days, assignment.remainingDays))}%</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Treatment Progress</span>
                      <span className="text-gray-900 font-medium">{Math.round(getProgressPercentage(assignment.startDate, assignment.days, assignment.remainingDays))}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          assignment.remainingDays <= 1 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                          assignment.remainingDays <= 3 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                          'bg-gradient-to-r from-green-400 to-green-600'
                        }`}
                        style={{ 
                          width: `${getProgressPercentage(assignment.startDate, assignment.days, assignment.remainingDays)}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <ClockIcon />
                      View Timeline
                    </Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Edit Assignment
                    </Button>
                    <Button variant="outline" size="sm" className="ml-auto">
                      More Actions
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
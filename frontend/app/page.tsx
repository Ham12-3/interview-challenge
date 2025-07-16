"use client"

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { assignmentApi, patientApi } from '../lib/api';
import type { AssignmentWithRemainingDays } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';

// Enhanced Premium Icons
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

const TrendingUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.856-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
  </svg>
);

const MoreVerticalIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);



// Dropdown Menu Component
const PatientDropdownMenu = ({ 
  patientId, 
  patientName, 
  isOpen, 
  onToggle, 
  onClose, 
  onDelete 
}: {
  patientId: number;
  patientName: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onDelete: (id: number, name: string) => void;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleExportData = () => {
    // Create CSV data for patient
    const csvContent = `Patient Name,${patientName}\nPatient ID,${patientId}\nExport Date,${new Date().toLocaleDateString()}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${patientName.replace(/\s+/g, '_')}_data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 hover:bg-gray-100"
        onClick={onToggle}
      >
        <MoreVerticalIcon />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
          <Link href={`/patients/${patientId}/edit`}>
            <button 
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"
              onClick={onClose}
            >
              <EditIcon />
              Edit Patient
            </button>
          </Link>
          
          <Link href={`/patients/${patientId}`}>
            <button 
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"
              onClick={onClose}
            >
              <EyeIcon />
              View Details
            </button>
          </Link>
          
          <Link href={`/assignments/new?patientId=${patientId}`}>
            <button 
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"
              onClick={onClose}
            >
              <PillIcon />
              Manage Treatments
            </button>
          </Link>
          
          <button 
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"
            onClick={handleExportData}
          >
            <DownloadIcon />
            Export Data
          </button>
          
          <div className="border-t border-gray-100 my-1"></div>
          
          <button 
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            onClick={() => onDelete(patientId, patientName)}
          >
            <TrashIcon />
            Delete Patient
          </button>
        </div>
      )}
    </div>
  );
};

// Progress Ring Component
const ProgressRing = ({ progress, size = 48, strokeWidth = 4, color = "#3B82F6" }: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-gray-700">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

// Health Score Indicator
const HealthScore = ({ score, trend }: { score: number; trend: 'up' | 'down' | 'stable' }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    if (score >= 60) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  };

  const colors = getScoreColor(score);
  
  return (
    <div className={`px-3 py-1.5 rounded-lg border ${colors.bg} ${colors.border} flex items-center gap-2`}>
      <span className={`text-sm font-semibold ${colors.text}`}>{score}</span>
      {trend === 'up' && <TrendingUpIcon />}
      {trend === 'down' && <TrendingDownIcon />}
      {trend === 'stable' && <div className="w-4 h-1 bg-gray-400 rounded"></div>}
    </div>
  );
};

// Patient Avatar Component
const PatientAvatar = ({ name, size = 40 }: { name: string; size?: number }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'bg-gradient-to-br from-red-400 to-red-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div
      className={`${getAvatarColor(name)} rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials(name)}
    </div>
  );
};

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'urgent' | 'stable'>('all');
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [patients, assignments] = await Promise.all([
        patientApi.getAll(),
        assignmentApi.getAllWithRemainingDays()
      ]);

      const groupedData: GroupedAssignments = {};
      
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

  const getHealthScore = (assignments: AssignmentWithRemainingDays[]): { score: number; trend: 'up' | 'down' | 'stable' } => {
    if (assignments.length === 0) return { score: 85, trend: 'stable' as const };
    const urgentCount = assignments.filter(a => a.remainingDays <= 3).length;
    const totalCount = assignments.length;
    const urgentRatio = urgentCount / totalCount;
    
    let score = 90 - (urgentRatio * 40);
    score = Math.max(20, Math.min(95, score));
    
    const trend: 'up' | 'down' | 'stable' = urgentRatio > 0.5 ? 'down' : urgentRatio > 0.2 ? 'stable' : 'up';
    return { score: Math.round(score), trend };
  };

  const getComplianceRate = (assignments: AssignmentWithRemainingDays[]) => {
    if (assignments.length === 0) return 0;
    const activeAssignments = assignments.filter(a => a.remainingDays > 0).length;
    return (activeAssignments / assignments.length) * 100;
  };

  const getPatientStatus = (assignments: AssignmentWithRemainingDays[]) => {
    if (assignments.length === 0) return 'stable';
    const urgentCount = assignments.filter(a => a.remainingDays <= 3).length;
    if (urgentCount > 0) return 'urgent';
    const activeCount = assignments.filter(a => a.remainingDays > 3).length;
    return activeCount > 0 ? 'active' : 'stable';
  };

  const filteredPatients = Object.values(grouped).filter(group => {
    const matchesSearch = group.patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getPatientStatus(group.assignments);
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleCardExpansion = (patientId: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(patientId)) {
      newExpanded.delete(patientId);
    } else {
      newExpanded.add(patientId);
    }
    setExpandedCards(newExpanded);
  };

  const toggleDropdown = (patientId: number) => {
    setOpenDropdown(openDropdown === patientId ? null : patientId);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const handleDeletePatient = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete patient "${name}"? This will also delete all associated treatments. This action cannot be undone.`)) {
      try {
        await patientApi.delete(id);
        fetchData(); // Refresh data
        closeDropdown();
      } catch (error) {
        console.error('Delete error:', error);
        if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
          alert('Cannot delete patient because they have active treatments. Please remove all treatments first.');
        } else {
          alert('Failed to delete patient. Please try again.');
        }
      }
    }
  };

  const totalPatients = Object.values(grouped).length;
  const activePatients = Object.values(grouped).filter(g => g.assignments.length > 0).length;
  const urgentCases = Object.values(grouped).filter(g => 
    g.assignments.some((a: AssignmentWithRemainingDays) => a.remainingDays <= 3)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Patient Care Command Center
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Intelligent healthcare management with real-time insights
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
                <Link href="/patients/new">
                  <UserIcon />
                  <span className="ml-2">Add Patient</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-blue-200 hover:bg-blue-50 shadow-md">
                <Link href="/medications/new">
                  <PillIcon />
                  <span className="ml-2">Add Medication</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-indigo-200 hover:bg-indigo-50 shadow-md">
                <Link href="/assignments/new">
                  <CalendarIcon />
                  <span className="ml-2">New Assignment</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
                <HeartIcon />
              </div>
              <p className="text-lg text-gray-600 font-medium">Loading patient data...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <AlertTriangleIcon />
              <p className="text-red-700 font-medium mb-4">{error}</p>
              <Button onClick={fetchData} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Enhanced Statistics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Patients</p>
                      <p className="text-3xl font-bold">{totalPatients}</p>
                      <p className="text-blue-100 text-xs mt-1">+12% from last month</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <UserIcon />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/10 rounded-full"></div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Active Treatments</p>
                      <p className="text-3xl font-bold">{activePatients}</p>
                      <p className="text-emerald-100 text-xs mt-1">+8% treatment rate</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <ActivityIcon />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/10 rounded-full"></div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500 border-0 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm font-medium">Urgent Cases</p>
                      <p className="text-3xl font-bold">{urgentCases}</p>
                      <p className="text-amber-100 text-xs mt-1">Needs attention</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <AlertTriangleIcon />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/10 rounded-full"></div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Avg Compliance</p>
                      <p className="text-3xl font-bold">87%</p>
                      <p className="text-purple-100 text-xs mt-1">+3% this week</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <TrendingUpIcon />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/10 rounded-full"></div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Search and Filter Bar */}
            <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Search patients by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="flex gap-2">
                    {(['all', 'active', 'urgent', 'stable'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={filterStatus === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus(status)}
                        className={`capitalize ${
                          filterStatus === status 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <FilterIcon />
                        <span className="ml-1">{status}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Patient Cards Grid */}
            {filteredPatients.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserIcon />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No patients found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'Get started by adding your first patient and their medications.'
                    }
                  </p>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Link href="/patients/new">
                      <UserIcon />
                      <span className="ml-2">Add First Patient</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPatients.map((group) => {
                  const isExpanded = expandedCards.has(group.patient.id);
                  const displayedAssignments = isExpanded ? group.assignments : group.assignments.slice(0, 1);
                  const hasMoreAssignments = group.assignments.length > 1;
                  const healthScore = getHealthScore(group.assignments);
                  const complianceRate = getComplianceRate(group.assignments);
                  const patientStatus = getPatientStatus(group.assignments);

                  return (
                    <Card 
                      key={group.patient.id} 
                      className={`relative overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group ${
                        patientStatus === 'urgent' ? 'ring-2 ring-red-200' : ''
                      }`}
                    >
                      {/* Status Indicator Strip */}
                      <div className={`absolute top-0 left-0 right-0 h-1 ${
                        patientStatus === 'urgent' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                        patientStatus === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        'bg-gradient-to-r from-blue-500 to-indigo-500'
                      }`}></div>

                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <PatientAvatar name={group.patient.name} size={48} />
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-xl font-bold text-gray-900 mb-1 truncate">
                                {group.patient.name}
                              </CardTitle>
                              <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon />
                                  Age {calculateAge(group.patient.dateOfBirth)}
                                </span>
                                <span>•</span>
                                <span>{group.assignments.length} treatments</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <HealthScore score={healthScore.score} trend={healthScore.trend} />
                                {patientStatus === 'urgent' && (
                                  <Badge className="bg-red-100 text-red-700 border-red-200">
                                    <AlertTriangleIcon />
                                    <span className="ml-1">Urgent</span>
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                                                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <PatientDropdownMenu 
                                patientId={group.patient.id} 
                                patientName={group.patient.name} 
                                isOpen={openDropdown === group.patient.id}
                                onToggle={() => toggleDropdown(group.patient.id)}
                                onClose={closeDropdown}
                                onDelete={handleDeletePatient}
                              />
                            </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* Treatment Progress Overview */}
                        {group.assignments.length > 0 && (
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-4">
                              <ProgressRing 
                                progress={complianceRate} 
                                size={40} 
                                color={complianceRate > 80 ? "#10B981" : complianceRate > 60 ? "#F59E0B" : "#EF4444"}
                              />
                              <div>
                                <p className="text-sm font-semibold text-gray-900">Treatment Progress</p>
                                <p className="text-xs text-gray-600">Compliance Rate</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">{Math.round(complianceRate)}%</p>
                              <p className="text-xs text-gray-600">Overall</p>
                            </div>
                          </div>
                        )}

                        {/* Treatments List */}
                        {group.assignments.length === 0 ? (
                          <div className="text-center py-8 space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto">
                              <PillIcon />
                            </div>
                            <div>
                              <p className="text-gray-700 font-medium mb-2">No treatments assigned</p>
                              <p className="text-gray-500 text-sm mb-4">Start managing this patient&apos;s medication schedule</p>
                            </div>
                            <Button asChild variant="outline" size="sm" className="border-2 border-blue-200 hover:bg-blue-50">
                              <Link href="/assignments/new">
                                <CalendarIcon />
                                <span className="ml-2">Add Treatment</span>
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {displayedAssignments.map((assignment: AssignmentWithRemainingDays, index: number) => (
                              <div key={assignment.id} className="group/treatment p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className={`p-2 rounded-lg ${
                                      assignment.remainingDays <= 1 ? 'bg-red-100' :
                                      assignment.remainingDays <= 3 ? 'bg-orange-100' :
                                      'bg-green-100'
                                    }`}>
                                      <PillIcon />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-900 truncate mb-1">
                                        {assignment.medication?.name ?? 'Unknown Medication'}
                                      </h4>
                                      <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
                                          {assignment.medication?.dosage ?? 'N/A'}
                                        </span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md font-medium">
                                          {assignment.medication?.frequency ?? 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <Badge className={`${
                                    assignment.remainingDays <= 1 ? 'bg-red-100 text-red-700 border-red-200' :
                                    assignment.remainingDays <= 3 ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                    assignment.remainingDays <= 7 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                    'bg-green-100 text-green-700 border-green-200'
                                  } font-semibold`}>
                                    {assignment.remainingDays} days left
                                  </Badge>
                                </div>

                                {/* Treatment Timeline */}
                                <div className="space-y-2 text-sm text-gray-600">
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                      <CalendarIcon />
                                      Started {new Date(assignment.startDate).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <ClockIcon />
                                      {assignment.days} days total
                                    </span>
                                  </div>
                                  
                                  {/* Progress Bar */}
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full transition-all duration-300 ${
                                        assignment.remainingDays <= 1 ? 'bg-red-500' :
                                        assignment.remainingDays <= 3 ? 'bg-orange-500' :
                                        'bg-green-500'
                                      }`}
                                      style={{ 
                                        width: `${Math.max(5, Math.min(95, ((assignment.days - assignment.remainingDays) / assignment.days) * 100))}%` 
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {index < displayedAssignments.length - 1 && (
                                  <Separator className="mt-4" />
                                )}
                              </div>
                            ))}
                            
                            {hasMoreAssignments && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleCardExpansion(group.patient.id)}
                                className="w-full mt-4 border border-blue-200 hover:bg-blue-50 text-blue-600 font-medium"
                              >
                                {isExpanded ? (
                                  <span>Show Less</span>
                                ) : (
                                  <span>Show {group.assignments.length - displayedAssignments.length} More Treatments</span>
                                )}
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

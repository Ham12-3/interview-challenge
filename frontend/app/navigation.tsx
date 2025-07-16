"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { patientApi, assignmentApi } from "../lib/api";
import type { AssignmentWithRemainingDays } from "../types";

// Premium Navigation Icons
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const PillIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.856-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

// Navigation Component
export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    urgentCases: 0,
    activeAssignments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patients, assignments] = await Promise.all([
          patientApi.getAll(),
          assignmentApi.getAllWithRemainingDays()
        ]);
        
        const urgentCount = assignments.filter((a: AssignmentWithRemainingDays) => a.remainingDays <= 3).length;
        
        setStats({
          totalPatients: patients.length,
          urgentCases: urgentCount,
          activeAssignments: assignments.length
        });
      } catch (error) {
        console.error('Failed to fetch navigation stats:', error);
      }
    };

    fetchStats();
  }, []);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: DashboardIcon,
      description: 'Overview & insights'
    },
    {
      name: 'Patients',
      href: '/patients',
      icon: UsersIcon,
      description: 'Patient management',
      count: stats.totalPatients,
      createHref: '/patients/new'
    },
    {
      name: 'Medications',
      href: '/medications',
      icon: PillIcon,
      description: 'Drug library',
      createHref: '/medications/new'
    },
    {
      name: 'Assignments',
      href: '/assignments',
      icon: CalendarIcon,
      description: 'Treatment plans',
      count: stats.activeAssignments,
      urgent: stats.urgentCases,
      createHref: '/assignments/new'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ActivityIcon,
      description: 'Performance insights',
      badge: 'Pro'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-indigo-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Premium Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <ActivityIcon />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Patient Care Command Center
                </h1>
                <p className="text-xs text-gray-600 font-medium">Intelligent Healthcare Management</p>
              </div>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative overflow-hidden ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon />
                    <span className="text-sm">{item.name}</span>
                    
                    {/* Count Badge */}
                    {item.count !== undefined && item.count > 0 && (
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        isActive(item.href)
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.count}
                      </span>
                    )}

                    {/* Urgent Badge */}
                    {item.urgent !== undefined && item.urgent > 0 && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                        <AlertTriangleIcon />
                        {item.urgent}
                      </span>
                    )}

                    {/* Pro Badge */}
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>

                  {/* Dropdown Tooltip */}
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl px-3 py-2 text-center min-w-max">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.description}</p>
                      {item.createHref && (
                        <Link
                          href={item.createHref}
                          className="inline-flex items-center gap-1 mt-2 px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors pointer-events-auto"
                        >
                          <PlusIcon />
                          Create New
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/assignments/new"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <PlusIcon />
                <span className="text-sm">New Assignment</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-indigo-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Brand */}
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <ActivityIcon />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Patient Care
                </h1>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-xl z-50">
              <div className="px-4 py-6 space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className={`text-xs ${isActive(item.href) ? 'text-white/70' : 'text-gray-500'}`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {item.count !== undefined && item.count > 0 && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          isActive(item.href)
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.count}
                        </span>
                      )}
                      {item.urgent !== undefined && item.urgent > 0 && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                          <AlertTriangleIcon />
                          {item.urgent}
                        </span>
                      )}
                      {item.badge && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
                
                {/* Mobile Quick Actions */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/patients/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg font-medium shadow-lg"
                    >
                      <PlusIcon />
                      <span className="text-sm">Patient</span>
                    </Link>
                    <Link
                      href="/assignments/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-lg font-medium shadow-lg"
                    >
                      <PlusIcon />
                      <span className="text-sm">Assignment</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
} 
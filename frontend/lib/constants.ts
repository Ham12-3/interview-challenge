// Backend API Configuration
export const API_BASE_URL = "http://localhost:8080";

// API Endpoints
export const API_ENDPOINTS = {
  PATIENTS: `${API_BASE_URL}/patients`,
  MEDICATIONS: `${API_BASE_URL}/medications`,
  ASSIGNMENTS: `${API_BASE_URL}/assignments`,
  ASSIGNMENTS_WITH_REMAINING_DAYS: `${API_BASE_URL}/assignments/remaining-days`,
} as const;

// Date format for forms
export const DATE_FORMAT = "YYYY-MM-DD";

// Status colors for remaining days
export const STATUS_COLORS = {
  HIGH: "text-green-600 bg-green-50",    // > 3 days
  MEDIUM: "text-yellow-600 bg-yellow-50", // 1-3 days
  LOW: "text-red-600 bg-red-50",          // 0 days (urgent)
} as const; 
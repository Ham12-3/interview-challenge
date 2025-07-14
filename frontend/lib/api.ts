import { API_ENDPOINTS } from './constants';
import type { 
  Patient, 
  Medication, 
  Assignment, 
  CreatePatientDto, 
  CreateMedicationDto, 
  CreateAssignmentDto,
  AssignmentWithRemainingDays 
} from '../types';

// Generic API error handling
class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(`API Error: ${response.statusText}`, response.status);
  }
  return response.json();
}

// Patient API functions
export const patientApi = {
  async getAll(): Promise<Patient[]> {
    const response = await fetch(API_ENDPOINTS.PATIENTS);
    return handleResponse<Patient[]>(response);
  },

  async getById(id: number): Promise<Patient> {
    const response = await fetch(`${API_ENDPOINTS.PATIENTS}/${id}`);
    return handleResponse<Patient>(response);
  },

  async create(patient: CreatePatientDto): Promise<Patient> {
    const response = await fetch(API_ENDPOINTS.PATIENTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    return handleResponse<Patient>(response);
  },

  async update(id: number, patient: Partial<CreatePatientDto>): Promise<Patient> {
    const response = await fetch(`${API_ENDPOINTS.PATIENTS}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    return handleResponse<Patient>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_ENDPOINTS.PATIENTS}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new ApiError(`Failed to delete patient: ${response.statusText}`, response.status);
    }
  },
};

// Medication API functions
export const medicationApi = {
  async getAll(): Promise<Medication[]> {
    const response = await fetch(API_ENDPOINTS.MEDICATIONS);
    return handleResponse<Medication[]>(response);
  },

  async getById(id: number): Promise<Medication> {
    const response = await fetch(`${API_ENDPOINTS.MEDICATIONS}/${id}`);
    return handleResponse<Medication>(response);
  },

  async create(medication: CreateMedicationDto): Promise<Medication> {
    const response = await fetch(API_ENDPOINTS.MEDICATIONS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medication),
    });
    return handleResponse<Medication>(response);
  },

  async update(id: number, medication: Partial<CreateMedicationDto>): Promise<Medication> {
    const response = await fetch(`${API_ENDPOINTS.MEDICATIONS}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medication),
    });
    return handleResponse<Medication>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_ENDPOINTS.MEDICATIONS}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new ApiError(`Failed to delete medication: ${response.statusText}`, response.status);
    }
  },
};

// Assignment API functions
export const assignmentApi = {
  async getAll(): Promise<Assignment[]> {
    const response = await fetch(API_ENDPOINTS.ASSIGNMENTS);
    return handleResponse<Assignment[]>(response);
  },

  async getAllWithRemainingDays(): Promise<AssignmentWithRemainingDays[]> {
    const response = await fetch(API_ENDPOINTS.ASSIGNMENTS_WITH_REMAINING_DAYS);
    return handleResponse<AssignmentWithRemainingDays[]>(response);
  },

  async getById(id: number): Promise<Assignment> {
    const response = await fetch(`${API_ENDPOINTS.ASSIGNMENTS}/${id}`);
    return handleResponse<Assignment>(response);
  },

  async getByIdWithRemainingDays(id: number): Promise<AssignmentWithRemainingDays> {
    const response = await fetch(`${API_ENDPOINTS.ASSIGNMENTS}/${id}/remaining-days`);
    return handleResponse<AssignmentWithRemainingDays>(response);
  },

  async create(assignment: CreateAssignmentDto): Promise<Assignment> {
    const response = await fetch(API_ENDPOINTS.ASSIGNMENTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignment),
    });
    return handleResponse<Assignment>(response);
  },

  async update(id: number, assignment: Partial<CreateAssignmentDto>): Promise<Assignment> {
    const response = await fetch(`${API_ENDPOINTS.ASSIGNMENTS}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignment),
    });
    return handleResponse<Assignment>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_ENDPOINTS.ASSIGNMENTS}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new ApiError(`Failed to delete assignment: ${response.statusText}`, response.status);
    }
  },
}; 
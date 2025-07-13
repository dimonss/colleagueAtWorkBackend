export interface Colleague {
  id: number;
  name: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  photo_filename?: string;
  photo_url?: string;
  hire_date?: string;
  salary?: number;
  notes?: string;
  is_at_work: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  created_at: string;
}

export interface CreateColleagueRequest {
  name: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  hire_date?: string;
  salary?: number;
  notes?: string;
}

export interface UpdateColleagueRequest extends Partial<CreateColleagueRequest> {}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface DatabaseError {
  message: string;
  code?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
} 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  division: string;
  site: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  status: string;
  created_at: string;
}

export interface AttendanceWithEmployee extends Attendance {
  employees: Employee;
}

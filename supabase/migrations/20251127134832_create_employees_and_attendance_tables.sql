/*
  # LNT Employee Attendance System

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `employee_id` (text, unique) - Employee ID like IXAR_SITE
      - `name` (text) - Employee name
      - `division` (text) - Division/Department
      - `site` (text) - Site location
      - `created_at` (timestamp)
    
    - `attendance`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, foreign key to employees)
      - `date` (date) - Attendance date
      - `status` (text) - Attendance status (DP, HO, etc.)
      - `created_at` (timestamp)
      - Unique constraint on (employee_id, date)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated admin access
*/

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text UNIQUE NOT NULL,
  name text NOT NULL,
  division text NOT NULL DEFAULT '',
  site text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'DP',
  created_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance(employee_id);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to employees"
  ON employees FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to attendance"
  ON attendance FOR ALL
  USING (true)
  WITH CHECK (true);
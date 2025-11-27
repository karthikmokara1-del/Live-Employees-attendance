import { useState, useEffect } from 'react';
import { supabase, Employee } from '../lib/supabase';
import { UserCheck } from 'lucide-react';

export default function AddAttendance() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('DP');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadEmployees();

    const subscription = supabase
      .channel('employees_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, () => {
        loadEmployees();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadEmployees = async () => {
    const { data } = await supabase
      .from('employees')
      .select('*')
      .order('name');
    if (data) setEmployees(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('attendance')
      .upsert({
        employee_id: selectedEmployee,
        date,
        status
      }, {
        onConflict: 'employee_id,date'
      });

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Attendance marked successfully!');
      setSelectedEmployee('');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        <UserCheck className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Add Attendance</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.employee_id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="DP">DP (Day Present)</option>
            <option value="HO">HO (Holiday)</option>
            <option value="AB">AB (Absent)</option>
            <option value="LV">LV (Leave)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Mark Attendance'}
        </button>

        {message && (
          <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

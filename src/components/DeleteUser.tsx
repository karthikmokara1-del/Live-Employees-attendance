import { useState, useEffect } from 'react';
import { supabase, Employee } from '../lib/supabase';
import { UserMinus } from 'lucide-react';

export default function DeleteUser() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const { data } = await supabase
      .from('employees')
      .select('*')
      .order('name');
    if (data) setEmployees(data);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirm('Are you sure you want to delete this employee? All attendance records will also be deleted.')) {
      return;
    }

    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', selectedEmployee);

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Employee deleted successfully!');
      setSelectedEmployee('');
      loadEmployees();
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        <UserMinus className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-semibold">Delete User</h2>
      </div>

      <form onSubmit={handleDelete} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Employee to Delete</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.employee_id}) - {emp.division}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedEmployee}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading ? 'Deleting...' : 'Delete Employee'}
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

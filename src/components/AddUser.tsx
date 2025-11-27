import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus } from 'lucide-react';

export default function AddUser() {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [division, setDivision] = useState('');
  const [site, setSite] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('employees')
      .insert({
        name,
        employee_id: employeeId,
        division,
        site
      });

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Employee added successfully!');
      setName('');
      setEmployeeId('');
      setDivision('');
      setSite('');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold">Add New User</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Employee Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Employee ID</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., IXAR_SITE"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Division</label>
          <input
            type="text"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., PLANT"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Site</label>
          <input
            type="text"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., IOCL PARADIP"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Employee'}
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

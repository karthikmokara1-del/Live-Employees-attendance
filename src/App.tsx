import AddAttendance from './components/AddAttendance';
import AddUser from './components/AddUser';
import DeleteUser from './components/DeleteUser';
import ExportExcel from './components/ExportExcel';
import { Building2 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <Building2 className="w-10 h-10 text-slate-700" />
            <div>
              <h1 className="text-3xl font-bold text-slate-800">LNT Employee Attendance</h1>
              <p className="text-slate-600">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AddAttendance />
          <AddUser />
          <DeleteUser />
          <ExportExcel />
        </div>
      </div>
    </div>
  );
}

export default App;

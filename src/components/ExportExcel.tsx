import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExportExcel() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const exportToExcel = async () => {
    if (!startDate || !endDate) {
      setMessage('Please select both start and end dates');
      return;
    }
    setLoading(true);
    setMessage('');

    const { data: employees } = await supabase
      .from('employees')
      .select('*')
      .order('name');

    const { data: attendance } = await supabase
      .from('attendance')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');

    if (!employees || !attendance) {
      setMessage('Error loading data');
      setLoading(false);
      return;
    }

    const dates = Array.from(
      new Set(attendance.map(a => a.date))
    ).sort();

    const attendanceMap = new Map<string, Map<string, string>>();
    attendance.forEach(a => {
      if (!attendanceMap.has(a.employee_id)) {
        attendanceMap.set(a.employee_id, new Map());
      }
      attendanceMap.get(a.employee_id)!.set(a.date, a.status);
    });

    const headerRow = [ 'EMPLOYEE ID','EMPLOYEE NAME', 'DIVISION', 'SITE'];
    dates.forEach(date => {
      const d = new Date(date + 'T00:00:00');
      const formatted = `'${d.getDate()}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
      headerRow.push(formatted);
    });

    const dataRows: (string | number)[][] = [];
    employees.forEach(emp => {
      const row: (string | number)[] = [ emp.employee_id,emp.name, emp.division, emp.site];
      const empAttendance = attendanceMap.get(emp.id);
      dates.forEach(date => {
        const status = empAttendance?.get(date) || '';
        row.push(status);
      });
      dataRows.push(row);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);

   headerRow.forEach((_, idx) => {
  const cell = XLSX.utils.encode_col(idx) + '1';
  if (!ws[cell]) ws[cell] = {};
  ws[cell].s = {
    fill: { fgColor: { rgb: "FFFF00" } },
    font: { bold: true },
    alignment: { horizontal: "center", vertical: "center" }
  };
});


    const colWidths = [20, 15, 15, 20];
    dates.forEach(() => colWidths.push(12));
    ws['!cols'] = colWidths.map(w => ({ wch: w }));

    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `LNT_Attendance_${startDate}_to_${endDate}.xlsx`);

    setMessage('Excel file downloaded successfully!');
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        <FileDown className="w-6 h-6 text-orange-600" />
        <h2 className="text-xl font-semibold">Export Attendance Sheet</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          onClick={exportToExcel}
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Download Excel Sheet'}
        </button>

        {message && (
          <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

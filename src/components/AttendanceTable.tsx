import React, { useState } from 'react';
import { Search, Download, CheckCircle2, XCircle, ArrowUpDown, Filter } from 'lucide-react';
import { Student } from '../types';

interface AttendanceTableProps {
  students: Student[];
  onToggleStatus: (studentId: string) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  students,
  onToggleStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Present' | 'Absent'>('All');

  // Filter students based on search query and status filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rfidUid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ? true : student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Export table data to CSV format
  const handleExportCSV = () => {
    const headers = ['Student ID', 'Roll Number', 'Student Name', 'Department', 'RFID UID', 'Date', 'Time', 'Attendance Status'];
    const rows = students.map((s) => [
      s.id,
      s.rollNumber,
      `"${s.name}"`,
      `"${s.department}"`,
      `"${s.rfidUid}"`,
      s.date,
      s.time,
      s.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RFID_Attendance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const presentCount = students.filter((s) => s.status === 'Present').length;
  const absentCount = students.filter((s) => s.status === 'Absent').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            Class Attendance Register
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time attendance logs synchronized with ESP32 node
          </p>
        </div>

        {/* Search, Filter Tabs & Export button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name or UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80 text-xs">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                statusFilter === 'All'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setStatusFilter('Present')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                statusFilter === 'Present'
                  ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Present ({presentCount})
            </button>
            <button
              onClick={() => setStatusFilter('Absent')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                statusFilter === 'Absent'
                  ? 'bg-white text-rose-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Absent ({absentCount})
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            title="Export Attendance to CSV Spreadsheet"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Student ID</th>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">RFID UID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No attendance records matched "{searchQuery}".
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const isPresent = student.status === 'Present';

                return (
                  <tr
                    key={student.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isPresent ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    {/* Student ID */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      {student.id}
                      <span className="block text-[10px] text-slate-400 font-sans">
                        {student.rollNumber}
                      </span>
                    </td>

                    {/* Student Name */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{student.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {student.department}
                      </div>
                    </td>

                    {/* RFID UID */}
                    <td className="py-3 px-4 font-mono text-slate-700 tracking-wider font-medium">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        {student.rfidUid}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {student.date}
                    </td>

                    {/* Time */}
                    <td className="py-3 px-4 font-mono font-medium">
                      {isPresent ? (
                        <span className="text-slate-900">{student.time}</span>
                      ) : (
                        <span className="text-slate-400">--:--</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {isPresent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Absent
                        </span>
                      )}
                    </td>

                    {/* Manual override action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onToggleStatus(student.id)}
                        title={isPresent ? 'Mark as Absent' : 'Mark as Present'}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                      >
                        {isPresent ? 'Mark Absent' : 'Mark Present'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>
          Showing {filteredStudents.length} of {students.length} registered students
        </span>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {presentCount} Present
          </span>
          <span className="inline-flex items-center gap-1 text-rose-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            {absentCount} Absent
          </span>
        </div>
      </div>
    </div>
  );
};

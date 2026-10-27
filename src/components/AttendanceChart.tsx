import React from 'react';
import { PieChart, UserCheck, UserX } from 'lucide-react';
import { SystemStats } from '../types';

interface AttendanceChartProps {
  stats: SystemStats;
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ stats }) => {
  const { totalStudents, presentToday, absentToday, attendancePercentage } = stats;

  // Calculate SVG circular arc values for Donut chart
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89
  const presentRatio = totalStudents > 0 ? presentToday / totalStudents : 0;
  const presentStrokeLength = circumference * presentRatio;
  const absentStrokeLength = circumference - presentStrokeLength;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Attendance Distribution</h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">Today's Class Session</span>
      </div>

      {/* Main Chart Graphic & Stats */}
      <div className="py-4 flex flex-col sm:flex-row items-center justify-around gap-6">
        
        {/* Donut graphic */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background track (Absent base) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#F43F5E"
              strokeWidth="11"
              className="transition-all duration-500"
              strokeDasharray={circumference}
              strokeDashoffset={0}
            />
            {/* Foreground track (Present overlay) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#2563EB"
              strokeWidth="11"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - presentStrokeLength}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center stats text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
              {attendancePercentage.toFixed(1)}%
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              Turnout
            </span>
          </div>
        </div>

        {/* Legend & Breakdown values */}
        <div className="flex flex-col gap-3 w-full max-w-[210px]">
          {/* Present Breakdown */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0"></span>
              <div className="flex items-center gap-1 text-xs font-semibold text-blue-950">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Present</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold font-mono text-blue-700 tabular-nums">
                {presentToday}
              </span>
              <span className="text-[11px] text-slate-500 ml-1">
                ({((presentToday / (totalStudents || 1)) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* Absent Breakdown */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50/60 border border-rose-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0"></span>
              <div className="flex items-center gap-1 text-xs font-semibold text-rose-950">
                <UserX className="w-3.5 h-3.5 text-rose-500" />
                <span>Absent</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold font-mono text-rose-700 tabular-nums">
                {absentToday}
              </span>
              <span className="text-[11px] text-slate-500 ml-1">
                ({((absentToday / (totalStudents || 1)) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Progress Bar comparison strip */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
          <span>Ratio: {presentToday} Present / {absentToday} Absent</span>
          <span className="font-mono text-slate-700">{totalStudents} Total</span>
        </div>
        <div className="w-full h-2 rounded-full bg-rose-100 overflow-hidden flex">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${(presentToday / (totalStudents || 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

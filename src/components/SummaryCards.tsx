import React from 'react';
import { Users, UserCheck, UserX, Percent } from 'lucide-react';
import { SystemStats } from '../types';

interface SummaryCardsProps {
  stats: SystemStats;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      unit: '',
      subtitle: 'Enrolled class strength',
      icon: Users,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      borderAccent: 'border-slate-200 hover:border-blue-300',
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      unit: '',
      subtitle: 'RFID verified entries',
      icon: UserCheck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      borderAccent: 'border-slate-200 hover:border-emerald-300',
    },
    {
      title: 'Absent Today',
      value: stats.absentToday,
      unit: '',
      subtitle: 'Pending card tap',
      icon: UserX,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
      borderAccent: 'border-slate-200 hover:border-rose-300',
    },
    {
      title: 'Attendance Percentage',
      value: stats.attendancePercentage.toFixed(1),
      unit: '%',
      subtitle: 'Real-time turnout rate',
      icon: Percent,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      borderAccent: 'border-slate-200 hover:border-indigo-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-xl border p-4.5 shadow-xs transition-all duration-200 ${card.borderAccent}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                    {card.value}
                  </span>
                  {card.unit && (
                    <span className="text-lg font-semibold text-slate-600">
                      {card.unit}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`w-11 h-11 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{card.subtitle}</span>
              {card.title === 'Attendance Percentage' && (
                <span className={`font-medium ${stats.attendancePercentage >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {stats.attendancePercentage >= 75 ? 'Criterion Met' : 'Below 75%'}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

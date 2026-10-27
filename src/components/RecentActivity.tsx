import React from 'react';
import { History, CheckCircle2, AlertOctagon, Info, Clock } from 'lucide-react';
import { ActivityLog } from '../types';

interface RecentActivityProps {
  activities: ActivityLog[];
  onClearActivities?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  onClearActivities,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <History className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
          </div>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {activities.length} Events Logged
        </span>
      </div>

      {/* Activity List */}
      <div className="my-3 space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No RFID scan events logged yet. Tap a card to simulate.
          </div>
        ) : (
          activities.map((act) => {
            const isPresent = act.status === 'Present';
            const isAlreadyMarked = act.status === 'Already Marked';
            const isUnknown = act.status === 'Not Marked';

            return (
              <div
                key={act.id}
                className={`p-3 rounded-lg border text-xs transition-colors flex items-center justify-between gap-3 ${
                  isPresent
                    ? 'bg-slate-50/70 border-slate-200 hover:border-blue-200'
                    : isAlreadyMarked
                    ? 'bg-blue-50/40 border-blue-100'
                    : 'bg-rose-50/40 border-rose-100'
                }`}
              >
                {/* Left side: Icon + Student Name & UID */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      isPresent
                        ? 'bg-emerald-100 text-emerald-700'
                        : isAlreadyMarked
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {isPresent ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : isAlreadyMarked ? (
                      <Info className="w-3.5 h-3.5" />
                    ) : (
                      <AlertOctagon className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {act.studentName}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 tracking-tight">
                      UID: {act.rfidUid}
                    </p>
                  </div>
                </div>

                {/* Right side: Timestamp & Status badge */}
                <div className="flex flex-col items-end shrink-0 gap-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                      isPresent
                        ? 'bg-emerald-100 text-emerald-800'
                        : isAlreadyMarked
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {act.status}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {act.time}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Continuous RFID hardware polling</span>
        <span className="font-mono text-emerald-600 font-semibold">Live Mode</span>
      </div>
    </div>
  );
};

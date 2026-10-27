import React, { useState } from 'react';
import { Radio, CreditCard, CheckCircle2, XCircle, AlertTriangle, Play, Sparkles, ChevronDown } from 'lucide-react';
import { Student } from '../types';

interface RfidScannerPanelProps {
  onScanCard: (uid: string, studentName?: string) => void;
  lastScannedStudent: {
    uid: string;
    name: string;
    status: 'PRESENT' | 'NOT MARKED' | 'ALREADY MARKED';
    timestamp: string;
  } | null;
  allStudents: Student[];
  isScanning: boolean;
}

export const RfidScannerPanel: React.FC<RfidScannerPanelProps> = ({
  onScanCard,
  lastScannedStudent,
  allStudents,
  isScanning,
}) => {
  const [customUid, setCustomUid] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Quick simulation options defined in requirements
  const handleScanStudent1 = () => {
    onScanCard('A2 BD 84 04', 'Student 1');
  };

  const handleScanStudent2 = () => {
    onScanCard('2B 32 6E 05', 'Student 2');
  };

  const handleScanUnknown = () => {
    onScanCard('9F 11 88 4A', 'Unknown Card');
  };

  const handleScanCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUid.trim()) return;
    const formatted = customUid.trim().toUpperCase();
    onScanCard(formatted);
  };

  const isIdle = !lastScannedStudent && !isScanning;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Radio className={`w-4 h-4 ${isScanning ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              RFID Scanner
            </h2>
            <p className="text-xs text-slate-500">
              RC522 13.56MHz Reader Interface via ESP32
            </p>
          </div>
        </div>

        {/* Live Reader status */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isScanning
                  ? 'bg-amber-400'
                  : lastScannedStudent?.status === 'NOT MARKED'
                  ? 'bg-rose-400'
                  : 'bg-emerald-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isScanning
                  ? 'bg-amber-500'
                  : lastScannedStudent?.status === 'NOT MARKED'
                  ? 'bg-rose-500'
                  : 'bg-emerald-500'
              }`}
            ></span>
          </span>
          <span className="text-slate-600 font-mono text-[11px]">
            {isScanning ? 'READING...' : 'READER READY'}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Visual Scanner Stage */}
        <div
          className={`relative rounded-xl border-2 transition-all duration-300 p-5 ${
            isScanning
              ? 'border-blue-400 bg-blue-50/40 shadow-inner'
              : lastScannedStudent?.status === 'PRESENT'
              ? 'border-emerald-300 bg-emerald-50/20'
              : lastScannedStudent?.status === 'NOT MARKED'
              ? 'border-rose-300 bg-rose-50/20'
              : 'border-dashed border-slate-200 bg-slate-50/70'
          }`}
        >
          {/* Hardware coil overlay graphic */}
          <div className="absolute right-4 top-4 opacity-15 pointer-events-none hidden sm:block">
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-slate-600 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-slate-600"></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Status & Identity Information */}
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Reader Status
                </span>
                <div className="mt-0.5 flex items-center gap-2">
                  {isScanning ? (
                    <span className="text-blue-700 font-medium text-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                      Reading RFID card data...
                    </span>
                  ) : isIdle ? (
                    <span className="text-slate-600 font-medium text-sm flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-slate-400 animate-bounce" />
                      Waiting for card...
                    </span>
                  ) : lastScannedStudent?.status === 'PRESENT' ? (
                    <span className="text-emerald-700 font-semibold text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Card Verified · Attendance Logged
                    </span>
                  ) : (
                    <span className="text-rose-700 font-semibold text-sm flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      Card Not Registered · Access Denied
                    </span>
                  )}
                </div>
              </div>

              {/* Data fields: RFID UID, Student Name, Attendance Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-lg p-2.5">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                    RFID UID
                  </p>
                  <p className="text-sm font-mono font-semibold text-slate-900 mt-0.5 tracking-wide">
                    {lastScannedStudent ? lastScannedStudent.uid : '— — — —'}
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-lg p-2.5">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                    Student Name
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
                    {lastScannedStudent ? lastScannedStudent.name : '—'}
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-lg p-2.5">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                    Attendance Status
                  </p>
                  <div className="mt-0.5">
                    {lastScannedStudent ? (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wide ${
                          lastScannedStudent.status === 'PRESENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lastScannedStudent.status === 'ALREADY MARKED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {lastScannedStudent.status}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">IDLE</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tap animation visual badge */}
            <div className="flex sm:flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 text-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isScanning
                    ? 'bg-blue-100 text-blue-600 scale-110 ring-4 ring-blue-100'
                    : lastScannedStudent?.status === 'PRESENT'
                    ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200'
                    : lastScannedStudent?.status === 'NOT MARKED'
                    ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-200'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <CreditCard className="w-7 h-7" />
              </div>
              <span className="ml-3 sm:ml-0 sm:mt-2 text-[11px] font-mono text-slate-500">
                13.56 MHz
              </span>
            </div>
          </div>
        </div>

        {/* Required Simulation Action Buttons */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
              Simulate RFID Scan
            </span>
            <span className="text-xs text-slate-500">Click to test project logic</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Student 1 Preset */}
            <button
              onClick={handleScanStudent1}
              disabled={isScanning}
              className="flex flex-col items-start p-3 text-left rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 active:scale-[0.98] transition-all bg-white shadow-2xs group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  Student 1
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  PRESENT
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 mt-1">
                UID: A2 BD 84 04
              </span>
            </button>

            {/* Student 2 Preset */}
            <button
              onClick={handleScanStudent2}
              disabled={isScanning}
              className="flex flex-col items-start p-3 text-left rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 active:scale-[0.98] transition-all bg-white shadow-2xs group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  Student 2
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  PRESENT
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 mt-1">
                UID: 2B 32 6E 05
              </span>
            </button>

            {/* Unknown Card Preset */}
            <button
              onClick={handleScanUnknown}
              disabled={isScanning}
              className="flex flex-col items-start p-3 text-left rounded-lg border border-slate-200 hover:border-rose-400 hover:bg-rose-50/40 active:scale-[0.98] transition-all bg-white shadow-2xs group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-900 group-hover:text-rose-700">
                  Unknown Card
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                  NOT MARKED
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 mt-1">
                UID: 9F 11 88 4A
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Advanced Testing for other absent students and manual UID entry */}
        <div className="pt-1">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-xs font-medium text-slate-600 hover:text-slate-900 py-1 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              More Test Cards (Mark Absent Students 3–7 or Enter Custom UID)
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                showAdvanced ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showAdvanced && (
            <div className="mt-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div>
                <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Tap Any Enrolled Student to Mark Attendance:
                </p>
                <div className="flex flex-wrap gap-2">
                  {allStudents.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onScanCard(s.rfidUid, s.name)}
                      disabled={isScanning}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-md border text-left transition-colors cursor-pointer ${
                        s.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                      }`}
                    >
                      <span className="font-semibold">{s.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">
                        ({s.rfidUid})
                      </span>
                      <span
                        className={`ml-1.5 text-[9px] uppercase px-1 py-0.2 rounded font-bold ${
                          s.status === 'Present'
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom manual UID form */}
              <form onSubmit={handleScanCustom} className="pt-2 border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Hex UID (e.g. C3 4A 91 02)"
                  value={customUid}
                  onChange={(e) => setCustomUid(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isScanning || !customUid.trim()}
                  className="px-3.5 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-md transition-colors cursor-pointer shadow-2xs"
                >
                  Test Scan
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

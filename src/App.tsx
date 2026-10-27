/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { RfidScannerPanel } from './components/RfidScannerPanel';
import { AttendanceChart } from './components/AttendanceChart';
import { RecentActivity } from './components/RecentActivity';
import { AttendanceTable } from './components/AttendanceTable';
import { HardwareSpecsModal } from './components/HardwareSpecsModal';
import { INITIAL_STUDENTS, INITIAL_ACTIVITIES } from './data/initialData';
import { Student, ActivityLog, SystemStats } from './types';
import { soundEffects } from './utils/audio';

export default function App() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [lastScannedStudent, setLastScannedStudent] = useState<{
    uid: string;
    name: string;
    status: 'PRESENT' | 'NOT MARKED' | 'ALREADY MARKED';
    timestamp: string;
  } | null>(null);

  // Calculate live statistics
  const totalStudents = students.length;
  const presentToday = students.filter((s) => s.status === 'Present').length;
  const absentToday = students.filter((s) => s.status === 'Absent').length;
  const attendancePercentage =
    totalStudents > 0 ? (presentToday / totalStudents) * 100 : 0;

  const stats: SystemStats = {
    totalStudents,
    presentToday,
    absentToday,
    attendancePercentage,
  };

  // Format current local time (e.g., "10:14 AM")
  const getCurrentTimeFormatted = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Toggle sound effects
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.enabled = next;
  };

  // Reset to initial demo state
  const handleResetData = () => {
    setStudents(INITIAL_STUDENTS);
    setActivities(INITIAL_ACTIVITIES);
    setLastScannedStudent(null);
  };

  // Scan simulation handler
  const handleScanCard = (uid: string, overrideName?: string) => {
    if (isScanning) return;
    setIsScanning(true);

    // Normalize UID format for matching
    const cleanUid = uid.trim().toUpperCase();

    // Visual scan delay simulation (250ms for realistic ESP32 radio response)
    setTimeout(() => {
      const matchedStudent = students.find(
        (s) => s.rfidUid.toUpperCase() === cleanUid
      );

      const currentTime = getCurrentTimeFormatted();
      const currentDate = new Date().toISOString().slice(0, 10);

      if (matchedStudent) {
        if (matchedStudent.status === 'Present') {
          // Already marked present earlier
          soundEffects.playSuccessBeep();
          setLastScannedStudent({
            uid: matchedStudent.rfidUid,
            name: matchedStudent.name,
            status: 'ALREADY MARKED',
            timestamp: currentTime,
          });

          const newLog: ActivityLog = {
            id: 'act-' + Date.now(),
            studentName: matchedStudent.name,
            rfidUid: matchedStudent.rfidUid,
            time: currentTime,
            date: currentDate,
            status: 'Already Marked',
            type: 'warning',
            note: 'Card already authenticated for current session',
          };
          setActivities((prev) => [newLog, ...prev.slice(0, 19)]);
        } else {
          // Mark student as present
          soundEffects.playSuccessBeep();
          setStudents((prev) =>
            prev.map((s) =>
              s.id === matchedStudent.id
                ? { ...s, status: 'Present', time: currentTime }
                : s
            )
          );

          setLastScannedStudent({
            uid: matchedStudent.rfidUid,
            name: matchedStudent.name,
            status: 'PRESENT',
            timestamp: currentTime,
          });

          const newLog: ActivityLog = {
            id: 'act-' + Date.now(),
            studentName: matchedStudent.name,
            rfidUid: matchedStudent.rfidUid,
            time: currentTime,
            date: currentDate,
            status: 'Present',
            type: 'success',
            note: 'Attendance successfully verified via RFID',
          };
          setActivities((prev) => [newLog, ...prev.slice(0, 19)]);
        }
      } else {
        // Unknown / unregistered card
        soundEffects.playErrorBuzz();
        const displayName = overrideName || 'Unregistered Card';

        setLastScannedStudent({
          uid: cleanUid,
          name: displayName,
          status: 'NOT MARKED',
          timestamp: currentTime,
        });

        const newLog: ActivityLog = {
          id: 'act-' + Date.now(),
          studentName: displayName,
          rfidUid: cleanUid,
          time: currentTime,
          date: currentDate,
          status: 'Not Marked',
          type: 'error',
          note: 'Unknown UID - Access denied / Student not enrolled',
        };
        setActivities((prev) => [newLog, ...prev.slice(0, 19)]);
      }

      setIsScanning(false);
    }, 280);
  };

  // Manual status toggle directly in table
  const handleToggleStudentStatus = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const nextStatus = s.status === 'Present' ? 'Absent' : 'Present';
          const newTime = nextStatus === 'Present' ? getCurrentTimeFormatted() : '--:--';

          // Also record in activity log
          const newLog: ActivityLog = {
            id: 'act-' + Date.now(),
            studentName: s.name,
            rfidUid: s.rfidUid,
            time: getCurrentTimeFormatted(),
            date: new Date().toISOString().slice(0, 10),
            status: nextStatus === 'Present' ? 'Present' : 'Not Marked',
            type: nextStatus === 'Present' ? 'success' : 'warning',
            note: `Manual register override: marked ${nextStatus.toLowerCase()}`,
          };
          setActivities((activities) => [newLog, ...activities.slice(0, 19)]);

          return { ...s, status: nextStatus, time: newTime };
        }
        return s;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onResetData={handleResetData}
        onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Section 1: Summary Cards (Total, Present, Absent, Attendance %) */}
        <section aria-label="Attendance Summary Metrics">
          <SummaryCards stats={stats} />
        </section>

        {/* Section 2: Prominent RFID Scanner Panel + Analytics & Activity Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Prominent RFID Scanner Panel (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <RfidScannerPanel
              onScanCard={handleScanCard}
              lastScannedStudent={lastScannedStudent}
              allStudents={students}
              isScanning={isScanning}
            />
          </div>

          {/* Right Column: Attendance Chart & Recent Activity (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Small Attendance Chart showing Present: 2, Absent: 5 */}
            <AttendanceChart stats={stats} />

            {/* Recent Activity Section */}
            <RecentActivity activities={activities} />
          </div>

        </section>

        {/* Section 3: Attendance Table */}
        <section aria-label="Student Attendance Table">
          <AttendanceTable
            students={students}
            onToggleStatus={handleToggleStudentStatus}
          />
        </section>

        {/* College Project Academic Footer */}
        <footer className="pt-4 pb-8 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-700">Project:</span> RFID Based Smart Attendance System using ESP32
            <span className="mx-2 text-slate-300">·</span>
            <span>Department of Computer Science & Engineering</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Microcontroller: ESP32-WROOM-32
            </span>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Reader: RC522 SPI 13.56MHz
            </span>
          </div>
        </footer>

      </main>

      {/* Hardware Architecture & Pinout Modal */}
      <HardwareSpecsModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
      />
    </div>
  );
}

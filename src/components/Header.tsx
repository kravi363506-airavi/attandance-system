import React from 'react';
import { Cpu, Wifi, Volume2, VolumeX, RotateCcw, FileCode2 } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetData: () => void;
  onOpenHardwareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onResetData,
  onOpenHardwareModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          
          {/* Brand & Project Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                  RFID ATTENDANCE SYSTEM
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  System Online
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                ESP32 Based Smart Attendance Dashboard <span className="text-slate-300">|</span> B.Tech Project
              </p>
            </div>
          </div>

          {/* Controls & Tools */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
            {/* System Status telemetry badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <Wifi className="w-3.5 h-3.5 text-blue-600" />
              <span>ESP32-WROOM-32</span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-[11px] text-slate-500">115200 Baud</span>
            </div>

            {/* Hardware Pinout / Architecture Spec button */}
            <button
              onClick={onOpenHardwareModal}
              title="View ESP32 to RC522 Circuit Pinout and API Architecture"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Hardware Specs</span>
            </button>

            {/* Audio Buzzer toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute Scanner Buzzer' : 'Enable Scanner Buzzer'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors shadow-2xs cursor-pointer ${
                soundEnabled
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Buzzer On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Buzzer Off</span>
                </>
              )}
            </button>

            {/* Reset Demo Data button */}
            <button
              onClick={onResetData}
              title="Reset dashboard to initial state (2 Present, 5 Absent)"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Demo</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

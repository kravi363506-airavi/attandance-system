import React from 'react';
import { X, Cpu, Radio, Network, Check, Copy } from 'lucide-react';

interface HardwareSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HardwareSpecsModal: React.FC<HardwareSpecsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const samplePayload = `{
  "deviceId": "ESP32_ATTENDANCE_NODE_01",
  "rfidUid": "A2 BD 84 04",
  "timestamp": 1793102040,
  "signalRssi": -58,
  "batteryStatus": "AC_POWERED"
}`;

  const copyPayload = () => {
    navigator.clipboard.writeText(samplePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pinouts = [
    { pinRC522: 'SDA / SS', pinESP32: 'GPIO 21 (or GPIO 5)', description: 'SPI Chip Select / Slave Select' },
    { pinRC522: 'SCK', pinESP32: 'GPIO 18', description: 'SPI Serial Clock' },
    { pinRC522: 'MOSI', pinESP32: 'GPIO 23', description: 'Master Out Slave In' },
    { pinRC522: 'MISO', pinESP32: 'GPIO 19', description: 'Master In Slave Out' },
    { pinRC522: 'IRQ', pinESP32: 'Not Connected', description: 'Interrupt Request line' },
    { pinRC522: 'GND', pinESP32: 'GND', description: 'Common Ground' },
    { pinRC522: 'RST', pinESP32: 'GPIO 22', description: 'Reset Line' },
    { pinRC522: '3.3V (VCC)', pinESP32: '3.3V Power Out', description: 'Strict 3.3V supply (DO NOT use 5V)' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Hardware Architecture & Pinout Specifications
              </h3>
              <p className="text-xs text-slate-500">
                RFID Based Smart Attendance System using ESP32 (B.Tech Project)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600">
          {/* Architecture Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <span className="font-semibold text-blue-900 flex items-center gap-1.5 mb-1">
                <Cpu className="w-4 h-4 text-blue-600" />
                Controller Unit
              </span>
              <p className="text-slate-600">ESP32 Dual-Core Tensilica Xtensa 32-bit LX6 @ 240MHz with 802.11 b/g/n Wi-Fi</p>
            </div>

            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <span className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1">
                <Radio className="w-4 h-4 text-emerald-600" />
                RFID Reader
              </span>
              <p className="text-slate-600">MFRC522 IC, 13.56 MHz High Frequency, ISO/IEC 14443A Mifare compatible</p>
            </div>

            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
              <span className="font-semibold text-purple-900 flex items-center gap-1.5 mb-1">
                <Network className="w-4 h-4 text-purple-600" />
                Data Link
              </span>
              <p className="text-slate-600">Wi-Fi TCP/IP HTTP REST API / WebSocket JSON event streaming</p>
            </div>
          </div>

          {/* SPI Pinout Connection Matrix */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">
              ESP32 to MFRC522 SPI Pinout Mapping
            </h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 px-3">MFRC522 Pin</th>
                    <th className="p-2.5 px-3">ESP32 GPIO Pin</th>
                    <th className="p-2.5 px-3">Protocol / Function</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {pinouts.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-2.5 px-3 font-semibold text-slate-800">{p.pinRC522}</td>
                      <td className="p-2.5 px-3 text-blue-700 font-bold">{p.pinESP32}</td>
                      <td className="p-2.5 px-3 text-slate-600 font-sans text-xs">{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ESP32 HTTP POST JSON Payload Sample */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 text-sm">
                ESP32 HTTP POST Payload Specification
              </h4>
              <button
                onClick={copyPayload}
                className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-900 text-emerald-400 font-mono rounded-lg overflow-x-auto text-[11px]">
              {samplePayload}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Complies with B.Tech Project Demonstration Standards
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};

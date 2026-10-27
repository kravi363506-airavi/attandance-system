export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  rfidUid: string;
  department: string;
  date: string;
  time: string;
  status: 'Present' | 'Absent';
}

export interface ActivityLog {
  id: string;
  studentName: string;
  rfidUid: string;
  time: string;
  date: string;
  status: 'Present' | 'Not Marked' | 'Already Marked';
  type: 'success' | 'warning' | 'error';
  note?: string;
}

export interface SystemStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  attendancePercentage: number;
}


export type Section = 'A' | 'B' | 'C' | 'D';

export interface ClassSession {
  subject: string;
  time: string;
  isLab: boolean;
}

export interface DaySchedule {
  day: string;
  classes: ClassSession[];
}

export interface Timetable {
  section: Section;
  postedBy: string;
  schedule: DaySchedule[];
}

export interface LabRequest {
  id: string;
  requesterName: string;
  requesterSection: Section;
  requirement: string; // e.g., "Apron", "Breadboard", "Multimeter"
  timestamp: number;
  aiVerificationResult?: string;
}

export interface User {
  name: string;
  section: Section;
  rollNumber: string;
  isFirstPoster?: boolean;
}

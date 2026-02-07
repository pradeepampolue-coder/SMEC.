
import React from 'react';
import { DaySchedule, Section } from './types';

export const SECTIONS: Section[] = ['A', 'B', 'C', 'D'];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const SUBJECTS = [
  "Digital Signal Propagation",
  "Microprocessors & Microcontrollers",
  "Antennas & Wave Propagation",
  "VLSI Design",
  "Optical Communications",
  "Management Science",
  "DSP Lab",
  "MPMC Lab",
  "VLSI Lab",
  "Embedded Systems",
  "Digital Image Processing",
  "Radar Systems"
];

export const MOCK_LAB_SCHEDULE_PROMPT = `
Assume these are the common ECE Lab days for SMEC:
- DSP Lab: Tuesday
- MPMC Lab: Thursday
- VLSI Lab: Friday
Aprons are mandatory for VLSI and MPMC labs.
Classes are 50 minutes each starting at 09:20.
Break is 40 minutes from 11:50 to 12:30.
`;

export const getEmptySchedule = (): DaySchedule[] => 
  DAYS.map(day => ({
    day,
    classes: [
      { time: "09:20 - 10:10", subject: "", isLab: false }, // P1
      { time: "10:10 - 11:00", subject: "", isLab: false }, // P2
      { time: "11:00 - 11:50", subject: "", isLab: false }, // P3
      // Break: 11:50 - 12:30 (40 mins)
      { time: "12:30 - 01:20", subject: "", isLab: false }, // P4
      { time: "01:20 - 02:10", subject: "", isLab: false }, // P5
      { time: "02:10 - 03:00", subject: "", isLab: false }, // P6
      { time: "03:00 - 03:50", subject: "", isLab: false }, // P7
    ]
  }));

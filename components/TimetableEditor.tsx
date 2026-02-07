
import React, { useState } from 'react';
import { Section, Timetable, DaySchedule } from '../types';
import { DAYS, SUBJECTS, getEmptySchedule } from '../constants';

interface Props {
  section: Section;
  userName: string;
  onSave: (timetable: Timetable) => void;
}

export const TimetableEditor: React.FC<Props> = ({ section, userName, onSave }) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(getEmptySchedule());

  const handleSubjectChange = (dayIdx: number, classIdx: number, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIdx].classes[classIdx].subject = value;
    // Auto-detect lab if the subject contains 'Lab'
    newSchedule[dayIdx].classes[classIdx].isLab = value.toLowerCase().includes('lab');
    setSchedule(newSchedule);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
      <div className="mb-6 text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Setup Section {section} Timetable</h2>
        <p className="text-slate-500 text-sm mt-1">Start 09:20 • 50 min classes • 40 min break (11:50 - 12:30)</p>
      </div>

      <div className="space-y-6">
        {schedule.map((dayData, dIdx) => (
          <div key={dayData.day} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="font-bold text-blue-600 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs">{dayData.day[0]}</span>
              {dayData.day}
            </h3>
            
            <div className="flex flex-wrap gap-3">
              {/* First 3 Periods */}
              <div className="flex flex-wrap gap-3 flex-1">
                {dayData.classes.slice(0, 3).map((cls, cIdx) => (
                  <div key={cIdx} className="flex-1 min-w-[120px]">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block mb-1">P{cIdx + 1} ({cls.time})</label>
                    <input
                      type="text"
                      list="subjects"
                      value={cls.subject}
                      onChange={(e) => handleSubjectChange(dIdx, cIdx, e.target.value)}
                      placeholder="Subject"
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Break Indicator */}
              <div className="flex items-end pb-1 text-[10px] font-bold text-slate-300 uppercase px-1">
                Break
              </div>

              {/* Last 4 Periods */}
              <div className="flex flex-wrap gap-3 flex-[1.3]">
                {dayData.classes.slice(3, 7).map((cls, cIdx) => {
                  const actualIdx = cIdx + 3;
                  return (
                    <div key={actualIdx} className="flex-1 min-w-[120px]">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block mb-1">P{actualIdx + 1} ({cls.time})</label>
                      <input
                        type="text"
                        list="subjects"
                        value={cls.subject}
                        onChange={(e) => handleSubjectChange(dIdx, actualIdx, e.target.value)}
                        placeholder="Subject"
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <datalist id="subjects">
        {SUBJECTS.map(s => <option key={s} value={s} />)}
      </datalist>

      <button
        onClick={() => onSave({ section, postedBy: userName, schedule })}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
      >
        <span>Publish Section {section} Timetable</span>
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
};

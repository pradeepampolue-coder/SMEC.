
import React from 'react';
import { Timetable } from '../types';

interface Props {
  timetable: Timetable;
}

export const TimetableView: React.FC<Props> = ({ timetable }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-white font-bold text-lg">Section {timetable.section} Schedule</h2>
        <span className="text-blue-100 text-xs italic">Posted by {timetable.postedBy}</span>
      </div>
      
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-2 text-slate-500 font-bold text-xs uppercase border-b w-24">Day</th>
              <th className="p-2 text-slate-500 font-bold text-xs uppercase border-b text-center">P1</th>
              <th className="p-2 text-slate-500 font-bold text-xs uppercase border-b text-center">P2</th>
              <th className="p-2 text-slate-500 font-bold text-xs uppercase border-b text-center">P3</th>
              <th className="p-2 bg-slate-100 text-slate-400 font-bold text-[10px] uppercase border-b text-center align-middle">Break</th>
              <th className="p-2 text-slate-500 font-bold text-xs uppercase border-b text-center">P4</th>
              <th className="p-2 text-slate-500 font-bold text-xs uppercase border-b text-center">P5</th>
              <th className="p-2 text-slate-500 font-bold text-xs uppercase border-b text-center">P6</th>
              <th className="p-2 text-slate-500 font-bold text-xs uppercase border-b text-center">P7</th>
            </tr>
          </thead>
          <tbody>
            {timetable.schedule.map((day) => (
              <tr key={day.day} className={day.day === today ? "bg-blue-50/50" : ""}>
                <td className="p-2 font-bold text-slate-700 border-b border-r text-sm">{day.day}</td>
                {/* Morning: First 3 Classes */}
                {day.classes.slice(0, 3).map((cls, idx) => (
                  <td key={idx} className="p-2 border-b text-center align-top">
                    <div className="text-[11px] font-bold text-slate-800 line-clamp-2">
                      {cls.subject || <span className="text-slate-300 font-normal italic">-</span>}
                    </div>
                    {cls.isLab && (
                      <span className="inline-block px-1.5 py-0.5 text-[8px] bg-amber-100 text-amber-700 rounded-sm font-bold uppercase mt-1">LAB</span>
                    )}
                  </td>
                ))}
                
                {/* 40 Min Break Column */}
                <td className="p-2 border-b bg-slate-50/50 text-center text-[10px] text-slate-400 font-medium align-middle">
                  11:50 - 12:30
                </td>

                {/* Afternoon: Next 4 Classes */}
                {day.classes.slice(3, 7).map((cls, idx) => (
                  <td key={idx + 3} className="p-2 border-b text-center align-top">
                    <div className="text-[11px] font-bold text-slate-800 line-clamp-2">
                      {cls.subject || <span className="text-slate-300 font-normal italic">-</span>}
                    </div>
                    {cls.isLab && (
                      <span className="inline-block px-1.5 py-0.5 text-[8px] bg-amber-100 text-amber-700 rounded-sm font-bold uppercase mt-1">LAB</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-6 py-3 border-t">
        <p className="text-xs text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          Labs are automatically highlighted based on subject name.
        </p>
      </div>
    </div>
  );
};

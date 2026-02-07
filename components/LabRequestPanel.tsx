
import React, { useState } from 'react';
import { Section, LabRequest, Timetable } from '../types';
import { matchLabRequest } from '../services/geminiService';

interface Props {
  userSection: Section;
  userName: string;
  allTimetables: Timetable[];
}

export const LabRequestPanel: React.FC<Props> = ({ userSection, userName, allTimetables }) => {
  const [requirement, setRequirement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ recommendation: string; eligibleSections: string[]; reasoning: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirement) return;

    setIsLoading(true);
    setResult(null);

    const newRequest: LabRequest = {
      id: Math.random().toString(36).substr(2, 9),
      requesterName: userName,
      requesterSection: userSection,
      requirement,
      timestamp: Date.now(),
    };

    const aiMatch = await matchLabRequest(newRequest, allTimetables);
    setResult(aiMatch);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full border border-blue-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Lab Resource Request</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">What do you need?</label>
          <input
            type="text"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="e.g. Lab Apron, Breadboard..."
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI Verifying Schedules...
            </>
          ) : "Check Availability"}
        </button>
      </form>

      {result && (
        <div className="mt-8 animate-fadeIn">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <h3 className="text-emerald-800 font-bold flex items-center gap-2 mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              AI Recommendation
            </h3>
            <p className="text-emerald-900 font-medium text-lg mb-2">{result.recommendation}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {result.eligibleSections.map(s => (
                <span key={s} className="px-3 py-1 bg-emerald-200 text-emerald-800 text-xs font-bold rounded-full">
                  SECTION {s} AVAILABLE
                </span>
              ))}
            </div>
            <p className="text-emerald-700 text-sm italic">{result.reasoning}</p>
          </div>
          
          <button className="w-full mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 text-center">
            Send Broadcast to Available Students?
          </button>
        </div>
      )}
    </div>
  );
};

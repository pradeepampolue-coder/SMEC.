
import React, { useState, useEffect } from 'react';
import { Section, User, Timetable } from './types';
import { SECTIONS } from './constants';
import { TimetableEditor } from './components/TimetableEditor';
import { TimetableView } from './components/TimetableView';
import { LabRequestPanel } from './components/LabRequestPanel';

const ROLL_PREFIX = "25K81A";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [view, setView] = useState<'home' | 'dashboard'>('home');

  // Load existing timetables from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('smec_ece_timetables');
    if (saved) {
      setTimetables(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('userName') as string;
    const section = formData.get('section') as Section;
    const rollSuffix = formData.get('rollSuffix') as string;

    if (!name || !section || !rollSuffix) return;

    const rollNumber = `${ROLL_PREFIX}${rollSuffix.toUpperCase()}`;

    // Check if this user is the first for their section
    const sectionHasTimetable = timetables.some(t => t.section === section);
    
    setUser({ name, section, rollNumber, isFirstPoster: !sectionHasTimetable });
    setView('dashboard');
  };

  const saveTimetable = (newTimetable: Timetable) => {
    const updated = [...timetables, newTimetable];
    setTimetables(updated);
    localStorage.setItem('smec_ece_timetables', JSON.stringify(updated));
    if (user) {
      setUser({ ...user, isFirstPoster: false });
    }
  };

  const logout = () => {
    setUser(null);
    setView('home');
  };

  if (view === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg">
              <span className="text-3xl font-black">ECE</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">SMEC ECE Connect</h1>
            <p className="text-slate-500 mt-1">St. Martin's Engineering College</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Full Name</label>
              <input
                name="userName"
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
                placeholder="Ex: Rahul Sharma"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Roll Number</label>
              <div className="flex items-center gap-0 overflow-hidden border border-slate-200 rounded-xl bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <span className="bg-slate-200 px-4 py-3 text-slate-600 font-bold border-r border-slate-300">
                  {ROLL_PREFIX}
                </span>
                <input
                  name="rollSuffix"
                  required
                  maxLength={4}
                  className="flex-1 p-3 bg-transparent outline-none uppercase font-mono tracking-widest text-slate-800 placeholder:text-slate-300"
                  placeholder="04H9"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 ml-1 uppercase font-bold tracking-tight">Enter last 4 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Select Section</label>
              <div className="grid grid-cols-4 gap-3">
                {SECTIONS.map((s) => (
                  <label key={s} className="relative cursor-pointer group">
                    <input type="radio" name="section" value={s} required className="peer sr-only" />
                    <div className="p-3 text-center border rounded-xl font-bold transition-all peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 hover:bg-slate-100">
                      {s}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98]"
            >
              Enter Dashboard
            </button>
          </form>
        </div>
        <p className="mt-8 text-slate-400 text-sm font-medium tracking-tight">© {new Date().getFullYear()} SMEC B.Tech ECE Department</p>
      </div>
    );
  }

  const currentSectionTimetable = timetables.find(t => t.section === user?.section);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-18 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-100">
              {user?.section}
            </div>
            <div>
              <h1 className="font-bold text-slate-800 leading-tight text-lg">{user?.name}</h1>
              <p className="text-xs font-mono font-bold text-blue-600 tracking-wider">{user?.rollNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:block text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ECE Portal</p>
                <p className="text-sm font-semibold text-slate-700">SMEC Campus</p>
             </div>
             <button 
                onClick={logout}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle: Timetable Section */}
        <div className="lg:col-span-2 space-y-8">
          {user?.isFirstPoster && !currentSectionTimetable ? (
            <TimetableEditor 
              section={user.section} 
              userName={user.name} 
              onSave={saveTimetable} 
            />
          ) : currentSectionTimetable ? (
            <TimetableView timetable={currentSectionTimetable} />
          ) : (
            <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-slate-100">
              <div className="bg-amber-100 text-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">No Timetable Yet</h2>
              <p className="text-slate-500">Waiting for the first student of Section {user?.section} to post the schedule.</p>
            </div>
          )}

          {/* All Sections Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              All Sections Progress
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SECTIONS.map(s => {
                const isReady = timetables.some(t => t.section === s);
                return (
                  <div key={s} className={`p-3 rounded-lg border text-center transition-all ${isReady ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-widest">Sec {s}</span>
                    <span className="text-xs font-bold">{isReady ? 'Active' : 'Missing'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: AI Requests */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <LabRequestPanel 
              userSection={user?.section || 'A'} 
              userName={user?.name || ''} 
              allTimetables={timetables}
            />
            
            <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-1">ECE Department</h4>
                <p className="text-slate-400 text-xs">SMEC Campus • Autonomous Status</p>
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Internal Tools</p>
                  <ul className="space-y-2 text-xs font-medium">
                    <li className="flex items-center gap-2 text-blue-400">
                      <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                      Lab Resource Tracker
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">
                      <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                      Attendance Preview
                    </li>
                  </ul>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5">
                <span className="text-8xl font-black">SMEC</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

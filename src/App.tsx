/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Utensils, 
  Droplets, 
  Pill, 
  Activity, 
  AlertTriangle, 
  Stethoscope, 
  Plus, 
  History, 
  Quote,
  Sparkles,
  Smile,
  ChevronRight,
  X,
  User,
  Calendar,
  Target,
  Settings,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  StickyNote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, differenceInDays, parseISO, startOfDay, subDays, isSameDay } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { getDailyContent, generateAppImage } from './services/geminiService';
import { DailyContent, LogEntry, UserProfile } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    diagnosisDate: format(new Date(), 'yyyy-MM-dd'),
    currentStatus: 'remission',
    goals: ''
  });
  const [isLogging, setIsLogging] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [logType, setLogType] = useState<LogEntry['type']>('meal');
  const [logContent, setLogContent] = useState('');
  const [severity, setSeverity] = useState(5);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [organUrl, setOrganUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingContent, setIsRefreshingContent] = useState(false);

  const fetchDailyContent = async (profile: UserProfile) => {
    setIsRefreshingContent(true);
    const content = await getDailyContent(profile);
    setDailyContent(content);
    setIsRefreshingContent(false);
  };

  useEffect(() => {
    async function init() {
      // Load data from local storage first
      const savedLogs = localStorage.getItem('uc_logs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }

      const savedProfile = localStorage.getItem('uc_profile');
      let currentProfile = userProfile;
      if (savedProfile) {
        currentProfile = JSON.parse(savedProfile);
        setUserProfile(currentProfile);
      }

      const savedNotes = localStorage.getItem('uc_notes');
      if (savedNotes) {
        setNotes(savedNotes);
      }

      // Fetch content based on profile
      await fetchDailyContent(currentProfile);
      
      // Generate images
      const logo = await generateAppImage('A funny cartoonish logo for an app called "UC with Dr. Hope". It should feature a cute, slightly grumpy but lovable cartoon gut/stomach character with a speech bubble saying "I hate my guts" in a playful font. Vibrant colors, clean lines.');
      const organ = await generateAppImage('A simple, vibrant cartoon illustration of a peaceful nature landscape with green hills, a few flowers, and a sun in the sky. Very friendly, clean lines, bright colors, uplifting atmosphere.');
      
      setLogoUrl(logo);
      setOrganUrl(organ);
      
      setIsLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    localStorage.setItem('uc_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('uc_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('uc_notes', notes);
  }, [notes]);

  const handleAddLog = () => {
    if (!logContent.trim()) return;
    
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      type: logType,
      content: logContent,
      severity: logType === 'symptom' ? severity : undefined,
    };
    
    setLogs([newLog, ...logs]);
    setLogContent('');
    setIsLogging(false);
  };

  const daysSinceDiagnosis = userProfile.diagnosisDate 
    ? differenceInDays(new Date(), parseISO(userProfile.diagnosisDate)) 
    : 0;

  const logTypes: { type: LogEntry['type']; icon: any; label: string; color: string; hex: string }[] = [
    { type: 'meal', icon: Utensils, label: 'Meal', color: 'bg-orange-100 text-orange-600', hex: '#f97316' },
    { type: 'drink', icon: Droplets, label: 'Drink', color: 'bg-blue-100 text-blue-600', hex: '#3b82f6' },
    { type: 'supplement', icon: Pill, label: 'Supplement', color: 'bg-purple-100 text-purple-600', hex: '#a855f7' },
    { type: 'activity', icon: Activity, label: 'Activity', color: 'bg-green-100 text-green-600', hex: '#22c55e' },
    { type: 'trigger', icon: AlertTriangle, label: 'Trigger', color: 'bg-yellow-100 text-yellow-600', hex: '#eab308' },
    { type: 'symptom', icon: Stethoscope, label: 'Symptom', color: 'bg-red-100 text-red-600', hex: '#e11d48' },
  ];

  // Process symptom data for the chart
  const symptomTrendData = logs
    .filter(log => log.type === 'symptom' && log.severity !== undefined)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(log => ({
      date: format(log.timestamp, 'MMM d'),
      severity: log.severity,
      fullDate: format(log.timestamp, 'MMM d, h:mm a'),
      content: log.content
    }))
    .slice(-14);

  // Process distribution data
  const distributionData = logTypes.map(lt => ({
    name: lt.label,
    value: logs.filter(log => log.type === lt.type).length,
    color: lt.hex
  })).filter(d => d.value > 0);

  // Process daily frequency data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
  const dailyFrequencyData = last7Days.map(date => {
    const dayLogs = logs.filter(log => isSameDay(new Date(log.timestamp), date));
    return {
      date: format(date, 'MMM d'),
      meals: dayLogs.filter(l => l.type === 'meal').length,
      drinks: dayLogs.filter(l => l.type === 'drink').length,
      supplements: dayLogs.filter(l => l.type === 'supplement').length,
      activities: dayLogs.filter(l => l.type === 'activity').length,
      triggers: dayLogs.filter(l => l.type === 'trigger').length,
      symptoms: dayLogs.filter(l => l.type === 'symptom').length,
    };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 bg-rose-200 rounded-full flex items-center justify-center mb-4"
        >
          <Heart className="text-rose-500 w-12 h-12 fill-current" />
        </motion.div>
        <p className="text-rose-600 font-medium animate-pulse">Dr. Hope is preparing your daily plan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 text-slate-800 font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-rose-100 p-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 overflow-hidden flex-shrink-0 border-2 border-rose-200 shadow-inner">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Smile className="text-rose-400 w-8 h-8" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-rose-600 tracking-tight">UC with Dr. Hope</h1>
              <p className="text-slate-500 text-sm font-medium">
                {userProfile.name ? `Welcome back, ${userProfile.name}!` : "Beating the disease, one day at a time."}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Daily Tip Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-rose-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24 text-rose-500" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <Sparkles className={cn("w-5 h-5 text-rose-600", isRefreshingContent && "animate-spin")} />
            </div>
            <h2 className="font-bold text-lg text-slate-700">Today's Personalized Method</h2>
          </div>
          {isRefreshingContent ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-rose-50 rounded w-3/4"></div>
              <div className="h-4 bg-rose-50 rounded w-full"></div>
              <div className="h-4 bg-rose-50 rounded w-5/6"></div>
            </div>
          ) : (
            <p className="text-slate-600 leading-relaxed">
              {dailyContent?.tip}
            </p>
          )}
        </motion.section>

        {/* Quick Log Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {logTypes.map((item) => (
            <button
              key={item.type}
              onClick={() => {
                setLogType(item.type);
                setIsLogging(true);
              }}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-rose-50 hover:border-rose-200 transition-all group"
            >
              <div className={cn("p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform", item.color)}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-600">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Notes Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-rose-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
              <StickyNote className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-slate-700">Daily Notes</h2>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling today? Any specific observations or thoughts?"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-rose-300 focus:ring-0 transition-all min-h-[120px] text-slate-700 outline-none resize-none"
          />
        </motion.section>

        {/* Recent Logs Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-rose-500" />
              Recent Activity
            </h2>
          </div>
          
          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="text-center py-12 bg-white/50 rounded-3xl border-2 border-dashed border-rose-200">
                <p className="text-slate-400 font-medium">No logs yet. Start tracking to see patterns!</p>
              </div>
            ) : (
              logs.slice(0, 10).map((log) => {
                const typeInfo = logTypes.find(t => t.type === log.type);
                return (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-rose-50 flex items-start gap-4"
                  >
                    <div className={cn("p-2 rounded-lg flex-shrink-0", typeInfo?.color)}>
                      {typeInfo && <typeInfo.icon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {typeInfo?.label} • {format(log.timestamp, 'h:mm a')}
                        </span>
                        {log.severity && (
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold",
                            log.severity > 7 ? "bg-red-100 text-red-600" : 
                            log.severity > 4 ? "bg-yellow-100 text-yellow-600" : 
                            "bg-green-100 text-green-600"
                          )}>
                            Severity: {log.severity}/10
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 font-medium">{log.content}</p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* Inspirational Quote Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-rose-600 rounded-3xl p-8 text-white text-center shadow-lg relative overflow-hidden"
        >
          <Quote className="absolute top-4 left-4 w-12 h-12 opacity-20" />
          <div className="relative z-10 space-y-4">
            <p className="text-xl font-medium italic leading-relaxed">
              "{dailyContent?.quote}"
            </p>
            <div className="h-px w-12 bg-rose-400 mx-auto" />
            <p className="font-bold text-rose-200">— {dailyContent?.author}</p>
          </div>
        </motion.section>

        {/* Nature Scene Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-rose-100 flex flex-col items-center text-center"
        >
          <div className="w-full h-48 bg-rose-50 rounded-2xl overflow-hidden border-4 border-white shadow-md relative">
            {organUrl ? (
              <img src={organUrl} alt="Nature Scene" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-rose-50/50">
                <Sparkles className="text-rose-300 w-12 h-12 mb-2 animate-pulse" />
                <p className="text-rose-300 text-[10px] font-bold uppercase tracking-widest">Visualizing your healing journey...</p>
              </div>
            )}
          </div>
        </motion.section>
      </main>

      {/* Profile Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingProfile(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 z-50 shadow-2xl max-w-2xl mx-auto overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
                    <User className="w-6 h-6" />
                  </div>
                  Your Profile
                </h2>
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    placeholder="What should we call you?"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-rose-300 focus:ring-0 transition-all text-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Diagnosis Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="date"
                      value={userProfile.diagnosisDate}
                      onChange={(e) => setUserProfile({...userProfile, diagnosisDate: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 focus:border-rose-300 focus:ring-0 transition-all text-lg outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Current Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['remission', 'recovering', 'flaring'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setUserProfile({...userProfile, currentStatus: status})}
                        className={cn(
                          "py-3 rounded-xl font-bold text-xs uppercase tracking-wider border-2 transition-all",
                          userProfile.currentStatus === status 
                            ? "bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-100" 
                            : "bg-white border-slate-100 text-slate-400 hover:border-rose-200"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Your Goals</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                    <textarea
                      value={userProfile.goals}
                      onChange={(e) => setUserProfile({...userProfile, goals: e.target.value})}
                      placeholder="What are you working towards? (e.g., running a 5k, eating a salad)"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 focus:border-rose-300 focus:ring-0 transition-all min-h-[100px] text-lg outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsEditingProfile(false);
                    fetchDailyContent(userProfile);
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 transition-all text-lg flex items-center justify-center gap-2"
                >
                  {isRefreshingContent ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  Save Profile & Update Tips
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logging Modal */}
      <AnimatePresence>
        {isLogging && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogging(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 z-50 shadow-2xl max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className={cn("p-2 rounded-xl", logTypes.find(t => t.type === logType)?.color)}>
                    {React.createElement(logTypes.find(t => t.type === logType)!.icon, { className: "w-6 h-6" })}
                  </div>
                  Log {logTypes.find(t => t.type === logType)?.label}
                </h2>
                <button 
                  onClick={() => setIsLogging(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Details</label>
                  <textarea
                    autoFocus
                    value={logContent}
                    onChange={(e) => setLogContent(e.target.value)}
                    placeholder={`What did you ${logType === 'meal' ? 'eat' : logType === 'drink' ? 'drink' : logType === 'activity' ? 'do' : 'experience'}?`}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-rose-300 focus:ring-0 transition-all min-h-[120px] text-lg outline-none"
                  />
                </div>

                {logType === 'symptom' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
                      Severity: {severity}/10
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={severity}
                      onChange={(e) => setSeverity(parseInt(e.target.value))}
                      className="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                      <span>MILD</span>
                      <span>MODERATE</span>
                      <span>SEVERE</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAddLog}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 text-lg"
                >
                  <Plus className="w-6 h-6" />
                  Save Entry
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Nav / Floating Action */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <button 
          onClick={() => {
            setLogType('meal');
            setIsLogging(true);
          }}
          className="bg-rose-600 text-white p-4 rounded-full shadow-xl shadow-rose-200 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 px-6"
        >
          <Plus className="w-6 h-6" />
          <span className="font-bold">Log Activity</span>
        </button>
      </div>
    </div>
  );
}

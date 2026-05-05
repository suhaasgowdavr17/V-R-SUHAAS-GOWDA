import React from 'react';
import { 
  History, 
  IndianRupee, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Award,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { WorkEntry, UserProfile } from '../types';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { NavSection } from './Sidebar';

interface DashboardProps {
  logs: WorkEntry[];
  profile: UserProfile;
  onNavigate: (section: NavSection) => void;
}

export default function Dashboard({ logs, profile, onNavigate }: DashboardProps) {
  const totalEarnings = logs.reduce((sum, log) => sum + log.income, 0);
  const verifiedCount = logs.filter(l => l.status === 'verified').length;
  const recentLogs = logs.slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header Stat Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Verified Identity Activated</span>
            </div>
          </div>
          
          <div className="relative z-10">
            <span className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Cumulative Earnings</span>
            <h2 className="text-6xl font-bold tracking-tighter mt-1">{formatCurrency(totalEarnings)}</h2>
          </div>

          <div className="relative z-10 flex gap-6 pt-6 border-t border-white/10">
            <div className="flex-1">
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Records</span>
              <span className="text-2xl font-bold">{logs.length} <span className="text-slate-500 font-medium text-sm">Valid entries</span></span>
            </div>
            <div className="flex-1">
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Verified</span>
              <span className="text-2xl font-bold text-green-400">{verifiedCount} <span className="text-slate-500 font-medium text-sm">Approved</span></span>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/20 rounded-full blur-[80px]" />
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
           <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 relative">
             <TrendingUp className="w-12 h-12" />
             <div className="absolute -top-1 -right-1 bg-green-500 p-1.5 rounded-lg border-4 border-white">
                <CheckCircle2 className="w-4 h-4 text-white" />
             </div>
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">Trust Badge</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">Your history is building a digital proof for your future financial stability.</p>
           </div>
           <button 
            onClick={() => onNavigate('reports')}
            className="w-full py-4 rounded-full bg-slate-900 text-white font-bold text-sm tracking-tight hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
             View My Report
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-xl uppercase tracking-tight">Recent Work Log</h3>
            <button onClick={() => onNavigate('history')} className="text-orange-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
              SEE FULL LEDGER <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-5 hover:border-slate-300 transition-colors shadow-sm group">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  log.status === 'verified' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                )}>
                  <IndianRupee className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm truncate">{log.description}</h4>
                    <span className="font-bold text-slate-900">{formatCurrency(log.income)}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.15em] flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(log.date)}</span>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.15em] flex items-center gap-1"><Award className="w-3 h-3" /> {log.employerName}</span>
                  </div>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <button 
                onClick={() => onNavigate('add')}
                className="w-full bg-white border-4 border-dashed border-slate-100 rounded-[2rem] p-12 text-center group hover:border-orange-200 transition-all"
              >
                 <Plus className="w-12 h-12 text-slate-200 mx-auto group-hover:text-orange-300 transition-all mb-2" />
                 <p className="font-bold text-slate-300 uppercase tracking-widest text-sm">Add your first work entry</p>
              </button>
            )}
          </div>
        </div>

        <div className="bg-orange-600 rounded-[2.5rem] p-10 text-white relative flex flex-col justify-center gap-6 overflow-hidden">
           <div className="space-y-2 relative z-10">
              <h3 className="text-3xl font-bold tracking-tight">Need a Mini-loan?</h3>
              <p className="text-orange-100 font-medium leading-relaxed">Based on your consistent history, you qualify for 10,000 INR emergency credit.</p>
           </div>
           <button className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg w-fit shadow-2xl shadow-orange-950/20 active:scale-95 transition-transform relative z-10">
              Learn More
           </button>
           <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
           <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}

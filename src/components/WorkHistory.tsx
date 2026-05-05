import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Calendar,
  IndianRupee,
  User,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Trash2,
  Clock
} from 'lucide-react';
import { WorkEntry } from '../types';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface WorkHistoryProps {
  logs: WorkEntry[];
  onDelete: (id: string) => void;
}

export default function WorkHistory({ logs, onDelete }: WorkHistoryProps) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(search.toLowerCase()) || 
                          log.employerName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || log.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Financial Ledger</h2>
        <div className="flex items-center gap-2 px-2 bg-white rounded-2xl border border-slate-200 p-1 shadow-sm shrink-0">
          {['all', 'unverified', 'verified'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                filter === f ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search work records or contractors..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 pl-12 pr-6 py-4 rounded-3xl font-medium focus:ring-4 focus:ring-slate-100 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredLogs.map((log) => (
            <motion.div 
              key={log.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                  log.status === 'verified' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                )}>
                  <IndianRupee className="w-7 h-7" />
                </div>
                <div className="min-w-0 flex-1">
                   <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg text-slate-800 truncate">{log.description}</h4>
                    {log.status === 'verified' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-orange-400" />
                    )}
                   </div>
                   <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1">
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(log.date)}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                        <User className="w-3.5 h-3.5" /> {log.employerName}
                      </span>
                   </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-6 md:pl-0 pl-16">
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Earnt</span>
                  <span className="text-xl font-bold text-slate-900">{formatCurrency(log.income)}</span>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                      <MoreVertical className="w-5 h-5" />
                   </button>
                   {log.status !== 'verified' && (
                    <button 
                      onClick={() => log.id && onDelete(log.id)}
                      className="p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                   )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredLogs.length === 0 && (
          <div className="p-12 text-center space-y-4">
             <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <History className="w-10 h-10 text-slate-300" />
             </div>
             <div>
                <h4 className="font-bold text-slate-900 text-lg">No records found</h4>
                <p className="text-slate-400 font-medium">Try changing your filters or searching for something else.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}


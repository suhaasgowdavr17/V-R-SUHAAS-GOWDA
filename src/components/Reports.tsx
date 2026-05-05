import React from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  Share2, 
  IndianRupee,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { WorkEntry, UserProfile } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { motion } from 'motion/react';

interface ReportsProps {
  logs: WorkEntry[];
  profile: UserProfile;
}

export default function Reports({ logs, profile }: ReportsProps) {
  const verifiedLogs = logs.filter(l => l.status === 'verified');
  const totalVerifiedIncome = verifiedLogs.reduce((sum, l) => sum + l.income, 0);

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Verifiable Reports</h2>
        <button 
          onClick={handleDownload}
          className="bg-orange-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg active:scale-95"
        >
          <Download className="w-5 h-5" /> Download PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Certificate Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] p-8 border-4 border-slate-100 shadow-2xl relative overflow-hidden"
        >
          <div className="text-center space-y-4 mb-8">
            <div className="bg-orange-500 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl shadow-orange-200">
               <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold tracking-tighter">Work Identity Card</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Verified Digital Certificate</p>
          </div>

          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Worker Name</span>
              <span className="font-bold text-slate-900">{profile.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verified Income</span>
              <span className="font-bold text-slate-900">{formatCurrency(totalVerifiedIncome)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">History Since</span>
              <span className="font-bold text-slate-900">{new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold border border-green-200 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> QR VERIFIED
            </div>
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-200 flex items-center gap-1">
              <Share2 className="w-3 h-3" /> SCAN TO VIEW
            </div>
          </div>
        </motion.div>

        {/* Guidelines */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400" /> Note for Institutions
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              This report serves as a verifiable history of work performed in the informal sector. Each entry has been timestamped and potentially verified by registered contractors or via geo-location proofs.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <h4 className="font-bold">Recent Verified Milestones</h4>
            <div className="space-y-3">
              {verifiedLogs.slice(0, 3).map(log => (
                <div key={log.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="bg-green-500 p-1.5 rounded-lg text-white">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs truncate">{log.description}</p>
                    <p className="text-[10px] text-slate-400">{formatDate(log.date)} • {log.employerName}</p>
                  </div>
                  <span className="font-bold text-sm">{formatCurrency(log.income)}</span>
                </div>
              ))}
              {verifiedLogs.length === 0 && (
                <div className="text-center py-4">
                   <p className="text-xs text-slate-400 italic">No verified entries yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Plus, 
  Mic, 
  Send, 
  Clock, 
  Calendar as CalendarIcon, 
  IndianRupee, 
  User, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { extractWorkDetailsFromText } from '../services/geminiService';

interface AddEntryProps {
  onSave: (entry: any) => Promise<void>;
  isProcessing: boolean;
}

export default function AddEntry({ onSave, isProcessing }: AddEntryProps) {
  const [mode, setMode] = useState<'voice' | 'manual'>('voice');
  const [inputText, setInputText] = useState('');
  const [manualData, setManualData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    income: 0,
    employerName: '',
    location: ''
  });

  const handleAIProcess = async () => {
    if (!inputText.trim()) return;
    const extracted = await extractWorkDetailsFromText(inputText);
    if (extracted) {
      await onSave({
        date: extracted.date,
        description: extracted.description,
        income: extracted.income,
        employerName: extracted.employerName,
        status: 'unverified'
      });
      setInputText('');
    }
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...manualData,
      status: 'unverified'
    });
    setManualData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      income: 0,
      employerName: '',
      location: ''
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200">
        <button 
          onClick={() => setMode('voice')}
          className={cn(
            "flex-1 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
            mode === 'voice' ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Mic className="w-5 h-5" /> Quick AI Log
        </button>
        <button 
          onClick={() => setMode('manual')}
          className={cn(
            "flex-1 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
            mode === 'manual' ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <FileText className="w-5 h-5" /> Manual Entry
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'voice' ? (
          <motion.div 
            key="voice"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-8"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">Speak your work details</h3>
              <p className="text-slate-400 text-sm font-medium">Just tell me what you did today and how much you earned.</p>
            </div>

            <div className="relative">
              <textarea 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="E.g., Today I worked at Green Park site for 6 hours. Contractor Raj gave me 900 rupees."
                className="w-full h-40 bg-slate-50 border border-slate-200 p-6 rounded-3xl font-medium resize-none focus:ring-4 focus:ring-orange-100 transition-all outline-none"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-6 right-6 w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-sm"
              >
                <Mic className="w-7 h-7" />
              </motion.button>
            </div>

            <button 
              onClick={handleAIProcess}
              disabled={!inputText.trim() || isProcessing}
              className={cn(
                "w-full py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95",
                inputText.trim() ? "bg-orange-600 text-white shadow-xl shadow-orange-200" : "bg-slate-100 text-slate-400"
              )}
            >
              {isProcessing ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Clock className="w-6 h-6" /></motion.div>
                  Processing voice notes...
                </>
              ) : (
                <>Save Entry <Send className="w-5 h-5" /></>
              )}
            </button>
            
            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-2xl border border-blue-100 text-left">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed font-medium">
                Tip: Mention the employer name and location for better proof in your future reports.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.form 
            key="manual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleManualSave}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Work Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="date" 
                    required
                    value={manualData.date}
                    onChange={e => setManualData({...manualData, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Earnings (INR)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="number" 
                    required
                    placeholder="0"
                    value={manualData.income || ''}
                    onChange={e => setManualData({...manualData, income: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Work Description</label>
              <textarea 
                required
                placeholder="What work did you do?"
                value={manualData.description}
                onChange={e => setManualData({...manualData, description: e.target.value})}
                className="w-full h-24 bg-slate-50 border border-slate-200 p-4 rounded-2xl font-semibold resize-none outline-none focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Contractor Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Employer name"
                    value={manualData.employerName}
                    onChange={e => setManualData({...manualData, employerName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Location</label>
                <input 
                  type="text" 
                  placeholder="Where did you work?"
                  value={manualData.location}
                  onChange={e => setManualData({...manualData, location: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-4 rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-slate-100"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full bg-slate-900 text-white py-5 rounded-full font-bold text-lg hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              Confirm Log
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { WorkEntry } from '../types';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';
import { TrendingUp, IndianRupee, Calendar } from 'lucide-react';

interface AnalysisProps {
  logs: WorkEntry[];
}

export default function Analysis({ logs }: AnalysisProps) {
  // Aggregate data by month
  const monthlyData = logs.reduce((acc: any[], log) => {
    const month = new Date(log.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    if (existing) {
      existing.income += log.income;
      existing.count += 1;
    } else {
      acc.push({ name: month, income: log.income, count: 1 });
    }
    return acc;
  }, []).reverse();

  // Aggregate by employer
  const employerData = logs.reduce((acc: any[], log) => {
    const name = log.employerName || 'Direct/Unknown';
    const existing = acc.find(item => item.name === name);
    if (existing) {
      existing.value += log.income;
    } else {
      acc.push({ name, value: log.income });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#6366f1', '#f43f5e'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Work Analysis</h2>
        <div className="bg-white border border-slate-200 rounded-full px-4 py-1 flex items-center gap-2 text-sm font-medium">
          <Calendar className="w-4 h-4 text-slate-400" />
          Last 6 Months
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Income Over Time */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Earning Trends</h3>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl text-xs font-bold ring-4 ring-white/10">
                          {formatCurrency(payload[0].value as number)}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="income" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Employers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
              <IndianRupee className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Top Clients</h3>
          </div>
          <div className="h-64 mt-4 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {employerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 pr-4">
              {employerData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs font-bold text-slate-600 truncate max-w-[100px]">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold">Monthly Summary</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Month</th>
              <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Work Days</th>
              <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Total Income</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {monthlyData.map((month) => (
              <tr key={month.name} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700">{month.name}</td>
                <td className="px-6 py-4 font-semibold text-slate-500">{month.count} days</td>
                <td className="px-6 py-4 font-bold text-orange-600">{formatCurrency(month.income)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

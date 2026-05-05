import React from 'react';
import { 
  Globe, 
  Bell, 
  Shield, 
  Smartphone, 
  ChevronRight,
  Database,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Settings() {
  const sections = [
    {
      title: 'App Preferences',
      items: [
        { id: 'lang', label: 'Language', desc: 'Hindi / English / Kannada', icon: <Globe className="w-5 h-5" /> },
        { id: 'notif', label: 'Notifications', desc: 'Daily reminders to log work', icon: <Bell className="w-5 h-5" /> },
        { id: 'theme', label: 'Appearance', desc: 'System / Light / Dark', icon: <Smartphone className="w-5 h-5" /> },
      ]
    },
    {
      title: 'Security & Data',
      items: [
        { id: 'privacy', label: 'Privacy Settings', desc: 'Control who sees your history', icon: <Shield className="w-5 h-5" /> },
        { id: 'backup', label: 'Data Backup', desc: 'Export all work records', icon: <Database className="w-5 h-5" /> },
      ]
    },
    {
      title: 'About',
      items: [
        { id: 'info', label: 'Version 2.1.0', desc: 'Release notes and upcoming features', icon: <Info className="w-5 h-5" /> },
      ]
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>

      {sections.map(section => (
        <div key={section.title} className="space-y-3">
          <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-4">{section.title}</h3>
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {section.items.map((item, idx) => (
              <button 
                key={item.id}
                className={cn(
                  "w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left",
                  idx !== section.items.length - 1 && "border-b border-slate-100"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-2.5 rounded-2xl text-slate-500">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-orange-50 rounded-3xl p-6 border border-orange-200 text-center">
         <p className="text-xs text-orange-800 font-medium flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> All your data is encrypted and secure with Firebase.
         </p>
      </div>
    </div>
  );
}

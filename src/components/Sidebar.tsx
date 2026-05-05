import React from 'react';
import { 
  User, 
  BarChart3, 
  PlusCircle, 
  History, 
  FileDown, 
  Settings, 
  LogOut,
  X,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

export type NavSection = 'profile' | 'analysis' | 'add' | 'history' | 'reports' | 'settings' | 'dashboard';

interface SidebarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeSection, onNavigate, onLogout, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Summary', icon: <History className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'analysis', label: 'Analysis', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'add', label: 'Add Work', icon: <PlusCircle className="w-5 h-5" /> },
    { id: 'history', label: 'Work History', icon: <History className="w-5 h-5" /> },
    { id: 'reports', label: 'Download Report', icon: <FileDown className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ] as const;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">KaryaSetu</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id as NavSection);
                onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all text-sm",
                activeSection === item.id 
                  ? "bg-orange-50 text-orange-600 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all text-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

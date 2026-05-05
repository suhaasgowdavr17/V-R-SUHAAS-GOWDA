import React, { useState, useEffect } from 'react';
import { Menu, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

import { db, auth, loginWithGoogle, logout, OperationType, handleFirestoreError } from './lib/firebase';
import { UserProfile, WorkEntry } from './types';

// Modular Components
import Sidebar, { NavSection } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import AddEntry from './components/AddEntry';
import WorkHistory from './components/WorkHistory';
import ProfileSection from './components/Profile';
import Reports from './components/Reports';
import Settings from './components/Settings';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<WorkEntry[]>([]);
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Auth & Profile Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setLoginError(null);
        const profileRef = doc(db, 'users', u.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as UserProfile);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
        setLogs([]);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Logs Listener
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'work_entries'),
      where('workerId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkEntry));
      setLogs(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'work_entries');
    });

    return unsubscribe;
  }, [user]);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Login popup closed by user');
      } else {
        setLoginError('Login failed. Please try again.');
        console.error('Login error:', error);
      }
    }
  };

  const handleCreateProfile = async (name: string) => {
    if (!user) return;
    const newProfile: UserProfile = {
      userId: user.uid,
      name,
      skills: [],
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'users', user.uid), newProfile);
      setProfile(newProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
    }
  };

  const handleSaveEntry = async (entry: any) => {
    if (!user) return;
    setIsProcessing(true);
    try {
      await addDoc(collection(db, 'work_entries'), {
        ...entry,
        workerId: user.uid,
        createdAt: new Date().toISOString(),
      });
      setActiveSection('dashboard');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'work_entries');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteDoc(doc(db, 'work_entries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `work_entries/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-slate-600 font-medium font-sans">Connecting to KaryaSetu...</p>
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLogin={handleLogin} error={loginError} />;
  }

  if (!profile) {
    return <ProfileSetup onComplete={handleCreateProfile} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activeSection={activeSection} 
        onNavigate={setActiveSection} 
        onLogout={logout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg tracking-tight">KaryaSetu</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'dashboard' && <Dashboard logs={logs} profile={profile} onNavigate={setActiveSection} />}
              {activeSection === 'analysis' && <Analysis logs={logs} />}
              {activeSection === 'add' && <AddEntry onSave={handleSaveEntry} isProcessing={isProcessing} />}
              {activeSection === 'history' && <WorkHistory logs={logs} onDelete={handleDeleteEntry} />}
              {activeSection === 'profile' && <ProfileSection profile={profile} />}
              {activeSection === 'reports' && <Reports logs={logs} profile={profile} />}
              {activeSection === 'settings' && <Settings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ... LandingPage and ProfileSetup stay the same but moved inside App.tsx or made components
import { cn } from './lib/utils';
import { useState as localState } from 'react';

function LandingPage({ onLogin, error }: { onLogin: () => void, error: string | null }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col text-white px-8 py-12 relative overflow-hidden">
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-orange-500 w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/20">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold tracking-tighter leading-tight">Your Work,<br/><span className="text-orange-500 underline decoration-4 underline-offset-8">Your Proof.</span></h1>
          <p className="text-xl text-slate-400 font-medium max-w-xs leading-relaxed">
            Record your daily earning and build a verifiable history for loans and schemes.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 space-y-4"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          <button 
            onClick={onLogin}
            className="w-full bg-white text-slate-900 py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Get Started with Google
          </button>
          <p className="text-center text-sm text-slate-500">Fast, secure, and always free for workers.</p>
        </motion.div>
      </div>

      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-orange-600/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]" />
    </div>
  );
}

function ProfileSetup({ onComplete }: { onComplete: (name: string) => void }) {
  const [name, setName] = useState('');
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
           <h2 className="text-3xl font-bold tracking-tight">One last step!</h2>
           <p className="text-slate-500 font-medium">What should we call you on your certificates?</p>
        </div>
        <div className="space-y-6">
          <input 
            type="text" 
            placeholder="Your Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-white border border-slate-200 p-5 rounded-3xl text-xl font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-orange-500 transition-all outline-none"
          />
          <button 
            onClick={() => name.trim() && onComplete(name)}
            disabled={!name.trim()}
            className={cn(
              "w-full py-5 rounded-full font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2",
              name.trim() ? "bg-orange-600 text-white shadow-orange-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            Create My Account <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

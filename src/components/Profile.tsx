import React, { useState } from 'react';
import { User, Phone, MapPin, Briefcase, Award, CheckCircle, Plus, Edit2, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { logout } from '../lib/firebase';

interface ProfileProps {
  profile: UserProfile;
}

export default function Profile({ profile }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Profile */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-slate-100 rounded-full border-4 border-white shadow-xl flex items-center justify-center shrink-0">
            <User className="w-16 h-16 text-slate-300" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold tracking-tight">{profile.name}</h2>
            <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
              <Phone className="w-4 h-4" /> {profile.phone || 'Phone not linked'}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
              <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-2xl text-sm font-bold border border-orange-100 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Verified Worker
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4">
          <button onClick={logout} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        {/* Pattern Decoration */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-slate-400" /> Professional Skills
            </h3>
            <button className="text-orange-500 hover:text-orange-600 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.length > 0 ? profile.skills.map(skill => (
              <span key={skill} className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-xs font-bold text-slate-600">{skill}</span>
            )) : (
              <p className="text-sm text-slate-400 italic">No skills added yet.</p>
            )}
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
           <h3 className="font-bold flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-slate-400" /> Working Area
          </h3>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="font-bold text-slate-700">{profile.location || 'Location not specified'}</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Primary Region</p>
          </div>
        </div>
      </div>

      {/* Trust Score / Badge */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex items-center gap-6">
        <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center shrink-0">
          <Award className="w-10 h-10 text-orange-400" />
        </div>
        <div className="relative z-10">
          <h4 className="text-xl font-bold">Digital Trust Score</h4>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
            Your profile is currently 80% complete. Add more work entries to increase your credibility for bank loan applications.
          </p>
          <div className="w-full bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
             <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              className="bg-orange-500 h-full"
             />
          </div>
        </div>
      </div>
    </div>
  );
}

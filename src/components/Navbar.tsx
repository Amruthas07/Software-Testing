import React from 'react';
import { User } from '../types';
import { ShieldCheck, LogOut, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onSwitchUser: (role: 'user' | 'admin' | 'inspector') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onSwitchUser,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark (Display Face / Anti-Slop Compliant) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(currentUser?.role === 'user' ? 'dashboard' : 'admin-dashboard')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded bg-sky-600 flex items-center justify-center font-bold text-white text-base">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              MotoPass
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {currentUser?.role === 'user' ? (
            <>
              <button
                id="nav-link-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`transition-colors hover:text-white ${activeTab === 'dashboard' ? 'text-sky-400 font-semibold' : ''}`}
              >
                Dashboard
              </button>
              <button
                id="nav-link-vehicles"
                onClick={() => setActiveTab('vehicles')}
                className={`transition-colors hover:text-white ${activeTab === 'vehicles' ? 'text-sky-400 font-semibold' : ''}`}
              >
                Vehicles
              </button>
              <button
                id="nav-link-apply"
                onClick={() => setActiveTab('apply')}
                className={`transition-colors hover:text-white ${activeTab === 'apply' ? 'text-sky-400 font-semibold' : ''}`}
              >
                License Application
              </button>
              <button
                id="nav-link-wallet"
                onClick={() => setActiveTab('wallet')}
                className={`transition-colors hover:text-white ${activeTab === 'wallet' ? 'text-sky-400 font-semibold' : ''}`}
              >
                Digital Wallet
              </button>
            </>
          ) : (
            <>
              <button
                id="nav-link-admin-dashboard"
                onClick={() => setActiveTab('admin-dashboard')}
                className={`transition-colors hover:text-white ${activeTab === 'admin-dashboard' ? 'text-sky-400 font-semibold' : ''}`}
              >
                Inspector Console
              </button>
              <button
                id="nav-link-inspection-bay"
                onClick={() => setActiveTab('inspection')}
                className={`transition-colors hover:text-white ${activeTab === 'inspection' ? 'text-sky-400 font-semibold' : ''}`}
              >
                Inspection Bay
              </button>
            </>
          )}

          {/* Testing Laboratory Link (Accessible by all roles for lab evaluation) */}
          <button
            id="nav-link-testing-lab"
            onClick={() => setActiveTab('testing-lab')}
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${activeTab === 'testing-lab' ? 'text-amber-400 font-semibold' : 'text-slate-300'}`}
          >
            <span>Testing Lab &amp; Cases</span>
          </button>

          {/* Documentation & Syllabus Mapping */}
          <button
            id="nav-link-docs"
            onClick={() => setActiveTab('docs')}
            className={`transition-colors hover:text-white ${activeTab === 'docs' ? 'text-emerald-400 font-semibold' : ''}`}
          >
            Docs &amp; Syllabus
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions (Role Switcher & Profile / Auth) */}
        <div className="flex items-center gap-3">
          {/* Quick Persona Switcher for Examiner / Testing Lab Demo */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-800 p-1 rounded border border-slate-700 text-xs">
            <span className="text-slate-400 px-2 py-0.5">Role:</span>
            <button
              id="btn-role-citizen"
              onClick={() => onSwitchUser('user')}
              className={`px-2.5 py-1 rounded transition-colors ${currentUser?.role === 'user' ? 'bg-sky-600 text-white font-medium' : 'text-slate-300 hover:text-white'}`}
            >
              Citizen
            </button>
            <button
              id="btn-role-admin"
              onClick={() => onSwitchUser('admin')}
              className={`px-2.5 py-1 rounded transition-colors ${currentUser?.role === 'admin' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-300 hover:text-white'}`}
            >
              Admin
            </button>
            <button
              id="btn-role-inspector"
              onClick={() => onSwitchUser('inspector')}
              className={`px-2.5 py-1 rounded transition-colors ${currentUser?.role === 'inspector' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300 hover:text-white'}`}
            >
              Inspector
            </button>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentUser.fullName}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
                  <span>{currentUser.role.toUpperCase()}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{currentUser.age} yrs</span>
                </div>
              </div>
              <button
                id="btn-logout"
                onClick={onLogout}
                title="Logout session"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="tab-login"
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                id="tab-register"
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 text-xs font-medium bg-sky-600 text-white rounded hover:bg-sky-500 transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

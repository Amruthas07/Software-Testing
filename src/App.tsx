import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import {
  User,
  Vehicle,
  LicenseApplication,
  Inspection,
  LicenseResult,
  Wallet,
  Transaction,
  TestCase,
  Defect,
  TestMetrics,
} from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { VehicleRegistrationView } from './components/VehicleRegistrationView';
import { LicenseApplicationView } from './components/LicenseApplicationView';
import { InspectionView } from './components/InspectionView';
import { WalletView } from './components/WalletView';
import { TestingLabView } from './components/TestingLabView';
import { DocumentationView } from './components/DocumentationView';
import { AuthModal } from './components/AuthModal';
import { ResultCertificateModal } from './components/ResultCertificateModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(api.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core Data State
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [applications, setApplications] = useState<LicenseApplication[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [results, setResults] = useState<LicenseResult[]>([]);
  const [wallet, setWallet] = useState<Wallet>({
    userId: currentUser?.id || 'usr-demo-01',
    balance: 2000,
    currency: '₹',
    lastUpdated: new Date().toISOString(),
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [defects, setDefects] = useState<Defect[]>([]);
  const [metrics, setMetrics] = useState<TestMetrics>({
    totalTestCases: 0,
    executedTestCases: 0,
    passedTestCases: 0,
    failedTestCases: 0,
    blockedTestCases: 0,
    pendingTestCases: 0,
    defectsFound: 0,
    defectsFixed: 0,
    passPercentage: 0,
    failPercentage: 0,
    defectDensity: 0,
    inspectionPassRate: 0,
    totalApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });

  // Modal States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [activeCertificate, setActiveCertificate] = useState<LicenseResult | null>(null);
  const [appForInspection, setAppForInspection] = useState<LicenseApplication | undefined>(undefined);

  // Load all data
  const refreshData = async () => {
    try {
      const u = api.getCurrentUser();
      setCurrentUser(u);

      const [uList, v, a, r, tc, d, m, t] = await Promise.all([
        api.getAllUsers(),
        api.getVehicles(u?.role === 'user' ? u.id : undefined),
        api.getApplications(u?.role === 'user' ? u.id : undefined),
        api.getAllResults(),
        api.getTestCases(),
        api.getDefects(),
        api.getTestMetrics(),
        api.getTransactions(u?.role === 'user' ? u.id : undefined),
      ]);

      setUsers(uList);
      setVehicles(v);
      setApplications(a);
      setResults(r);
      setTestCases(tc);
      setDefects(d);
      setMetrics(m);
      setTransactions(t);

      if (u) {
        const w = await api.getWallet(u.id);
        setWallet(w);
      }
    } catch (e) {
      console.error('Failed to load portal data', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser?.id, currentUser?.role]);

  // Persona switch handler
  const handleSwitchUser = async (role: 'user' | 'admin' | 'inspector') => {
    const all = await api.getAllUsers();
    let target = all.find((u) => u.role === role);
    if (target) {
      await api.login(target.email);
      setCurrentUser(target);
      if (role === 'user') {
        setActiveTab('dashboard');
      } else {
        setActiveTab('admin-dashboard');
      }
      refreshData();
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'user') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('admin-dashboard');
    }
    refreshData();
  };

  const handleOpenInspectionFromAdmin = (app: LicenseApplication) => {
    setAppForInspection(app);
    setActiveTab('inspection');
  };

  const handleAppStatusUpdate = async (appId: string, status: LicenseApplication['status']) => {
    await api.updateApplicationStatus(appId, status);
    refreshData();
  };

  const handleQuickPay = async (app: LicenseApplication) => {
    if (!currentUser) return;
    try {
      await api.payFee(currentUser.id, app.feeAmount, app.id, `Payment for ${app.licenseType}`);
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Payment failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      
      {/* Universal Anti-Slop Top Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* User Citizen Dashboard */}
        {activeTab === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            vehicles={vehicles}
            applications={applications}
            results={results}
            wallet={wallet}
            transactions={transactions}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenCertificate={(res) => setActiveCertificate(res)}
            onQuickPay={handleQuickPay}
          />
        )}

        {/* Admin / Inspector Dashboard */}
        {activeTab === 'admin-dashboard' && currentUser && (
          <AdminDashboardView
            currentUser={currentUser}
            users={users}
            vehicles={vehicles}
            applications={applications}
            inspections={inspections}
            results={results}
            transactions={transactions}
            defects={defects}
            metrics={metrics}
            onOpenInspection={handleOpenInspectionFromAdmin}
            onOpenCertificate={(res) => setActiveCertificate(res)}
            onUpdateAppStatus={handleAppStatusUpdate}
            onNavigateToTestingLab={() => setActiveTab('testing-lab')}
          />
        )}

        {/* Vehicle Registration */}
        {activeTab === 'vehicles' && currentUser && (
          <VehicleRegistrationView
            currentUser={currentUser}
            onSuccess={(veh) => {
              refreshData();
              setActiveTab('dashboard');
            }}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {/* License Application */}
        {activeTab === 'apply' && currentUser && (
          <LicenseApplicationView
            currentUser={currentUser}
            vehicles={vehicles}
            onSuccess={(newApp) => {
              refreshData();
              setActiveTab('dashboard');
            }}
            onCancel={() => setActiveTab('dashboard')}
            onNavigateToVehicles={() => setActiveTab('vehicles')}
          />
        )}

        {/* Vehicle Inspection Module (Lab 1 & Lab 8) */}
        {activeTab === 'inspection' && currentUser && (
          <InspectionView
            currentUser={currentUser}
            applications={applications}
            selectedApp={appForInspection}
            onSuccess={(insp, result) => {
              refreshData();
              setActiveCertificate(result);
            }}
            onCancel={() => setActiveTab(currentUser.role === 'user' ? 'dashboard' : 'admin-dashboard')}
          />
        )}

        {/* Digital Wallet View (Lab 4 ATM Simulator) */}
        {activeTab === 'wallet' && currentUser && (
          <WalletView
            currentUser={currentUser}
            wallet={wallet}
            transactions={transactions}
            applications={applications}
            onWalletUpdated={refreshData}
          />
        )}

        {/* Software Testing Laboratory & Metrics Hub */}
        {activeTab === 'testing-lab' && (
          <TestingLabView
            testCases={testCases}
            defects={defects}
            metrics={metrics}
            onRefresh={refreshData}
            onNavigateToDocs={() => setActiveTab('docs')}
          />
        )}

        {/* Complete Documentation & Syllabus Repository */}
        {activeTab === 'docs' && (
          <DocumentationView />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">MotoPass</span>
            <span>·</span>
            <span>Software Testing Laboratory &amp; Case Study Portal</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>IEEE-829 Format</span>
            <span>·</span>
            <span>BVA / EP Testing</span>
            <span>·</span>
            <span>PyTest &amp; Selenium Automations</span>
            <span>·</span>
            <span>MySQL 8.0 DDL</span>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Result Certificate Modal */}
      <ResultCertificateModal
        result={activeCertificate}
        onClose={() => setActiveCertificate(null)}
      />

    </div>
  );
}

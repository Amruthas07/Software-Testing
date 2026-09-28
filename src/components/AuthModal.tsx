import React, { useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { AlertCircle, CheckCircle, ShieldAlert, ArrowRight, UserCheck, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration form state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState<string>('24');
  const [address, setAddress] = useState('');
  const [stateName, setStateName] = useState('Karnataka');
  const [cityName, setCityName] = useState('Bengaluru');

  if (!isOpen) return null;

  // Age BVA Real-time helper
  const parsedAge = parseInt(age, 10);
  const isAgeValid = !isNaN(parsedAge) && parsedAge >= 18 && parsedAge <= 60;
  let ageValidationHint = '';
  if (!isNaN(parsedAge)) {
    if (parsedAge < 18) {
      ageValidationHint = `Invalid (Age ${parsedAge} < 18): Underage. Boundary minimum is 18.`;
    } else if (parsedAge > 60) {
      ageValidationHint = `Invalid (Age ${parsedAge} > 60): Overage. Boundary maximum is 60.`;
    } else {
      ageValidationHint = `Valid (18 ≤ ${parsedAge} ≤ 60): Eligible for licensing.`;
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await api.login(loginEmail, loginPassword);
      if (res.user) {
        setSuccessMessage('Login successful. Redirecting...');
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    // Frontend pre-check (mirroring backend)
    const numAge = Number(age);
    if (isNaN(numAge) || numAge < 18) {
      setErrorMessage('Registration failed: Age must be at least 18 years old.');
      setLoading(false);
      return;
    }
    if (numAge > 60) {
      setErrorMessage('Registration failed: Age cannot exceed 60 years old.');
      setLoading(false);
      return;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.register({
        fullName,
        email: regEmail,
        mobile,
        password,
        confirmPassword,
        age: numAge,
        address,
        state: stateName,
        city: cityName,
      });

      if (res.user) {
        setSuccessMessage('Registration successful! Initial digital wallet balance of ₹2,000 credited.');
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const setBVAQuickAge = (val: number) => {
    setAge(val.toString());
  };

  const fillQuickDemo = (role: 'citizen' | 'admin' | 'inspector') => {
    if (role === 'citizen') {
      setLoginEmail('rahul.verma@example.com');
      setLoginPassword('Password@123');
    } else if (role === 'admin') {
      setLoginEmail('admin@motopass.gov');
      setLoginPassword('Admin@123');
    } else {
      setLoginEmail('inspector@motopass.gov');
      setLoginPassword('Inspector@123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {mode === 'login' ? 'Portal Authentication' : 'Citizen Registration'}
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              MotoPass Licensing &amp; Testing Evaluation System
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            id="tab-toggle-login"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${mode === 'login' ? 'border-sky-600 text-sky-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            Log In (User / Inspector / Admin)
          </button>
          <button
            id="tab-toggle-register"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${mode === 'register' ? 'border-sky-600 text-sky-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            New Citizen Registration (Age 18–60)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {errorMessage && (
            <div
              id="login-error-message"
              className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-start gap-2.5 font-medium"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div id="reg-validation-error">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-start gap-2.5 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>{successMessage}</div>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. rahul.verma@example.com or admin@motopass.gov"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Authenticating...' : 'Sign In to Portal'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Fill Demo Credentials for Examination */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="text-[11px] font-semibold text-slate-500 mb-2">
                  Testing Quick-Access Accounts:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    id="btn-demo-citizen"
                    onClick={() => fillQuickDemo('citizen')}
                    className="p-2 text-left border border-slate-200 rounded hover:border-sky-400 bg-slate-50 transition-colors"
                  >
                    <div className="text-[11px] font-semibold text-slate-800">Citizen</div>
                    <div className="text-[10px] text-slate-500 truncate">Rahul Verma (24)</div>
                  </button>

                  <button
                    type="button"
                    id="btn-demo-admin"
                    onClick={() => fillQuickDemo('admin')}
                    className="p-2 text-left border border-slate-200 rounded hover:border-indigo-400 bg-slate-50 transition-colors"
                  >
                    <div className="text-[11px] font-semibold text-slate-800">Admin</div>
                    <div className="text-[10px] text-slate-500 truncate">Vikram Sharma</div>
                  </button>

                  <button
                    type="button"
                    id="btn-demo-inspector"
                    onClick={() => fillQuickDemo('inspector')}
                    className="p-2 text-left border border-slate-200 rounded hover:border-emerald-400 bg-slate-50 transition-colors"
                  >
                    <div className="text-[11px] font-semibold text-slate-800">Inspector</div>
                    <div className="text-[10px] text-slate-500 truncate">Priya Patel</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="reg-full-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ananya Rao"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ananya.rao@example.com"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    id="reg-mobile"
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                {/* CRITICAL AGE FIELD (BVA/EP Testing) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-900">
                      Age (Years) *
                    </label>
                    <span className="text-[10px] text-slate-500">
                      18 to 60 inclusive
                    </span>
                  </div>
                  <input
                    id="reg-age"
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 24"
                    className={`w-full px-3 py-1.5 text-xs font-mono font-semibold border rounded focus:outline-none ${isAgeValid ? 'border-slate-300 focus:ring-sky-500' : 'border-rose-400 bg-rose-50/50 text-rose-800'}`}
                  />
                </div>
              </div>

              {/* Age Validation Status Callout & Quick BVA Test Points */}
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-semibold text-slate-700">Lab 3 BVA/EP Live Check:</span>
                  <span className={`font-semibold ${isAgeValid ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {ageValidationHint}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-500">Test Points:</span>
                  <button
                    type="button"
                    onClick={() => setBVAQuickAge(17)}
                    className="px-1.5 py-0.5 text-[10px] bg-rose-100 text-rose-800 rounded font-mono hover:bg-rose-200"
                    title="BVA Min - 1 (Invalid)"
                  >
                    17 (Invalid)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBVAQuickAge(18)}
                    className="px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded font-mono hover:bg-emerald-200"
                    title="BVA Min Boundary (Valid)"
                  >
                    18 (Valid)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBVAQuickAge(19)}
                    className="px-1.5 py-0.5 text-[10px] bg-slate-200 text-slate-800 rounded font-mono hover:bg-slate-300"
                    title="BVA Min + 1 (Valid)"
                  >
                    19 (Valid)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBVAQuickAge(59)}
                    className="px-1.5 py-0.5 text-[10px] bg-slate-200 text-slate-800 rounded font-mono hover:bg-slate-300"
                    title="BVA Max - 1 (Valid)"
                  >
                    59 (Valid)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBVAQuickAge(60)}
                    className="px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded font-mono hover:bg-emerald-200"
                    title="BVA Max Boundary (Valid)"
                  >
                    60 (Valid)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBVAQuickAge(61)}
                    className="px-1.5 py-0.5 text-[10px] bg-rose-100 text-rose-800 rounded font-mono hover:bg-rose-200"
                    title="BVA Max + 1 (Invalid)"
                  >
                    61 (Invalid)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    id="reg-confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address *
                </label>
                <input
                  id="reg-address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot 101, Lakeview Residency"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State *
                  </label>
                  <input
                    id="reg-state"
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    id="reg-city"
                    type="text"
                    required
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-register-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded transition-colors shadow-xs"
                >
                  {loading ? 'Validating & Creating Account...' : 'Complete Citizen Registration'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

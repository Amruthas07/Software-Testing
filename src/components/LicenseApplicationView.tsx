import React, { useState } from 'react';
import { api } from '../services/api';
import { User, Vehicle, LicenseApplication, LicenseType } from '../types';
import { FileText, AlertCircle, CheckCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

interface LicenseApplicationViewProps {
  currentUser: User;
  vehicles: Vehicle[];
  onSuccess: (newApp: LicenseApplication) => void;
  onCancel: () => void;
  onNavigateToVehicles: () => void;
}

export const LicenseApplicationView: React.FC<LicenseApplicationViewProps> = ({
  currentUser,
  vehicles,
  onSuccess,
  onCancel,
  onNavigateToVehicles,
}) => {
  const [applicantName, setApplicantName] = useState(currentUser.fullName);
  const [age, setAge] = useState<string>(currentUser.age.toString());
  const [vehicleId, setVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [licenseType, setLicenseType] = useState<LicenseType>('Four-Wheeler LMV');
  const [applicationDate, setApplicationDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [address, setAddress] = useState(currentUser.address);
  const [stateName, setStateName] = useState(currentUser.state);
  const [cityName, setCityName] = useState(currentUser.city);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Critical Age Validation Check
  const numAge = parseInt(age, 10);
  const isAgeValid = !isNaN(numAge) && numAge >= 18 && numAge <= 60;

  // Statutory Fee Calculation based on License Type
  const getFeeForType = (type: LicenseType) => {
    switch (type) {
      case 'Two-Wheeler Learner': return 250;
      case 'Two-Wheeler Permanent': return 350;
      case 'Four-Wheeler LMV': return 500;
      case 'Commercial Transport': return 800;
    }
  };

  const statutoryFee = getFeeForType(licenseType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    // CRITICAL AGE VALIDATION
    if (isNaN(numAge) || numAge < 18) {
      setErrorMessage('Application rejected: Applicant must be at least 18 years old.');
      setLoading(false);
      return;
    }
    if (numAge > 60) {
      setErrorMessage('Application rejected: Applicant cannot exceed 60 years old.');
      setLoading(false);
      return;
    }

    if (!vehicleId) {
      setErrorMessage('Please select a registered vehicle for the road test.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.createApplication({
        userId: currentUser.id,
        applicantName: applicantName.trim(),
        age: numAge,
        vehicleId,
        licenseType,
        applicationDate,
        address: address.trim(),
        state: stateName.trim(),
        city: cityName.trim(),
      });

      if (res.application) {
        setSuccessMessage('Application submitted successfully! Application Status set to "Submitted".');
        setTimeout(() => {
          onSuccess(res.application!);
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit license application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-sky-600 flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Driving License Application
              </h1>
              <div className="text-xs text-slate-400">
                Form 4 - Application for Driving License with Mandatory Age Eligibility Verification
              </div>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>{successMessage}</div>
            </div>
          )}

          {vehicles.length === 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-center justify-between">
              <div>
                <strong>Notice:</strong> You must register a motor vehicle before scheduling an inspection.
              </div>
              <button
                type="button"
                onClick={onNavigateToVehicles}
                className="px-3 py-1 bg-amber-600 text-white font-semibold rounded text-xs hover:bg-amber-700"
              >
                + Register Vehicle First
              </button>
            </div>
          )}

          {/* Applicant Name & Critical Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Applicant Legal Name *
              </label>
              <input
                id="app-applicant-name"
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-900">
                  Applicant Age (Years) *
                </label>
                <span className="text-[10px] text-slate-500">Allowed: 18 - 60</span>
              </div>
              <input
                id="app-age"
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={`w-full px-3 py-2 text-xs font-mono font-bold border rounded focus:outline-none ${isAgeValid ? 'border-slate-300 focus:ring-sky-500 text-slate-900' : 'border-rose-400 bg-rose-50 text-rose-800'}`}
              />
              {!isAgeValid && (
                <div className="text-[11px] text-rose-600 mt-1 font-medium">
                  {numAge < 18 ? 'Underage: Age must be at least 18 years old.' : 'Overage: Age cannot exceed 60 years old.'}
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Selection & License Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Test Vehicle *
              </label>
              <select
                id="app-vehicle-select"
                required
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white font-mono"
              >
                {vehicles.length === 0 ? (
                  <option value="">No vehicles available</option>
                ) : (
                  vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vehicleNumber} ({v.brand} {v.model} - {v.vehicleType})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                License Category / Type *
              </label>
              <select
                id="app-license-type"
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value as LicenseType)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
              >
                <option value="Four-Wheeler LMV">Four-Wheeler LMV (Motor Car)</option>
                <option value="Two-Wheeler Permanent">Two-Wheeler Permanent (Motorcycle)</option>
                <option value="Two-Wheeler Learner">Two-Wheeler Learner</option>
                <option value="Commercial Transport">Commercial Transport (Heavy Goods)</option>
              </select>
            </div>
          </div>

          {/* Application Date & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Date
              </label>
              <input
                id="app-date"
                type="date"
                required
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                required
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Residential Address *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Statutory Fee Callout */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Statutory License Examination Fee
              </div>
              <div className="text-[11px] text-slate-500">
                Payable via Simulated Digital Wallet after application submission
              </div>
            </div>
            <div className="text-base font-bold font-mono text-slate-900">
              ₹{statutoryFee}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-application"
              type="submit"
              disabled={loading || !isAgeValid || vehicles.length === 0}
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 disabled:cursor-not-allowed rounded transition-colors shadow-xs"
            >
              {loading ? 'Submitting...' : 'Submit License Application'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

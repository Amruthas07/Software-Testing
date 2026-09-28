import React, { useState } from 'react';
import { api } from '../services/api';
import { User, LicenseApplication, InspectionComponent, Inspection, LicenseResult } from '../types';
import {
  Wrench,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  ArrowLeft,
  Award,
} from 'lucide-react';

interface InspectionViewProps {
  currentUser: User;
  applications: LicenseApplication[];
  selectedApp?: LicenseApplication;
  onSuccess: (inspection: Inspection, result: LicenseResult) => void;
  onCancel: () => void;
}

const DEFAULT_COMPONENTS: InspectionComponent[] = [
  { name: 'Brakes', score: 18, maxScore: 20, remarks: 'Hydraulic line pressure 120 bar; ABS tested.' },
  { name: 'Lights', score: 17, maxScore: 20, remarks: 'Headlights, high-beam, brake illumination clear.' },
  { name: 'Tyres', score: 16, maxScore: 20, remarks: 'Tread depth 4.8mm; pressure 32 PSI across all 4.' },
  { name: 'Engine', score: 19, maxScore: 20, remarks: 'No oil leaks; emissions pass BS-VI standards.' },
  { name: 'Safety Equipment', score: 18, maxScore: 20, remarks: 'Reflective triangle, seatbelts, first aid kit.' },
];

export const InspectionView: React.FC<InspectionViewProps> = ({
  currentUser,
  applications,
  selectedApp,
  onSuccess,
  onCancel,
}) => {
  const [activeAppId, setActiveAppId] = useState<string>(
    selectedApp?.id || applications[0]?.id || ''
  );
  const [inspectionDate, setInspectionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [components, setComponents] = useState<InspectionComponent[]>([...DEFAULT_COMPONENTS]);
  
  const [calculationResult, setCalculationResult] = useState<{
    totalPoints: number;
    totalComponents: number;
    averageScore: number;
    error?: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const currentApp = applications.find((a) => a.id === activeAppId);

  // Score Updater
  const handleScoreChange = (index: number, newScoreStr: string) => {
    const val = parseFloat(newScoreStr) || 0;
    const clamped = Math.max(0, Math.min(val, components[index].maxScore));
    const updated = [...components];
    updated[index].score = clamped;
    setComponents(updated);
    setCalculationResult(null); // Clear previous calc so user recalculates or sees update
  };

  const handleRemarkChange = (index: number, text: string) => {
    const updated = [...components];
    updated[index].remarks = text;
    setComponents(updated);
  };

  const handleRemoveComponent = (index: number) => {
    const updated = components.filter((_, i) => i !== index);
    setComponents(updated);
    setCalculationResult(null);
  };

  const handleAddComponent = () => {
    setComponents([
      ...components,
      { name: `Auxiliary Check ${components.length + 1}`, score: 15, maxScore: 20, remarks: 'General inspection' },
    ]);
    setCalculationResult(null);
  };

  // LAB 1 DIVISION BY ZERO SPECIAL TESTER
  const handleTriggerLab1ZeroComponents = () => {
    setComponents([]);
    // Run calculation immediately on 0 components to demonstrate safe error handling
    const res = api.calculateInspectionScore([]);
    setCalculationResult(res);
  };

  const handleResetStandardComponents = () => {
    setComponents([...DEFAULT_COMPONENTS]);
    setCalculationResult(null);
    setErrorMessage('');
  };

  // Interactive Calculate Button (Lab 1 formula)
  const handleCalculateScore = () => {
    setErrorMessage('');
    const calc = api.calculateInspectionScore(components);
    setCalculationResult(calc);
    if (calc.error) {
      setErrorMessage(calc.error);
    }
  };

  // Submit Final Inspection Record (Lab 8: White-Box Logic >= 70 Pass)
  const handleSubmitInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    if (!currentApp) {
      setErrorMessage('Please select a valid license application for inspection.');
      setLoading(false);
      return;
    }

    // Must calculate first if not done
    const calc = calculationResult || api.calculateInspectionScore(components);
    if (calc.error) {
      setErrorMessage(calc.error);
      setLoading(false);
      return;
    }

    try {
      const res = await api.performInspection({
        applicationId: currentApp.id,
        vehicleId: currentApp.vehicleId,
        inspectorId: currentUser.id,
        inspectorName: currentUser.fullName,
        inspectionDate,
        components,
      });

      if (res.inspection && res.result) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onSuccess(res.inspection!, res.result!);
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Inspection recording failed.');
    } finally {
      setLoading(false);
    }
  };

  // Derive projected status if components are present
  const liveTotal = components.reduce((acc, c) => acc + (Number(c.score) || 0), 0);
  const liveProjectedStatus = liveTotal >= 70 ? 'PASSED' : 'FAILED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-sky-600 flex items-center justify-center text-white">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Vehicle Inspection Bay &amp; Scoring Engine
            </h1>
            <div className="text-xs text-slate-300">
              Lab 1 (Division-by-Zero) &amp; Lab 8 (White-Box Pass Threshold $\ge 70$) Testing Module
            </div>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Bay
        </button>
      </div>

      {/* Main Inspection Form Card */}
      <form onSubmit={handleSubmitInspection} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        
        {errorMessage && (
          <div
            id="insp-calc-error-banner"
            className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-3 font-medium"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Inspection Calculation Notice:</div>
              <div>{errorMessage}</div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-start gap-3 font-medium">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>{successMessage}</div>
          </div>
        )}

        {/* Application Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Candidate License Application *
            </label>
            <select
              id="insp-app-select"
              value={activeAppId}
              onChange={(e) => {
                setActiveAppId(e.target.value);
                setCalculationResult(null);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white font-medium"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  #{app.id} - {app.applicantName} ({app.licenseType} | {app.vehicleNumber}) [{app.status}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Official Inspection Date
            </label>
            <input
              type="date"
              required
              value={inspectionDate}
              onChange={(e) => setInspectionDate(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Lab 1 Testing Sandbox Controls */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Lab 1: Division-by-Zero Corner Case Testing</span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Formula: <code>Average = Total Points / Total Components</code>. Verify zero-division safety.
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              id="btn-test-lab1-zero-components"
              onClick={handleTriggerLab1ZeroComponents}
              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold rounded border border-rose-200 transition-colors"
              title="Remove all components to test division-by-zero"
            >
              Test 0 Components (Lab 1)
            </button>
            <button
              type="button"
              onClick={handleResetStandardComponents}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset 5 Components
            </button>
          </div>
        </div>

        {/* 5 Components Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Component Scoring Table ({components.length} components available)
            </h2>
            <button
              type="button"
              onClick={handleAddComponent}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Component
            </button>
          </div>

          {components.length === 0 ? (
            <div className="p-8 text-center bg-rose-50/50 border border-dashed border-rose-300 rounded-lg">
              <div className="text-sm font-bold text-rose-900">
                0 Inspection Components Available
              </div>
              <div className="text-xs text-rose-700 mt-1 max-w-md mx-auto">
                Triggered Lab 1 Division-by-Zero condition. Click &quot;Calculate Average Score&quot; to verify that the application returns the expected error message rather than crashing with an unhandled exception.
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-100 px-4 py-2 text-[11px] font-bold text-slate-700 uppercase">
                <div className="col-span-3">Component</div>
                <div className="col-span-2 text-center">Score (Max 20)</div>
                <div className="col-span-6">Inspector Diagnostic Remarks</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              {components.map((comp, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center px-4 py-2.5 gap-2 hover:bg-slate-50/60">
                  <div className="col-span-3 text-xs font-semibold text-slate-900">
                    {comp.name}
                  </div>
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <input
                      id={`insp-score-${idx}`}
                      type="number"
                      min="0"
                      max={comp.maxScore}
                      value={comp.score}
                      onChange={(e) => handleScoreChange(idx, e.target.value)}
                      className="w-16 px-2 py-1 text-xs font-mono font-bold text-center border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-400 font-mono">/ 20</span>
                  </div>
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={comp.remarks || ''}
                      onChange={(e) => handleRemarkChange(idx, e.target.value)}
                      placeholder="Enter mechanical or diagnostic notes..."
                      className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Remove component"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calculation Summary Bar */}
        <div className="p-4 bg-slate-900 text-white rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total Points</div>
              <div className="text-xl font-bold font-mono text-white">
                {components.reduce((acc, c) => acc + (Number(c.score) || 0), 0)} / {components.length * 20}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total Components</div>
              <div className="text-xl font-bold font-mono text-sky-400">
                {components.length}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Average Score</div>
              <div className="text-xl font-bold font-mono text-amber-400">
                {calculationResult
                  ? calculationResult.error
                    ? 'ERR: 0 Comp'
                    : `${calculationResult.averageScore} / 20`
                  : components.length > 0
                  ? `${(components.reduce((acc, c) => acc + (Number(c.score) || 0), 0) / components.length).toFixed(2)} / 20`
                  : 'N/A'}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Lab 8 Result Logic</div>
              <div className={`text-base font-bold tracking-tight ${liveProjectedStatus === 'PASSED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {components.length > 0 ? (liveTotal >= 70 ? 'PASSED (≥ 70)' : 'FAILED (< 70)') : 'CANNOT EVALUATE'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-calculate-inspection"
              type="button"
              onClick={handleCalculateScore}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 transition-colors"
            >
              Calculate Average Score
            </button>
            <button
              id="btn-submit-inspection"
              type="submit"
              disabled={loading || components.length === 0}
              className="px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded transition-colors shadow-xs"
            >
              {loading ? 'Recording...' : 'Finalize & Record Result'}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};

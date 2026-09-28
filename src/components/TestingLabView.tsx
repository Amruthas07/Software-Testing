import React, { useState } from 'react';
import { api } from '../services/api';
import { TestCase, Defect, TestMetrics, TestStatus, TestSeverity } from '../types';
import {
  FlaskConical,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bug,
  BarChart3,
  GitBranch,
  Terminal,
  FileCode,
  ShieldAlert,
  Search,
  Plus,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface TestingLabViewProps {
  testCases: TestCase[];
  defects: Defect[];
  metrics: TestMetrics;
  onRefresh: () => void;
  onNavigateToDocs: () => void;
}

export const TestingLabView: React.FC<TestingLabViewProps> = ({
  testCases,
  defects,
  metrics,
  onRefresh,
  onNavigateToDocs,
}) => {
  const [activeLabSubTab, setActiveLabSubTab] = useState<
    'test-cases' | 'metrics' | 'bva-ep' | 'white-box' | 'defects' | 'selenium'
  >('test-cases');

  const [filterModule, setFilterModule] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [executing, setExecuting] = useState(false);

  // Lab 3 BVA Interactive Tester State
  const [testAgeInput, setTestAgeInput] = useState<string>('18');
  const [bvaResult, setBvaResult] = useState<{
    valid: boolean;
    partition: string;
    bvaTag: string;
    message: string;
  } | null>(null);

  // Lab 8 White-Box Interactive Tester State
  const [wbScoreInput, setWbScoreInput] = useState<number>(70);
  const [wbExecutionResult, setWbExecutionResult] = useState<{
    score: number;
    branchTaken: 'Branch A (Score >= 70)' | 'Branch B (Score < 70)';
    status: 'PASSED' | 'FAILED';
    statementCoverage: string;
    branchCoverage: string;
  } | null>(null);

  // New Defect Modal State
  const [showDefectModal, setShowDefectModal] = useState(false);
  const [defectModule, setDefectModule] = useState('Payment Wallet');
  const [defectDesc, setDefectDesc] = useState('');
  const [defectSeverity, setDefectSeverity] = useState<TestSeverity>('Major');
  const [defectPriority, setDefectPriority] = useState<Defect['priority']>('P2');
  const [defectSteps, setDefectSteps] = useState('');
  const [defectExpected, setDefectExpected] = useState('');
  const [defectActual, setDefectActual] = useState('');
  const [defectAssignee, setDefectAssignee] = useState('QA Engineer');

  // Filtered Test Cases
  const filteredTestCases = testCases.filter((tc) => {
    if (filterModule !== 'ALL' && tc.module !== filterModule) return false;
    if (filterStatus !== 'ALL' && tc.status !== filterStatus) return false;
    return true;
  });

  // Execute single test case
  const handleExecuteSingleTest = async (id: string) => {
    await api.executeTestCase(id);
    onRefresh();
  };

  // Execute all test cases (Lab 2/6/7 runner)
  const handleExecuteAll = async () => {
    setExecuting(true);
    await api.executeAllTestCases();
    setTimeout(() => {
      onRefresh();
      setExecuting(false);
    }, 600);
  };

  // Lab 3 BVA Evaluator
  const evaluateAgeBVA = (ageVal: number) => {
    const age = Number(ageVal);
    let valid = false;
    let partition = '';
    let bvaTag = '';
    let message = '';

    if (age < 18) {
      valid = false;
      partition = 'Invalid Partition 1 (Age < 18)';
      bvaTag = age === 17 ? 'BVA Boundary: Min - 1 (17)' : `Underage (${age})`;
      message = 'Registration rejected: Age must be at least 18 years old.';
    } else if (age > 60) {
      valid = false;
      partition = 'Invalid Partition 2 (Age > 60)';
      bvaTag = age === 61 ? 'BVA Boundary: Max + 1 (61)' : `Overage (${age})`;
      message = 'Registration rejected: Age cannot exceed 60 years old.';
    } else {
      valid = true;
      partition = 'Valid Partition (18 <= Age <= 60)';
      if (age === 18) bvaTag = 'BVA Boundary: Exact Min (18)';
      else if (age === 19) bvaTag = 'BVA Boundary: Min + 1 (19)';
      else if (age === 59) bvaTag = 'BVA Boundary: Max - 1 (59)';
      else if (age === 60) bvaTag = 'BVA Boundary: Exact Max (60)';
      else bvaTag = `Nominal Interior (${age})`;
      message = 'Registration accepted: Valid age within statutory boundaries.';
    }

    setBvaResult({ valid, partition, bvaTag, message });
  };

  // Lab 8 White-Box Evaluator
  const evaluateWhiteBoxScore = (score: number) => {
    const isPass = score >= 70;
    setWbExecutionResult({
      score,
      branchTaken: isPass ? 'Branch A (Score >= 70)' : 'Branch B (Score < 70)',
      status: isPass ? 'PASSED' : 'FAILED',
      statementCoverage: isPass
        ? 'Lines 1-3 Executed: status = "PASSED", application = "Approved"'
        : 'Lines 4-6 Executed: status = "FAILED", application = "Rejected"',
      branchCoverage: 'Branch Condition Evaluated True/False Deterministically',
    });
  };

  // Create Defect Handler
  const handleCreateDefect = (e: React.FormEvent) => {
    e.preventDefault();
    api.createDefect({
      module: defectModule,
      description: defectDesc,
      severity: defectSeverity,
      priority: defectPriority,
      stepsToReproduce: defectSteps,
      expectedResult: defectExpected,
      actualResult: defectActual,
      status: 'Open',
      assignedTo: defectAssignee,
    });
    setShowDefectModal(false);
    setDefectDesc('');
    setDefectSteps('');
    setDefectExpected('');
    setDefectActual('');
    onRefresh();
  };

  const handleUpdateDefectStatus = (id: string, status: Defect['status']) => {
    api.updateDefectStatus(id, status);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      
      {/* Testing Workbench Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Software Testing Laboratory &amp; Case Study Workbench
            </h1>
            <div className="text-xs text-slate-300">
              Interactive Examination Hub for Labs 1 through 9, IEEE-829, BVA, White-Box &amp; Defect Tracking
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-execute-all-tests"
            onClick={handleExecuteAll}
            disabled={executing}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {executing ? 'Executing Test Suite...' : 'Execute All Test Cases'}
          </button>
          <button
            onClick={onNavigateToDocs}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <span>IEEE-829 Syllabus</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Lab Navigation Segmented Tabs */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs overflow-x-auto text-xs font-semibold">
        <button
          id="tab-sub-testcases"
          onClick={() => setActiveLabSubTab('test-cases')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${activeLabSubTab === 'test-cases' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Lab 13: Test Case Management ({testCases.length})
        </button>
        <button
          id="tab-sub-metrics"
          onClick={() => setActiveLabSubTab('metrics')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${activeLabSubTab === 'metrics' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Lab 6 &amp; 7: Test Metrics Dashboard
        </button>
        <button
          id="tab-sub-bva"
          onClick={() => setActiveLabSubTab('bva-ep')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${activeLabSubTab === 'bva-ep' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Lab 3 &amp; 8: Age BVA &amp; EP Sandbox
        </button>
        <button
          id="tab-sub-whitebox"
          onClick={() => setActiveLabSubTab('white-box')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${activeLabSubTab === 'white-box' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Lab 8: White-Box Coverage (Score $\ge 70$)
        </button>
        <button
          id="tab-sub-defects"
          onClick={() => setActiveLabSubTab('defects')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${activeLabSubTab === 'defects' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Lab 5: Defect Tracker ({defects.length})
        </button>
        <button
          id="tab-sub-selenium"
          onClick={() => setActiveLabSubTab('selenium')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${activeLabSubTab === 'selenium' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Lab 2 &amp; 9: Selenium Automation
        </button>
      </div>

      {/* ----------------- SUB-TAB 1: TEST CASES MANAGEMENT (LAB 13) ----------------- */}
      {activeLabSubTab === 'test-cases' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Laboratory Test Cases Specification
              </h2>
              <div className="text-xs text-slate-500">
                Mapped to syllabus requirements: Age BVA, EP, ATM Black-Box, Zero-Division, White-Box &amp; E2E Integration
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none bg-white font-medium"
              >
                <option value="ALL">All Modules</option>
                <option value="User Registration">User Registration</option>
                <option value="Vehicle Inspection">Vehicle Inspection</option>
                <option value="Payment Wallet">Payment Wallet</option>
                <option value="License Result System">License Result System</option>
                <option value="End-to-End Workflow">End-to-End Workflow</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none bg-white font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5">Code</th>
                  <th className="py-2.5">Module</th>
                  <th className="py-2.5">Scenario / Technique</th>
                  <th className="py-2.5">Test Data</th>
                  <th className="py-2.5">Expected Result</th>
                  <th className="py-2.5 text-center">Severity</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTestCases.map((tc) => (
                  <tr key={tc.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-mono font-bold text-slate-900">{tc.code}</td>
                    <td className="py-3 text-slate-600 font-medium">{tc.module}</td>
                    <td className="py-3">
                      <div className="font-semibold text-slate-800">{tc.scenario}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Technique: {tc.technique}</div>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-indigo-700 font-medium">
                      {tc.testData}
                    </td>
                    <td className="py-3 text-slate-600 text-[11px] max-w-xs">{tc.expectedResult}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tc.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        tc.severity === 'Major' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {tc.severity}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tc.status === 'Passed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        tc.status === 'Failed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {tc.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleExecuteSingleTest(tc.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                        title="Execute this test case now"
                      >
                        Run
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 2: TEST METRICS DASHBOARD (LAB 6 & 7) ----------------- */}
      {activeLabSubTab === 'metrics' && (
        <div className="space-y-6">
          {/* Key Formula Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-semibold uppercase">Total Test Cases</div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 mt-2">
                {metrics.totalTestCases}
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                <span>Executed: <strong className="font-mono">{metrics.executedTestCases}</strong></span>
                <span>Pending: <strong className="font-mono">{metrics.pendingTestCases}</strong></span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-semibold uppercase">Pass Percentage</div>
              <div className="text-3xl font-extrabold font-mono text-emerald-600 mt-2">
                {metrics.passPercentage}%
              </div>
              <div className="text-[11px] text-slate-500 mt-2 font-mono">
                Formula: (Passed / Executed) &times; 100
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-semibold uppercase">Fail Percentage</div>
              <div className="text-3xl font-extrabold font-mono text-rose-600 mt-2">
                {metrics.failPercentage}%
              </div>
              <div className="text-[11px] text-slate-500 mt-2 font-mono">
                Formula: (Failed / Executed) &times; 100
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-semibold uppercase">Defect Density &amp; Fix Rate</div>
              <div className="text-3xl font-extrabold font-mono text-indigo-600 mt-2">
                {metrics.defectsFixed} / {metrics.defectsFound}
              </div>
              <div className="text-[11px] text-slate-500 mt-2 font-mono">
                Density: {metrics.defectDensity} defects / test
              </div>
            </div>

          </div>

          {/* Visual Execution Bar */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Test Execution Breakdown
            </h3>
            
            <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden flex">
              <div
                style={{ width: `${(metrics.passedTestCases / (metrics.totalTestCases || 1)) * 100}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Passed: ${metrics.passedTestCases}`}
              />
              <div
                style={{ width: `${(metrics.failedTestCases / (metrics.totalTestCases || 1)) * 100}%` }}
                className="bg-rose-500 h-full transition-all"
                title={`Failed: ${metrics.failedTestCases}`}
              />
              <div
                style={{ width: `${(metrics.blockedTestCases / (metrics.totalTestCases || 1)) * 100}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Blocked: ${metrics.blockedTestCases}`}
              />
              <div
                style={{ width: `${(metrics.pendingTestCases / (metrics.totalTestCases || 1)) * 100}%` }}
                className="bg-slate-300 h-full transition-all"
                title={`Pending: ${metrics.pendingTestCases}`}
              />
            </div>

            <div className="flex items-center gap-6 text-xs font-semibold flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Passed: <strong className="font-mono">{metrics.passedTestCases}</strong> ({metrics.passPercentage}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span>Failed: <strong className="font-mono">{metrics.failedTestCases}</strong> ({metrics.failPercentage}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Blocked: <strong className="font-mono">{metrics.blockedTestCases}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span>Pending: <strong className="font-mono">{metrics.pendingTestCases}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 3: AGE BVA & EP SANDBOX (LAB 3 & 8) ----------------- */}
      {activeLabSubTab === 'bva-ep' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Lab 3 &amp; Lab 8: Age Field Boundary Value Analysis (BVA) &amp; Equivalence Partitioning (EP)
            </h2>
            <div className="text-xs text-slate-500 mt-1">
              Statutory Age Rule: <strong>18 to 60 inclusive</strong>. Test boundaries: 17, 18, 19, 59, 60, 61.
            </div>
          </div>

          {/* Interactive Age Testing Sandbox */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div className="text-xs font-bold text-slate-800">
              Interactive Age Evaluator:
            </div>

            <div className="flex items-center gap-3 max-w-md">
              <input
                id="interactive-bva-age-input"
                type="number"
                value={testAgeInput}
                onChange={(e) => {
                  setTestAgeInput(e.target.value);
                  evaluateAgeBVA(Number(e.target.value));
                }}
                className="w-28 px-3 py-2 text-sm font-mono font-bold border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                placeholder="Age"
              />
              <button
                type="button"
                onClick={() => evaluateAgeBVA(Number(testAgeInput))}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded shadow-xs"
              >
                Evaluate Age Condition
              </button>
            </div>

            {/* Quick Test Points */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 font-semibold">Quick BVA Points:</span>
              {[
                { val: 17, label: '17 (Min - 1)', color: 'bg-rose-100 text-rose-800 hover:bg-rose-200' },
                { val: 18, label: '18 (Exact Min)', color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' },
                { val: 19, label: '19 (Min + 1)', color: 'bg-slate-200 text-slate-800 hover:bg-slate-300' },
                { val: 59, label: '59 (Max - 1)', color: 'bg-slate-200 text-slate-800 hover:bg-slate-300' },
                { val: 60, label: '60 (Exact Max)', color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' },
                { val: 61, label: '61 (Max + 1)', color: 'bg-rose-100 text-rose-800 hover:bg-rose-200' },
              ].map((pt) => (
                <button
                  key={pt.val}
                  type="button"
                  onClick={() => {
                    setTestAgeInput(pt.val.toString());
                    evaluateAgeBVA(pt.val);
                  }}
                  className={`px-2.5 py-1 text-xs font-mono font-semibold rounded ${pt.color} transition-colors`}
                >
                  {pt.label}
                </button>
              ))}
            </div>

            {/* Evaluation Result Banner */}
            {bvaResult && (
              <div className={`p-4 rounded-lg border text-xs space-y-1 ${bvaResult.valid ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                <div className="font-bold flex items-center gap-2">
                  <span>{bvaResult.valid ? 'CONDITION MET: VALID' : 'CONDITION VIOLATED: INVALID'}</span>
                  <span className="font-mono text-[11px] font-normal">[{bvaResult.bvaTag}]</span>
                </div>
                <div className="text-[11px]">Partition: <strong>{bvaResult.partition}</strong></div>
                <div className="text-[11px] opacity-90">{bvaResult.message}</div>
              </div>
            )}
          </div>

          {/* Reference BVA Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5">Test Case ID</th>
                  <th className="py-2.5">Technique</th>
                  <th className="py-2.5">Input Age</th>
                  <th className="py-2.5">Boundary Condition</th>
                  <th className="py-2.5">Equivalence Partition</th>
                  <th className="py-2.5 text-center">Expected Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">TC-AGE-001</td>
                  <td className="py-2.5 font-sans">BVA</td>
                  <td className="py-2.5 text-rose-600 font-bold">17</td>
                  <td className="py-2.5 font-sans text-slate-600">Min - 1</td>
                  <td className="py-2.5 font-sans text-rose-700">Invalid Partition (Age &lt; 18)</td>
                  <td className="py-2.5 text-center font-sans font-bold text-rose-700">Reject (422)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">TC-AGE-002</td>
                  <td className="py-2.5 font-sans">BVA</td>
                  <td className="py-2.5 text-emerald-600 font-bold">18</td>
                  <td className="py-2.5 font-sans text-slate-600">Min Boundary</td>
                  <td className="py-2.5 font-sans text-emerald-700">Valid Partition (18 &le; Age &le; 60)</td>
                  <td className="py-2.5 text-center font-sans font-bold text-emerald-700">Accept (201)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">TC-AGE-003</td>
                  <td className="py-2.5 font-sans">BVA</td>
                  <td className="py-2.5 text-emerald-600 font-bold">19</td>
                  <td className="py-2.5 font-sans text-slate-600">Min + 1</td>
                  <td className="py-2.5 font-sans text-emerald-700">Valid Partition</td>
                  <td className="py-2.5 text-center font-sans font-bold text-emerald-700">Accept (201)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">TC-AGE-004</td>
                  <td className="py-2.5 font-sans">BVA</td>
                  <td className="py-2.5 text-emerald-600 font-bold">59</td>
                  <td className="py-2.5 font-sans text-slate-600">Max - 1</td>
                  <td className="py-2.5 font-sans text-emerald-700">Valid Partition</td>
                  <td className="py-2.5 text-center font-sans font-bold text-emerald-700">Accept (201)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">TC-AGE-005</td>
                  <td className="py-2.5 font-sans">BVA</td>
                  <td className="py-2.5 text-emerald-600 font-bold">60</td>
                  <td className="py-2.5 font-sans text-slate-600">Max Boundary</td>
                  <td className="py-2.5 font-sans text-emerald-700">Valid Partition</td>
                  <td className="py-2.5 text-center font-sans font-bold text-emerald-700">Accept (201)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">TC-AGE-006</td>
                  <td className="py-2.5 font-sans">BVA</td>
                  <td className="py-2.5 text-rose-600 font-bold">61</td>
                  <td className="py-2.5 font-sans text-slate-600">Max + 1</td>
                  <td className="py-2.5 font-sans text-rose-700">Invalid Partition (Age &gt; 60)</td>
                  <td className="py-2.5 text-center font-sans font-bold text-rose-700">Reject (422)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 4: WHITE-BOX COVERAGE (LAB 8) ----------------- */}
      {activeLabSubTab === 'white-box' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Lab 8: White-Box Statement &amp; Branch Coverage Analyzer
            </h2>
            <div className="text-xs text-slate-500 mt-1">
              Target Decision Logic: <code>IF score &gt;= 70 THEN status = &quot;PASSED&quot; ELSE status = &quot;FAILED&quot;</code>
            </div>
          </div>

          {/* Interactive Score Branch Evaluator */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div className="text-xs font-bold text-slate-800">
              Interactive Branch Tester:
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                value={wbScoreInput}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWbScoreInput(val);
                  evaluateWhiteBoxScore(val);
                }}
                className="w-24 px-3 py-2 text-sm font-mono font-bold border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => evaluateWhiteBoxScore(wbScoreInput)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded shadow-xs"
              >
                Execute Code Branch
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 font-semibold">White-Box Test Points:</span>
              {[
                { val: 70, label: 'Score = 70 (True Boundary)', desc: 'PASS' },
                { val: 69, label: 'Score = 69 (False Boundary)', desc: 'FAIL' },
                { val: 100, label: 'Score = 100 (Max Extreme)', desc: 'PASS' },
                { val: 0, label: 'Score = 0 (Min Extreme)', desc: 'FAIL' },
              ].map((pt) => (
                <button
                  key={pt.val}
                  type="button"
                  onClick={() => {
                    setWbScoreInput(pt.val);
                    evaluateWhiteBoxScore(pt.val);
                  }}
                  className="px-2.5 py-1 text-xs font-mono font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded transition-colors"
                >
                  {pt.label}
                </button>
              ))}
            </div>

            {wbExecutionResult && (
              <div className={`p-4 rounded-lg border text-xs space-y-2 ${wbExecutionResult.status === 'PASSED' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                <div className="font-bold flex items-center justify-between">
                  <span>Branch Result: {wbExecutionResult.branchTaken}</span>
                  <span className="text-sm font-extrabold">{wbExecutionResult.status}</span>
                </div>
                <div className="font-mono text-[11px] bg-white/70 p-2 rounded border border-slate-200">
                  {wbExecutionResult.statementCoverage}
                </div>
              </div>
            )}
          </div>

          {/* Visual Branch Control Flow Diagram */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 font-mono text-xs">
            <div className="text-slate-400 font-sans text-xs font-bold uppercase tracking-wider">
              Control Flow Graph &amp; Coverage Metrics
            </div>
            <pre className="text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
{`    [Decision Node]  --->  if (total_points >= 70)
                                 /                \\
                       [True Branch]            [False Branch]
                             v                        v
                  status = "PASSED"        status = "FAILED"
                  app = "Approved"         app = "Rejected"
                             \\                        /
                              v                      v
                       [Merge Node: Persist Result in Database]`}
            </pre>
            <div className="text-slate-300 text-[11px] font-sans pt-2 border-t border-slate-800 flex items-center justify-between">
              <span>Statement Coverage: <strong>100% (All statements visited)</strong></span>
              <span>Branch Coverage: <strong>100% (Both True and False edges traversed)</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 5: DEFECT TRACKER (LAB 5) ----------------- */}
      {activeLabSubTab === 'defects' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Defect Tracking System (Lab 5)
              </h2>
              <div className="text-xs text-slate-500">
                Log and monitor defects across the licensing pipeline lifecycle
              </div>
            </div>

            <button
              onClick={() => setShowDefectModal(true)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Log New Defect
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5">Defect ID</th>
                  <th className="py-2.5">Module</th>
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5 text-center">Severity</th>
                  <th className="py-2.5 text-center">Priority</th>
                  <th className="py-2.5">Assigned To</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {defects.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-mono font-bold text-slate-900">{d.defectId}</td>
                    <td className="py-3 font-semibold text-slate-700">{d.module}</td>
                    <td className="py-3 max-w-sm text-slate-800">
                      <div>{d.description}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                        Expected: {d.expectedResult}
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        d.severity === 'Major' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {d.severity}
                      </span>
                    </td>
                    <td className="py-3 text-center font-mono font-bold text-slate-800">
                      {d.priority}
                    </td>
                    <td className="py-3 text-slate-600">{d.assignedTo}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.status === 'Closed' ? 'bg-slate-100 text-slate-600' :
                        d.status === 'Fixed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        d.status === 'In Progress' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={d.status}
                        onChange={(e) => handleUpdateDefectStatus(d.id, e.target.value as Defect['status'])}
                        className="px-2 py-1 text-[11px] border border-slate-300 rounded focus:outline-none bg-white font-medium"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Fixed">Fixed</option>
                        <option value="Retest">Retest</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 6: SELENIUM AUTOMATION (LAB 2 & 9) ----------------- */}
      {activeLabSubTab === 'selenium' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Lab 2 &amp; Lab 9: Selenium Automation &amp; Predictable Selectors
            </h2>
            <div className="text-xs text-slate-500 mt-1">
              Workflow: Open application &rarr; Login &rarr; Dashboard &rarr; License Application &rarr; Enter Age &rarr; Submit &rarr; Inspection &rarr; Payment &rarr; Result
            </div>
          </div>

          {/* Predictable Selectors Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Verified Automation Selectors (Predictable DOM IDs)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px]">
                <div className="font-bold text-slate-900 font-sans mb-1">Authentication Module:</div>
                <div>id=&quot;login-email&quot;</div>
                <div>id=&quot;login-password&quot;</div>
                <div>id=&quot;btn-login-submit&quot;</div>
                <div>id=&quot;reg-age&quot; (BVA 18-60)</div>
                <div>id=&quot;btn-register-submit&quot;</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px]">
                <div className="font-bold text-slate-900 font-sans mb-1">Licensing &amp; Inspection:</div>
                <div>id=&quot;app-applicant-name&quot;</div>
                <div>id=&quot;app-age&quot;</div>
                <div>id=&quot;btn-submit-application&quot;</div>
                <div>id=&quot;btn-calculate-inspection&quot;</div>
                <div>id=&quot;btn-submit-inspection&quot;</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px]">
                <div className="font-bold text-slate-900 font-sans mb-1">Digital Wallet:</div>
                <div>id=&quot;wallet-balance-amount&quot;</div>
                <div>id=&quot;wallet-custom-pay-amount&quot;</div>
                <div>id=&quot;btn-wallet-pay-now&quot;</div>
                <div>id=&quot;btn-test-atm-sufficient&quot;</div>
                <div>id=&quot;btn-test-atm-insufficient&quot;</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px]">
                <div className="font-bold text-slate-900 font-sans mb-1">Vehicle Registry:</div>
                <div>id=&quot;veh-number&quot;</div>
                <div>id=&quot;veh-type&quot;</div>
                <div>id=&quot;veh-brand&quot;</div>
                <div>id=&quot;btn-register-vehicle&quot;</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Selenium Python Script Reference (/tests/test_selenium.py)</span>
              <span className="text-emerald-400">IEEE-829 Compatible</span>
            </div>
            <pre className="text-emerald-400 overflow-x-auto text-[11px] font-mono leading-relaxed max-h-48 p-2 bg-slate-950 rounded">
{`# Automated 9-Step Selenium Workflow
driver.find_element(By.ID, "login-email").send_keys("rahul.verma@example.com")
driver.find_element(By.ID, "login-password").send_keys("Password@123")
driver.find_element(By.ID, "btn-login-submit").click()

# Verify Dashboard Welcome
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "dashboard-welcome")))

# Automate License Application with BVA Age Validation
age_field = driver.find_element(By.ID, "reg-age")
age_field.clear()
age_field.send_keys("17") # Expect Validation Error
driver.find_element(By.ID, "btn-register-submit").click()`}
            </pre>
          </div>
        </div>
      )}

      {/* Log Defect Modal */}
      {showDefectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Log New Software Defect (Lab 5)
              </h2>
              <button
                onClick={() => setShowDefectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateDefect} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Module *</label>
                  <select
                    value={defectModule}
                    onChange={(e) => setDefectModule(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none bg-white"
                  >
                    <option value="Payment Wallet">Payment Wallet</option>
                    <option value="Vehicle Inspection">Vehicle Inspection</option>
                    <option value="User Registration">User Registration</option>
                    <option value="License Application">License Application</option>
                    <option value="Admin Reports">Admin Reports</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity *</label>
                  <select
                    value={defectSeverity}
                    onChange={(e) => setDefectSeverity(e.target.value as TestSeverity)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none bg-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="Major">Major</option>
                    <option value="Medium">Medium</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Defect Description *</label>
                <input
                  type="text"
                  required
                  value={defectDesc}
                  onChange={(e) => setDefectDesc(e.target.value)}
                  placeholder="e.g. Wallet balance becomes negative under concurrent debits"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Steps to Reproduce *</label>
                <textarea
                  required
                  rows={2}
                  value={defectSteps}
                  onChange={(e) => setDefectSteps(e.target.value)}
                  placeholder="1. Step one... 2. Step two..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Result *</label>
                  <input
                    type="text"
                    required
                    value={defectExpected}
                    onChange={(e) => setDefectExpected(e.target.value)}
                    placeholder="e.g. Return error message"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Actual Result *</label>
                  <input
                    type="text"
                    required
                    value={defectActual}
                    onChange={(e) => setDefectActual(e.target.value)}
                    placeholder="e.g. Server returned 500 error"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDefectModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 border border-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded shadow-xs"
                >
                  Record Defect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

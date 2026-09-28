import React from 'react';
import { User, Vehicle, LicenseApplication, LicenseResult, Wallet, Transaction } from '../types';
import {
  Car,
  FileCheck2,
  Wallet as WalletIcon,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  vehicles: Vehicle[];
  applications: LicenseApplication[];
  results: LicenseResult[];
  wallet: Wallet;
  transactions: Transaction[];
  onNavigate: (tab: string) => void;
  onOpenCertificate: (result: LicenseResult) => void;
  onQuickPay: (application: LicenseApplication) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  vehicles,
  applications,
  results,
  wallet,
  transactions,
  onNavigate,
  onOpenCertificate,
  onQuickPay,
}) => {
  // Derive primary active application & result
  const activeApp = applications[0];
  const activeResult = activeApp ? results.find(r => r.applicationId === activeApp.id) : undefined;
  const pendingPaymentApp = applications.find(a => a.paymentStatus === 'UNPAID');

  const getStatusBadge = (status: LicenseApplication['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'Under Inspection':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Under Inspection
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            <Clock className="w-3.5 h-3.5" /> Submitted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Verified Citizen Profile</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">ID: {currentUser.id}</span>
          </div>
          <h1 id="dashboard-welcome" className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {currentUser.fullName}
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-600 mt-1.5 flex-wrap">
            <span>Age: <strong className="font-mono tabular-nums">{currentUser.age} yrs</strong> (Valid: 18-60)</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.city}, {currentUser.state}</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.mobile}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-dash-new-vehicle"
            onClick={() => onNavigate('vehicles')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-slate-600" />
            Register Vehicle
          </button>
          <button
            id="btn-dash-apply-license"
            onClick={() => onNavigate('apply')}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded transition-colors shadow-xs flex items-center gap-1.5"
          >
            Apply for License
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Status Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Application Status Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
            <span>License Application</span>
            <FileCheck2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {activeApp ? activeApp.licenseType : 'No Active Application'}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">Status:</span>
            {activeApp ? getStatusBadge(activeApp.status) : <span className="text-xs text-slate-400">None</span>}
          </div>
        </div>

        {/* Inspection Score Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
            <span>Inspection Score</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {activeResult ? `${activeResult.totalScore}/100` : 'Pending'}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Avg Component:</span>
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              {activeResult ? `${activeResult.averageScore} / 20` : '—'}
            </span>
          </div>
        </div>

        {/* License Result Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
            <span>Test Evaluation Result</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center gap-2">
            {activeResult ? (
              <span className={`text-xl font-bold tracking-tight ${activeResult.status === 'PASSED' ? 'text-emerald-700' : 'text-rose-700'}`}>
                {activeResult.status}
              </span>
            ) : (
              <span className="text-sm font-semibold text-slate-500">Awaiting Bay Test</span>
            )}
          </div>
          <div className="mt-2">
            {activeResult ? (
              <button
                id="btn-view-certificate"
                onClick={() => onOpenCertificate(activeResult)}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 underline flex items-center gap-1"
              >
                View Official Result Certificate
              </button>
            ) : (
              <span className="text-[11px] text-slate-400">Inspection required (Pass threshold ≥ 70)</span>
            )}
          </div>
        </div>

        {/* Digital Wallet Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
            <span>Simulated Wallet Balance</span>
            <WalletIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <div id="wallet-balance-amount" className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            ₹{wallet.balance.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">ATM Rules Active</span>
            <button
              onClick={() => onNavigate('wallet')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Open Wallet &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* Unpaid Fee Alert Banner (if applicable) */}
      {pendingPaymentApp && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-900">
                Action Required: Unpaid Application Fee
              </div>
              <div className="text-xs text-amber-800 mt-0.5">
                License application <strong>#{pendingPaymentApp.id}</strong> ({pendingPaymentApp.licenseType}) has a pending statutory fee of ₹{pendingPaymentApp.feeAmount}.
              </div>
            </div>
          </div>
          <button
            id="btn-quick-pay-fee"
            onClick={() => onQuickPay(pendingPaymentApp)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded transition-colors shadow-xs shrink-0"
          >
            Pay ₹{pendingPaymentApp.feeAmount} from Wallet
          </button>
        </div>
      )}

      {/* Two Column Layout: Vehicles & Application History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Registered Vehicles */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Registered Vehicles ({vehicles.length})
              </h2>
              <div className="text-xs text-slate-500">Vehicles tied to your transport profile</div>
            </div>
            <button
              onClick={() => onNavigate('vehicles')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              + Add Vehicle
            </button>
          </div>

          {vehicles.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded border border-dashed border-slate-300">
              No vehicles registered yet. Register a vehicle before applying for a driving test.
            </div>
          ) : (
            <div className="divide-y divide-slate-100" id="registered-vehicles-container">
              {vehicles.map((v) => (
                <div key={v.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center text-slate-700">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 font-mono">
                        {v.vehicleNumber}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {v.brand} {v.model} · {v.vehicleType} · {v.fuelType} ({v.manufacturingYear})
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {v.ownerName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application & Inspection History */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Application History
              </h2>
              <div className="text-xs text-slate-500">Track licensing lifecycle status</div>
            </div>
            <button
              onClick={() => onNavigate('apply')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              Apply New
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded border border-dashed border-slate-300">
              No license applications found. Start an application to schedule an inspection.
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const res = results.find(r => r.applicationId === app.id);
                return (
                  <div key={app.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{app.licenseType}</span>
                        {getStatusBadge(app.status)}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>Veh: <strong className="font-mono">{app.vehicleNumber}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Date: {app.applicationDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>Fee: ₹{app.feeAmount} ({app.paymentStatus})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {res && (
                        <button
                          onClick={() => onOpenCertificate(res)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
                        >
                          Certificate
                        </button>
                      )}
                      {app.paymentStatus === 'UNPAID' && (
                        <button
                          onClick={() => onQuickPay(app)}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded"
                        >
                          Pay ₹{app.feeAmount}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Recent Payment Transactions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Digital Wallet Transactions
            </h2>
            <div className="text-xs text-slate-500">Replicating ATM withdrawal boundary rules (Lab 4)</div>
          </div>
          <button
            onClick={() => onNavigate('wallet')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700"
          >
            View Full Ledger
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5">TX Reference</th>
                <th className="py-2.5">Description</th>
                <th className="py-2.5">Type</th>
                <th className="py-2.5 text-right">Amount</th>
                <th className="py-2.5 text-right">Balance After</th>
                <th className="py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {transactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 text-slate-600">{tx.id}</td>
                  <td className="py-2.5 font-sans text-slate-800">{tx.description}</td>
                  <td className="py-2.5 font-sans">
                    <span className={tx.type === 'CREDIT_TOPUP' ? 'text-emerald-700' : 'text-slate-700'}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`py-2.5 text-right tabular-nums font-semibold ${tx.type === 'CREDIT_TOPUP' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'CREDIT_TOPUP' ? '+' : '-'}₹{tx.amount}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-slate-600">
                    ₹{tx.balanceAfter}
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

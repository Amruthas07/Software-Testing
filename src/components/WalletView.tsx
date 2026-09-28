import React, { useState } from 'react';
import { api } from '../services/api';
import { User, Wallet, Transaction, LicenseApplication } from '../types';
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  CreditCard,
  ShieldCheck,
  RefreshCw,
  Coins,
} from 'lucide-react';

interface WalletViewProps {
  currentUser: User;
  wallet: Wallet;
  transactions: Transaction[];
  applications: LicenseApplication[];
  onWalletUpdated: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  currentUser,
  wallet,
  transactions,
  applications,
  onWalletUpdated,
}) => {
  const [payAmount, setPayAmount] = useState<string>('500');
  const [topUpAmount, setTopUpAmount] = useState<string>('1000');
  const [selectedAppId, setSelectedAppId] = useState<string>(
    applications.find(a => a.paymentStatus === 'UNPAID')?.id || ''
  );
  
  const [loading, setLoading] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    details?: string;
  } | null>(null);

  const pendingApps = applications.filter(a => a.paymentStatus === 'UNPAID');

  const handlePay = async (customFee?: number, customDesc?: string) => {
    setStatusFeedback(null);
    setLoading(true);

    const feeToPay = customFee !== undefined ? customFee : parseFloat(payAmount);

    try {
      const res = await api.payFee(
        currentUser.id,
        feeToPay,
        selectedAppId || undefined,
        customDesc || `License fee debit: ₹${feeToPay}`
      );
      setStatusFeedback({
        type: 'success',
        message: res.message,
        details: `Transaction ID: ${res.transaction?.id} · Remaining Balance: ₹${res.balance}`,
      });
      onWalletUpdated();
    } catch (err: any) {
      setStatusFeedback({
        type: 'error',
        message: err.message || 'Payment transaction rejected.',
        details: 'Lab 4 Invariant Enforced: Wallet balance cannot become negative.',
      });
      onWalletUpdated(); // update to show failed transaction in ledger
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    setStatusFeedback(null);
    setLoading(true);
    const amount = parseFloat(topUpAmount);

    try {
      const res = await api.topUpWallet(currentUser.id, amount);
      setStatusFeedback({
        type: 'success',
        message: res.message,
        details: `Credited ₹${amount} via Bank Direct Debit`,
      });
      onWalletUpdated();
    } catch (err: any) {
      setStatusFeedback({
        type: 'error',
        message: err.message || 'Top-up failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Wallet Banner Card */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Coins className="w-4 h-4" />
            <span>Digital Payment Wallet (Lab 4 ATM Simulator)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Account Balance: <span id="wallet-balance-amount" className="font-mono text-white text-3xl font-extrabold">₹{wallet.balance.toLocaleString()}</span>
          </h1>
          <div className="text-xs text-slate-300 mt-1.5 flex items-center gap-2">
            <span>Owner: <strong>{currentUser.fullName}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Non-negative invariant guarantee active</span>
          </div>
        </div>

        {/* Quick Top-Up Box */}
        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
          <input
            id="wallet-topup-input"
            type="number"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            className="w-24 px-2.5 py-1.5 text-xs font-mono font-bold bg-slate-900 text-white border border-slate-600 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
            placeholder="Amount"
          />
          <button
            id="btn-wallet-topup"
            onClick={handleTopUp}
            disabled={loading}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Top Up Balance
          </button>
        </div>
      </div>

      {/* Lab 4 Black-Box ATM Test Matrix Sandbox */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Lab 4: Black-Box Testing Matrix (ATM Withdrawal Equivalent)
            </h2>
            <span className="text-xs text-slate-500">
              Interactive Test Case Trigger
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Click any black-box test scenario below to execute the transaction and verify boundary handling:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Test 1: Balance > Fee */}
          <button
            type="button"
            id="btn-test-atm-sufficient"
            onClick={() => handlePay(500, 'TC-WAL-001: Balance > Fee (Sufficient Funds)')}
            className="p-3 text-left bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors group"
          >
            <div className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-900">
              1. Balance &gt; Fee
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">
              Pay ₹500 (Sufficient)
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-2">
              Expected: Success
            </div>
          </button>

          {/* Test 2: Balance = Fee */}
          <button
            type="button"
            id="btn-test-atm-exact"
            onClick={() => handlePay(wallet.balance, 'TC-WAL-002: Balance = Fee (Exact Zero Balance)')}
            className="p-3 text-left bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors group"
          >
            <div className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-900">
              2. Balance = Fee
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">
              Pay Exact ₹{wallet.balance}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-2">
              Expected: Success (₹0)
            </div>
          </button>

          {/* Test 3: Balance < Fee */}
          <button
            type="button"
            id="btn-test-atm-insufficient"
            onClick={() => handlePay(wallet.balance + 1000, 'TC-WAL-003: Balance < Fee (Insufficient Balance)')}
            className="p-3 text-left bg-slate-50 hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 rounded-lg transition-colors group"
          >
            <div className="text-[11px] font-bold text-slate-800 group-hover:text-rose-900">
              3. Balance &lt; Fee
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">
              Pay ₹{wallet.balance + 1000} (Excess)
            </div>
            <div className="text-[10px] text-rose-700 font-semibold mt-2">
              Expected: Insufficient
            </div>
          </button>

          {/* Test 4: Fee = 0 */}
          <button
            type="button"
            id="btn-test-atm-zero"
            onClick={() => handlePay(0, 'TC-WAL-004: Fee = 0 (Zero Amount Check)')}
            className="p-3 text-left bg-slate-50 hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 rounded-lg transition-colors group"
          >
            <div className="text-[11px] font-bold text-slate-800 group-hover:text-rose-900">
              4. Fee = ₹0
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">
              Pay ₹0.00
            </div>
            <div className="text-[10px] text-rose-700 font-semibold mt-2">
              Expected: Invalid Amount
            </div>
          </button>

          {/* Test 5: Fee < 0 */}
          <button
            type="button"
            id="btn-test-atm-negative"
            onClick={() => handlePay(-200, 'TC-WAL-005: Fee < 0 (Negative Amount Check)')}
            className="p-3 text-left bg-slate-50 hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 rounded-lg transition-colors group"
          >
            <div className="text-[11px] font-bold text-slate-800 group-hover:text-rose-900">
              5. Negative Fee
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">
              Pay -₹200.00
            </div>
            <div className="text-[10px] text-rose-700 font-semibold mt-2">
              Expected: Invalid Amount
            </div>
          </button>

        </div>

        {/* Live Feedback Banner */}
        {statusFeedback && (
          <div
            id="wallet-status-feedback"
            className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
              statusFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {statusFeedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold">{statusFeedback.message}</div>
              {statusFeedback.details && (
                <div className="text-[11px] mt-0.5 opacity-90">{statusFeedback.details}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Manual Payment Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          Custom Fee Settlement
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Unpaid License Application
            </label>
            <select
              id="wallet-app-select"
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
            >
              <option value="">No application selected / General</option>
              {pendingApps.map((a) => (
                <option key={a.id} value={a.id}>
                  #{a.id} - {a.licenseType} (Fee: ₹{a.feeAmount})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Amount (₹) *
            </label>
            <input
              id="wallet-custom-pay-amount"
              type="number"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
              placeholder="e.g. 500"
            />
          </div>

          <div className="flex items-end">
            <button
              id="btn-wallet-pay-now"
              onClick={() => handlePay()}
              disabled={loading}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded transition-colors shadow-xs"
            >
              {loading ? 'Processing Debit...' : 'Pay via Digital Wallet'}
            </button>
          </div>
        </div>
      </div>

      {/* Complete Transaction Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Transaction Audit Trail ({transactions.length} entries)
            </h2>
            <div className="text-xs text-slate-500">
              Immutable ledger of all digital wallet credit and debit activities
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5">TX ID</th>
                <th className="py-2.5">Timestamp</th>
                <th className="py-2.5">Description</th>
                <th className="py-2.5">Type</th>
                <th className="py-2.5 text-right">Debit / Credit</th>
                <th className="py-2.5 text-right">Balance After</th>
                <th className="py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50">
                  <td className="py-3 text-slate-600">{tx.id}</td>
                  <td className="py-3 text-[11px] text-slate-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 font-sans text-slate-800">{tx.description}</td>
                  <td className="py-3 font-sans text-slate-600">{tx.type}</td>
                  <td className={`py-3 text-right tabular-nums font-bold ${tx.type === 'CREDIT_TOPUP' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'CREDIT_TOPUP' ? '+' : '-'}₹{tx.amount}
                  </td>
                  <td className="py-3 text-right tabular-nums text-slate-700">
                    ₹{tx.balanceAfter}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
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

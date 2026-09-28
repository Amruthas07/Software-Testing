import React, { useState } from 'react';
import {
  User,
  Vehicle,
  LicenseApplication,
  Inspection,
  LicenseResult,
  Transaction,
  Defect,
  TestMetrics,
} from '../types';
import {
  Users,
  Car,
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Wrench,
  Award,
  Wallet,
  Bug,
  ShieldCheck,
  Eye,
} from 'lucide-react';

interface AdminDashboardViewProps {
  currentUser: User;
  users: User[];
  vehicles: Vehicle[];
  applications: LicenseApplication[];
  inspections: Inspection[];
  results: LicenseResult[];
  transactions: Transaction[];
  defects: Defect[];
  metrics: TestMetrics;
  onOpenInspection: (app: LicenseApplication) => void;
  onOpenCertificate: (result: LicenseResult) => void;
  onUpdateAppStatus: (appId: string, status: LicenseApplication['status']) => void;
  onNavigateToTestingLab: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  users,
  vehicles,
  applications,
  inspections,
  results,
  transactions,
  defects,
  metrics,
  onOpenInspection,
  onOpenCertificate,
  onUpdateAppStatus,
  onNavigateToTestingLab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubTab, setSelectedSubTab] = useState<'applications' | 'vehicles' | 'users' | 'transactions'>('applications');

  // Filtered queries
  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.mobile.includes(searchTerm)
  );

  const filteredApplications = applications.filter(
    (a) =>
      a.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingInspectionsCount = applications.filter(a => a.status === 'Submitted' || a.status === 'Under Inspection').length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;
  const passedInspectionsCount = results.filter(r => r.status === 'PASSED').length;
  const failedInspectionsCount = results.filter(r => r.status === 'FAILED').length;
  const totalRevenue = transactions.filter(t => t.type === 'DEBIT_LICENSE_FEE' && t.status === 'SUCCESS').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
            {currentUser.role === 'admin' ? 'Administrative Controller Console' : 'Senior Vehicle Inspector Console'}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Motor Transport Licensing &amp; Inspection Authority
          </h1>
          <div className="text-xs text-slate-300 mt-1 flex items-center gap-3">
            <span>Inspector Officer: <strong>{currentUser.fullName}</strong></span>
            <span aria-hidden="true">·</span>
            <span>RTO Division: Central Testing Command</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToTestingLab}
            className="px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Bug className="w-4 h-4" />
            Inspect Testing Metrics &amp; Labs
          </button>
        </div>
      </div>

      {/* High-Density Statistical Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium">Total Citizens</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">{users.length}</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium">Total Vehicles</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">{vehicles.length}</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium">Pending Inspections</div>
          <div className="text-xl font-bold font-mono text-amber-600 mt-1">{pendingInspectionsCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium">Approved / Passed</div>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1">{approvedCount} / {passedInspectionsCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium">Rejected / Failed</div>
          <div className="text-xl font-bold font-mono text-rose-600 mt-1">{rejectedCount} / {failedInspectionsCount}</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium">Collected Fees</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">₹{totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Search & Sub-Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setSelectedSubTab('applications')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${selectedSubTab === 'applications' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Applications Queue ({applications.length})
            </button>
            <button
              onClick={() => setSelectedSubTab('vehicles')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${selectedSubTab === 'vehicles' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Vehicles Registry ({vehicles.length})
            </button>
            <button
              onClick={() => setSelectedSubTab('users')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${selectedSubTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Citizen Users ({users.length})
            </button>
            <button
              onClick={() => setSelectedSubTab('transactions')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${selectedSubTab === 'transactions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Transactions
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="admin-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, plate, ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tab 1: Applications Queue */}
        {selectedSubTab === 'applications' && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5">App ID</th>
                  <th className="py-2.5">Applicant Name</th>
                  <th className="py-2.5">Age</th>
                  <th className="py-2.5">Vehicle Plate</th>
                  <th className="py-2.5">License Type</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Inspection Score</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((app) => {
                  const res = results.find(r => r.applicationId === app.id);
                  const insp = inspections.find(i => i.applicationId === app.id);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-mono text-slate-600">{app.id}</td>
                      <td className="py-3 font-semibold text-slate-900">{app.applicantName}</td>
                      <td className="py-3 font-mono tabular-nums">{app.age} yrs</td>
                      <td className="py-3 font-mono text-slate-700">{app.vehicleNumber}</td>
                      <td className="py-3 text-slate-700">{app.licenseType}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono tabular-nums">
                        {insp ? (
                          <span className={`font-bold ${insp.totalPoints >= 70 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {insp.totalPoints}/100 ({insp.totalPoints >= 70 ? 'PASS' : 'FAIL'})
                          </span>
                        ) : (
                          <span className="text-slate-400">Not Conducted</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`btn-inspect-app-${app.id}`}
                            onClick={() => onOpenInspection(app)}
                            className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded border border-sky-200 flex items-center gap-1"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            {insp ? 'Re-inspect' : 'Conduct Inspection'}
                          </button>
                          {res && (
                            <button
                              onClick={() => onOpenCertificate(res)}
                              className="px-2 py-1 text-xs text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-300"
                              title="View Result Certificate"
                            >
                              <Award className="w-3.5 h-3.5 text-indigo-600" />
                            </button>
                          )}
                          <button
                            onClick={() => onUpdateAppStatus(app.id, app.status === 'Approved' ? 'Rejected' : 'Approved')}
                            className="px-2 py-1 text-xs text-slate-500 hover:text-slate-900 border border-slate-200 rounded"
                            title="Toggle override status"
                          >
                            Override
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Vehicle Registry */}
        {selectedSubTab === 'vehicles' && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5">Vehicle Number</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Make &amp; Model</th>
                  <th className="py-2.5">Mfg Year</th>
                  <th className="py-2.5">Fuel Type</th>
                  <th className="py-2.5">Owner Name</th>
                  <th className="py-2.5">Owner ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-mono font-bold text-slate-900">{v.vehicleNumber}</td>
                    <td className="py-3 text-slate-700">{v.vehicleType}</td>
                    <td className="py-3 text-slate-800">{v.brand} {v.model}</td>
                    <td className="py-3 font-mono tabular-nums text-slate-600">{v.manufacturingYear}</td>
                    <td className="py-3 text-slate-700">{v.fuelType}</td>
                    <td className="py-3 font-semibold text-slate-900">{v.ownerName}</td>
                    <td className="py-3 font-mono text-[11px] text-slate-500">{v.userId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Citizen Users */}
        {selectedSubTab === 'users' && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5">User ID</th>
                  <th className="py-2.5">Full Name</th>
                  <th className="py-2.5">Email</th>
                  <th className="py-2.5">Mobile</th>
                  <th className="py-2.5">Age (BVA Status)</th>
                  <th className="py-2.5">Role</th>
                  <th className="py-2.5">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-mono text-slate-600">{u.id}</td>
                    <td className="py-3 font-semibold text-slate-900">{u.fullName}</td>
                    <td className="py-3 text-slate-700">{u.email}</td>
                    <td className="py-3 font-mono text-slate-600">{u.mobile}</td>
                    <td className="py-3 font-mono tabular-nums">
                      <span className="font-bold text-emerald-700">{u.age} yrs</span> (Valid)
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        u.role === 'inspector' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{u.city}, {u.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Transactions */}
        {selectedSubTab === 'transactions' && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5">TX ID</th>
                  <th className="py-2.5">User ID</th>
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Balance After</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 text-slate-600">{tx.id}</td>
                    <td className="py-2.5 text-slate-600">{tx.userId}</td>
                    <td className="py-2.5 font-sans text-slate-800">{tx.description}</td>
                    <td className="py-2.5 tabular-nums font-semibold text-slate-900">₹{tx.amount}</td>
                    <td className="py-2.5 tabular-nums text-slate-600">₹{tx.balanceAfter}</td>
                    <td className="py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-[11px] text-slate-500">{new Date(tx.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

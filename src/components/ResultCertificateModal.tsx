import React from 'react';
import { LicenseResult } from '../types';
import { Award, CheckCircle2, XCircle, X, Printer, ShieldCheck } from 'lucide-react';

interface ResultCertificateModalProps {
  result: LicenseResult | null;
  onClose: () => void;
}

export const ResultCertificateModal: React.FC<ResultCertificateModalProps> = ({
  result,
  onClose,
}) => {
  if (!result) return null;

  const isPassed = result.status === 'PASSED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        
        {/* Certificate Border Header */}
        <div className={`p-6 text-white text-center ${isPassed ? 'bg-slate-900 border-b-4 border-emerald-500' : 'bg-slate-900 border-b-4 border-rose-500'}`}>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 flex items-center justify-center mb-3">
            {isPassed ? (
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-400" />
            )}
          </div>

          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            Ministry of Road Transport &amp; Highways
          </div>
          <h2 className="text-xl font-bold tracking-tight mt-0.5">
            Official Driving &amp; Vehicle Inspection Result
          </h2>
          <div className="text-xs text-slate-400 mt-1">
            Certificate Ref: <span className="font-mono text-slate-200">{result.id}</span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 space-y-5">
          
          {/* Big Status Badge */}
          <div className={`p-4 rounded-xl text-center ${isPassed ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'}`}>
            <div className="text-xs font-semibold uppercase tracking-wider">Evaluation Outcome</div>
            <div className="text-3xl font-black tracking-tight mt-0.5">
              {result.status}
            </div>
            <div className="text-xs font-medium mt-1">
              {isPassed ? 'Score exceeds 70-point statutory benchmark' : 'Score below 70-point statutory benchmark'}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-sans">Total Score</div>
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                {result.totalScore} / 100
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-sans">Avg Component</div>
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                {result.averageScore} / 20
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-sans">App Status</div>
              <div className={`text-base font-bold font-sans ${isPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
                {result.applicationStatus}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-sans">Date</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">
                {result.inspectionDate}
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="text-xs space-y-2.5 divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500">Applicant Legal Name:</span>
              <span className="font-bold text-slate-900">{result.applicantName}</span>
            </div>
            <div className="flex items-center justify-between pt-2.5">
              <span className="text-slate-500">Test Vehicle Plate:</span>
              <span className="font-mono font-bold text-slate-900">{result.vehicleNumber}</span>
            </div>
            <div className="flex items-center justify-between pt-2.5">
              <span className="text-slate-500">Authorized Inspector:</span>
              <span className="font-medium text-slate-800">{result.inspector}</span>
            </div>
            <div className="pt-2.5">
              <span className="text-slate-500 block mb-1">Inspector Diagnostic Remarks:</span>
              <p className="text-slate-700 italic bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] leading-relaxed">
                &ldquo;{result.remarks}&rdquo;
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Evaluated at: {new Date(result.evaluatedAt).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print Certificate
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

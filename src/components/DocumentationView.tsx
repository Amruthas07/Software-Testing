import React, { useState } from 'react';
import {
  BookOpen,
  FileCode2,
  Database,
  Terminal,
  CheckCircle,
  Copy,
  Download,
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [docTab, setDocTab] = useState<'syllabus' | 'fastapi' | 'mysql' | 'pytest' | 'selenium'>('syllabus');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-emerald-600 flex items-center justify-center text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Software Testing Curriculum &amp; Project Repository
            </h1>
            <div className="text-xs text-slate-300">
              Complete Documentation Mapped to Labs 1 through 9, Final Case Study, and Viva Voce
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {copied && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Copied to clipboard!
            </span>
          )}
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setDocTab('syllabus')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${docTab === 'syllabus' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          22-Part Syllabus Mapping &amp; IEEE-829 Test Plan
        </button>
        <button
          onClick={() => setDocTab('fastapi')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${docTab === 'fastapi' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          FastAPI Backend (Python)
        </button>
        <button
          onClick={() => setDocTab('mysql')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${docTab === 'mysql' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          MySQL Schema DDL (11 Tables)
        </button>
        <button
          onClick={() => setDocTab('pytest')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${docTab === 'pytest' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          PyTest Suite (BVA/EP/ATM/White-Box)
        </button>
        <button
          onClick={() => setDocTab('selenium')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${docTab === 'selenium' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Selenium Automation Script (Python)
        </button>
      </div>

      {/* Content Panes */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        
        {docTab === 'syllabus' && (
          <div className="prose prose-slate max-w-none text-xs space-y-6">
            
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-2">
                1. Project Introduction &amp; Objectives
              </h2>
              <p className="text-slate-700 leading-relaxed">
                <strong>MotoPass</strong> is a full-stack vehicle licensing, mechanical inspection scoring, and digital fee transaction portal engineered specifically for academic software testing laboratory evaluation.
                It provides complete coverage for:
              </p>
              <ul className="list-disc pl-5 text-slate-700 space-y-1 mt-2">
                <li><strong>Lab 1</strong>: Division by Zero Corner Case Error Handling ($Average = Total Points / Total Components$, handling $0$ components).</li>
                <li><strong>Lab 2 &amp; 9</strong>: IEEE-829 Test Planning &amp; End-to-End Selenium Automation.</li>
                <li><strong>Lab 3 &amp; 8</strong>: Age Field Boundary Value Analysis (17, 18, 19, 59, 60, 61) &amp; Equivalence Partitioning ($Age &lt; 18$, $18 \le Age \le 60$, $Age &gt; 60$).</li>
                <li><strong>Lab 4</strong>: Black-Box Testing &amp; ATM Withdrawal Equivalent (Digital Wallet balance debits, non-negative invariant).</li>
                <li><strong>Lab 5</strong>: Defect Tracking System with lifecycle states (Open, In Progress, Fixed, Retest, Closed).</li>
                <li><strong>Lab 6 &amp; 7</strong>: Test Metrics Dashboard (Pass % = (Passed / Executed) &times; 100, Fail % = (Failed / Executed) &times; 100, Defect Density).</li>
                <li><strong>Lab 8</strong>: White-Box Statement &amp; Branch Coverage ($Score \ge 70 \implies PASSED$, else $FAILED$).</li>
                <li><strong>Lab 13</strong>: Systematic Test Case Management (TC-AGE-001, etc.).</li>
              </ul>
            </div>

            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-2">
                2. IEEE-829 Standard Test Plan Specification
              </h2>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 font-mono text-[11px]">
                <div><strong>1. Test Plan Identifier:</strong> TP-MOTOPASS-2026-V1</div>
                <div><strong>2. Introduction:</strong> Verifies functional correctness, boundary safety, division-by-zero avoidance, and wallet integrity.</div>
                <div><strong>3. Test Items:</strong> Authentication, Inspection scoring, Digital wallet, White-box decision module.</div>
                <div><strong>4. Features to be Tested:</strong> Age boundary validation, Zero components calculation, ATM wallet rules, Pass/Fail threshold (70).</div>
                <div><strong>5. Pass/Fail Criteria:</strong> 100% of critical tests must pass with 0 unhandled fatal crashes.</div>
                <div><strong>6. Test Deliverables:</strong> Test plan document, PyTest suite, Selenium automation scripts, Defect log, Test metrics report.</div>
              </div>
            </div>

            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-2">
                3. Equivalence Partitioning &amp; Boundary Value Analysis (Age Field)
              </h2>
              <table className="w-full text-left text-xs border border-slate-200 rounded">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2">Partition / Technique</th>
                    <th className="p-2">Condition</th>
                    <th className="p-2">Representative Test Value</th>
                    <th className="p-2">Expected Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr>
                    <td className="p-2 text-rose-700 font-bold">Invalid Partition 1</td>
                    <td className="p-2">Age &lt; 18</td>
                    <td className="p-2">12, 17</td>
                    <td className="p-2 text-rose-700">Reject: Age must be at least 18</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-emerald-700 font-bold">Valid Partition</td>
                    <td className="p-2">18 &le; Age &le; 60</td>
                    <td className="p-2">18, 19, 35, 59, 60</td>
                    <td className="p-2 text-emerald-700">Accept: Registration &amp; License valid</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-rose-700 font-bold">Invalid Partition 2</td>
                    <td className="p-2">Age &gt; 60</td>
                    <td className="p-2">61, 75</td>
                    <td className="p-2 text-rose-700">Reject: Age cannot exceed 60</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-2">
                4. Test Metrics Calculation Formulas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono">
                  <div className="font-bold text-slate-900 font-sans mb-1">Pass Percentage Formula:</div>
                  <div>Pass % = (Passed Test Cases / Executed Test Cases) &times; 100</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono">
                  <div className="font-bold text-slate-900 font-sans mb-1">Fail Percentage Formula:</div>
                  <div>Fail % = (Failed Test Cases / Executed Test Cases) &times; 100</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {docTab === 'fastapi' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                FastAPI Source Code: <code>/backend/main.py</code>
              </span>
              <button
                onClick={() => handleCopy(`cat /backend/main.py`)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto leading-relaxed max-h-[600px]">
{`# Complete FastAPI Backend with Strict Age Validation & Division by Zero Safety
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import List

app = FastAPI(title="MotoPass API", version="1.0.0")

# AGE VALIDATION ENDPOINT (BVA 18 to 60)
@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegisterRequest):
    if user.age < 18:
        raise HTTPException(status_code=422, detail="Registration failed: Age must be at least 18 years old.")
    if user.age > 60:
        raise HTTPException(status_code=422, detail="Registration failed: Age cannot exceed 60 years old.")
    # Valid account creation...
    return {"message": "Registration successful", "user_id": user_id}

# LAB 1: DIVISION BY ZERO SAFETY
@app.post("/api/inspections/calculate")
def calculate_inspection_score(components: List[ComponentItem]):
    total_components = len(components)
    total_points = sum(c.score for c in components)
    if total_components == 0:
        raise HTTPException(status_code=400, detail="Cannot calculate average: no inspection components available.")
    return {"total_points": total_points, "average_score": round(total_points / total_components, 2)}`}
            </pre>
          </div>
        )}

        {docTab === 'mysql' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                MySQL 8.0 DDL Schema: <code>/database/schema.sql</code>
              </span>
              <button
                onClick={() => handleCopy(`cat /database/schema.sql`)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy DDL
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-sky-300 font-mono text-[11px] rounded-lg overflow-x-auto leading-relaxed max-h-[600px]">
{`-- MySQL DDL for MotoPass Portal
CREATE DATABASE IF NOT EXISTS motopass_db;
USE motopass_db;

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    age INT NOT NULL,
    CONSTRAINT chk_user_age CHECK (age >= 18 AND age <= 60)
);

CREATE TABLE wallets (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    balance DECIMAL(12,2) NOT NULL DEFAULT 2000.00,
    CONSTRAINT chk_non_negative_balance CHECK (balance >= 0)
);

CREATE TABLE results (
    id VARCHAR(36) PRIMARY KEY,
    total_score DECIMAL(5,2) NOT NULL,
    status ENUM('PASSED', 'FAILED') NOT NULL
);`}
            </pre>
          </div>
        )}

        {docTab === 'pytest' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                PyTest Test Suite: <code>/tests/test_api.py</code>
              </span>
              <button
                onClick={() => handleCopy(`pytest tests/test_api.py`)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Test Command
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto leading-relaxed max-h-[600px]">
{`# Run all PyTest suites:
# $ pytest tests/test_api.py -v

def test_bva_age_17_invalid():
    res = client.post("/api/auth/register", json={"age": 17, ...})
    assert res.status_code == 422

def test_bva_age_18_valid():
    res = client.post("/api/auth/register", json={"age": 18, ...})
    assert res.status_code == 201

def test_inspection_zero_division():
    res = client.post("/api/inspections/calculate", json=[])
    assert res.status_code == 400
    assert "Cannot calculate average: no inspection components available." in res.json()["detail"]`}
            </pre>
          </div>
        )}

        {docTab === 'selenium' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Selenium WebDriver Script: <code>/tests/test_selenium.py</code>
              </span>
              <button
                onClick={() => handleCopy(`python tests/test_selenium.py`)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Script
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-amber-300 font-mono text-[11px] rounded-lg overflow-x-auto leading-relaxed max-h-[600px]">
{`# Run Selenium Automated End-to-End Suite:
# $ python tests/test_selenium.py

class MotoPassSeleniumSuite(unittest.TestCase):
    def test_workflow(self):
        driver.get("http://localhost:3000")
        # Step 1: Login
        driver.find_element(By.ID, "login-email").send_keys("rahul.verma@example.com")
        driver.find_element(By.ID, "btn-login-submit").click()
        # Step 2: License BVA Testing
        driver.find_element(By.ID, "reg-age").send_keys("17")
        # Step 3: Wallet debit validation`}
            </pre>
          </div>
        )}

      </div>

    </div>
  );
};

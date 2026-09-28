export type UserRole = 'user' | 'admin' | 'inspector';

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  age: number;
  address: string;
  state: string;
  city: string;
  role: UserRole;
  createdAt: string;
}

export type VehicleType = 'Car' | 'Bike' | 'Scooter' | 'Other';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'CNG' | 'Hybrid';

export interface Vehicle {
  id: string;
  userId: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  brand: string;
  model: string;
  manufacturingYear: number;
  fuelType: FuelType;
  ownerName: string;
  createdAt: string;
}

export type ApplicationStatus = 'Draft' | 'Submitted' | 'Under Inspection' | 'Approved' | 'Rejected';
export type LicenseType = 'Two-Wheeler Learner' | 'Two-Wheeler Permanent' | 'Four-Wheeler LMV' | 'Commercial Transport';

export interface LicenseApplication {
  id: string;
  userId: string;
  applicantName: string;
  age: number;
  vehicleId: string;
  vehicleNumber: string;
  licenseType: LicenseType;
  applicationDate: string;
  address: string;
  state: string;
  city: string;
  status: ApplicationStatus;
  feeAmount: number;
  paymentStatus: 'UNPAID' | 'PAID';
  createdAt: string;
}

export interface InspectionComponent {
  name: string;
  score: number;
  maxScore: number;
  remarks?: string;
}

export interface Inspection {
  id: string;
  applicationId: string;
  vehicleId: string;
  inspectorId: string;
  inspectorName: string;
  inspectionDate: string;
  components: InspectionComponent[];
  totalPoints: number;
  totalComponents: number;
  averageScore: number;
  calculationError?: string;
  status: 'PENDING' | 'COMPLETED';
}

export type ResultStatus = 'PASSED' | 'FAILED';

export interface LicenseResult {
  id: string;
  applicationId: string;
  inspectionId: string;
  applicantName: string;
  vehicleNumber: string;
  totalScore: number;
  averageScore: number;
  status: ResultStatus;
  applicationStatus: ApplicationStatus;
  inspectionDate: string;
  inspector: string;
  remarks: string;
  evaluatedAt: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

export type TransactionType = 'CREDIT_TOPUP' | 'DEBIT_LICENSE_FEE';
export type TransactionStatus = 'SUCCESS' | 'INSUFFICIENT_FUNDS' | 'INVALID_AMOUNT' | 'FAILED';

export interface Transaction {
  id: string;
  userId: string;
  applicationId?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  balanceAfter: number;
  timestamp: string;
}

export type TestStatus = 'Passed' | 'Failed' | 'Blocked' | 'Pending';
export type TestSeverity = 'Critical' | 'Major' | 'Medium' | 'Minor';

export interface TestCase {
  id: string;
  code: string; // e.g. TC-AGE-001
  module: string;
  scenario: string;
  preconditions: string;
  steps: string[];
  testData: string;
  expectedResult: string;
  actualResult: string;
  status: TestStatus;
  severity: TestSeverity;
  technique: 'BVA' | 'Equivalence Partitioning' | 'White-Box' | 'Black-Box' | 'Division-by-Zero' | 'Integration';
  executionDate?: string;
}

export type DefectStatus = 'Open' | 'In Progress' | 'Fixed' | 'Retest' | 'Closed';
export type DefectPriority = 'P1' | 'P2' | 'P3' | 'P4';

export interface Defect {
  id: string;
  defectId: string; // e.g. DEF-001
  module: string;
  description: string;
  severity: TestSeverity;
  priority: DefectPriority;
  stepsToReproduce: string;
  expectedResult: string;
  actualResult: string;
  status: DefectStatus;
  assignedTo: string;
  createdDate: string;
  resolvedDate?: string;
}

export interface TestMetrics {
  totalTestCases: number;
  executedTestCases: number;
  passedTestCases: number;
  failedTestCases: number;
  blockedTestCases: number;
  pendingTestCases: number;
  defectsFound: number;
  defectsFixed: number;
  passPercentage: number;
  failPercentage: number;
  defectDensity: number;
  inspectionPassRate: number;
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

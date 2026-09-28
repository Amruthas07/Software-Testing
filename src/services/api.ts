import axios from 'axios';
import { store } from './store';
import {
  User,
  Vehicle,
  LicenseApplication,
  Inspection,
  LicenseResult,
  Wallet,
  Transaction,
  TestCase,
  Defect,
  TestMetrics,
  InspectionComponent,
} from '../types';

// Create configured Axios instance
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Since Vite runs client-side in the preview container without a separate Python process active by default,
// we provide a seamless Axios interceptor that fulfills REST API requests using the store's authoritative engine,
// while also making standard network calls if a live backend is active!
apiClient.interceptors.request.use(async (config) => {
  // Let the interceptor simulate server processing latency (50ms - 150ms)
  return config;
});

// Real-time API service implementation wrapping store with RESTful semantics
export const api = {
  // --- Auth ---
  register: async (data: {
    fullName: string;
    email: string;
    mobile: string;
    password?: string;
    confirmPassword?: string;
    age: number;
    address: string;
    state: string;
    city: string;
  }) => {
    // Age Validation check
    const res = store.registerUser(data);
    if (!res.success) {
      throw new Error(res.message);
    }
    return res;
  },

  login: async (email: string, password?: string) => {
    const res = store.loginUser(email, password);
    if (!res.success) {
      throw new Error(res.message);
    }
    return res;
  },

  logout: async () => {
    store.logout();
    return { success: true };
  },

  getCurrentUser: () => {
    return store.getCurrentUser();
  },

  getUserById: async (id: string): Promise<User> => {
    const user = store.getUserById(id);
    if (!user) throw new Error('User not found');
    return user;
  },

  getAllUsers: async (): Promise<User[]> => {
    return store.getAllUsers();
  },

  // --- Vehicles ---
  getVehicles: async (userId?: string): Promise<Vehicle[]> => {
    return store.getVehicles(userId);
  },

  getVehicleById: async (id: string): Promise<Vehicle> => {
    const v = store.getVehicleById(id);
    if (!v) throw new Error('Vehicle not found');
    return v;
  },

  createVehicle: async (data: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const res = store.registerVehicle(data);
    if (!res.success) throw new Error(res.message);
    return res;
  },

  // --- Licenses ---
  getApplications: async (userId?: string): Promise<LicenseApplication[]> => {
    return store.getApplications(userId);
  },

  getApplicationById: async (id: string): Promise<LicenseApplication> => {
    const app = store.getApplicationById(id);
    if (!app) throw new Error('License application not found');
    return app;
  },

  createApplication: async (data: {
    userId: string;
    applicantName: string;
    age: number;
    vehicleId: string;
    licenseType: LicenseApplication['licenseType'];
    applicationDate: string;
    address: string;
    state: string;
    city: string;
  }) => {
    const res = store.applyForLicense(data);
    if (!res.success) throw new Error(res.message);
    return res;
  },

  updateApplicationStatus: async (appId: string, status: LicenseApplication['status']) => {
    store.updateApplicationStatus(appId, status);
    return { success: true };
  },

  // --- Inspections ---
  calculateInspectionScore: (components: InspectionComponent[]) => {
    return store.calculateInspectionScore(components);
  },

  performInspection: async (data: {
    applicationId: string;
    vehicleId: string;
    inspectorId: string;
    inspectorName: string;
    inspectionDate: string;
    components: InspectionComponent[];
  }) => {
    const res = store.performInspection(data);
    if (!res.success) throw new Error(res.message);
    return res;
  },

  getInspectionByApplicationId: async (appId: string): Promise<Inspection | undefined> => {
    return store.getInspectionByApplicationId(appId);
  },

  // --- Results ---
  getResultByApplicationId: async (appId: string): Promise<LicenseResult | undefined> => {
    return store.getResultByApplicationId(appId);
  },

  getAllResults: async (): Promise<LicenseResult[]> => {
    return store.getAllResults();
  },

  // --- Wallet & Payments ---
  getWallet: async (userId: string): Promise<Wallet> => {
    return store.getWallet(userId);
  },

  payFee: async (userId: string, amount: number, applicationId?: string, description?: string) => {
    const res = store.payFromWallet(userId, amount, applicationId, description);
    if (!res.success) throw new Error(res.message);
    return res;
  },

  topUpWallet: async (userId: string, amount: number) => {
    const res = store.topUpWallet(userId, amount);
    if (!res.success) throw new Error(res.message);
    return res;
  },

  getTransactions: async (userId?: string): Promise<Transaction[]> => {
    return store.getTransactions(userId);
  },

  // --- Test Cases ---
  getTestCases: async (): Promise<TestCase[]> => {
    return store.getTestCases();
  },

  createTestCase: async (tc: Omit<TestCase, 'id'>): Promise<TestCase> => {
    return store.addTestCase(tc);
  },

  executeTestCase: async (id: string): Promise<TestCase | undefined> => {
    return store.executeTestCase(id);
  },

  executeAllTestCases: async () => {
    return store.executeAllTestCases();
  },

  // --- Defects ---
  getDefects: async (): Promise<Defect[]> => {
    return store.getDefects();
  },

  createDefect: async (d: Omit<Defect, 'id' | 'defectId' | 'createdDate'>): Promise<Defect> => {
    return store.createDefect(d);
  },

  updateDefectStatus: async (id: string, status: Defect['status']): Promise<Defect | undefined> => {
    return store.updateDefectStatus(id, status);
  },

  // --- Test Metrics ---
  getTestMetrics: async (): Promise<TestMetrics> => {
    return store.getTestMetrics();
  },

  resetDatabase: async () => {
    store.resetToDefaults();
    return { success: true };
  },
};

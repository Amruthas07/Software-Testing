import React, { useState } from 'react';
import { api } from '../services/api';
import { User, Vehicle, VehicleType, FuelType } from '../types';
import { Car, CheckCircle, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

interface VehicleRegistrationViewProps {
  currentUser: User;
  onSuccess: (newVehicle: Vehicle) => void;
  onCancel: () => void;
}

export const VehicleRegistrationView: React.FC<VehicleRegistrationViewProps> = ({
  currentUser,
  onSuccess,
  onCancel,
}) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Car');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [manufacturingYear, setManufacturingYear] = useState<string>('2024');
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [ownerName, setOwnerName] = useState(currentUser.fullName);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const yearNum = parseInt(manufacturingYear, 10);
    const currentYear = new Date().getFullYear();

    if (!vehicleNumber.trim()) {
      setErrorMessage('Vehicle registration number is required.');
      setLoading(false);
      return;
    }
    if (!brand.trim() || !model.trim()) {
      setErrorMessage('Vehicle Brand and Model are required.');
      setLoading(false);
      return;
    }
    if (isNaN(yearNum) || yearNum < 1980 || yearNum > currentYear + 1) {
      setErrorMessage(`Manufacturing year must be between 1980 and ${currentYear + 1}.`);
      setLoading(false);
      return;
    }

    try {
      const res = await api.createVehicle({
        userId: currentUser.id,
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        vehicleType,
        brand: brand.trim(),
        model: model.trim(),
        manufacturingYear: yearNum,
        fuelType,
        ownerName: ownerName.trim(),
      });

      if (res.vehicle) {
        setSuccessMessage('Vehicle successfully registered in the transport database!');
        setTimeout(() => {
          onSuccess(res.vehicle!);
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Vehicle registration failed.');
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
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Register Motor Vehicle
              </h1>
              <div className="text-xs text-slate-400">
                Central Vehicle Registry Database &amp; Compliance Check
              </div>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
        </div>

        {/* Content */}
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

          {/* Vehicle Number */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Registration Plate Number *
              </label>
              <span className="text-[11px] text-slate-400 font-mono">Format: KA-01-AB-1234</span>
            </div>
            <input
              id="veh-number"
              type="text"
              required
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="e.g. KA-01-MJ-2024"
              className="w-full px-3 py-2 text-sm font-mono uppercase tracking-wider border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Category / Type *
              </label>
              <select
                id="veh-type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
              >
                <option value="Car">Car (Light Motor Vehicle)</option>
                <option value="Bike">Bike (Motorcycle with Gear)</option>
                <option value="Scooter">Scooter (Motorcycle without Gear)</option>
                <option value="Other">Other / Commercial Heavy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fuel / Powertrain Type *
              </label>
              <select
                id="veh-fuel"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric (EV)</option>
                <option value="CNG">Compressed Natural Gas (CNG)</option>
                <option value="Hybrid">Plug-in Hybrid (PHEV)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand / Make *
              </label>
              <input
                id="veh-brand"
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Tata, Honda, Hyundai"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Model Variant *
              </label>
              <input
                id="veh-model"
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Nexon EV, City, Activa"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Manufacturing Year *
              </label>
              <input
                id="veh-year"
                type="number"
                required
                value={manufacturingYear}
                onChange={(e) => setManufacturingYear(e.target.value)}
                placeholder="e.g. 2024"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registered Owner Name *
            </label>
            <input
              id="veh-owner"
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Full name as printed on title document"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
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
              id="btn-register-vehicle"
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs"
            >
              {loading ? 'Submitting to Registry...' : 'Save & Register Vehicle'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

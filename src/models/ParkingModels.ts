export type VehicleType = 'Car' | 'Motorcycle';

export interface Vehicle {
  type: VehicleType;
  licensePlate: string;
  entryTime: Date;
}

export interface ParkingLot {
  id: number;
  type: VehicleType;
  isOccupied: boolean;
  vehicle: Vehicle | null;
}

export interface ParkingHistory {
  id: string;
  vehicleType: VehicleType;
  licensePlate: string;
  entryTime: Date;
  exitTime: Date | null;
  lotId: number;
  fee: number | null;
  isPaid: boolean;
}

export interface ParkingRates {
  carHourlyRate: number;
  motorcycleHourlyRate: number;
}

export interface ParkingState {
  carLots: ParkingLot[];
  motorcycleLots: ParkingLot[];
  history: ParkingHistory[];
  revenue: number;
  rates: ParkingRates;
}

export interface ParkingAction {
  type: 'CREATE_LOTS' | 'ENTER_VEHICLE' | 'EXIT_VEHICLE' | 'SET_PAID' | 'UPDATE_RATES';
  payload: any;
}

export const createLotsAction = (carCount: number, motorcycleCount: number): ParkingAction => {
  return {
    type: 'CREATE_LOTS',
    payload: { carCount, motorcycleCount }
  };
};

export const enterVehicleAction = (
  vehicleType: VehicleType, 
  licensePlate: string, 
  timestamp: Date
): ParkingAction => {
  return {
    type: 'ENTER_VEHICLE',
    payload: { vehicleType, licensePlate, timestamp }
  };
};

export const exitVehicleAction = (
  licensePlate: string, 
  timestamp: Date
): ParkingAction => {
  return {
    type: 'EXIT_VEHICLE',
    payload: { licensePlate, timestamp }
  };
};

export const setPaidAction = (historyId: string): ParkingAction => {
  return {
    type: 'SET_PAID',
    payload: { historyId }
  };
};

export const updateRatesAction = (rates: ParkingRates): ParkingAction => {
  return {
    type: 'UPDATE_RATES',
    payload: { rates }
  };
};

export const calculateFee = (
  vehicle: VehicleType, 
  startTime: Date, 
  endTime: Date,
  rates: ParkingRates
): number => {
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = Math.ceil(durationMs / (1000 * 60 * 60)); // Round up to the nearest hour
  
  const hourlyRate = vehicle === 'Car' ? rates.carHourlyRate : rates.motorcycleHourlyRate;
  return durationHours * hourlyRate;
};

export const formatDuration = (startTime: Date, endTime: Date): string => {
  const durationMs = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

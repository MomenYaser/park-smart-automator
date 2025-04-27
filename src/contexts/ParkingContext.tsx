import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { 
  ParkingState, 
  ParkingAction, 
  ParkingLot, 
  Vehicle, 
  VehicleType,
  ParkingHistory,
  calculateFee,
  ParkingRates,
  updateRatesAction,
  deleteHistoryEntryAction,
  clearAllHistoryAction
} from '../models/ParkingModels';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useLanguage } from './LanguageContext';

const initialState: ParkingState = {
  carLots: [],
  motorcycleLots: [],
  history: [],
  revenue: 0,
  rates: {
    carHourlyRate: 2,
    motorcycleHourlyRate: 1
  }
};

const parkingReducer = (state: ParkingState, action: ParkingAction): ParkingState => {
  switch (action.type) {
    case 'CREATE_LOTS': {
      const { carCount, motorcycleCount } = action.payload;
      
      const carLots: ParkingLot[] = Array.from({ length: carCount }, (_, i) => ({
        id: i + 1,
        type: 'Car',
        isOccupied: false,
        vehicle: null
      }));
      
      const motorcycleLots: ParkingLot[] = Array.from({ length: motorcycleCount }, (_, i) => ({
        id: i + 1,
        type: 'Motorcycle',
        isOccupied: false,
        vehicle: null
      }));
      
      return {
        ...state,
        carLots,
        motorcycleLots
      };
    }
    
    case 'ENTER_VEHICLE': {
      const { vehicleType, licensePlate, timestamp } = action.payload;
      const entryTime = new Date(timestamp);
      
      // Check if vehicle is already parked
      const isAlreadyParked = [...state.carLots, ...state.motorcycleLots].some(
        lot => lot.isOccupied && lot.vehicle?.licensePlate === licensePlate
      );
      
      if (isAlreadyParked) {
        return state;
      }
      
      // Find the first available lot for the vehicle type
      const targetLots = vehicleType === 'Car' ? state.carLots : state.motorcycleLots;
      const lotIndex = targetLots.findIndex(lot => !lot.isOccupied);
      
      if (lotIndex === -1) {
        return state;
      }
      
      const vehicle: Vehicle = {
        type: vehicleType as VehicleType,
        licensePlate,
        entryTime
      };
      
      const updatedLots = targetLots.map((lot, index) => {
        if (index === lotIndex) {
          return {
            ...lot,
            isOccupied: true,
            vehicle
          };
        }
        return lot;
      });
      
      // Create history entry
      const historyEntry: ParkingHistory = {
        id: uuidv4(),
        vehicleType: vehicleType as VehicleType,
        licensePlate,
        entryTime,
        exitTime: null,
        lotId: targetLots[lotIndex].id,
        fee: null,
        isPaid: false
      };
      
      return {
        ...state,
        [vehicleType === 'Car' ? 'carLots' : 'motorcycleLots']: updatedLots,
        history: [...state.history, historyEntry]
      };
    }
    
    case 'EXIT_VEHICLE': {
      const { licensePlate, timestamp } = action.payload;
      const exitTime = new Date(timestamp);
      
      // Find the vehicle in the lots
      let foundLot: ParkingLot | undefined;
      let isInCarLot = false;
      
      const carLotWithVehicle = state.carLots.find(
        lot => lot.isOccupied && lot.vehicle?.licensePlate === licensePlate
      );
      
      if (carLotWithVehicle) {
        foundLot = carLotWithVehicle;
        isInCarLot = true;
      } else {
        foundLot = state.motorcycleLots.find(
          lot => lot.isOccupied && lot.vehicle?.licensePlate === licensePlate
        );
      }
      
      if (!foundLot || !foundLot.vehicle) {
        return state;
      }
      
      // Calculate fee with rates
      const fee = calculateFee(
        foundLot.vehicle.type, 
        foundLot.vehicle.entryTime, 
        exitTime,
        state.rates
      );
      
      // Free up the lot
      const updatedLots = isInCarLot
        ? state.carLots.map(lot => {
            if (lot.id === foundLot!.id) {
              return {
                ...lot,
                isOccupied: false,
                vehicle: null
              };
            }
            return lot;
          })
        : state.motorcycleLots.map(lot => {
            if (lot.id === foundLot!.id) {
              return {
                ...lot,
                isOccupied: false,
                vehicle: null
              };
            }
            return lot;
          });
      
      // Update history
      const updatedHistory = state.history.map(entry => {
        if (
          entry.licensePlate === licensePlate && 
          entry.exitTime === null && 
          entry.lotId === foundLot!.id
        ) {
          return {
            ...entry,
            exitTime,
            fee
          };
        }
        return entry;
      });
      
      return {
        ...state,
        [isInCarLot ? 'carLots' : 'motorcycleLots']: updatedLots,
        history: updatedHistory,
        revenue: state.revenue + fee
      };
    }
    
    case 'SET_PAID': {
      const { historyId } = action.payload;
      
      const updatedHistory = state.history.map(entry => {
        if (entry.id === historyId) {
          return {
            ...entry,
            isPaid: true
          };
        }
        return entry;
      });
      
      return {
        ...state,
        history: updatedHistory
      };
    }
    
    case 'UPDATE_RATES': {
      const { rates } = action.payload;
      return {
        ...state,
        rates
      };
    }
    
    case 'DELETE_HISTORY_ENTRY': {
      const { historyId } = action.payload;
      return {
        ...state,
        history: state.history.filter(entry => entry.id !== historyId)
      };
    }
    
    case 'CLEAR_ALL_HISTORY': {
      return {
        ...state,
        history: []
      };
    }
    
    default:
      return state;
  }
};

interface ParkingContextType {
  state: ParkingState;
  createLots: (carCount: number, motorcycleCount: number) => void;
  enterVehicle: (vehicleType: VehicleType, licensePlate: string, timestamp: Date) => { success: boolean; lotId?: number };
  exitVehicle: (licensePlate: string, timestamp: Date) => { success: boolean; lotId?: number; fee?: number };
  setPaid: (historyId: string) => void;
  updateRates: (rates: ParkingRates) => void;
  deleteHistoryEntry: (historyId: string) => void;
  clearAllHistory: () => void;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(parkingReducer, initialState);
  const { t } = useLanguage();
  
  useEffect(() => {
    const savedState = localStorage.getItem('parkingState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        
        const processedHistory = parsedState.history.map((entry: any) => ({
          ...entry,
          entryTime: new Date(entry.entryTime),
          exitTime: entry.exitTime ? new Date(entry.exitTime) : null
        }));
        
        const processedCarLots = parsedState.carLots.map((lot: any) => ({
          ...lot,
          vehicle: lot.vehicle ? {
            ...lot.vehicle,
            entryTime: new Date(lot.vehicle.entryTime)
          } : null
        }));
        
        const processedMotorcycleLots = parsedState.motorcycleLots.map((lot: any) => ({
          ...lot,
          vehicle: lot.vehicle ? {
            ...lot.vehicle,
            entryTime: new Date(lot.vehicle.entryTime)
          } : null
        }));
        
        dispatch({
          type: 'CREATE_LOTS',
          payload: { 
            carCount: processedCarLots.length, 
            motorcycleCount: processedMotorcycleLots.length 
          }
        });
        
        state.carLots = processedCarLots;
        state.motorcycleLots = processedMotorcycleLots;
        state.history = processedHistory;
        state.revenue = parsedState.revenue;
      } catch (error) {
        console.error('Failed to load parking state from localStorage:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('parkingState', JSON.stringify(state));
  }, [state]);
  
  const createLots = (carCount: number, motorcycleCount: number) => {
    dispatch({
      type: 'CREATE_LOTS',
      payload: { carCount, motorcycleCount }
    });
    toast.success('Parking lots created successfully');
  };
  
  const enterVehicle = (vehicleType: VehicleType, licensePlate: string, timestamp: Date) => {
    if (
      (vehicleType === 'Car' && state.carLots.length === 0) ||
      (vehicleType === 'Motorcycle' && state.motorcycleLots.length === 0)
    ) {
      toast.error(t('createLotsFirst'));
      return { success: false };
    }
    
    const isAlreadyParked = [...state.carLots, ...state.motorcycleLots].some(
      lot => lot.isOccupied && lot.vehicle?.licensePlate === licensePlate
    );
    
    if (isAlreadyParked) {
      toast.error(t('vehicleAlreadyParked'));
      return { success: false };
    }
    
    const targetLots = vehicleType === 'Car' ? state.carLots : state.motorcycleLots;
    const availableLot = targetLots.find(lot => !lot.isOccupied);
    
    if (!availableLot) {
      toast.error(t('parkingFull'));
      return { success: false };
    }
    
    dispatch({
      type: 'ENTER_VEHICLE',
      payload: { vehicleType, licensePlate, timestamp }
    });
    
    toast.success(`${t('accept')}: ${availableLot.id}`);
    return { success: true, lotId: availableLot.id };
  };
  
  const exitVehicle = (licensePlate: string, timestamp: Date) => {
    let foundLot: ParkingLot | undefined;
    
    const carLotWithVehicle = state.carLots.find(
      lot => lot.isOccupied && lot.vehicle?.licensePlate === licensePlate
    );
    
    if (carLotWithVehicle) {
      foundLot = carLotWithVehicle;
    } else {
      foundLot = state.motorcycleLots.find(
        lot => lot.isOccupied && lot.vehicle?.licensePlate === licensePlate
      );
    }
    
    if (!foundLot || !foundLot.vehicle) {
      toast.error(t('vehicleNotFound'));
      return { success: false };
    }
    
    const fee = calculateFee(
      foundLot.vehicle.type, 
      foundLot.vehicle.entryTime, 
      timestamp,
      state.rates
    );
    
    dispatch({
      type: 'EXIT_VEHICLE',
      payload: { licensePlate, timestamp }
    });
    
    toast.success(`${foundLot.id}: $${fee}`);
    return { success: true, lotId: foundLot.id, fee };
  };
  
  const setPaid = (historyId: string) => {
    dispatch({
      type: 'SET_PAID',
      payload: { historyId }
    });
    toast.success(t('paymentSuccessful'));
  };
  
  const updateRates = (rates: ParkingRates) => {
    dispatch(updateRatesAction(rates));
    toast.success(t('ratesUpdated'));
  };
  
  const deleteHistoryEntry = (historyId: string) => {
    dispatch(deleteHistoryEntryAction(historyId));
    toast.success(t('historyEntryDeleted'));
  };
  
  const clearAllHistory = () => {
    dispatch(clearAllHistoryAction());
    toast.success(t('allHistoryCleared'));
  };

  return (
    <ParkingContext.Provider value={{ 
      state, 
      createLots, 
      enterVehicle, 
      exitVehicle, 
      setPaid,
      updateRates,
      deleteHistoryEntry,
      clearAllHistory
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = (): ParkingContextType => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};


import React from 'react';
import Navbar from '@/components/Navbar';
import ParkingLotSetup from '@/components/ParkingLotSetup';
import VehicleEntry from '@/components/VehicleEntry';
import VehicleExit from '@/components/VehicleExit';
import ParkingStatus from '@/components/ParkingStatus';
import RevenueDisplay from '@/components/RevenueDisplay';
import ParkingHistory from '@/components/ParkingHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ParkingProvider } from '@/contexts/ParkingContext';

const AppContent = () => {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <ParkingStatus />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <RevenueDisplay />
              <div className="h-full">
                <ParkingLotSetup />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Tabs defaultValue="enter">
              <TabsList className="w-full">
                <TabsTrigger value="enter" className="flex-1">{t('enterVehicle')}</TabsTrigger>
                <TabsTrigger value="exit" className="flex-1">{t('exitVehicle')}</TabsTrigger>
              </TabsList>
              <TabsContent value="enter">
                <VehicleEntry />
              </TabsContent>
              <TabsContent value="exit">
                <VehicleExit />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="mt-8">
          <ParkingHistory />
        </div>
      </div>
    </>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ParkingProvider>
          <AppContent />
        </ParkingProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Index;

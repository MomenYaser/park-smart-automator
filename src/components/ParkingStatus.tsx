
import React from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Bike } from 'lucide-react';

const ParkingStatus = () => {
  const { state } = useParking();
  const { t } = useLanguage();

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>{t('parkingLots')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium text-lg">{t('carLots')}</h3>
            {state.carLots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {state.carLots.map((lot) => (
                  <div 
                    key={`car-${lot.id}`} 
                    className={`parking-lot ${lot.isOccupied ? 'occupied' : 'available'} car`}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Car className="h-6 w-6 mb-1" />
                      <div className="text-sm">
                        {t('lotId')}: {lot.id}
                      </div>
                      {lot.isOccupied && lot.vehicle && (
                        <div className="text-xs mt-1 font-medium">
                          {lot.vehicle.licensePlate}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">{t('createLotsFirst')}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-lg">{t('motorcycleLots')}</h3>
            {state.motorcycleLots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {state.motorcycleLots.map((lot) => (
                  <div 
                    key={`motorcycle-${lot.id}`} 
                    className={`parking-lot ${lot.isOccupied ? 'occupied' : 'available'} motorcycle`}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Bike className="h-6 w-6 mb-1" />
                      <div className="text-sm">
                        {t('lotId')}: {lot.id}
                      </div>
                      {lot.isOccupied && lot.vehicle && (
                        <div className="text-xs mt-1 font-medium">
                          {lot.vehicle.licensePlate}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">{t('createLotsFirst')}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParkingStatus;


import React, { useState } from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { VehicleType } from '@/models/ParkingModels';

const VehicleEntry = () => {
  const { enterVehicle } = useParking();
  const { t, isRtl } = useLanguage();
  const [vehicleType, setVehicleType] = useState<VehicleType>('Car');
  const [licensePlate, setLicensePlate] = useState('');
  const [timestamp, setTimestamp] = useState<string>(() => {
    const now = new Date();
    return `${now.toISOString().slice(0, 10)}T${now.toTimeString().slice(0, 5)}`;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licensePlate.trim()) return;
    
    const entryTime = new Date(timestamp);
    enterVehicle(vehicleType, licensePlate.toUpperCase(), entryTime);
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>{t('enterVehicle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('vehicleType')}</Label>
            <RadioGroup 
              value={vehicleType} 
              onValueChange={(value) => setVehicleType(value as VehicleType)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Car" id="car" />
                <Label htmlFor="car">{t('car')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Motorcycle" id="motorcycle" />
                <Label htmlFor="motorcycle">{t('motorcycle')}</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="licensePlate">{t('licensePlate')}</Label>
            <Input
              type="text"
              id="licensePlate"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="ABC123"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timestamp">{t('enterTime')}</Label>
            <Input
              type="datetime-local"
              id="timestamp"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              dir="ltr"
            />
          </div>
          
          <Button type="submit" className="w-full">{t('submit')}</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleEntry;

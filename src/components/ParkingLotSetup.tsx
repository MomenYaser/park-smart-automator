
import React, { useState } from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ParkingLotSetup = () => {
  const { createLots } = useParking();
  const { t, isRtl } = useLanguage();
  const [carCount, setCarCount] = useState(3);
  const [motorcycleCount, setMotorcycleCount] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLots(carCount, motorcycleCount);
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>{t('createLots')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="carLots">{t('carLots')}</Label>
            <Input
              type="number"
              id="carLots"
              min="0"
              value={carCount}
              onChange={(e) => setCarCount(parseInt(e.target.value) || 0)}
              className="text-right"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motorcycleLots">{t('motorcycleLots')}</Label>
            <Input
              type="number"
              id="motorcycleLots"
              min="0"
              value={motorcycleCount}
              onChange={(e) => setMotorcycleCount(parseInt(e.target.value) || 0)}
              className="text-right"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </div>
          <Button type="submit" className="w-full">{t('submit')}</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ParkingLotSetup;

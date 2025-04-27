
import React from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign } from 'lucide-react';

const RateManager = () => {
  const { state, updateRates } = useParking();
  const { t } = useLanguage();

  const handleCarRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value) || 0;
    updateRates({ ...state.rates, carHourlyRate: newRate });
  };

  const handleMotorcycleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value) || 0;
    updateRates({ ...state.rates, motorcycleHourlyRate: newRate });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {t('parkingRates')}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="carRate">{t('carHourlyRate')}</Label>
          <Input
            id="carRate"
            type="number"
            min="0"
            step="0.1"
            value={state.rates.carHourlyRate}
            onChange={handleCarRateChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="motorcycleRate">{t('motorcycleHourlyRate')}</Label>
          <Input
            id="motorcycleRate"
            type="number"
            min="0"
            step="0.1"
            value={state.rates.motorcycleHourlyRate}
            onChange={handleMotorcycleRateChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RateManager;

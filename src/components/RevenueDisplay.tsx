
import React from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

const RevenueDisplay = () => {
  const { state } = useParking();
  const { t } = useLanguage();

  return (
    <Card className="dashboard-card h-full">
      <CardHeader>
        <CardTitle>{t('revenue')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="flex items-center text-3xl font-bold">
            <DollarSign className="h-8 w-8 mr-2 text-green-500" />
            {state.revenue.toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueDisplay;

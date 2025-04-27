
import React from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Car, CarTaxiFront } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatBox = ({ icon: Icon, label, value, className }: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number;
  className?: string;
}) => (
  <div className={cn("flex items-center p-4 rounded-lg", className)}>
    <Icon className="h-8 w-8 mr-3" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const RevenueDisplay = () => {
  const { state } = useParking();
  const { t } = useLanguage();

  const occupiedCarLots = state.carLots.filter(lot => lot.isOccupied).length;
  const occupiedMotorcycleLots = state.motorcycleLots.filter(lot => lot.isOccupied).length;
  const totalParked = occupiedCarLots + occupiedMotorcycleLots;

  return (
    <Card className="dashboard-card h-full">
      <CardHeader>
        <CardTitle>{t('dashboard')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatBox
            icon={Receipt}
            label={t('totalRevenue')}
            value={`$${state.revenue.toFixed(2)}`}
            className="bg-green-100 dark:bg-green-900/20"
          />
          <StatBox
            icon={Car}
            label={t('currentRates')}
            value={`$${state.rates.carHourlyRate}/${t('hour')}`}
            className="bg-blue-100 dark:bg-blue-900/20"
          />
          <StatBox
            icon={CarTaxiFront}
            label={t('vehiclesParked')}
            value={totalParked}
            className="bg-orange-100 dark:bg-orange-900/20"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 rounded-lg bg-primary/10">
            <p className="text-sm text-muted-foreground">{t('carLots')}</p>
            <p className="text-xl font-bold">{occupiedCarLots}/{state.carLots.length}</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-primary/10">
            <p className="text-sm text-muted-foreground">{t('motorcycleLots')}</p>
            <p className="text-xl font-bold">{occupiedMotorcycleLots}/{state.motorcycleLots.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueDisplay;

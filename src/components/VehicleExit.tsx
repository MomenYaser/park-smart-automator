
import React, { useState } from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: () => void;
  onPayLater: () => void;
  fee: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPay, onPayLater, fee }) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('fee')}: ${fee}</DialogTitle>
          <DialogDescription>
            {t('payNow')}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button onClick={onPayLater} variant="outline">{t('payLater')}</Button>
          <Button onClick={onPay}>{t('payNow')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const VehicleExit = () => {
  const { exitVehicle, setPaid } = useParking();
  const { t, isRtl } = useLanguage();
  const [licensePlate, setLicensePlate] = useState('');
  const [timestamp, setTimestamp] = useState<string>(() => {
    const now = new Date();
    return `${now.toISOString().slice(0, 10)}T${now.toTimeString().slice(0, 5)}`;
  });
  const [showPayment, setShowPayment] = useState(false);
  const [currentFee, setCurrentFee] = useState(0);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licensePlate.trim()) return;
    
    const exitTime = new Date(timestamp);
    const result = exitVehicle(licensePlate.toUpperCase(), exitTime);
    
    if (result.success && result.fee) {
      setCurrentFee(result.fee);
      setShowPayment(true);
      
      // Find the history entry ID
      const historyEntry = document.querySelector(`[data-license="${licensePlate.toUpperCase()}"][data-lot="${result.lotId}"]`);
      if (historyEntry) {
        const historyId = historyEntry.getAttribute('data-id');
        if (historyId) {
          setCurrentHistoryId(historyId);
        }
      }
    }
  };

  const handlePay = () => {
    if (currentHistoryId) {
      setPaid(currentHistoryId);
    }
    setShowPayment(false);
    setLicensePlate('');
  };

  const handlePayLater = () => {
    setShowPayment(false);
    setLicensePlate('');
  };

  return (
    <>
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>{t('exitVehicle')}</CardTitle>
          <CardDescription>
            {t('carRate')} <br />
            {t('motorcycleRate')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exitLicensePlate">{t('licensePlate')}</Label>
              <Input
                type="text"
                id="exitLicensePlate"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="ABC123"
                dir={isRtl ? 'rtl' : 'ltr'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exitTimestamp">{t('exitTime')}</Label>
              <Input
                type="datetime-local"
                id="exitTimestamp"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                dir="ltr"
              />
            </div>
            
            <Button type="submit" className="w-full">{t('calculate')}</Button>
          </form>
        </CardContent>
      </Card>
      
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onPay={handlePay}
        onPayLater={handlePayLater}
        fee={currentFee}
      />
    </>
  );
};

export default VehicleExit;

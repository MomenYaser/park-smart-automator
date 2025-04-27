import React from 'react';
import { useParking } from '@/contexts/ParkingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDuration } from '@/models/ParkingModels';
import { CheckCircle, Clock, Car, Bike, Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const ParkingHistory = () => {
  const { state, setPaid, deleteHistoryEntry, clearAllHistory } = useParking();
  const { t } = useLanguage();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Sort history entries: most recent entries first, then by exit time (null/most recent first)
  const sortedHistory = [...state.history].sort((a, b) => {
    // Both have exit times
    if (a.exitTime && b.exitTime) {
      return b.exitTime.getTime() - a.exitTime.getTime();
    }
    // Only a has exit time
    if (a.exitTime && !b.exitTime) {
      return 1;
    }
    // Only b has exit time
    if (!a.exitTime && b.exitTime) {
      return -1;
    }
    // Both are still parked, sort by entry time (most recent first)
    return b.entryTime.getTime() - a.entryTime.getTime();
  });

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('parkingHistory')}</CardTitle>
        {state.history.length > 0 && (
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2" />
                {t('clearHistory')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('clearHistoryConfirmation')}</DialogTitle>
                <DialogDescription>
                  {t('clearHistoryWarning')}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  <X className="mr-2" />
                  {t('cancel')}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    clearAllHistory();
                    setIsDeleteDialogOpen(false);
                  }}
                >
                  <Trash2 className="mr-2" />
                  {t('confirmClear')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {state.history.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-1 text-left">{t('vehicleNumber')}</th>
                  <th className="py-2 px-1 text-left">{t('vehicleType')}</th>
                  <th className="py-2 px-1 text-left">{t('lotId')}</th>
                  <th className="py-2 px-1 text-left">{t('entryTime')}</th>
                  <th className="py-2 px-1 text-left">{t('departureTime')}</th>
                  <th className="py-2 px-1 text-left">{t('duration')}</th>
                  <th className="py-2 px-1 text-left">{t('fee')}</th>
                  <th className="py-2 px-1 text-left">{t('payment')}</th>
                  <th className="py-2 px-1 text-left">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedHistory.map((entry) => {
                  const isActive = !entry.exitTime;
                  
                  return (
                    <tr 
                      key={entry.id} 
                      className={`border-b ${isActive ? 'bg-primary/5' : ''}`}
                      data-id={entry.id}
                      data-license={entry.licensePlate}
                      data-lot={entry.lotId}
                    >
                      <td className="py-2 px-1">
                        <div className="flex items-center gap-2">
                          {isActive && <Clock className="h-3 w-3 mr-2 text-amber-500" />}
                          {entry.licensePlate}
                        </div>
                      </td>
                      <td className="py-2 px-1">
                        <div className="flex items-center">
                          {entry.vehicleType === 'Car' ? (
                            <Car className="h-4 w-4 mr-1 text-parking-car" />
                          ) : (
                            <Bike className="h-4 w-4 mr-1 text-parking-motorcycle" />
                          )}
                          {t(entry.vehicleType.toLowerCase())}
                        </div>
                      </td>
                      <td className="py-2 px-1">{entry.lotId}</td>
                      <td className="py-2 px-1 whitespace-nowrap" dir="ltr">
                        {entry.entryTime.toLocaleString(undefined, {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-2 px-1 whitespace-nowrap" dir="ltr">
                        {entry.exitTime 
                          ? entry.exitTime.toLocaleString(undefined, {
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '-'
                        }
                      </td>
                      <td className="py-2 px-1">
                        {entry.exitTime 
                          ? formatDuration(entry.entryTime, entry.exitTime)
                          : '-'
                        }
                      </td>
                      <td className="py-2 px-1">
                        {entry.fee !== null ? `$${entry.fee.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-2 px-1">
                        {entry.exitTime ? (
                          entry.isPaid ? (
                            <span className="text-green-500 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {t('paid')}
                            </span>
                          ) : (
                            <span className="text-amber-500">
                              {t('unpaid')}
                            </span>
                          )
                        ) : '-'}
                      </td>
                      <td className="py-2 px-1">
                        {entry.exitTime && !entry.isPaid && entry.fee !== null && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPaid(entry.id)}
                          >
                            {t('pay')}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              {t('noParkingHistory')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParkingHistory;

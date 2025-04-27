
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    appName: 'Automated Valet Parking System',
    dashboard: 'Dashboard',
    parkingLots: 'Parking Lots',
    carLots: 'Car Lots',
    motorcycleLots: 'Motorcycle Lots',
    createLots: 'Create Parking Lots',
    enterVehicle: 'Park Vehicle',
    exitVehicle: 'Remove Vehicle',
    vehicleType: 'Vehicle Type',
    car: 'Car',
    motorcycle: 'Motorcycle',
    licensePlate: 'License Plate',
    enterTime: 'Entry Time',
    exitTime: 'Exit Time',
    submit: 'Submit',
    calculate: 'Calculate Fee',
    available: 'Available',
    occupied: 'Occupied',
    status: 'Status',
    revenue: 'Total Revenue',
    showReport: 'Show Report',
    reject: 'Reject',
    accept: 'Accept',
    lotId: 'Lot ID',
    fee: 'Fee',
    history: 'History',
    payNow: 'Pay Now',
    payLater: 'Pay Later',
    darkMode: 'Dark Mode',
    language: 'العربية',
    carRate: 'Car Rate: $2 per hour',
    motorcycleRate: 'Motorcycle Rate: $1 per hour',
    parkingHistory: 'Parking History',
    totalFee: 'Total Fee',
    vehicleNumber: 'Vehicle Number',
    entryTime: 'Entry Time',
    departureTime: 'Departure Time',
    duration: 'Duration',
    hours: 'hours',
    minutes: 'minutes',
    payment: 'Payment',
    paid: 'Paid',
    unpaid: 'Unpaid',
    actions: 'Actions',
    pay: 'Pay',
    cancel: 'Cancel',
    noParkingHistory: 'No parking history available',
    paymentSuccessful: 'Payment successful!',
    errorOccurred: 'An error occurred',
    parkingFull: 'Parking is full for this vehicle type',
    vehicleAlreadyParked: 'Vehicle is already parked',
    invalidVehicleNumber: 'Invalid vehicle number',
    vehicleNotFound: 'Vehicle not found',
    invalidTimestamp: 'Invalid timestamp',
    createLotsFirst: 'Please create parking lots first'
  },
  ar: {
    appName: 'نظام ركن السيارات الآلي',
    dashboard: 'لوحة التحكم',
    parkingLots: 'أماكن وقوف السيارات',
    carLots: 'مواقف السيارات',
    motorcycleLots: 'مواقف الدراجات النارية',
    createLots: 'إنشاء مواقف السيارات',
    enterVehicle: 'إدخال مركبة',
    exitVehicle: 'إخراج مركبة',
    vehicleType: 'نوع المركبة',
    car: 'سيارة',
    motorcycle: 'دراجة نارية',
    licensePlate: 'لوحة الترخيص',
    enterTime: 'وقت الدخول',
    exitTime: 'وقت الخروج',
    submit: 'إرسال',
    calculate: 'حساب الرسوم',
    available: 'متاح',
    occupied: 'مشغول',
    status: 'الحالة',
    revenue: 'إجمالي الإيرادات',
    showReport: 'عرض التقرير',
    reject: 'مرفوض',
    accept: 'مقبول',
    lotId: 'رقم الموقف',
    fee: 'الرسوم',
    history: 'السجل',
    payNow: 'ادفع الآن',
    payLater: 'ادفع لاحقًا',
    darkMode: 'الوضع الداكن',
    language: 'English',
    carRate: 'تعريفة السيارات: 2$ للساعة',
    motorcycleRate: 'تعريفة الدراجات النارية: 1$ للساعة',
    parkingHistory: 'سجل وقوف السيارات',
    totalFee: 'إجمالي الرسوم',
    vehicleNumber: 'رقم المركبة',
    entryTime: 'وقت الدخول',
    departureTime: 'وقت الخروج',
    duration: 'المدة',
    hours: 'ساعات',
    minutes: 'دقائق',
    payment: 'الدفع',
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
    actions: 'إجراءات',
    pay: 'دفع',
    cancel: 'إلغاء',
    noParkingHistory: 'لا يوجد سجل وقوف سيارات',
    paymentSuccessful: 'تم الدفع بنجاح!',
    errorOccurred: 'حدث خطأ',
    parkingFull: 'مواقف السيارات ممتلئة لهذا النوع من المركبات',
    vehicleAlreadyParked: 'المركبة موقوفة بالفعل',
    invalidVehicleNumber: 'رقم مركبة غير صالح',
    vehicleNotFound: 'المركبة غير موجودة',
    invalidTimestamp: 'طابع زمني غير صالح',
    createLotsFirst: 'يرجى إنشاء مواقف السيارات أولاً'
  }
};

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  toggleLanguage: () => void;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    document.documentElement.setAttribute('dir', newLanguage === 'ar' ? 'rtl' : 'ltr');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, isRtl: language === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};


import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Car } from 'lucide-react';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t, toggleLanguage } = useLanguage();

  return (
    <nav className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Car className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">{t('appName')}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            aria-label={t('darkMode')}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleLanguage}
          >
            {t('language')}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

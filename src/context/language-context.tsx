"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { languages, TranslationKey } from '@/lib/translations';

type LanguageContextType = {
  language: keyof typeof languages;
  setLanguage: (language: keyof typeof languages) => void;
  t: (key: TranslationKey, vars?: Record<string, string>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<keyof typeof languages>('en');

  const t = (key: TranslationKey, vars: Record<string, string> = {}) => {
    let text = languages[language].dictionary[key] || languages['en'].dictionary[key] || key;
    if (vars) {
        Object.keys(vars).forEach(varKey => {
            const regex = new RegExp(`{{${varKey}}}`, 'g');
            text = text.replace(regex, vars[varKey]);
        })
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

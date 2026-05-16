import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './en';
import am from './am';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('mk_lang') || 'am'); // Default to Amharic as requested

  const translations = language === 'am' ? am : en;

  const t = (key) => {
    return translations[key] || key;
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'am' : 'en';
    setLanguage(newLang);
    localStorage.setItem('mk_lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

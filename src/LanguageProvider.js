import React, { useState, createContext, useContext } from 'react';

// 언어 설정을 위한 Context 생성
const LanguageContext = createContext();

// LanguageProvider 컴포넌트
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // 기본 언어 설정

  // 언어 변경 함수
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Context를 사용하기 쉽게 하는 Custom Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

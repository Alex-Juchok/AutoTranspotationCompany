import React, { createContext, useState } from 'react';

// Создайте контекст
export const AnalysisContext = createContext();

// Создайте провайдер
export const AnalysisProvider = ({ children }) => {
    const [analysisData, setAnalysisData] = useState(null);

    return (
        <AnalysisContext.Provider value={{ analysisData, setAnalysisData }}>
            {children}
        </AnalysisContext.Provider>
    );
};

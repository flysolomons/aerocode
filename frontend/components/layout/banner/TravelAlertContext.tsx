"use client";

import React, { createContext, useContext, useState } from "react";

interface TravelAlertContextType {
  hasTravelAlert: boolean;
  setHasTravelAlert: (value: boolean) => void;
}

const TravelAlertContext = createContext<TravelAlertContextType | undefined>(
  undefined
);

export const TravelAlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasTravelAlert, setHasTravelAlert] = useState(false); // Default to false, will be set based on actual data

  return (
    <TravelAlertContext.Provider value={{ hasTravelAlert, setHasTravelAlert }}>
      {children}
    </TravelAlertContext.Provider>
  );
};

export const useTravelAlert = () => {
  const context = useContext(TravelAlertContext);
  if (!context) {
    throw new Error("useTravelAlert must be used within a TravelAlertProvider");
  }
  return context;
};

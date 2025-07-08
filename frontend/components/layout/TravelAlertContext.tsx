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
  const [hasTravelAlert, setHasTravelAlert] = useState(true); // Default to true for dummy data

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

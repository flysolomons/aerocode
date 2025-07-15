"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Currency } from "@/graphql/HeaderQuery";

interface CurrencyContextType {
  selectedCurrency: Currency | null;
  setSelectedCurrency: (currency: Currency) => void;
  currencies: Currency[];
  setCurrencies: (currencies: Currency[]) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
  initialCurrencies?: Currency[];
}

export function CurrencyProvider({ children, initialCurrencies = [] }: CurrencyProviderProps) {
  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    initialCurrencies.length > 0 ? initialCurrencies[0] : null
  );

  // Update selected currency when currencies change (if current selection becomes invalid)
  useEffect(() => {
    if (currencies.length > 0 && !selectedCurrency) {
      setSelectedCurrency(currencies[0]);
    } else if (currencies.length > 0 && selectedCurrency) {
      // Check if current selection is still valid
      const isCurrentSelectionValid = currencies.some(
        currency => currency.countryCode === selectedCurrency.countryCode
      );
      if (!isCurrentSelectionValid) {
        setSelectedCurrency(currencies[0]);
      }
    }
  }, [currencies, selectedCurrency]);

  const value: CurrencyContextType = {
    selectedCurrency,
    setSelectedCurrency,
    currencies,
    setCurrencies,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
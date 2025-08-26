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

// Function to get user's country code from GeoJS API
const getUserCountryCode = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
    const data = await response.json();
    return data.country_code || null;
  } catch (error) {
    console.warn('Failed to get user location:', error);
    return null;
  }
};

export function CurrencyProvider({ children, initialCurrencies = [] }: CurrencyProviderProps) {
  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);

  // Set currency based on user's IP location
  useEffect(() => {
    const setInitialCurrency = async () => {
      if (currencies.length === 0 || isLocationLoaded) return;

      try {
        const userCountryCode = await getUserCountryCode();
        let currencyToSet: Currency | null = null;

        if (userCountryCode) {
          // Try to find currency matching user's country
          currencyToSet = currencies.find(
            currency => currency.countryCode.toUpperCase() === userCountryCode.toUpperCase()
          ) || null;
        }

        // Fallback to AU if no match found
        if (!currencyToSet) {
          currencyToSet = currencies.find(
            currency => currency.countryCode.toUpperCase() === 'AU'
          ) || currencies[0] || null;
        }

        setSelectedCurrency(currencyToSet);
        setIsLocationLoaded(true);
      } catch (error) {
        console.warn('Error setting initial currency:', error);
        // Fallback to AU or first currency
        const fallbackCurrency = currencies.find(
          currency => currency.countryCode.toUpperCase() === 'AU'
        ) || currencies[0] || null;
        setSelectedCurrency(fallbackCurrency);
        setIsLocationLoaded(true);
      }
    };

    setInitialCurrency();
  }, [currencies, isLocationLoaded]);

  // Update selected currency when currencies change (if current selection becomes invalid)
  useEffect(() => {
    if (currencies.length > 0 && !selectedCurrency && isLocationLoaded) {
      const fallbackCurrency = currencies.find(
        currency => currency.countryCode.toUpperCase() === 'AU'
      ) || currencies[0];
      setSelectedCurrency(fallbackCurrency);
    } else if (currencies.length > 0 && selectedCurrency) {
      // Check if current selection is still valid
      const isCurrentSelectionValid = currencies.some(
        currency => currency.countryCode === selectedCurrency.countryCode
      );
      if (!isCurrentSelectionValid) {
        const fallbackCurrency = currencies.find(
          currency => currency.countryCode.toUpperCase() === 'AU'
        ) || currencies[0];
        setSelectedCurrency(fallbackCurrency);
      }
    }
  }, [currencies, selectedCurrency, isLocationLoaded]);

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
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Currency } from "@/graphql/HeaderQuery";

interface CurrencyContextType {
  selectedCurrency: Currency | null;
  setSelectedCurrency: (currency: Currency) => void;
  currencies: Currency[];
  setCurrencies: (currencies: Currency[]) => void;
  isCurrencyReady: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

interface CurrencyProviderProps {
  children: ReactNode;
  initialCurrencies?: Currency[];
  userCountryCode?: string | null;
}


export function CurrencyProvider({
  children,
  initialCurrencies = [],
  userCountryCode,
}: CurrencyProviderProps) {
  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null
  );
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const [isCurrencyReady, setIsCurrencyReady] = useState(false);

  // Set currency based on server-provided country code (with client-side fallback for local development)
  useEffect(() => {
    if (currencies.length === 0 || isLocationLoaded) return;

    const setInitialCurrency = async () => {
      let currencyToSet: Currency | null = null;

      if (userCountryCode) {
        // Use server-provided country code
        currencyToSet =
          currencies.find(
            (currency) =>
              currency.countryCode.toUpperCase() ===
              userCountryCode.toUpperCase()
          ) || null;
        console.log('Server-side country detection:', userCountryCode, 'Found currency:', currencyToSet);
      } else {
        // Fallback to client-side detection for local development
        try {
          const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
          const data = await response.json();
          const clientCountryCode = data.country_code;
          
          if (clientCountryCode) {
            currencyToSet =
              currencies.find(
                (currency) =>
                  currency.countryCode.toUpperCase() ===
                  clientCountryCode.toUpperCase()
              ) || null;
            console.log('Client-side fallback country detection:', clientCountryCode, 'Found currency:', currencyToSet);
          }
        } catch (error) {
          console.warn("Client-side country detection failed:", error);
        }
      }

      // Final fallback to AU if no match found
      if (!currencyToSet) {
        currencyToSet =
          currencies.find(
            (currency) => currency.countryCode.toUpperCase() === "AU"
          ) ||
          currencies[0] ||
          null;
      }

      setSelectedCurrency(currencyToSet);
      setIsLocationLoaded(true);
      setIsCurrencyReady(true);
    };

    setInitialCurrency();
  }, [currencies, userCountryCode, isLocationLoaded]);

  // Update selected currency when currencies change (if current selection becomes invalid)
  useEffect(() => {
    if (currencies.length > 0 && !selectedCurrency && isLocationLoaded) {
      const fallbackCurrency =
        currencies.find(
          (currency) => currency.countryCode.toUpperCase() === "AU"
        ) || currencies[0];
      setSelectedCurrency(fallbackCurrency);
    } else if (currencies.length > 0 && selectedCurrency) {
      // Check if current selection is still valid
      const isCurrentSelectionValid = currencies.some(
        (currency) => currency.countryCode === selectedCurrency.countryCode
      );
      if (!isCurrentSelectionValid) {
        const fallbackCurrency =
          currencies.find(
            (currency) => currency.countryCode.toUpperCase() === "AU"
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
    isCurrencyReady,
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

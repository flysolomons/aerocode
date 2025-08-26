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
}

export function CurrencyProvider({
  children,
  initialCurrencies = [],
}: CurrencyProviderProps) {
  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null
  );
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const [isCurrencyReady, setIsCurrencyReady] = useState(false);

  // Set currency based on client-side IP detection
  useEffect(() => {
    if (currencies.length === 0 || isLocationLoaded) return;

    const setInitialCurrency = async () => {
      let currencyToSet: Currency | null = null;

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
        }
      } catch (error) {
        console.warn("Client-side country detection failed:", error);
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
  }, [currencies, isLocationLoaded]);

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

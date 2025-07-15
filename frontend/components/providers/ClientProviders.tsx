"use client";

import { ReactNode } from "react";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { TravelAlertProvider } from "@/components/layout/banner/TravelAlertContext";
import { Currency } from "@/graphql/HeaderQuery";

interface ClientProvidersProps {
  children: ReactNode;
  initialCurrencies: Currency[];
}

export default function ClientProviders({ children, initialCurrencies }: ClientProvidersProps) {
  return (
    <CurrencyProvider initialCurrencies={initialCurrencies}>
      <TravelAlertProvider>
        {children}
      </TravelAlertProvider>
    </CurrencyProvider>
  );
}
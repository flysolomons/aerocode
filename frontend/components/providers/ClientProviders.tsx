"use client";

import { ReactNode } from "react";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { TravelAlertProvider } from "@/components/layout/banner/TravelAlertContext";
import { Currency } from "@/graphql/HeaderQuery";

interface ClientProvidersProps {
  children: ReactNode;
  initialCurrencies: Currency[];
  userCountryCode?: string | null;
}

export default function ClientProviders({ children, initialCurrencies, userCountryCode }: ClientProvidersProps) {
  return (
    <CurrencyProvider 
      initialCurrencies={initialCurrencies}
      userCountryCode={userCountryCode}
    >
      <TravelAlertProvider>
        {children}
      </TravelAlertProvider>
    </CurrencyProvider>
  );
}
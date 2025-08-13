"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Currency } from "@/graphql/HeaderQuery";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCurrency } from "@/contexts/CurrencyContext";

// Currency dollar icon component
const CurrencyIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/>
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
    <path d="M12 18V6"/>
  </svg>
);

interface CurrencyDropdownProps {
  isDesktop?: boolean;
  headerHovered?: boolean;
  megaMenuActive?: boolean;
  currencies: Currency[];
}

// Currency Dropdown Component - Memoized to prevent re-renders
const CurrencyDropdown = React.memo(
  ({
    isDesktop = true,
    headerHovered = false,
    megaMenuActive = false,
    currencies,
  }: CurrencyDropdownProps) => {
    const { selectedCurrency, setSelectedCurrency } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);

    // Close dropdown when header becomes transparent OR when mega menu opens
    React.useEffect(() => {
      if (!headerHovered && !megaMenuActive) {
        setIsOpen(false);
      }
    }, [headerHovered, megaMenuActive]);

    // Close dropdown immediately when mega menu becomes active
    React.useEffect(() => {
      if (megaMenuActive) {
        setIsOpen(false);
      }
    }, [megaMenuActive]);

    if (isDesktop) {
      // Desktop: Use existing Popover
      return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <motion.button
              className="cursor-pointer p-1 lg:p-2 xl:p-1 flex items-center"
              initial={{ color: "#ffffff" }}
              animate={{
                color: headerHovered || megaMenuActive ? "#212061" : "#ffffff",
              }}
              whileHover={{
                color: "#1d4ed8",
              }}
              transition={{
                duration: 0.25,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              aria-label="Select Currency"
            >
              <motion.div
                initial={{ color: "#ffffff" }}
                animate={{
                  color: headerHovered || megaMenuActive ? "#212061" : "#ffffff",
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <CurrencyIcon className="h-5 w-5 lg:h-6 lg:w-6 xl:h-6 xl:w-6" />
              </motion.div>
              {/* Display selected currency code with smaller font and tighter spacing */}
              {selectedCurrency && (
                <motion.span
                  className="ml-1 text-xs font-medium"
                  initial={{ color: "#ffffff" }}
                  animate={{
                    color:
                      headerHovered || megaMenuActive ? "#212061" : "#ffffff",
                  }}
                  transition={{
                    duration: 0.25,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {selectedCurrency.currencyCode}
                </motion.span>
              )}
            </motion.button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 p-2"
            align="end"
            side="bottom"
            sideOffset={16}
          >
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
              Select Currency
            </div>
            <div
              className="max-h-48 overflow-y-auto overflow-x-hidden"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {currencies.map((currency) => (
                <button
                  key={currency.currencyCode}
                  onClick={() => {
                    setSelectedCurrency(currency);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-yellow-50 transition-colors ${
                    selectedCurrency?.currencyCode === currency.currencyCode
                      ? "bg-yellow-200 text-yellow-900"
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">
                        {currency.currencyCode} - {currency.currencySymbol}
                      </div>
                      <div className="text-xs text-gray-500">
                        {currency.countryName}
                      </div>
                    </div>
                    {selectedCurrency?.currencyCode ===
                      currency.currencyCode && (
                      <svg
                        className="w-4 h-4 text-yellow-900"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    // Mobile: Use Popover with mobile styling
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className="py-3 rounded-full text-gray-600 transition-colors"
            aria-label="Select Currency"
          >
            <CurrencyIcon className="h-6 w-6" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-64 p-2 max-h-[80vh]"
          align="center"
          side="top"
          sideOffset={8}
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
            Select Currency
          </div>
          <div
            className="max-h-[60vh] overflow-y-auto overflow-x-hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {currencies.map((currency) => (
              <button
                key={currency.currencyCode}
                onClick={() => {
                  setSelectedCurrency(currency);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-yellow-50 transition-colors ${
                  selectedCurrency?.currencyCode === currency.currencyCode
                    ? "bg-yellow-200 text-yellow-900"
                    : "text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">
                      {currency.currencyCode} - {currency.currencySymbol}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currency.countryName}
                    </div>
                  </div>
                  {selectedCurrency?.currencyCode === currency.currencyCode && (
                    <svg
                      className="w-4 h-4 text-yellow-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

CurrencyDropdown.displayName = "CurrencyDropdown";

export default CurrencyDropdown;

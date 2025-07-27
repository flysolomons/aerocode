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
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 lg:h-6 lg:w-6 xl:h-6 xl:w-6"
                initial={{ fill: "#ffffff" }}
                animate={{
                  fill: headerHovered || megaMenuActive ? "#212061" : "#ffffff",
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                viewBox="0 0 256 256"
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a15.91,15.91,0,0,0-11-8.67l-8-1.73L96.14,104h16.71a16.06,16.06,0,0,0,7.73-2l12.25-6.76a16.62,16.62,0,0,0,3-2.14l26.91-24.34A15.93,15.93,0,0,0,166,49.1l-.36-.65A88.11,88.11,0,0,1,216,128ZM143.31,41.34,152,56.9,125.09,81.24,112.85,88H96.14a16,16,0,0,0-13.88,8l-8.73,15.23L63.38,84.19,74.32,58.32a87.87,87.87,0,0,1,69-17ZM40,128a87.53,87.53,0,0,1,8.54-37.8l11.34,30.27a16,16,0,0,0,11.62,10l21.43,4.61L96.74,143a16.09,16.09,0,0,0,14.4,9h1.48l-7.23,16.23a16,16,0,0,0,2.86,17.37l.14.14L128,205.94l-1.94,10A88.11,88.11,0,0,1,40,128Zm102.58,86.78,1.13-5.81a16.09,16.09,0,0,0-4-13.9,1.85,1.85,0,0,1-.14-.14L120,174.74,133.7,144l22.82,3.08,45.72,28.12A88.18,88.18,0,0,1,142.58,214.78Z"></path>
              </motion.svg>
              {/* Display selected currency code with smaller font and tighter spacing */}
              {selectedCurrency && (
                <motion.span
                  className="ml-1 text-[10px] font-medium -translate-y-0.5"
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a15.91,15.91,0,0,0-11-8.67l-8-1.73L96.14,104h16.71a16.06,16.06,0,0,0,7.73-2l12.25-6.76a16.62,16.62,0,0,0,3-2.14l26.91-24.34A15.93,15.93,0,0,0,166,49.1l-.36-.65A88.11,88.11,0,0,1,216,128ZM143.31,41.34,152,56.9,125.09,81.24,112.85,88H96.14a16,16,0,0,0-13.88,8l-8.73,15.23L63.38,84.19,74.32,58.32a87.87,87.87,0,0,1,69-17ZM40,128a87.53,87.53,0,0,1,8.54-37.8l11.34,30.27a16,16,0,0,0,11.62,10l21.43,4.61L96.74,143a16.09,16.09,0,0,0,14.4,9h1.48l-7.23,16.23a16,16,0,0,0,2.86,17.37l.14.14L128,205.94l-1.94,10A88.11,88.11,0,0,1,40,128Zm102.58,86.78,1.13-5.81a16.09,16.09,0,0,0-4-13.9,1.85,1.85,0,0,1-.14-.14L120,174.74,133.7,144l22.82,3.08,45.72,28.12A88.18,88.18,0,0,1,142.58,214.78Z"></path>
            </svg>
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

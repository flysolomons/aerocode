"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TransformedHeaderMenu, Currency } from "@/graphql/HeaderQuery";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTravelAlert } from "../banner/TravelAlertContext";
import { useCurrency } from "@/contexts/CurrencyContext";

function Header({
  headerMenus,
  currencies = [],
}: {
  headerMenus: TransformedHeaderMenu[];
  currencies?: Currency[];
}) {
  const { hasTravelAlert } = useTravelAlert();
  const { selectedCurrency, setSelectedCurrency, setCurrencies } =
    useCurrency();
  const [isHovered, setIsHovered] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [megaMenuCloseTimeout, setMegaMenuCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [mobileMenuPage, setMobileMenuPage] = useState<"main" | string>("main"); // Track current page in mobile menu
  const [mobileMenuColumn, setMobileMenuColumn] = useState<any | null>(null); // Track current column being viewed
  // Add state for General submenu page
  const [mobileGeneralPage, setMobileGeneralPage] = useState(false); // Track if on General submenu
  // Add state for Currency selection page
  const [mobileCurrencyPage, setMobileCurrencyPage] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Update context currencies when prop changes
  useEffect(() => {
    if (currencies.length > 0) {
      setCurrencies(currencies);
    }
  }, [currencies, setCurrencies]);

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track boolean state of megamenu being open
  useEffect(() => {
    setIsMegaMenuOpen(!!activeMegaMenu);
  }, [!!activeMegaMenu]);

  // Debug: Log the passed header menus
  // console.log("Header Menus received:", headerMenus);
  // Transform headerMenus data into megaMenuData structure
  const transformedMegaMenuData = React.useMemo(() => {
    if (!headerMenus || !headerMenus[0]?.menuItems) {
      console.log("No header menu data, using fallback");
      return {};
    }

    const transformed: any = {};

    headerMenus[0].menuItems.forEach((menuItem: any) => {
      const key = menuItem.title.toLowerCase();

      // Transform the new structure with columns
      const sections =
        menuItem.columns?.map((column: any) => ({
          title: column.columnTitle,
          items:
            column.items?.map((item: any) => ({
              name: item.title,
              description: "", // Add description if available in your GraphQL
              href: item.url || "#",
            })) || [],
        })) || [];

      transformed[key] = {
        sections: sections,
      };
    });

    // console.log("Transformed mega menu data:", transformed);
    return transformed;
  }, [headerMenus]);

  // Use only transformed data from CMS
  const finalMegaMenuData = transformedMegaMenuData;

  // Helper function to check if a mega menu has content
  const hasMegaMenuContent = (key: string) => {
    const menuData = finalMegaMenuData[key];
    if (!menuData || !menuData.sections) return false;

    // Check if there are sections with items
    return menuData.sections.some(
      (section: any) => section.items && section.items.length > 0
    );
  };

  // console.log("Final mega menu data being used:", finalMegaMenuData);  // Transform header menu data into navigation items
  const navigationItems = headerMenus[0]?.menuItems?.map((menuItem: any) => ({
    name: menuItem.title,
    path: menuItem.url || "#",
    key: menuItem.title.toLowerCase(),
  })) || [
    // Fallback navigation items
    { name: "Explore", path: "/explore", key: "explore" },
    { name: "Experience", path: "/experience", key: "experience" },
    { name: "Belama", path: "/belama", key: "belama" },
  ];

  // Currency Dropdown Component - Memoized to prevent re-renders
  const CurrencyDropdown = React.memo(({ 
    isDesktop = true, 
    headerHovered = false, 
    megaMenuActive = false 
  }: { 
    isDesktop?: boolean;
    headerHovered?: boolean;
    megaMenuActive?: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Close dropdown when header becomes transparent
    React.useEffect(() => {
      if (!headerHovered && !megaMenuActive) {
        setIsOpen(false);
      }
    }, [headerHovered, megaMenuActive]);

    if (isDesktop) {
      // Desktop: Use existing Popover
      return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <motion.button
              className="cursor-pointer p-1 lg:p-2 xl:p-1 flex items-center"
              initial={{ color: "#ffffff" }}
              animate={{
                color: isHovered || activeMegaMenu ? "#212061" : "#ffffff",
              }}
              whileHover={{
                color: "#1d4ed8",
              }}
              transition={{ 
                duration: 0.25, 
                ease: [0.25, 0.46, 0.45, 0.94] 
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
                ease: [0.25, 0.46, 0.45, 0.94] 
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
                    color: headerHovered || megaMenuActive ? "#212061" : "#ffffff",
                  }}
                  transition={{ 
                  duration: 0.25, 
                  ease: [0.25, 0.46, 0.45, 0.94] 
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
  });

  // Desktop General Dropdown Component - Memoized to prevent re-renders
  const GeneralDropdown = React.memo(({ 
    headerHovered = false, 
    megaMenuActive = false 
  }: { 
    headerHovered?: boolean;
    megaMenuActive?: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Close dropdown when header becomes transparent
    React.useEffect(() => {
      if (!headerHovered && !megaMenuActive) {
        setIsOpen(false);
      }
    }, [headerHovered, megaMenuActive]);
    
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <motion.button
            className="cursor-pointer p-1 lg:p-2 xl:p-1 flex items-center"
            initial={{ color: "#ffffff" }}
            animate={{
              color: headerHovered || megaMenuActive ? "#212061" : "#ffffff",
            }}
            transition={{ 
                duration: 0.25, 
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
            aria-label="General"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 lg:h-6 lg:w-6 xl:h-6 xl:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {/* Removed the word 'General' for desktop */}
          </motion.button>
        </PopoverTrigger>
        <PopoverContent
          className="w-48 p-2"
          align="end"
          side="bottom"
          sideOffset={16}
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
            General
          </div>
          <div className="flex flex-col gap-1">
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md hover:bg-yellow-50 text-gray-700 text-sm font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/news"
              className="block px-3 py-2 rounded-md hover:bg-yellow-50 text-gray-700 text-sm font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              News
            </Link>
            <Link
              href="/travel-alerts"
              className="block px-3 py-2 rounded-md hover:bg-yellow-50 text-gray-700 text-sm font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Travel Alerts
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    );
  });

  // Unified Mega Menu Component - Single container that changes content
  const UnifiedMegaMenu = React.memo(() => {
    const currentData = activeMegaMenu ? finalMegaMenuData[activeMegaMenu as keyof typeof finalMegaMenuData] : null;
    const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false);
    
    // Track if ANY megamenu is open (boolean state instead of specific menu)
    React.useEffect(() => {
      setIsMegaMenuOpen(!!activeMegaMenu);
    }, [!!activeMegaMenu]); // Only depend on boolean presence, not the specific value
    
    return (
      <>
        {/* Container - only animate based on boolean open/closed state */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              initial={{ 
                opacity: 0, 
                y: -8
              }}
              animate={{ 
                opacity: 1, 
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                y: -8
              }}
              transition={{
                duration: 0.25,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 z-40 max-h-[calc(16rem-4rem)] sm:max-h-[calc(20rem-4rem)] lg:max-h-[calc(25rem-4rem)] overflow-y-auto hidden xl:block"
            >
              <div className="max-w-[70.5rem] mx-auto py-4 px-4 sm:px-6 lg:px-8 xl:px-0">
                {/* Content - animate only when switching between nav items */}
                <AnimatePresence mode="wait">
                  {currentData && (
                    <motion.div
                      key={activeMegaMenu}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.15,
                        ease: "easeInOut"
                      }}
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        {currentData.title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentData.sections.map((section: any, index: number) => (
                          <div key={index} className="space-y-3">
                            <h4 className="text-sm font-semibold uppercase text-blue-600">
                              {section.title}
                            </h4>
                            <ul className="space-y-2">
                              {section.items.map((item: any, itemIndex: number) => (
                                <li key={itemIndex}>
                                  <Link
                                    href={item.href || "#"}
                                    className="group block p-1.5 rounded-lg hover:bg-yellow-50 transition-colors"
                                    onClick={() => {
                                      setActiveMegaMenu(null);
                                      setIsHovered(false);
                                    }}
                                  >
                                    <div className="text-sm text-gray-800 group-hover:text-blue-600">
                                      {item.name}
                                    </div>
                                    {item.description && (
                                      <div className="text-xs text-gray-500">
                                        {item.description}
                                      </div>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      {/* Horizontal line at bottom */}
                      <div className="border-b border-gray-200 mt-4"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  });

  // Mobile Menu Component
  const MobileMenu = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <div
          // Commenting out mobile animations for now
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // exit={{ opacity: 0 }}
          // transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-white xl:hidden flex flex-col"
        >
          {/* Mobile menu header */}
          <div className="flex items-center justify-between p-4">
            {/* Back button - show when not on main page or in General/Currency submenu */}
            {mobileMenuPage !== "main" ||
            mobileMenuColumn ||
            mobileGeneralPage ||
            mobileCurrencyPage ? (
              <button
                onClick={() => {
                  if (mobileGeneralPage) {
                    setMobileGeneralPage(false);
                  } else if (mobileCurrencyPage) {
                    setMobileCurrencyPage(false);
                  } else if (mobileMenuColumn) {
                    setMobileMenuColumn(null);
                  } else {
                    setMobileMenuPage("main");
                  }
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Back"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            ) : (
              <div className="w-10 h-10"></div>
            )}

            {/* Page title - centered */}
            <h1 className="text-sm font-medium text-gray-800 capitalize">
              {mobileGeneralPage
                ? "General"
                : mobileCurrencyPage
                ? "Select Currency"
                : mobileMenuColumn
                ? mobileMenuColumn.title
                : mobileMenuPage !== "main"
                ? mobileMenuPage
                : ""}
            </h1>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setMobileMenuPage("main");
                setMobileMenuColumn(null);
                setMobileGeneralPage(false);
                setMobileCurrencyPage(false);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Horizontal line under header */}
          <div className="border-b border-gray-200"></div>

          {/* Mobile menu content */}
          <div
            className="flex-1 px-4 py-6 overflow-y-auto overflow-x-hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* Main navigation page */}
            {mobileMenuPage === "main" &&
              !mobileMenuColumn &&
              !mobileGeneralPage &&
              !mobileCurrencyPage && (
                <>
                  <nav className="space-y-6">
                    {navigationItems.map((item: any) => (
                      <div key={item.name}>
                        {/* Check if item has submenu content */}
                        {hasMegaMenuContent(item.key) ? (
                          <button
                            onClick={() => setMobileMenuPage(item.key)}
                            className="w-full flex items-center justify-between text-base font-medium text-gray-800 hover:text-blue-600 transition-colors py-2"
                          >
                            <span>{item.name}</span>
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        ) : (
                          <Link
                            href={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-base font-sans font-medium text-gray-800 hover:text-blue-600 transition-colors py-2"
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </nav>
                  {/* Mobile action buttons - only show on top-level */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col items-start gap-6">
                      {/* General */}
                      <button
                        className="flex flex-row items-center justify-start p-0 bg-transparent border-none focus:outline-none w-full"
                        aria-label="General"
                        onClick={() => setMobileGeneralPage(true)}
                      >
                        <span className="py-3 rounded-full text-gray-600 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </span>
                        <span className="ml-3 text-base font-medium text-gray-700">
                          General
                        </span>
                        <span className="ml-auto">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </button>
                      {/* Currency - now navigates to currency page */}
                      <button
                        className="flex flex-row items-center justify-start p-0 bg-transparent border-none focus:outline-none w-full"
                        aria-label="Currency"
                        onClick={() => setMobileCurrencyPage(true)}
                      >
                        <span className="py-3 rounded-full text-gray-600 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                          >
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a15.91,15.91,0,0,0-11-8.67l-8-1.73L96.14,104h16.71a16.06,16.06,0,0,0,7.73-2l12.25-6.76a16.62,16.62,0,0,0,3-2.14l26.91-24.34A15.93,15.93,0,0,0,166,49.1l-.36-.65A88.11,88.11,0,0,1,216,128ZM143.31,41.34,152,56.9,125.09,81.24,112.85,88H96.14a16,16,0,0,0-13.88,8l-8.73,15.23L63.38,84.19,74.32,58.32a87.87,87.87,0,0,1,69-17ZM40,128a87.53,87.53,0,0,1,8.54-37.8l11.34,30.27a16,16,0,0,0,11.62,10l21.43,4.61L96.74,143a16.09,16.09,0,0,0,14.4,9h1.48l-7.23,16.23a16,16,0,0,0,2.86,17.37l.14.14L128,205.94l-1.94,10A88.11,88.11,0,0,1,40,128Zm102.58,86.78,1.13-5.81a16.09,16.09,0,0,0-4-13.9,1.85,1.85,0,0,1-.14-.14L120,174.74,133.7,144l22.82,3.08,45.72,28.12A88.18,88.18,0,0,1,142.58,214.78Z"></path>
                          </svg>
                        </span>
                        <span className="ml-3 flex flex-col items-start text-base font-medium font-sans text-gray-700">
                          {selectedCurrency ? (
                            <>
                              <span className="leading-tight">
                                {selectedCurrency.countryName}
                              </span>
                              <span className="text-xs text-gray-500 leading-tight">
                                {selectedCurrency.currencyCode}
                              </span>
                            </>
                          ) : (
                            <span>Currency</span>
                          )}
                        </span>
                        <span className="ml-auto">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </button>
                      {/* Contact */}
                      <button
                        className="flex flex-row items-center justify-start p-0 bg-transparent border-none focus:outline-none"
                        aria-label="Contact"
                      >
                        <span className="py-3 rounded-full text-gray-600 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z"
                            />
                          </svg>
                        </span>
                        <span className="ml-3 text-base font-medium text-gray-700">
                          Contact Us
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            {/* General submenu page */}
            {mobileGeneralPage && (
              <div className="space-y-4">
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-base text-gray-800 hover:text-blue-600 transition-colors py-2 px-2 rounded-lg"
                  >
                    About
                  </Link>
                  <Link
                    href="/news"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-base text-gray-800 hover:text-blue-600 transition-colors py-2 px-2 rounded-lg"
                  >
                    News
                  </Link>
                  <Link
                    href="/travel-alerts"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-base text-gray-800 hover:text-blue-600 transition-colors py-2 px-2 rounded-lg"
                  >
                    Travel Alerts
                  </Link>
                </nav>
              </div>
            )}
            {/* Currency selection page */}
            {mobileCurrencyPage && (
              <div className="h-full flex flex-col">
                <div
                  className="flex-1 overflow-y-auto overflow-x-hidden"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <div className="flex flex-col gap-2 pb-4">
                    {currencies.map((currency) => (
                      <button
                        key={currency.currencyCode}
                        onClick={() => {
                          setSelectedCurrency(currency);
                          setMobileCurrencyPage(false);
                          setIsMobileMenuOpen(false);
                          setMobileMenuPage("main");
                          setMobileMenuColumn(null);
                          setMobileGeneralPage(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-yellow-50 transition-colors ${
                          selectedCurrency?.currencyCode ===
                          currency.currencyCode
                            ? "bg-yellow-200 text-yellow-900"
                            : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">
                              {currency.currencyCode} -{" "}
                              {currency.currencySymbol}
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
                </div>
              </div>
            )}
            {/* Submenu sections page - show column titles */}
            {mobileMenuPage !== "main" &&
              !mobileMenuColumn &&
              !mobileGeneralPage &&
              !mobileCurrencyPage &&
              finalMegaMenuData[mobileMenuPage] && (
                <div className="space-y-6">
                  <nav className="space-y-6">
                    {finalMegaMenuData[mobileMenuPage].sections?.map(
                      (section: any, sectionIndex: number) => (
                        <div key={sectionIndex}>
                          {section.items && section.items.length === 1 ? (
                            // If only one item, show it directly as a link
                            <Link
                              href={section.items[0].href || "#"}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block w-full text-base text-gray-800 hover:text-blue-600 transition-colors py-2 rounded-lg"
                            >
                              <div>{section.items[0].name}</div>
                              {section.items[0].description && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {section.items[0].description}
                                </div>
                              )}
                            </Link>
                          ) : (
                            // Otherwise, show the button to go to the column page
                            <button
                              onClick={() => setMobileMenuColumn(section)}
                              className="w-full flex items-center justify-between text-base font-medium text-gray-800 hover:text-blue-600 transition-colors py-2"
                            >
                              <span>{section.title}</span>
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      )
                    )}
                  </nav>
                </div>
              )}
            {/* Column items page - show individual items */}
            {mobileMenuColumn && !mobileGeneralPage && (
              <div className="space-y-6">
                <nav className="space-y-2">
                  {mobileMenuColumn.items?.map(
                    (subItem: any, subItemIndex: number) => (
                      <div key={subItemIndex}>
                        <Link
                          href={subItem.href || "#"}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-gray-900 hover:text-blue-600 transition-colors py-2 px-2 rounded-lg"
                        >
                          <div>{subItem.name}</div>
                          {subItem.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {subItem.description}
                            </div>
                          )}
                        </Link>
                      </div>
                    )
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
  // Handle window resize to close mobile menu on desktop
  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        // xl breakpoint
        setIsMobileMenuOpen(false);
        setActiveMegaMenu(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient]);

  // Update selected currency when currencies prop changes
  useEffect(() => {
    if (currencies.length > 0 && !selectedCurrency) {
      setSelectedCurrency(currencies[0]);
    }
  }, [currencies, selectedCurrency]);
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (megaMenuCloseTimeout) {
        clearTimeout(megaMenuCloseTimeout);
      }
    };
  }, [megaMenuCloseTimeout]);

  // Memoized Desktop Action Buttons to prevent unnecessary re-renders but allow color changes
  const DesktopActionButtons = React.useMemo(() => (
    <div
      className="hidden xl:flex items-center justify-end gap-2 w-36 lg:w-40 xl:w-36"
      onMouseEnter={() => {
        // Clear any pending close timeout
        if (megaMenuCloseTimeout) {
          clearTimeout(megaMenuCloseTimeout);
          setMegaMenuCloseTimeout(null);
        }
        setActiveMegaMenu(null);
      }}
      style={{
        // Prevent flickering by ensuring icons maintain stable states
        transition: "none"
      }}
    >
      {/* General Dropdown - Use the component */}
      <GeneralDropdown 
        headerHovered={isHovered} 
        megaMenuActive={isMegaMenuOpen} 
      />

      {/* Currency Dropdown - Use the component */}
      <CurrencyDropdown 
        isDesktop={true}
        headerHovered={isHovered} 
        megaMenuActive={isMegaMenuOpen} 
      />
      <motion.button
        className="h-8 px-4 rounded-full text-sm font-medium transition-all duration-200 ease-out"
        initial={{ 
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "#ffffff",
          borderColor: "rgba(255, 255, 255, 0.2)"
        }}
        animate={{
          backgroundColor: isHovered || isMegaMenuOpen 
            ? "transparent" 
            : "rgba(255, 255, 255, 0.1)",
          color: isHovered || isMegaMenuOpen ? "#212061" : "#ffffff",
          borderColor: isHovered || isMegaMenuOpen 
            ? "#212061" 
            : "rgba(255, 255, 255, 0.2)"
        }}
        whileHover={{
          backgroundColor: isHovered || isMegaMenuOpen 
            ? "rgba(33, 32, 97, 0.05)" 
            : "rgba(255, 255, 255, 0.2)"
        }}
        transition={{ 
          duration: 0.25, 
          ease: [0.25, 0.46, 0.45, 0.94] 
        }}
        style={{
          border: "2px solid"
        }}
        aria-label="Contact"
      >
        Contact
      </motion.button>
    </div>
  ), [isHovered, isMegaMenuOpen, megaMenuCloseTimeout, selectedCurrency]); // Include dependencies for color changes and currency updates

  return (
    <>
      <motion.header
        className="w-full absolute z-40"
        animate={{
          top: hasTravelAlert ? "46px" : "0px",
          backgroundColor:
            isHovered || activeMegaMenu
              ? "rgba(255, 255, 255, 0.98)"
              : "rgba(255, 255, 255, 0)",
          backdropFilter: isHovered || activeMegaMenu ? "blur(8px)" : "blur(0px)",
        }}
        transition={{
          backgroundColor: { 
            duration: 0.25, 
            ease: [0.25, 0.46, 0.45, 0.94] // Premium easing curve
          },
          backdropFilter: { 
            duration: 0.3, 
            ease: "easeOut" 
          },
          top: { 
            duration: 0.2, 
            ease: "easeOut" 
          }
        }}
        style={{
          willChange: isHovered || activeMegaMenu ? "background-color, backdrop-filter, box-shadow" : "auto",
          boxShadow:
            isHovered || activeMegaMenu
              ? "0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 2px 8px -2px rgba(0, 0, 0, 0.06)"
              : "0 0 0 0 rgba(0, 0, 0, 0)",
          transition: "box-shadow 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          // Add a small delay before closing megamenu to prevent flickering when moving between nav items
          const timeout = setTimeout(() => {
            setActiveMegaMenu(null);
            setMegaMenuCloseTimeout(null);
          }, 100);
          setMegaMenuCloseTimeout(timeout);
        }}
      >
        <div className="max-w-[70.5rem] mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 xl:px-0 relative">
          <div className="flex items-center">
            <Link 
              href="/"
              onMouseEnter={() => {
                // Clear any pending close timeout
                if (megaMenuCloseTimeout) {
                  clearTimeout(megaMenuCloseTimeout);
                  setMegaMenuCloseTimeout(null);
                }
                setActiveMegaMenu(null);
              }}
            >
              <motion.div
                animate={{
                  opacity: 1,
                }}
                transition={{ 
                duration: 0.25, 
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
              >
                {/* Desktop Logo */}
                <Image
                  src={
                    isHovered || activeMegaMenu
                      ? "/logo.svg"
                      : "/logo-white.svg"
                  }
                  alt="Solomon Airlines Logo"
                  width={150}
                  height={40}
                  className="h-6 w-auto hidden xl:block"
                />

                {/* Mobile Logo */}
                <Image
                  src={
                    isHovered || activeMegaMenu
                      ? "/logo-mobile.svg"
                      : "/logo-mobile-white.svg"
                  }
                  alt="Solomon Airlines Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 xl:hidden"
                />
              </motion.div>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-3 lg:space-x-4 xl:space-x-4 justify-between font-sans relative">
            {navigationItems.map((item: any) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => {
                  // Clear any pending close timeout
                  if (megaMenuCloseTimeout) {
                    clearTimeout(megaMenuCloseTimeout);
                    setMegaMenuCloseTimeout(null);
                  }
                  
                  // Only activate mega menu if it has content and on desktop
                  if (
                    hasMegaMenuContent(item.key) &&
                    isClient &&
                    window.innerWidth >= 1280
                  ) {
                    setActiveMegaMenu(item.key);
                  }
                }}
              >
                <Link
                  href={item.path}
                  onClick={() => {
                    setActiveMegaMenu(null);
                    // Don't reset hover state since user is still hovering over header
                  }}
                  className="relative block"
                >
                  {/* Active state background */}
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    initial={{ 
                      backgroundColor: "rgba(100, 116, 139, 0)",
                      scale: 0.95 
                    }}
                    animate={{
                      backgroundColor: activeMegaMenu === item.key 
                        ? "rgba(100, 116, 139, 0.08)" 
                        : "rgba(100, 116, 139, 0)",
                      scale: activeMegaMenu === item.key ? 1 : 0.95
                    }}
                    transition={{
                      duration: 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  />
                  
                  <motion.span
                    className="relative text-sm lg:text-base xl:text-sm font-bold cursor-pointer px-3 py-1 block"
                    initial={{ color: "#ffffff" }}
                    animate={{
                      color:
                        isHovered || activeMegaMenu ? "#212061" : "#ffffff",
                    }}
                    transition={{ 
                      duration: 0.25, 
                      ease: [0.25, 0.46, 0.45, 0.94] 
                    }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              </div>
            ))}
          </nav>
          {/* Desktop Action Buttons */}
          {DesktopActionButtons}
          {/* Mobile Menu Toggle */}
          <div className="xl:hidden flex items-center">
            <motion.button
              onClick={() => {
                setIsMobileMenuOpen(true);
                // Reset mobile menu to top level when opening
                setMobileMenuPage("main");
                setMobileMenuColumn(null);
              }}
              className="p-2 lg:p-3 xl:p-2 rounded-lg hover:bg-black/10 transition-colors"
              initial={{ color: "#ffffff" }}
              animate={{
                color: isHovered || activeMegaMenu ? "#212061" : "#ffffff",
              }}
              whileHover={{
                backgroundColor:
                  isHovered || activeMegaMenu
                    ? "rgba(0,0,0,0.1)"
                    : "rgba(255,255,255,0.1)",
              }}
              transition={{ duration: 0.2 }}
              aria-label="Open menu"
            >
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6 xl:w-6 xl:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.button>
          </div>
        </div>
        {/* Unified Mega Menu */}
        <UnifiedMegaMenu />
        {/* Mobile Menu */}
        <MobileMenu />
      </motion.header>

      {/* Background overlay when megamenu is open */}
      <AnimatePresence>
        {activeMegaMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-gray-900 bg-opacity-85 z-30 hidden xl:block"
            style={{
              top: hasTravelAlert ? "46px" : "0px",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;

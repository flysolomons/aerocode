"use client";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Currency } from "@/graphql/HeaderQuery";
import { useCurrency } from "@/contexts/CurrencyContext";

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  mobileMenuPage: "main" | string;
  setMobileMenuPage: (page: "main" | string) => void;
  mobileMenuColumn: any | null;
  setMobileMenuColumn: (column: any | null) => void;
  mobileGeneralPage: boolean;
  setMobileGeneralPage: (general: boolean) => void;
  mobileCurrencyPage: boolean;
  setMobileCurrencyPage: (currency: boolean) => void;
  navigationItems: any[];
  hasMegaMenuContent: (key: string) => boolean;
  finalMegaMenuData: any;
  currencies: Currency[];
}

const MobileMenu = React.memo(
  ({
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    mobileMenuPage,
    setMobileMenuPage,
    mobileMenuColumn,
    setMobileMenuColumn,
    mobileGeneralPage,
    setMobileGeneralPage,
    mobileCurrencyPage,
    setMobileCurrencyPage,
    navigationItems,
    hasMegaMenuContent,
    finalMegaMenuData,
    currencies,
  }: MobileMenuProps) => {
    const { selectedCurrency, setSelectedCurrency } = useCurrency();

    return (
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[60] xl:hidden flex flex-col"
            style={{
              backgroundColor: "#ffffff",
              width: "100vw",
              height: "100vh",
            }}
          >
            {/* Mobile menu header */}
            <div
              className="flex items-center justify-between px-4 border-b border-gray-200 bg-white"
              style={{ height: "69px" }}
            >
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
              <h1 className="text-sm font-semibold text-gray-800 capitalize">
                {mobileGeneralPage
                  ? "General"
                  : mobileCurrencyPage
                  ? "Select Currency"
                  : mobileMenuColumn
                  ? mobileMenuColumn.title
                  : mobileMenuPage !== "main"
                  ? mobileMenuPage
                  : "Menu"}
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

            {/* Mobile menu content */}
            <div
              className="flex-1 px-7 py-6 bg-white overflow-y-auto"
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
                              className="w-full flex items-center justify-between text-base font-medium text-gray-800 hover:text-blue-600 transition-colors py-2 px-0"
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
                              className="block text-base font-sans font-medium text-gray-800 hover:text-blue-600 transition-colors py-2 px-0"
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
                          className="flex flex-row items-center justify-start px-0 bg-transparent border-none focus:outline-none w-full"
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
                          className="flex flex-row items-center justify-start px-0 bg-transparent border-none focus:outline-none w-full"
                          aria-label="Currency"
                          onClick={() => setMobileCurrencyPage(true)}
                        >
                          <span className="py-3 rounded-full text-gray-600 transition-colors">
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
                              className="h-6 w-6"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                              <path d="M12 18V6" />
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
                        <Link
                          href="/contact-us"
                          className="flex flex-row items-center justify-start px-0 bg-transparent border-none focus:outline-none"
                          aria-label="Contact"
                          onClick={() => setIsMobileMenuOpen(false)}
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
                          <span className="ml-3 text-base font-medium font-sans text-gray-700">
                            Contact Us
                          </span>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              {/* General submenu page */}
              {mobileGeneralPage && (
                <div className="space-y-4">
                  <nav className="flex flex-col gap-4">
                    <Link
                      href="/travel-alerts"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-base text-gray-800 hover:text-blue-600 transition-colors py-2 px-0 rounded-lg"
                    >
                      Travel Alerts
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-base text-gray-800 hover:text-blue-600 transition-colors py-2 px-0 rounded-lg"
                    >
                      About
                    </Link>
                    <Link
                      href="/news"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-base text-gray-800 hover:text-blue-600 transition-colors py-2 px-0 rounded-lg"
                    >
                      News
                    </Link>
                    <Link
                      href="/careers"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-base text-gray-800 hover:text-blue-600 transition-colors py-2 px-0 rounded-lg"
                    >
                      Careers
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
                                className="block w-full text-base text-gray-800 hover:text-blue-600 transition-colors py-2 px-0 rounded-lg"
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
                                className="w-full flex items-center justify-between text-base font-medium text-gray-800 hover:text-blue-600 transition-colors py-2 px-0"
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
                <div>
                  <nav className="space-y-6">
                    {mobileMenuColumn.items?.map(
                      (subItem: any, subItemIndex: number) => (
                        <div key={subItemIndex}>
                          <Link
                            href={subItem.href || "#"}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-gray-900 hover:text-blue-600 transition-colors py-2 px-0 rounded-lg"
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
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

MobileMenu.displayName = "MobileMenu";

export default MobileMenu;

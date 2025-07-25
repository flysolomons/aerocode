"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TransformedHeaderMenu, Currency } from "@/graphql/HeaderQuery";
import { useTravelAlert } from "../banner/TravelAlertContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import UnifiedMegaMenu from "./UnifiedMegaMenu";
import MobileMenu from "./MobileMenu";
import DesktopActionButtons from "./DesktopActionButtons";

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
  const [megaMenuCloseTimeout, setMegaMenuCloseTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileMenuPage, setMobileMenuPage] = useState<"main" | string>("main");
  const [mobileMenuColumn, setMobileMenuColumn] = useState<any | null>(null);
  const [mobileGeneralPage, setMobileGeneralPage] = useState(false);
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

  return (
    <>
      <motion.header
        className={`w-full absolute z-40 transition-all duration-300 ${
          isHovered || activeMegaMenu
            ? "xl:rounded-none rounded-b-lg"
            : "xl:rounded-none rounded-b-lg"
        }`}
        animate={{
          top: hasTravelAlert ? "46px" : "0px",
          backgroundColor:
            isHovered || activeMegaMenu
              ? "rgba(255, 255, 255, 0.98)"
              : "rgba(255, 255, 255, 0)",
          backdropFilter:
            isHovered || activeMegaMenu ? "blur(8px)" : "blur(0px)",
        }}
        transition={{
          backgroundColor: {
            duration: 0.25,
            ease: [0.25, 0.46, 0.45, 0.94], // Premium easing curve
          },
          backdropFilter: {
            duration: 0.3,
            ease: "easeOut",
          },
          top: {
            duration: 0.2,
            ease: "easeOut",
          },
        }}
        style={{
          willChange:
            isHovered || activeMegaMenu
              ? "background-color, backdrop-filter, box-shadow"
              : "auto",
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
        <div className="max-w-[70.5rem] mx-auto flex items-center justify-between py-3 xl:py-4 px-4 sm:px-6 lg:px-8 xl:px-0 relative">
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
                  ease: [0.25, 0.46, 0.45, 0.94],
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

                {/* Mobile Logo - Switches based on header state */}
                <Image
                  src={
                    isHovered || activeMegaMenu
                      ? "/logo-mobile.svg"
                      : "/logo-mobile-white.svg"
                  }
                  alt="Solomon Airlines Logo"
                  width={45}
                  height={45}
                  className="h-[45px] w-[45px] xl:hidden"
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
                      scale: 0.95,
                    }}
                    animate={{
                      backgroundColor:
                        activeMegaMenu === item.key
                          ? "rgba(100, 116, 139, 0.08)"
                          : "rgba(100, 116, 139, 0)",
                      scale: activeMegaMenu === item.key ? 1 : 0.95,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
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
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              </div>
            ))}
          </nav>
          {/* Desktop Action Buttons */}
          <DesktopActionButtons
            isHovered={isHovered}
            isMegaMenuOpen={isMegaMenuOpen}
            megaMenuCloseTimeout={megaMenuCloseTimeout}
            setMegaMenuCloseTimeout={setMegaMenuCloseTimeout}
            setActiveMegaMenu={setActiveMegaMenu}
            currencies={currencies}
          />
          {/* Mobile Menu Toggle */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => {
                setIsMobileMenuOpen(true);
                setMobileMenuPage("main");
                setMobileMenuColumn(null);
                setMobileGeneralPage(false);
                setMobileCurrencyPage(false);
              }}
              className={`p-2 rounded-lg transition-colors ${
                isHovered || activeMegaMenu
                  ? "hover:bg-gray-100"
                  : "hover:bg-white/10"
              }`}
              aria-label="Open menu"
            >
              <svg
                className={`w-7 h-7 transition-colors ${
                  isHovered || activeMegaMenu ? "text-blue-600" : "text-white"
                }`}
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
            </button>
          </div>
        </div>
        {/* Unified Mega Menu */}
        <UnifiedMegaMenu
          activeMegaMenu={activeMegaMenu}
          finalMegaMenuData={finalMegaMenuData}
          setActiveMegaMenu={setActiveMegaMenu}
          setIsHovered={setIsHovered}
        />
        {/* Mobile Menu */}
        <MobileMenu
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          mobileMenuPage={mobileMenuPage}
          setMobileMenuPage={setMobileMenuPage}
          mobileMenuColumn={mobileMenuColumn}
          setMobileMenuColumn={setMobileMenuColumn}
          mobileGeneralPage={mobileGeneralPage}
          setMobileGeneralPage={setMobileGeneralPage}
          mobileCurrencyPage={mobileCurrencyPage}
          setMobileCurrencyPage={setMobileCurrencyPage}
          navigationItems={navigationItems}
          hasMegaMenuContent={hasMegaMenuContent}
          finalMegaMenuData={finalMegaMenuData}
          currencies={currencies}
        />
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

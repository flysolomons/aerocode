"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformedHeaderMenu } from "@/graphql/HeaderQuery";

function Header({ headerMenus }: { headerMenus: TransformedHeaderMenu[] }) {
  const [isWhiteHeader, setIsWhiteHeader] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Fallback data for mega menus
  const megaMenuData = {
    explore: {
      // title: "Explore Destinations",
      sections: [
        {
          title: "Popular Destinations",
          items: [
            { name: "Honiara", description: "Capital city and gateway" },
            { name: "Gizo", description: "Western Province hub" },
            { name: "Munda", description: "Beautiful lagoons" },
            { name: "Tulagi", description: "Historic island" },
          ],
        },
        {
          title: "Island Groups",
          items: [
            {
              name: "Central Province",
              description: "Heart of Solomon Islands",
            },
            { name: "Western Province", description: "Pristine waters" },
            { name: "Guadalcanal", description: "Main island adventures" },
            { name: "Malaita", description: "Cultural experiences" },
          ],
        },
        {
          title: "Activities",
          items: [
            {
              name: "Diving & Snorkeling",
              description: "World-class dive sites",
            },
            { name: "Island Hopping", description: "Explore multiple islands" },
            { name: "Cultural Tours", description: "Traditional experiences" },
            { name: "Adventure Sports", description: "Thrilling activities" },
          ],
        },
      ],
    },
    experience: {
      // title: "Unique Experiences",
      sections: [
        {
          title: "Cultural Experiences",
          items: [
            {
              name: "Traditional Villages",
              description: "Authentic community visits",
            },
            { name: "Local Markets", description: "Fresh produce and crafts" },
            { name: "Cultural Shows", description: "Traditional performances" },
            { name: "Cooking Classes", description: "Learn local cuisine" },
          ],
        },
        {
          title: "Adventure Activities",
          items: [
            { name: "Scuba Diving", description: "WWII wrecks and reefs" },
            { name: "Fishing Charters", description: "Sport and game fishing" },
            { name: "Hiking Tours", description: "Jungle and mountain trails" },
            { name: "Kayaking", description: "Lagoon explorations" },
          ],
        },
        {
          title: "Relaxation",
          items: [
            { name: "Beach Resorts", description: "Luxury accommodations" },
            { name: "Spa Treatments", description: "Traditional wellness" },
            { name: "Sunset Cruises", description: "Romantic evenings" },
            { name: "Private Islands", description: "Exclusive getaways" },
          ],
        },
      ],
    },
    belama: {
      // title: "Belama Express",
      sections: [
        {
          title: "Services",
          items: [
            {
              name: "Express Flights",
              description: "Fast inter-island connections",
            },
            {
              name: "Charter Services",
              description: "Private flight solutions",
            },
            { name: "Scenic Tours", description: "Aerial sightseeing" },
            { name: "Medical Transfers", description: "Emergency transport" },
          ],
        },
        {
          title: "Routes",
          items: [
            { name: "Honiara Hub", description: "Central connections" },
            { name: "Western Routes", description: "Gizo and Munda" },
            { name: "Eastern Routes", description: "Remote island access" },
            { name: "Special Charters", description: "Custom destinations" },
          ],
        },
        {
          title: "Benefits",
          items: [
            {
              name: "Time Saving",
              description: "Quick travel between islands",
            },
            { name: "Reliability", description: "Weather-dependent service" },
            { name: "Comfort", description: "Modern aircraft fleet" },
            { name: "Flexibility", description: "Multiple daily flights" },
          ],
        },
      ],
    },
  };
  // Use transformed data if available, otherwise use fallback
  const finalMegaMenuData =
    Object.keys(transformedMegaMenuData).length > 0
      ? transformedMegaMenuData
      : megaMenuData;

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

  // console.log("Navigation items:", navigationItems); // Mega Menu Component
  const MegaMenu = ({ data, isVisible }: { data: any; isVisible: boolean }) => (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 z-40 max-h-[344px] hidden lg:block"
        >
          <div className="max-w-[70.5rem] mx-auto py-6 px-4 sm:px-6 lg:px-0">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {data.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.sections.map((section: any, index: number) => (
                <div key={index} className="space-y-3">
                  <h4 className="text-base font-semibold text-blue-600">
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.items.map((item: any, itemIndex: number) => (
                      <li key={itemIndex}>
                        <Link
                          href={item.href || "#"}
                          className="group block p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          onClick={() => {
                            setActiveMegaMenu(null);
                            setIsHovered(false);
                          }}
                        >
                          <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Mobile Menu Component
  const MobileMenu = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-white lg:hidden"
        >
          {/* Mobile menu header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Image
                src="/logo.svg"
                alt="Solomon Airlines Logo"
                width={120}
                height={32}
                className="h-5 w-auto"
              />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
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
          <div className="px-4 py-6 overflow-y-auto">
            <nav className="space-y-6">
              {navigationItems.map((item: any) => (
                <div key={item.name}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors py-2"
                  >
                    {item.name}
                  </Link>

                  {/* Mobile mega menu sections */}
                  {hasMegaMenuContent(item.key) &&
                    finalMegaMenuData[item.key] && (
                      <div className="mt-3 ml-4 space-y-4">
                        {finalMegaMenuData[item.key].sections?.map(
                          (section: any, sectionIndex: number) => (
                            <div key={sectionIndex}>
                              <h4 className="text-sm font-semibold text-blue-600 mb-2">
                                {section.title}
                              </h4>
                              <ul className="space-y-1">
                                {section.items?.map(
                                  (subItem: any, subItemIndex: number) => (
                                    <li key={subItemIndex}>
                                      <Link
                                        href={subItem.href || "#"}
                                        onClick={() =>
                                          setIsMobileMenuOpen(false)
                                        }
                                        className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-1"
                                      >
                                        {subItem.name}
                                      </Link>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              ))}
            </nav>

            {/* Mobile action buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6">
                <button
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  aria-label="Information"
                >
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
                </button>
                <button
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  aria-label="Language"
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
                <button
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  aria-label="Contact"
                >
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
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scroll direction
      const isScrollUp = currentScrollY < lastScrollY;
      setIsScrollingUp(isScrollUp); // Check if we're at the top
      const isTop = currentScrollY < 50;
      setIsAtTop(isTop); // Logic for white header - only show when scrolling up significantly and not at top
      if (
        isScrollUp &&
        currentScrollY > 200 &&
        !isTop &&
        lastScrollY - currentScrollY > 10
      ) {
        setIsWhiteHeader(true);
      }
      // Hide white header immediately when scrolling down or at top
      else if (!isScrollUp || isTop) {
        setIsWhiteHeader(false);
      }

      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isScrollingUp]);

  // Handle window resize to close mobile menu on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setIsMobileMenuOpen(false);
        setActiveMegaMenu(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // If at top, render transparent header
  if (isAtTop) {
    return (
      <motion.header
        className="w-full absolute top-0 z-50"
        animate={{
          backgroundColor:
            isHovered || activeMegaMenu
              ? "rgba(255, 255, 255, 1)"
              : "rgba(255, 255, 255, 0)",
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setActiveMegaMenu(null);
        }}
        style={{
          boxShadow:
            isHovered || activeMegaMenu
              ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
              : "none",
        }}
      >
        <div className="max-w-[70.5rem] mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-0 relative">
          <div className="flex items-center">
            <Link href="/">
              <motion.div
                animate={{
                  opacity: 1,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Image
                  src={
                    isHovered || activeMegaMenu
                      ? "/logo.svg"
                      : "/logo-white.svg"
                  }
                  alt="Solomon Airlines Logo"
                  width={150}
                  height={40}
                  className="h-5 sm:h-6 w-auto"
                />
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 justify-between font-sans relative">
            {navigationItems.map((item: any) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => {
                  // Only activate mega menu if it has content and on desktop
                  if (
                    hasMegaMenuContent(item.key) &&
                    window.innerWidth >= 1024
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
                >
                  <motion.span
                    className="text-sm font-bold cursor-pointer"
                    animate={{
                      color:
                        isHovered || activeMegaMenu ? "#212061" : "#ffffff",
                    }}
                    whileHover={{
                      color: "#2563eb",
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center justify-end gap-3 w-36">
            <motion.button
              className="cursor-pointer"
              animate={{
                color: isHovered || activeMegaMenu ? "#212061" : "#ffffff",
              }}
              whileHover={{
                color: "#1d4ed8",
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              aria-label="Information"
            >
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
            </motion.button>
            <motion.button
              className="cursor-pointer"
              animate={{
                color: isHovered || activeMegaMenu ? "#212061" : "#ffffff",
              }}
              whileHover={{
                color: "#1d4ed8",
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              aria-label="Language"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                animate={{
                  fill: isHovered || activeMegaMenu ? "#212061" : "#ffffff",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                viewBox="0 0 256 256"
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a15.91,15.91,0,0,0-11-8.67l-8-1.73L96.14,104h16.71a16.06,16.06,0,0,0,7.73-2l12.25-6.76a16.62,16.62,0,0,0,3-2.14l26.91-24.34A15.93,15.93,0,0,0,166,49.1l-.36-.65A88.11,88.11,0,0,1,216,128ZM143.31,41.34,152,56.9,125.09,81.24,112.85,88H96.14a16,16,0,0,0-13.88,8l-8.73,15.23L63.38,84.19,74.32,58.32a87.87,87.87,0,0,1,69-17ZM40,128a87.53,87.53,0,0,1,8.54-37.8l11.34,30.27a16,16,0,0,0,11.62,10l21.43,4.61L96.74,143a16.09,16.09,0,0,0,14.4,9h1.48l-7.23,16.23a16,16,0,0,0,2.86,17.37l.14.14L128,205.94l-1.94,10A88.11,88.11,0,0,1,40,128Zm102.58,86.78,1.13-5.81a16.09,16.09,0,0,0-4-13.9,1.85,1.85,0,0,1-.14-.14L120,174.74,133.7,144l22.82,3.08,45.72,28.12A88.18,88.18,0,0,1,142.58,214.78Z"></path>
              </motion.svg>
            </motion.button>
            <motion.button
              className="cursor-pointer"
              animate={{
                color: isHovered || activeMegaMenu ? "#212061" : "#ffffff",
              }}
              whileHover={{
                color: "#1d4ed8",
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              aria-label="Contact"
            >
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
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <motion.button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-black/10 transition-colors"
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
                className="w-6 h-6"
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
        {/* Mega Menu */}
        {activeMegaMenu &&
          finalMegaMenuData[
            activeMegaMenu as keyof typeof finalMegaMenuData
          ] && (
            <MegaMenu
              data={
                finalMegaMenuData[
                  activeMegaMenu as keyof typeof finalMegaMenuData
                ]
              }
              isVisible={true}
            />
          )}
        {/* Mobile Menu */}
        <MobileMenu />
      </motion.header>
    );
  }
  // White header that appears when scrolling up
  return (
    <>
      {/* Transparent Header */}
      {/* <motion.header
        className="w-full absolute top-0 z-50 bg-transparent"
        animate={{
          opacity: isWhiteHeader ? 0 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{
          pointerEvents: isWhiteHeader ? "none" : "auto",
        }}
      >
        <div className="max-w-[70.5rem] mx-auto flex items-center justify-between py-4">
          
          <div className="flex items-center">
            <Link href="/">
              <Image
                src={isHovered ? "/logo-white.svg" : "/logo.svg"}
                alt="Solomon Airlines Logo"
                width={150}
                height={40}
                className="h-6 w-auto"
              />
            </Link>
          </div>
          <nav className="flex items-center space-x-8 justify-between font-sans">
            {[
              { name: "Explore", path: "/explore" },
              { name: "Experience", path: "/experience" },
              { name: "Belama", path: "/belama" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`text-sm font-bold transition-colors ${
                  isHovered ? "text-blue-500" : "text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-3 w-36">
            <button
              className={`transition-colors ${
                isHovered ? "text-blue-500" : "text-white"
              } hover:text-blue-700`}
              aria-label="Information"
            >
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
            </button>
            <button
              className={`transition-colors ${
                isHovered ? "text-blue-500" : "text-white"
              } hover:text-blue-700`}
              aria-label="Language"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="#212061"
                viewBox="0 0 256 256"
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a15.91,15.91,0,0,0-11-8.67l-8-1.73L96.14,104h16.71a16.06,16.06,0,0,0,7.73-2l12.25-6.76a16.62,16.62,0,0,0,3-2.14l26.91-24.34A15.93,15.93,0,0,0,166,49.1l-.36-.65A88.11,88.11,0,0,1,216,128ZM143.31,41.34,152,56.9,125.09,81.24,112.85,88H96.14a16,16,0,0,0-13.88,8l-8.73,15.23L63.38,84.19,74.32,58.32a87.87,87.87,0,0,1,69-17ZM40,128a87.53,87.53,0,0,1,8.54-37.8l11.34,30.27a16,16,0,0,0,11.62,10l21.43,4.61L96.74,143a16.09,16.09,0,0,0,14.4,9h1.48l-7.23,16.23a16,16,0,0,0,2.86,17.37l.14.14L128,205.94l-1.94,10A88.11,88.11,0,0,1,40,128Zm102.58,86.78,1.13-5.81a16.09,16.09,0,0,0-4-13.9,1.85,1.85,0,0,1-.14-.14L120,174.74,133.7,144l22.82,3.08,45.72,28.12A88.18,88.18,0,0,1,142.58,214.78Z"></path>
              </svg>
            </button>

            <button
              className={`transition-colors ${
                isHovered ? "text-blue-500" : "text-white"
              } hover:text-blue-700`}
              aria-label="Contact"
            >
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
            </button>
          </div>
        </div>
      </motion.header> */}
      {/* White Header */}
      {/* <motion.header
        className="w-full fixed top-0 z-50"
        animate={{
          opacity: isWhiteHeader ? 1 : 0,
          y: isWhiteHeader ? 0 : -10,
          backgroundColor: "rgba(255, 255, 255, 1)",
        }}
        transition={{
          duration: isWhiteHeader ? 0.15 : 0.1,
          ease: "easeInOut",
        }}
        style={{
          pointerEvents: isWhiteHeader ? "auto" : "none",
          boxShadow: isWhiteHeader
            ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
            : "none",
        }}
      >
        <div className="max-w-[70.5rem] mx-auto flex items-center justify-between py-4">
          
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="Solomon Airlines Logo"
                width={150}
                height={40}
                className="h-6 w-auto"
              />
            </Link>
          </div>
          <nav className="flex items-center space-x-8 justify-between font-sans">
            {[
              { name: "Explore", path: "/explore" },
              { name: "Experience", path: "/experience" },
              { name: "Belama", path: "/belama" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-blue-500 text-sm font-bold transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-3 w-36">
            <button
              className="text-blue-500 hover:text-blue-700 transition-colors"
              aria-label="Information"
            >
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
            </button>
            <button
              className="text-blue-500 hover:text-blue-700 transition-colors"
              aria-label="Language"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="#212061"
                viewBox="0 0 256 256"
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a15.91,15.91,0,0,0-11-8.67l-8-1.73L96.14,104h16.71a16.06,16.06,0,0,0,7.73-2l12.25-6.76a16.62,16.62,0,0,0,3-2.14l26.91-24.34A15.93,15.93,0,0,0,166,49.1l-.36-.65A88.11,88.11,0,0,1,216,128ZM143.31,41.34,152,56.9,125.09,81.24,112.85,88H96.14a16,16,0,0,0-13.88,8l-8.73,15.23L63.38,84.19,74.32,58.32a87.87,87.87,0,0,1,69-17ZM40,128a87.53,87.53,0,0,1,8.54-37.8l11.34,30.27a16,16,0,0,0,11.62,10l21.43,4.61L96.74,143a16.09,16.09,0,0,0,14.4,9h1.48l-7.23,16.23a16,16,0,0,0,2.86,17.37l.14.14L128,205.94l-1.94,10A88.11,88.11,0,0,1,40,128Zm102.58,86.78,1.13-5.81a16.09,16.09,0,0,0-4-13.9,1.85,1.85,0,0,1-.14-.14L120,174.74,133.7,144l22.82,3.08,45.72,28.12A88.18,88.18,0,0,1,142.58,214.78Z"></path>
              </svg>
            </button>

            <button
              className="text-blue-500 hover:text-blue-700 transition-colors"
              aria-label="Contact"
            >
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
            </button>
          </div>
        </div>      </motion.header> */}

      {/* Mobile Menu */}
      <MobileMenu />
    </>
  );
}

export default Header;

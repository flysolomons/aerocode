"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SubMenuItem {
  name: string;
  href: string;
}
interface MenuItem {
  title: string;
  href?: string;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Explore",
    href:"/explore",
    subItems: [
      { name: "Destinations", href: "/explore/destinations" },
      { name: "Our Specials", href: "/explore/our-specials" },
      { name: "Schedules", href: "/explore/flight-schedules" },
      { name: "Cargo", href: "/explore/cargo" }
    ],
  },
  {
    title: "Experience",
    href:"/experience",
    subItems: [
      { name: "Baggage Allowance", href: "/experience/baggage-allowance" },
      { name: "Seat Selection", href: "/experience/seat-selection" },
      { name: "Dangerous Goods", href: "/experience/dangerous-goods" },
    ],
  },
  {
    title: "Belama",
    href: "/belama",
  },
];

const currencyItems: MenuItem[] = [
  {
    title: "USD",
    href: "/currency/usd",
  },
  {
    title: "AUD",
    href: "/currency/aud",
  },
  {
    title: "EUR",
    href: "/currency/eur",
  },
  
];

function Header() {
  const [isWhiteHeader, setIsWhiteHeader] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scroll direction
      const isScrollUp = currentScrollY < lastScrollY;
      setIsScrollingUp(isScrollUp);

      // Check if we're at the top
      const isTop = currentScrollY < 50;
      setIsAtTop(isTop);

      // Logic for white header
      if (isScrollingUp && currentScrollY > 100) {
        setIsWhiteHeader(true);
      }
      // Only hide white header when scrolling down OR at top
      else if (!isScrollingUp || isTop) {
        setIsWhiteHeader(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isScrollingUp]);

  const handleMouseEnter = (index: number) => {
    setIsOpen(index);
  };

  const handleMouseLeave = () => {
    setIsOpen(null);
  };

  const handleCurrencyMouseEnter = () => {
    setIsCurrencyOpen(true);
  };

  const handleCurrencyMouseLeave = () => {
    setIsCurrencyOpen(false);
  };
  // If at top, render transparent header
  
  if (isAtTop) {
    return (
      
      <header
        className={`w-full absolute top-0 z-50 transition-all duration-1000 ease-in-out ${
          isHovered ? "bg-white shadow-sm rounded-b-lg opacity-100 translate-y-0" : "bg-transparent"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="max-w-[70.5rem] mx-auto flex items-center justify-between py-4">
          {" "}
          <div className="flex items-center animate__animated animate__fadeInDown">
            <Link href="/">
              <Image
                src={isHovered ? "/logo.svg" : "/logo-white.svg"}
                alt="Solomon Airlines Logo"
                width={150}
                height={40}
                className="h-6 w-auto"
              />
            </Link>
          </div>
          <nav className="flex items-center space-x-8 justify-between font-sans animate__animated animate__fadeInDown">
          <ul className="flex space-x-8 font-sans animate__animated animate__fadeInDown">
          {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="relative"
                  onMouseEnter={() => item.subItems && handleMouseEnter(index)}
                  onMouseLeave={() => item.subItems && handleMouseLeave()}
                >
                  <Link
                    href={item.href || "#"}
                    className={`text-sm font-bold transition-colors ${
                      isHovered ? "text-blue-500" : "text-white"
                    } hover:text-blue-700`}
                  >
                    {item.title}
                  </Link>
                  {item.subItems && (
                    <AnimatePresence>
                      {isOpen === index && (
                        <motion.div
                          className="absolute mt-8 transform -translate-x-1/2 bg-white text-black shadow-lg rounded-lg p-6 grid grid-cols-1 gap-4 w-60 z-10 -ml-20"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          {item.subItems.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="text-sm text-blue-500 hover:text-slate-800 transition-colors hover:bg-slate-200 p-1 rounded-md"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
              
          </ul>
            
          </nav>
          <div className="flex items-center justify-end gap-3 w-36 animate__animated animate__fadeInDown">
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
            {/* Currency dropdown */}
            <div className="relative mt-1"
                 onMouseEnter={handleCurrencyMouseEnter}
                 onMouseLeave={handleCurrencyMouseLeave}>
                
                <button
                className={`transition-colors ${
                  isHovered ? "text-blue-500" : "text-white"
                } hover:text-blue-700`}
                aria-label="Currency"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill={`${isHovered ? "#212061" : "#ffffff"}`}
                  viewBox="0 0 256 256"
                >
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a15.91,15.91,0,0,0-11-8.67l-8-1.73L96.14,104h16.71a16.06,16.06,0,0,0,7.73-2l12.25-6.76a16.62,16.62,0,0,0,3-2.14l26.91-24.34A15.93,15.93,0,0,0,166,49.1l-.36-.65A88.11,88.11,0,0,1,216,128ZM143.31,41.34,152,56.9,125.09,81.24,112.85,88H96.14a16,16,0,0,0-13.88,8l-8.73,15.23L63.38,84.19,74.32,58.32a87.87,87.87,0,0,1,69-17ZM40,128a87.53,87.53,0,0,1,8.54-37.8l11.34,30.27a16,16,0,0,0,11.62,10l21.43,4.61L96.74,143a16.09,16.09,0,0,0,14.4,9h1.48l-7.23,16.23a16,16,0,0,0,2.86,17.37l.14.14L128,205.94l-1.94,10A88.11,88.11,0,0,1,40,128Zm102.58,86.78,1.13-5.81a16.09,16.09,0,0,0-4-13.9,1.85,1.85,0,0,1-.14-.14L120,174.74,133.7,144l22.82,3.08,45.72,28.12A88.18,88.18,0,0,1,142.58,214.78Z"></path>
                </svg>
              </button>
              <AnimatePresence>
                {isCurrencyOpen && (
                  <motion.div
                    className="absolute mt-8 transform -translate-x-1/2 bg-white text-black shadow-lg rounded-lg p-6 grid grid-cols-1 gap-4 w-20 z-10 -ml-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    {currencyItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={"#"}
                        className="text-sm text-blue-500 hover:text-slate-800 transition-colors hover:bg-slate-200 p-1 rounded-md"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>


            </div>
          </div>
        </div>
      </header>
    );
  }

  // White header that appears when scrolling up
  return (
    <>
      {/* Transparent Header */}
      <header
        className={`w-full absolute top-0 z-50 bg-transparent transition-all duration-1000 ease-in-out ${
          isWhiteHeader ? " pointer-events-none translate-y-0" : "opacity-100"
        }`}
      >
        <div className="max-w-[70.5rem] mx-auto flex items-center justify-between py-4 animate__animated animate__fadeInDown">
          {" "}
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
          </nav>{" "}
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
      </header>

      {/* White Header */}
      <header
        className={`w-full fixed top-0 z-50 transition-all duration-1000 ease-in-out ${
          isWhiteHeader
            ? "opacity-100 translate-y-0 bg-white shadow-sm rounded-b-lg"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-[70.5rem] mx-auto flex items-center justify-between py-4">
          {" "}
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
          </nav>{" "}
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
        </div>
      </header>
      
    </>
  );
}

export default Header;

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookATripForm from "./BookATripForm";
import ManageBookingForm from "./ManageBookingForm";

interface BookingWidgetProps {
  onModalStateChange?: (isActive: boolean) => void;
}

export default function BookingWidget({
  onModalStateChange,
}: BookingWidgetProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktopModalActive, setIsDesktopModalActive] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent body scroll when mobile modal is open
  useEffect(() => {
    if (showMobileForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileForm]);

  const handleTabClick = (tabIndex: number) => {
    // If clicking Flight Schedules (index 2), redirect to flight schedules page
    if (tabIndex === 2) {
      window.location.href = "/explore/flight-schedules";
      return;
    }

    setActiveTab(tabIndex);

    // Add haptic feedback for mobile
    if (navigator.vibrate && window.innerWidth < 1280) {
      navigator.vibrate(10);
    }

    // On mobile, show the full-screen form with slight delay for better UX
    if (isMobile) {
      // Small delay to show the tab selection state before transitioning
      setTimeout(() => {
        setShowMobileForm(true);
      }, 150);
    }
  };
  const closeMobileForm = () => {
    // Add haptic feedback when closing
    if (navigator.vibrate && window.innerWidth < 1280) {
      navigator.vibrate(5);
    }
    setShowMobileForm(false);
  };
  const handleDesktopModalStateChange = (isActive: boolean) => {
    setIsDesktopModalActive(isActive);
    onModalStateChange?.(isActive);
  };
  return (
    <>
      <div className="relative flex flex-col items-center h-1/2 text-white animate__animated animate__fadeInUp -mt-8 xl:mt-0">
        <div className="w-full xl:w-[70.5rem] xl:bg-gray-100 xl:rounded-3xl xl:shadow-lg">
          <div
            className={`flex flex-col space-y-2 xl:space-y-0 xl:flex-row xl:bg-white xl:rounded-3xl transition-opacity duration-500 ease-in-out ${
              isDesktopModalActive
                ? "xl:opacity-0 xl:pointer-events-none"
                : "xl:opacity-100"
            }`}
          >
            {/* Mobile: Full-width rectangles layout */}
            <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto xl:hidden">
              {/* Book a Trip - Full width */}
              <div className="w-full">
                <div className="flex items-center justify-center h-14 rounded-full bg-white/80 backdrop-blur-xl border border-white/70 px-5 transition-all duration-200 ease-out">
                  <button
                    className="flex flex-row items-center justify-center gap-2 w-full h-full text-gray-500 font-medium transition-colors duration-200"
                    onClick={() => handleTabClick(0)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 text-center">
                      Book
                    </span>
                  </button>
                </div>
              </div>
              {/* Manage, Schedules - Same row */}
              <div className="w-full">
                <div className="grid grid-cols-2 gap-3 w-full">
                  {/* Manage Booking */}
                  <div className="flex items-center justify-center h-14 rounded-full bg-white/80 backdrop-blur-xl border border-white/70 px-5 transition-all duration-200 ease-out">
                    <button
                      className="flex flex-row items-center justify-center gap-2 w-full h-full text-gray-500 font-medium transition-colors duration-200"
                      onClick={() => handleTabClick(1)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-700"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700 text-center">
                        Manage
                      </span>
                    </button>
                  </div>
                  {/* Flight Schedules */}
                  <div className="flex items-center justify-center h-14 rounded-full bg-white/80 backdrop-blur-xl border border-white/70 px-5 transition-all duration-200 ease-out">
                    <button
                      className="flex flex-row items-center justify-center gap-2 w-full h-full text-gray-500 font-medium transition-colors duration-200"
                      onClick={() => handleTabClick(2)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-700"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M3 10h18" />
                        <path d="m9 16 2 2 4-4" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700 text-center">
                        Schedules
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Simple tabs with bottom border */}
            <div className="hidden xl:flex xl:w-full xl:justify-start xl:relative xl:border-b xl:border-gray-200 bg-gray-200 rounded-t-3xl">
              <div className="flex">
                {/* Book a Trip */}
                <button
                  className={`flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 min-w-[10rem] relative ${
                    activeTab === 0
                      ? "text-blue-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => handleTabClick(0)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                  </svg>
                  Book a Trip
                  {activeTab === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                  )}
                </button>

                {/* Separator Dot */}
                <div className="flex items-center px-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>

                {/* Manage Booking */}
                <button
                  className={`flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 min-w-[10rem] relative ${
                    activeTab === 1
                      ? "text-blue-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => handleTabClick(1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                  </svg>
                  Manage Booking
                  {activeTab === 1 && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                  )}
                </button>

                {/* Separator Dot */}
                <div className="flex items-center px-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>

                {/* Flight Schedules */}
                <button
                  className={`flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 min-w-[10rem] relative ${
                    activeTab === 2
                      ? "text-blue-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => handleTabClick(2)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                    <path d="m9 16 2 2 4-4" />
                  </svg>
                  Flight Schedules
                  {activeTab === 2 && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* Desktop content */}
          <div className="hidden xl:block">
            {activeTab === 0 && (
              <BookATripForm
                onModalStateChange={handleDesktopModalStateChange}
              />
            )}
            {activeTab === 1 && <ManageBookingForm />}
            {/* activeTab === 2 redirects to flight schedules page */}
          </div>
        </div>
      </div>
      {/* Mobile overlay form (90% coverage) */}
      <AnimatePresence>
        {showMobileForm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-60 z-40 xl:hidden"
              onClick={closeMobileForm}
            />

            {/* Modal content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="fixed inset-x-0 bottom-0 z-50 xl:hidden"
            >
              <div className="w-full h-[80vh] bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 ease-out">
                {/* Header with heading and close button */}
                <div className="flex justify-between items-center p-4 flex-shrink-0 border-b border-gray-200">
                  {/* Empty space for balance */}
                  <div className="w-10"></div>
                  {/* Dynamic heading based on active tab - centered */}
                  <div className="flex-1 flex justify-center items-center">
                    <h1 className="text-lg font-semibold text-blue-500">
                      {activeTab === 0 && "Book a Trip"}
                      {activeTab === 1 && "Manage Booking"}
                      {activeTab === 2 && "Flight Schedules"}
                    </h1>
                  </div>
                  {/* Close button */}
                  <button
                    onClick={closeMobileForm}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close form"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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

                {/* Form content */}
                <div className="flex-1 overflow-y-auto">
                  {activeTab === 0 && <BookATripForm />}
                  {activeTab === 1 && <ManageBookingForm />}
                  {/* activeTab === 2 redirects to flight schedules page */}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

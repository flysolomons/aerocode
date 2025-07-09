"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookATripForm from "./BookATripForm";
import ManageBookingForm from "./ManageBookingForm";
import FlightUpgradeForm from "./FlightUpgradeForm";

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
    setActiveTab(tabIndex);
    // On mobile, show the full-screen form
    if (isMobile) {
      setShowMobileForm(true);
    }
  };
  const closeMobileForm = () => {
    setShowMobileForm(false);
  };
  const handleDesktopModalStateChange = (isActive: boolean) => {
    setIsDesktopModalActive(isActive);
    onModalStateChange?.(isActive);
  };
  return (
    <>
      <div className="relative flex flex-col items-center h-1/2 text-white animate__animated animate__fadeInUp -mt-8 xl:mt-0">
        <div className="w-full xl:w-[70.5rem] xl:bg-white xl:rounded-[2rem] xl:shadow-lg">
          <div
            className={`flex flex-col space-y-2 xl:space-y-0 xl:flex-row xl:border-b xl:bg-white xl:rounded-[2rem] transition-opacity duration-500 ease-in-out ${
              isDesktopModalActive
                ? "xl:opacity-0 xl:pointer-events-none"
                : "xl:opacity-100"
            }`}
          >
            {/* Mobile: Full-width rectangles layout */}
            <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto xl:hidden">
              {/* Book a Trip - Full width rectangle */}
              <div
                className={`flex items-center justify-center h-24 py-0 rounded-3xl bg-white/85 backdrop-blur-md shadow-lg ${
                  activeTab === 0
                    ? "border-2 border-blue-500"
                    : "border border-white/40"
                }`}
              >
                <button
                  className={`flex flex-col items-center justify-center gap-2 w-full h-full ${
                    activeTab === 0
                      ? "text-blue-500"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  onClick={() => handleTabClick(0)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                  </svg>
                  <span className="text-sm font-semibold text-center">
                    Book a Trip
                  </span>
                </button>
              </div>

              {/* Manage Booking and Flight Upgrade - Same row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Manage Booking - Half width rectangle */}
                <div
                  className={`flex items-center justify-center h-24 py-0 rounded-3xl bg-white/85 backdrop-blur-md shadow-lg ${
                    activeTab === 1
                      ? "border-2 border-blue-500"
                      : "border border-white/40"
                  }`}
                >
                  <button
                    className={`flex flex-col items-center justify-center gap-2 w-full h-full ${
                      activeTab === 1
                        ? "text-blue-500"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                    onClick={() => handleTabClick(1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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
                    <span className="text-sm font-semibold text-center">
                      Manage Booking
                    </span>
                  </button>
                </div>

                {/* Flight Upgrade - Half width rectangle */}
                <div
                  className={`flex items-center justify-center h-24 py-0 rounded-3xl bg-white/85 backdrop-blur-md shadow-lg ${
                    activeTab === 2
                      ? "border-2 border-blue-500"
                      : "border border-white/40"
                  }`}
                >
                  <button
                    className={`flex flex-col items-center justify-center gap-2 w-full h-full ${
                      activeTab === 2
                        ? "text-blue-500"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                    onClick={() => handleTabClick(2)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2a10 10 0 0 1 7.38 16.75" />
                      <path d="m16 12-4-4-4 4" />
                      <path d="M12 16V8" />
                      <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
                      <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
                      <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
                      <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
                    </svg>
                    <span className="text-sm font-semibold text-center">
                      Flight Upgrade
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop: Original horizontal layout */}
            <div className="hidden xl:flex xl:w-full">
              <div
                className={`flex px-4 py-3 h-12 w-[11rem] rounded-tl-[2rem] rounded-tr-none rounded-bl-none rounded-br-none bg-white xl:shadow-none ${
                  activeTab === 0
                    ? "border-0 border-b-2 border-b-blue-500"
                    : "border-0"
                }`}
              >
                <button
                  className={`text-sm font-semibold w-[11rem] text-center flex items-center justify-center gap-2 ${
                    activeTab === 0
                      ? "text-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => handleTabClick(0)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                  </svg>
                  Book a Trip
                </button>
              </div>
              <div
                className={`flex px-4 py-3 h-12 w-[11rem] rounded-none bg-white xl:shadow-none ${
                  activeTab === 1
                    ? "border-0 border-b-2 border-b-blue-500"
                    : "border-0"
                }`}
              >
                <button
                  className={`text-sm font-semibold w-[11rem] text-center flex items-center justify-center gap-2 ${
                    activeTab === 1
                      ? "text-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => handleTabClick(1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                  Manage Booking
                </button>
              </div>
              <div
                className={`flex px-4 py-3 h-12 w-[11rem] rounded-tl-none rounded-tr-[2rem] rounded-bl-none rounded-br-none bg-white xl:shadow-none ${
                  activeTab === 2
                    ? "border-0 border-b-2 border-b-blue-500"
                    : "border-0"
                }`}
              >
                <button
                  className={`text-sm font-semibold w-[11rem] text-center flex items-center justify-center gap-2 ${
                    activeTab === 2
                      ? "text-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => handleTabClick(2)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a10 10 0 0 1 7.38 16.75" />
                    <path d="m16 12-4-4-4 4" />
                    <path d="M12 16V8" />
                    <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
                    <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
                    <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
                    <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
                  </svg>
                  Flight Upgrade
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
            {activeTab === 2 && <FlightUpgradeForm />}
          </div>
        </div>
      </div>
      {/* Mobile full-screen form overlay */}
      <AnimatePresence>
        {showMobileForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-white xl:hidden flex flex-col"
          >
            {/* Header with heading and close button */}
            <div className="flex justify-between items-center p-4 flex-shrink-0">
              {/* Empty space for balance */}
              <div className="w-10"></div>
              {/* Dynamic heading based on active tab - centered */}
              <div className="flex-1 flex justify-center items-center">
                <h1 className="text-lg font-semibold text-blue-500">
                  {activeTab === 0 && "Book a Trip"}
                  {activeTab === 1 && "Manage Booking"}
                  {activeTab === 2 && "Flight Upgrade"}
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
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {activeTab === 0 && <BookATripForm />}
              {activeTab === 1 && <ManageBookingForm />}
              {activeTab === 2 && <FlightUpgradeForm />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

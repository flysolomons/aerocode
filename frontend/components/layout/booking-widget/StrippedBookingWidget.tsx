"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import BookATripForm from "./BookATripForm";

// Accept id as a prop with type
interface StrippedBookingWidgetProps {
  id?: string;
  preselectedDeparture?: {
    departureAirport: string;
    departureAirportCode: string;
  };
  preselectedArrival?: {
    arrivalAirport: string;
    arrivalAirportCode: string;
  };
}

export default function StrippedBookingWidget({
  id,
  preselectedDeparture,
  preselectedArrival,
}: StrippedBookingWidgetProps) {
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleFormClick = () => {
    // On mobile, show the full-screen form
    if (isMobile) {
      setShowMobileForm(true);
    }
  };
  const closeMobileForm = () => {
    setShowMobileForm(false);
  };

  // Create the mobile form modal content
  const mobileFormModal = (
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
                    Book a Trip
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
                <BookATripForm
                  preselectedDeparture={preselectedDeparture}
                  preselectedArrival={preselectedArrival}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
  return (
    <>
      <div
        id={id}
        className="relative flex flex-col items-center h-1/2 text-white animate__animated animate__fadeInUp -mt-8 xl:mt-0"
      >
        <div className="w-full xl:w-[70.5rem]">
          {/* Mobile clickable area - same styling as BookingWidget mobile tab */}
          <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto xl:hidden">
            <div className="w-full">
              <div
                className="flex items-center justify-center h-14 rounded-full bg-white/80 backdrop-blur-xl border border-white/70 px-5 transition-all duration-200 ease-out cursor-pointer shadow-lg"
                onClick={handleFormClick}
              >
                <button className="flex flex-row items-center justify-center gap-2 w-full h-full text-gray-500 font-medium transition-colors duration-200">
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
          </div>

          {/* Desktop content - direct form without background wrapper */}
          <div className="hidden xl:block">
            <BookATripForm
              preselectedDeparture={preselectedDeparture}
              preselectedArrival={preselectedArrival}
            />
          </div>
        </div>
      </div>

      {/* Mobile full-screen form overlay - using portal to ensure it covers everything */}
      {mounted &&
        typeof window !== "undefined" &&
        createPortal(mobileFormModal, document.body)}
    </>
  );
}

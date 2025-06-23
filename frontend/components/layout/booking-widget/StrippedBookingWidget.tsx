"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import BookATripForm from "./BookATripForm";

export default function StrippedBookingWidget() {
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
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
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] bg-white md:hidden flex flex-col"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
            maxHeight: "100vh",
            zIndex: 9999,
          }}
        >
          {/* Header with logo and close button */}
          <div className="flex justify-between items-center p-4 flex-shrink-0">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/logo.svg" alt="FlySolomons" className="h-6 w-auto" />
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
            <BookATripForm />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  return (
    <>
      <div className="relative flex flex-col items-center h-1/2 text-white animate__animated animate__fadeInUp -mt-8 md:mt-0">
        <div className="w-full md:w-[70.5rem]">
          {/* Mobile clickable area - same styling as BookingWidget mobile tab */}
          <div
            className="flex px-4 py-3 h-12 w-full rounded-[2rem] bg-white shadow-md border-2 border-blue-500 cursor-pointer md:hidden my-2"
            onClick={handleFormClick}
          >
            <button className="text-sm font-semibold w-full text-center text-blue-500">
              Book a Trip
            </button>
          </div>

          {/* Desktop content - direct form without background wrapper */}
          <div className="hidden md:block">
            <BookATripForm />
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

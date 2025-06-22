"use client";
import { useState, useEffect } from "react";
import BookATripForm from "./BookATripForm";
import ManageBookingForm from "./ManageBookingForm";

export default function BookingWidget() {
  const [activeTab, setActiveTab] = useState(0);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <>
      <div className="relative flex flex-col items-center h-1/2 text-white animate__animated animate__fadeInUp">
        <div className="w-full md:w-[70.5rem] md:bg-white md:rounded-[2rem] md:shadow-lg">
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:border-b md:bg-white md:rounded-[2rem]">
            <div
              className={`flex px-4 py-3 h-12 w-full md:w-[11rem] rounded-[2rem] md:rounded-tl-[2rem] md:rounded-tr-none md:rounded-bl-none md:rounded-br-none bg-white shadow-md md:shadow-none ${
                activeTab === 0
                  ? "border-2 border-blue-500 md:border-0 md:border-b-2 md:border-b-blue-500"
                  : "border border-gray-200 md:border-0"
              }`}
            >
              <button
                className={`text-sm font-semibold w-full md:w-[11rem] text-center ${
                  activeTab === 0
                    ? "text-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabClick(0)}
              >
                Book a Trip
              </button>
            </div>
            <div
              className={`flex px-4 py-3 h-12 w-full md:w-[11rem] rounded-[2rem] md:rounded-none bg-white shadow-md md:shadow-none ${
                activeTab === 1
                  ? "border-2 border-blue-500 md:border-0 md:border-b-2 md:border-b-blue-500"
                  : "border border-gray-200 md:border-0"
              }`}
            >
              <button
                className={`text-sm font-semibold w-full md:w-[11rem] text-center ${
                  activeTab === 1
                    ? "text-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabClick(1)}
              >
                Manage Booking
              </button>
            </div>
            <div
              className={`flex px-4 py-3 h-12 w-full md:w-[11rem] rounded-[2rem] md:rounded-tl-none md:rounded-tr-[2rem] md:rounded-bl-none md:rounded-br-none bg-white shadow-md md:shadow-none ${
                activeTab === 2
                  ? "border-2 border-blue-500 md:border-0 md:border-b-2 md:border-b-blue-500"
                  : "border border-gray-200 md:border-0"
              }`}
            >
              <button
                className={`text-sm font-semibold w-full md:w-[11rem] text-center ${
                  activeTab === 2
                    ? "text-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabClick(2)}
              >
                Flight Upgrade
              </button>
            </div>
          </div>
          {/* Desktop content */}
          <div className="hidden md:block">
            {activeTab === 0 && <BookATripForm />}
            {activeTab === 1 && <ManageBookingForm />}
          </div>
        </div>
      </div>
      {/* Mobile full-screen form overlay */}
      {showMobileForm && (
        <div className="fixed inset-0 z-50 bg-white md:hidden flex flex-col">
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
            {activeTab === 0 && <BookATripForm />}
            {activeTab === 1 && <ManageBookingForm />}
          </div>
        </div>
      )}
    </>
  );
}

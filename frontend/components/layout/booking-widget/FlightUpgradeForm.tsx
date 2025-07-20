"use client";
import { useState } from "react";

export default function FlightUpgradeForm() {
  const [bookingReference, setBookingReference] = useState("");
  const [lastName, setLastName] = useState("");

  const handleUpgrade = () => {
    if (bookingReference && lastName) {
      console.log("Upgrading flight for booking:", {
        bookingReference,
        lastName,
      });
      // Implement flight upgrade functionality here
    } else {
      alert("Please enter both booking reference and last name");
    }
  };

  return (
    <div className="px-4 py-3 flex flex-col items-center space-y-4">
      {/* Desktop version - original styling */}
      <div className="hidden md:block w-full">
        {/* Explanatory text for height matching */}
        <div className="mb-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg px-4 py-2 border border-yellow-200 w-fit mx-auto">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="w-5 h-5 text-amber-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              {/* <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Flight Upgrade & Changes
              </h3> */}
              <p className="text-sm text-gray-600 leading-relaxed">
                If you have purchased a Solomon Airlines ticket more than 48
                hours ago, please enter your details here to upgrade your
                flight.
              </p>
            </div>
          </div>
        </div>
        {/* Search form */}
        <div className="flex w-full items-center border border-gray-200 rounded-full px-2 shadow-md">
          <div className="flex-1 px-6 py-3">
            <label className="block text-left text-xs text-black font-semibold">
              Booking Reference
            </label>
            <input
              type="text"
              placeholder="Enter your booking reference"
              className="w-full text-sm outline-none text-black"
              value={bookingReference}
              onChange={(e) => setBookingReference(e.target.value)}
            />
          </div>

          <div className="w-[1px] h-10 bg-gray-200"></div>

          <div className="flex-1 px-6 py-3">
            <label className="block text-left text-xs text-black font-semibold">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="w-full text-sm outline-none text-black"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2"
              onClick={handleUpgrade}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">Upgrade</span>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile version - matching BookATripForm styling */}
      <div className="block md:hidden w-full">
        <div className="space-y-4">
          {/* Booking Reference Input Card */}
          <div>
            <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1 ml-2">
              Booking Reference
            </label>
            <div className="cursor-text border border-gray-300 rounded-3xl transition-all duration-300 ease-in-out bg-gradient-to-br from-white to-gray-50 px-4 py-3 sm:px-4 sm:py-4 min-h-[50px] flex items-center relative shadow-md hover:shadow-lg">
              <input
                type="text"
                placeholder="Enter your booking reference"
                className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                value={bookingReference}
                onChange={(e) => setBookingReference(e.target.value)}
              />
              {/* Add selected indicator */}
              {bookingReference && (
                <div className="flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2B8A1E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check-big-icon lucide-circle-check-big"
                  >
                    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Last Name Input Card */}
          <div>
            <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1 ml-2">
              Last Name
            </label>
            <div className="cursor-text border border-gray-300 rounded-3xl transition-all duration-300 ease-in-out bg-gradient-to-br from-white to-gray-50 px-4 py-3 sm:px-4 sm:py-4 min-h-[50px] flex items-center relative shadow-md hover:shadow-lg">
              <input
                type="text"
                placeholder="Enter your last name"
                className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {/* Add selected indicator */}
              {lastName && (
                <div className="flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2B8A1E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check-big-icon lucide-circle-check-big"
                  >
                    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Upgrade button */}
        <div className="md:hidden pt-4 px-0 pb-2 mt-4">
          <button
            className={`w-full py-3 rounded-full transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl ${
              bookingReference && lastName
                ? "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 cursor-pointer"
                : ""
            } disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-100 disabled:text-white`}
            onClick={bookingReference && lastName ? handleUpgrade : undefined}
            disabled={!bookingReference || !lastName}
          >
            <span>
              {!bookingReference || !lastName
                ? "Complete form to upgrade"
                : "Upgrade Flight"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

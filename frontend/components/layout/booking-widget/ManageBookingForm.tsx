"use client";
import { useState } from "react";

export default function ManageBookingForm() {
  const [bookingReference, setBookingReference] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSearch = () => {
    if (bookingReference && lastName) {
      console.log("Searching for booking:", { bookingReference, lastName });
      // Implement manage booking search functionality here
    } else {
      alert("Please enter both booking reference and last name");
    }
  };

  return (
    <div className="px-4 py-3 flex flex-col items-center space-y-4">
      {/* Desktop version - original styling */}
      <div className="hidden md:block w-full">
        <br />
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
              className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-colors"
              onClick={handleSearch}
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

        {/* Mobile: Search button */}
        <div className="md:hidden pt-4 px-0 pb-2 mt-4">
          <button
            className={`w-full py-3 rounded-full transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl ${
              bookingReference && lastName
                ? "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 cursor-pointer"
                : ""
            } disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-100 disabled:text-white`}
            onClick={bookingReference && lastName ? handleSearch : undefined}
            disabled={!bookingReference || !lastName}
          >
            <span>
              {!bookingReference || !lastName
                ? "Complete form to search"
                : "Retrieve Booking"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

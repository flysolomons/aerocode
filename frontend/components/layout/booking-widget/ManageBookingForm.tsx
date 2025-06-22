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
      {/* Mobile: Heading */}
      <h2 className="block md:hidden text-lg font-bold text-blue-500 mb-2">
        Manage Booking
      </h2>
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
          <div className="w-full border-2 border-gray-300 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-white px-5 py-1.5 sm:px-4 sm:py-3 hover:border-blue-300">
            <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1">
              Booking Reference
            </label>
            <input
              type="text"
              placeholder="Enter your booking reference"
              className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 px-2 sm:px-0"
              value={bookingReference}
              onChange={(e) => setBookingReference(e.target.value)}
            />
          </div>
          {/* Last Name Input Card */}
          <div className="w-full border-2 border-gray-300 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-white px-5 py-1.5 sm:px-4 sm:py-3 hover:border-blue-300">
            <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 px-2 sm:px-0"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile: Search button always under form */}
        <div className="mt-2 pt-6 bg-white border-t border-gray-300 px-0 py-4">
          <button
            className="w-full bg-blue-500 text-white py-4 rounded-full hover:bg-blue-600 transition-colors text-sm font-medium"
            onClick={handleSearch}
          >
            Retrieve Booking
          </button>
        </div>
      </div>
    </div>
  );
}

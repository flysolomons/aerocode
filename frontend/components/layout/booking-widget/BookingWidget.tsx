"use client";
import { useState } from "react";
import BookATripForm from "./BookATripForm";

// Placeholder component for Manage Booking functionality
function ManageBookingForm() {
  return (
    <div className="px-4 py-3 flex flex-col items-center space-y-4">
      <br />
      {/* Search form */}
      <div className="flex w-full items-center border border-gray-200 rounded-full px-2 shadow-md">
        <div className="flex-1 px-6 py-3">
          <label className="block text-xs text-black font-semibold">
            Booking Reference
          </label>
          <input
            type="text"
            placeholder="Enter your booking reference"
            className="w-full text-sm outline-none text-black"
          />
        </div>

        <div className="w-[1px] h-10 bg-gray-200"></div>

        <div className="flex-1 px-6 py-3">
          <label className="block text-xs text-black font-semibold">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Enter your last name"
            className="w-full text-sm outline-none text-black"
          />
        </div>

        <div className="flex items-center justify-end">
          <button className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-colors">
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
  );
}

export default function BookingWidget() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative flex flex-col items-center h-1/2 text-white animate__animated animate__fadeInUp">
      <div className="w-[70.5rem] bg-white rounded-[2rem] shadow-lg">
        <div className="flex border-b">
          <div
            className={`flex px-4 py-3 h-12 w-[11rem] ${
              activeTab === 0 ? "border-b-2 border-b-blue-500" : ""
            }`}
          >
            <button
              className={`text-sm font-semibold w-[11rem] text-center ${
                activeTab === 0
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(0)}
            >
              Book a Trip
            </button>
          </div>
          <div
            className={`flex px-4 py-3 h-12 w-[11rem] ${
              activeTab === 1 ? "border-b-2 border-b-blue-500" : ""
            }`}
          >
            <button
              className={`text-sm font-semibold w-[11rem] text-center ${
                activeTab === 1
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(1)}
            >
              Manage Booking
            </button>
          </div>
          <div
            className={`flex px-4 py-3 h-12 w-[11rem] ${
              activeTab === 2 ? "border-b-2 border-b-blue-500" : ""
            }`}
          >
            <button
              className={`text-sm font-semibold w-[11rem] text-center ${
                activeTab === 2
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(2)}
            >
              Flight Upgrade
            </button>
          </div>
        </div>
        {activeTab === 0 && <BookATripForm />}
        {activeTab === 1 && <ManageBookingForm />}
      </div>
    </div>
  );
}

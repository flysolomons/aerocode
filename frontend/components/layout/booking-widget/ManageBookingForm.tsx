"use client";
import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

function redirectToManageBooking(
  bookingReference: string,
  lastName: string,
  countryCode: string
) {
  const baseUrl =
    "https://uat.digital.airline.amadeus.com/ie/booking/manage-booking/retrieve";

  // Build portalFacts (same format as before)
  const portalFacts = JSON.stringify([
    { key: "OfficeID", value: "HIRIE08AA" },
    { key: "countryCode", value: countryCode },
  ]);

  // Create form and submit as POST request
  const form = document.createElement("form");
  form.method = "POST";
  form.action = baseUrl;
  form.style.display = "none";

  // Create hidden inputs with original field names
  const reclocInput = document.createElement("input");
  reclocInput.type = "hidden";
  reclocInput.name = "recLoc";
  reclocInput.value = bookingReference;
  form.appendChild(reclocInput);

  const lastNameInput = document.createElement("input");
  lastNameInput.type = "hidden";
  lastNameInput.name = "lastName";
  lastNameInput.value = lastName;
  form.appendChild(lastNameInput);

  const portalFactsInput = document.createElement("input");
  portalFactsInput.type = "hidden";
  portalFactsInput.name = "portalFacts";
  portalFactsInput.value = portalFacts;
  form.appendChild(portalFactsInput);

  const traceInput = document.createElement("input");
  traceInput.type = "hidden";
  traceInput.name = "trace";
  traceInput.value = "true";
  form.appendChild(traceInput);

  document.body.appendChild(form);
  form.submit();
}

export default function ManageBookingForm() {
  const [bookingReference, setBookingReference] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const { selectedCurrency } = useCurrency();

  const handleSearch = () => {
    if (bookingReference && lastName) {
      setIsLoading(true);
      setShowValidation(false);
      const countryCode = selectedCurrency?.countryCode || "AU";
      redirectToManageBooking(bookingReference, lastName, countryCode);
    } else {
      setShowValidation(true);
    }
  };

  const isBookingReferenceError = showValidation && !bookingReference;
  const isLastNameError = showValidation && !lastName;

  return (
    <div className="px-4 py-3 flex flex-col items-center space-y-4">
      {/* Desktop version - original styling */}
      <div className="hidden md:block w-full">
        {/* Explanatory text for managing bookings */}
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
              <p className="text-sm text-gray-600 leading-relaxed">
                Enter your booking reference and last name to view or modify
                your booking.
              </p>
            </div>
          </div>
        </div>
        {/* Search form */}
        <div className="flex w-full items-center border border-gray-200 rounded-full px-2 shadow-md relative">
          <div className="flex-1 px-6 py-3">
            <div className="flex justify-between items-center">
              <label className="text-left text-xs text-black font-semibold">
                Booking Reference
              </label>
              {isBookingReferenceError && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="Enter your booking reference"
              className="w-full text-sm outline-none text-black"
              value={bookingReference}
              onChange={(e) => {
                setBookingReference(e.target.value);
                if (showValidation) setShowValidation(false);
              }}
            />
          </div>

          <div className="w-[1px] h-10 bg-gray-200"></div>

          <div className="flex-1 px-6 py-3">
            <div className="flex justify-between items-center">
              <label className="text-left text-xs text-black font-semibold">
                Last Name
              </label>
              {isLastNameError && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="Enter your last name"
              className="w-full text-sm outline-none text-black"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (showValidation) setShowValidation(false);
              }}
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
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
              )}
              <span className="text-sm font-medium">
                {isLoading ? "Retrieving..." : "Retrieve"}
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile version - matching BookATripForm styling */}
      <div className="block md:hidden w-full">
        <div className="space-y-4">
          {/* Booking Reference Input Card */}
          <div>
            <div className="flex justify-between items-center mb-1 ml-2 mr-2">
              <label className="text-left text-xs text-gray-600 font-semibold cursor-pointer">
                Booking Reference
              </label>
              {isBookingReferenceError && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>
            <div
              className={`cursor-text rounded-3xl transition-all duration-300 ease-in-out bg-gradient-to-br from-white to-gray-50 px-4 py-3 sm:px-4 sm:py-4 min-h-[50px] flex items-center relative shadow-md hover:shadow-lg border ${
                isBookingReferenceError ? "border-red-500" : "border-gray-300"
              }`}
            >
              <input
                type="text"
                placeholder="Enter your booking reference"
                className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                value={bookingReference}
                onChange={(e) => {
                  setBookingReference(e.target.value);
                  if (showValidation) setShowValidation(false);
                }}
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
            <div className="flex justify-between items-center mb-1 ml-2 mr-2">
              <label className="text-left text-xs text-gray-600 font-semibold cursor-pointer">
                Last Name
              </label>
              {isLastNameError && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>
            <div
              className={`cursor-text rounded-3xl transition-all duration-300 ease-in-out bg-gradient-to-br from-white to-gray-50 px-4 py-3 sm:px-4 sm:py-4 min-h-[50px] flex items-center relative shadow-md hover:shadow-lg border ${
                isLastNameError ? "border-red-500" : "border-gray-300"
              }`}
            >
              <input
                type="text"
                placeholder="Enter your last name"
                className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (showValidation) setShowValidation(false);
                }}
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
            className="w-full py-3 rounded-full transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-100 disabled:text-white"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading && (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            <span>{isLoading ? "Retrieving..." : "Retrieve Booking"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

export default function FlightUpgradeWidget() {
  const [bookingReference, setBookingReference] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedUpgrade, setSelectedUpgrade] = useState("");

  const upgradeOptions = [
    {
      id: "premium-economy",
      name: "Premium Economy",
      price: "$150",
      description: "Extra legroom and priority boarding",
    },
    {
      id: "business",
      name: "Business Class",
      price: "$450",
      description: "Lie-flat seats, premium meals, and lounge access",
    },
    {
      id: "first",
      name: "First Class",
      price: "$850",
      description: "Private suites, gourmet dining, and personal service",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Flight upgrade:", {
      bookingReference,
      lastName,
      selectedUpgrade,
    });
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-md mb-6 sm:mb-8 lg:mb-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-500 mb-2 sm:mb-4 text-center">
          Upgrade Your Flight
        </h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">
          If you have purchased a Solomon Airlines ticket more than 48 hours
          ago, please enter your details here to upgrade your flight.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label
                htmlFor="upgrade-booking-reference"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Booking Reference *
              </label>
              <input
                type="text"
                id="upgrade-booking-reference"
                value={bookingReference}
                onChange={(e) => setBookingReference(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter booking reference"
                required
              />
            </div>

            <div>
              <label
                htmlFor="upgrade-last-name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="upgrade-last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="flex justify-center pt-2 sm:pt-4">
            <PrimaryButton text="Check Offers" onClick={() => handleSubmit} />
          </div>
        </form>
      </div>
    </div>
  );
}

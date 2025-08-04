"use client";
import { useState } from "react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import RadioButton from "@/components/ui/buttons/RadioButton";

export default function FlightTimetableWidget() {
  const [departureLocation, setDepartureLocation] = useState("");
  const [arrivalLocation, setArrivalLocation] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [tripType, setTripType] = useState<"one" | "two">("one"); // "one" = Round Trip, "two" = One Way
  const [returnDate, setReturnDate] = useState("");

  const handleTripTypeChange = (option: "one" | "two") => {
    setTripType(option);
    if (option === "two") {
      setReturnDate(""); // Clear return date when switching to one-way
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Flight timetable search:", {
      departureLocation,
      arrivalLocation,
      travelDate,
      tripType: tripType === "one" ? "Round Trip" : "One Way",
      ...(tripType === "one" && { returnDate }),
    });
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-md mb-6 sm:mb-8 lg:mb-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-500 mb-2 sm:mb-4 text-center">
          Flight Timetable
        </h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">
          Search for flight schedules by entering your departure and arrival
          locations, or view our complete flight timetable.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Trip Type Selection */}
          <div className="flex justify-center">
            <RadioButton
              optionOne="Round Trip"
              optionTwo="One Way"
              initialSelected={tripType}
              onOptionChange={handleTripTypeChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label
                htmlFor="departure-location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Flying From?
              </label>
              <input
                type="text"
                id="departure-location"
                value={departureLocation}
                onChange={(e) => setDepartureLocation(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Departure city or airport"
              />
            </div>

            <div>
              <label
                htmlFor="arrival-location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Flying To?
              </label>
              <input
                type="text"
                id="arrival-location"
                value={arrivalLocation}
                onChange={(e) => setArrivalLocation(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Arrival city or airport"
              />
            </div>
          </div>

          <div className={`grid gap-4 sm:gap-6 ${tripType === "two" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
            <div>
              <label
                htmlFor="travel-date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {tripType === "two" ? "Travel Date" : "Departure Date"}
              </label>
              <input
                type="date"
                id="travel-date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {tripType === "one" && (
              <div>
                <label
                  htmlFor="return-date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Return Date
                </label>
                <input
                  type="date"
                  id="return-date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="flex justify-center pt-2 sm:pt-4">
            <PrimaryButton text="View Timetable" onClick={() => handleSubmit} />
          </div>
        </form>
      </div>
    </div>
  );
}

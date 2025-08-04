"use client";
import React, { useState, useEffect } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import RadioButton from "@/components/ui/buttons/RadioButton";
import Accordion from "@/components/ui/Accordion";
import Recommendations from "@/components/layout/sections/Recommendations";

import {
  ScheduleWithFlightData,
  Flight,
  Schedule,
} from "@/graphql/FlightSchedulePageQuery";
import parse from "html-react-parser";

interface FlightScheduleProps {
  initialPage: ScheduleWithFlightData;
}

// Helper function to format dates nicely
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    // year: "numeric",
  });
};

export default function FlightScheduleTemplate({
  initialPage,
}: FlightScheduleProps) {
  const [showInternational, setShowInternational] = useState(true);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );
  // Set default schedule ID on component mount
  useEffect(() => {
    if (
      initialPage.schedules &&
      initialPage.schedules.length > 0 &&
      !selectedScheduleId
    ) {
      setSelectedScheduleId(initialPage.schedules[0].id);
    }
  }, [initialPage.schedules, selectedScheduleId]);

  // Create schedule items from the data
  const createScheduleItems = (isInternational: boolean) => {
    // Filter flights by scope (international or domestic)
    const scopeType = isInternational ? "International" : "Domestic";

    // Group flights by day
    const flightsByDay: Record<string, Flight[]> = {};

    // Find the selected schedule
    const filteredSchedules = selectedScheduleId
      ? initialPage.schedules.filter(
          (schedule) => schedule.id === selectedScheduleId
        )
      : initialPage.schedules;

    // Get flights from the filtered schedules
    filteredSchedules.forEach((schedule) => {
      schedule.flights.forEach((flight) => {
        if (flight.flightScope === scopeType) {
          const day = flight.day.toLowerCase();
          if (!flightsByDay[day]) {
            flightsByDay[day] = [];
          }
          flightsByDay[day].push(flight);
        }
      });
    });

    const days = [
      { key: "monday", label: "Monday" },
      { key: "tuesday", label: "Tuesday" },
      { key: "wednesday", label: "Wednesday" },
      { key: "thursday", label: "Thursday" },
      { key: "friday", label: "Friday" },
      { key: "saturday", label: "Saturday" },
      { key: "sunday", label: "Sunday" },
    ];

    return days.map((day) => ({
      title: day.label,
      content: (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto shadow-inner rounded-xl bg-white">
            <table className="min-w-full rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <thead className="bg-blue-500 border-b-2 border-blue-600">
                <tr>
                  <th className="px-4 py-3 sm:py-4 text-center text-sm font-medium text-white">
                    Flight
                  </th>
                  <th className="px-4 py-3 sm:py-4 text-center text-sm font-medium text-white">
                    Departing from
                  </th>
                  <th className="px-4 py-3 sm:py-4 text-center text-sm font-medium text-white">
                    Arriving to
                  </th>
                  <th className="px-4 py-3 sm:py-4 text-center text-sm font-medium text-white">
                    Departure Time
                  </th>
                  <th className="px-4 py-3 sm:py-4 text-center text-sm font-medium text-white">
                    Arrival Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {(() => {
                  const flights = flightsByDay[day.key] || [];
                  if (flights.length === 0) return null;

                  // Group flights by aircraft type using actual backend data
                  const flightsByAircraft: Record<string, typeof flights> = {};
                  flights.forEach((flight) => {
                    const aircraft = flight.aircraft || "Unknown Aircraft";
                    if (!flightsByAircraft[aircraft]) {
                      flightsByAircraft[aircraft] = [];
                    }
                    flightsByAircraft[aircraft].push(flight);
                  });

                  // Sort flights within each aircraft group by departure time
                  Object.keys(flightsByAircraft).forEach(aircraft => {
                    flightsByAircraft[aircraft].sort((a, b) => {
                      const timeA = a.departureTime || "00:00";
                      const timeB = b.departureTime || "00:00";
                      return timeA.localeCompare(timeB);
                    });
                  });

                  // Render grouped flights with headers
                  return Object.entries(flightsByAircraft).map(
                    ([aircraft, aircraftFlights], groupIdx) => (
                      <React.Fragment key={`${aircraft}-${groupIdx}`}>
                        {/* Aircraft group header */}
                        <tr className="bg-yellow-50 border-t-2 border-yellow-200">
                          <td
                            colSpan={5}
                            className="px-4 py-2.5 text-sm font-medium text-yellow-800 text-left"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              {aircraft} Flights
                            </div>
                          </td>
                        </tr>
                        {/* Aircraft flights */}
                        {aircraftFlights.map((flight, flightIdx) => (
                          <tr
                            key={`${aircraft}-${flightIdx}`}
                            className={`transition-colors duration-200 ${
                              flightIdx % 2 === 0
                                ? "bg-white hover:bg-blue-25"
                                : "bg-gray-25 hover:bg-blue-25"
                            }`}
                          >
                            <td className="px-4 py-3 sm:py-4 text-sm text-gray-800 text-center font-semibold">
                              {flight.flightNumber}
                            </td>
                            <td className="px-4 py-3 sm:py-4 text-sm text-gray-700 text-center font-normal">
                              {flight.departurePort}
                            </td>
                            <td className="px-4 py-3 sm:py-4 text-sm text-gray-700 text-center font-normal">
                              {flight.arrivalPort}
                            </td>
                            <td className="px-4 py-3 sm:py-4 text-sm text-gray-700 text-center font-medium">
                              {flight.departureTime}
                            </td>
                            <td className="px-4 py-3 sm:py-4 text-sm text-gray-700 text-center font-medium">
                              {flight.arrivalTime}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    )
                  );
                })()}
                {(!flightsByDay[day.key] ||
                  flightsByDay[day.key].length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 sm:py-8 text-base text-gray-500 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-400 text-lg">✈</span>
                        </div>
                        No flights scheduled for this day
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {(() => {
              const flights = flightsByDay[day.key] || [];
              if (flights.length === 0) {
                return (
                  <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 text-lg">✈</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        No flights scheduled for this day
                      </span>
                    </div>
                  </div>
                );
              }

              // Group flights by aircraft type using actual backend data
              const flightsByAircraft: Record<string, typeof flights> = {};
              flights.forEach((flight) => {
                const aircraft = flight.aircraft || "Unknown Aircraft";
                if (!flightsByAircraft[aircraft]) {
                  flightsByAircraft[aircraft] = [];
                }
                flightsByAircraft[aircraft].push(flight);
              });

              // Sort flights within each aircraft group by departure time
              Object.keys(flightsByAircraft).forEach(aircraft => {
                flightsByAircraft[aircraft].sort((a, b) => {
                  const timeA = a.departureTime || "00:00";
                  const timeB = b.departureTime || "00:00";
                  return timeA.localeCompare(timeB);
                });
              });

              return Object.entries(flightsByAircraft).map(
                ([aircraft, aircraftFlights], groupIdx) => (
                  <div key={`${aircraft}-${groupIdx}`} className="space-y-3">
                    {/* Aircraft group header */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-yellow-800">
                          {aircraft} Flights
                        </span>
                      </div>
                    </div>

                    {/* Aircraft flights as cards */}
                    <div className="space-y-2">
                      {aircraftFlights.map((flight, flightIdx) => (
                        <div
                          key={`${aircraft}-${flightIdx}`}
                          className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-800">
                              Flight {flight.flightNumber}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>{flight.departurePort}</span>
                              <span>→</span>
                              <span>{flight.arrivalPort}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <div className="text-gray-500 mb-0.5">
                                Departure
                              </div>
                              <div className="font-medium text-gray-700">
                                {flight.departureTime}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500 mb-0.5">
                                Arrival
                              </div>
                              <div className="font-medium text-gray-700">
                                {flight.arrivalTime}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              );
            })()}
          </div>
        </>
      ),
    }));
  };
  const scheduleItems = createScheduleItems(showInternational);

  // Check if we have active schedules and flights
  const hasSchedules =
    initialPage.schedules && initialPage.schedules.length > 0;
  const hasFilteredSchedule = selectedScheduleId !== null;
  const hasFlights = Object.values(scheduleItems).some(
    (item) =>
      item.content &&
      typeof item.content === "object" &&
      "props" in item.content
  );
  // console.log(initialPage);
  return (
    <>
      <SecondaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage?.url || "/hero.jpg"}
        breadcrumbs={initialPage.url}
      />
      <div className="bg-[url(/traditional_ring_section.png)] bg-no-repeat bg-bottom bg-opacity-5">
        <Container>
        <div className="py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16 px-4 sm:px-6">
          {initialPage.description && (
            <div className="mx-auto w-full">
              <div className="text-sm sm:text-base lg:text-base text-left text-gray-700 leading-relaxed">
                {parse(initialPage.description)}
              </div>
            </div>
          )}
          {/* Filters Group: Schedule Cards + Flight Type Toggle */}
          <div className="space-y-4">
            {/* Schedule Date Filter Cards */}
            {initialPage.schedules && initialPage.schedules.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs sm:text-sm font-medium text-gray-600">
                    Select Period
                  </div>
                  <div className="text-xs text-gray-400 sm:hidden">Swipe →</div>
                </div>
                <div
                  className="flex gap-2 sm:gap-3 overflow-x-auto sm:flex-wrap scrollbar-hide pt-1"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {initialPage.schedules.map((schedule) => (
                    <button
                      key={schedule.id}
                      onClick={() => setSelectedScheduleId(schedule.id)}
                      className={`relative flex-shrink-0 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                        selectedScheduleId === schedule.id
                          ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-yellow-400"
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-medium">
                        {formatDate(schedule.startDate)} -{" "}
                        {formatDate(schedule.endDate)}
                      </div>
                      {selectedScheduleId === schedule.id && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Toggle between International and Domestic routes */}
            <div className="flex justify-center">
              <RadioButton
                optionOne="International"
                optionTwo="Domestic"
                initialSelected="one"
                onOptionChange={(option) =>
                  setShowInternational(option === "one")
                }
              />
            </div>
          </div>
          {/* Flight schedule accordion section */}
          <div>
            {hasSchedules && hasFilteredSchedule ? (
              <div>
                {scheduleItems.length > 0 ? (
                  <Accordion items={scheduleItems} defaultOpen={0} />
                ) : (
                  <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
                    <p className="text-sm sm:text-base text-gray-600">
                      No flights available for the selected filters.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
                <p className="text-sm sm:text-base text-gray-600">
                  Please select a schedule to view available flights.
                </p>
              </div>
            )}
          </div>
          {/* Recommendation Section */}
          <Recommendations heading="Explore our destinations" />
        </div>
        </Container>
      </div>
      
    </>
  );
}

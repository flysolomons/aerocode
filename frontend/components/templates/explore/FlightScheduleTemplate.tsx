"use client";
import { useState, useEffect } from "react";
import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import RadioButton from "@/components/common/RadioButton";
import Accordion from "@/components/common/Accordion";
import {
  ScheduleWithFlightData,
  Flight,
  Schedule,
} from "@/graphql/FlightSchedulePageQuery";

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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50 rounded-[10px] overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Flight
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Departing from
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Arriving to
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Departure Time
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Arrival Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-gray-50">
              {flightsByDay[day.key]?.map((flight, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">
                    {flight.flightNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">
                    {flight.departurePort}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">
                    {flight.arrivalPort}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">
                    {flight.departureTime}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">
                    {flight.arrivalTime}
                  </td>
                </tr>
              ))}
              {(!flightsByDay[day.key] ||
                flightsByDay[day.key].length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-sm text-gray-600 text-center"
                  >
                    No flights scheduled for this day
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

  return (
    <>
      <SecondaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage?.url || "/hero.jpg"}
        breadcrumbs={initialPage.url}
      />
      <Container>
        <div className="py-12 space-y-16">
          {/* Description */}
          <span className="block text-center">{initialPage.description}</span>

          {/* Schedule Date Filter Cards */}
          {initialPage.schedules && initialPage.schedules.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {initialPage.schedules.map((schedule) => (
                <button
                  key={schedule.id}
                  onClick={() => setSelectedScheduleId(schedule.id)}
                  className={`px-6 py-3 rounded-full shadow-md transition-all ${
                    selectedScheduleId === schedule.id
                      ? "bg-yellow-300 text-black"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium">
                    {"From"}{" "}
                    <span className="font-semibold">
                      {formatDate(schedule.startDate)}
                    </span>
                    {" to "}
                    <span className="font-semibold">
                      {formatDate(schedule.endDate)}
                    </span>
                  </div>
                </button>
              ))}
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

          {/* Flight schedule accordion section */}
          <div>
            {hasSchedules && hasFilteredSchedule ? (
              <div>
                {scheduleItems.length > 0 ? (
                  <Accordion items={scheduleItems} defaultOpen={0} />
                ) : (
                  <div className="bg-white rounded-lg p-8 text-center">
                    <p>No flights available for the selected filters.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <p>Please select a schedule to view available flights.</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

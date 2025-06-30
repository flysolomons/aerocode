import React from "react";
import { TravelPeriod } from "@/graphql/SpecialPageQuery";

interface FlightSpecialInformationProps {
  bookingClass?: string;
  discount?: string;
  tripType?: string;
  flightScope?: string;
  travelPeriods?: TravelPeriod[];
  startDate?: string;
  endDate?: string;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString || "-";
  }
}

const FlightSpecialInformation: React.FC<FlightSpecialInformationProps> = ({
  bookingClass,
  discount,
  tripType,
  flightScope,
  travelPeriods,
  startDate,
  endDate,
}) => {
  // Sales period is startDate - endDate
  const salesPeriod =
    startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : "-";
  // Travel period: show all travelPeriods if available, else fallback to salesPeriod
  const travelPeriodDisplay =
    travelPeriods && travelPeriods.length > 0
      ? travelPeriods
          .map((p) => `${formatDate(p.startDate)} - ${formatDate(p.endDate)}`)
          .join(", ")
      : salesPeriod;
  // Expires: use endDate
  const expires = endDate ? formatDate(endDate) : "-";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-500">
          Flight Special Information
        </h2>
        <div className="flex gap-2">
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            Expires {expires}
          </span>
        </div>
      </div>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-gray-500">Sales Period</dt>
          <dd className="mt-1 text-sm text-gray-900">{salesPeriod}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Travel Period</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {travelPeriods && travelPeriods.length > 0 ? (
              <ul className="list-none p-0 m-0">
                {travelPeriods.map((p, i) => (
                  <li key={i}>{`${formatDate(p.startDate)} - ${formatDate(
                    p.endDate
                  )}`}</li>
                ))}
              </ul>
            ) : (
              salesPeriod
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Discount</dt>
          <dd className="mt-1 text-sm text-gray-900">{discount || "-"}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Trip type</dt>
          <dd className="mt-1 text-sm text-gray-900">{tripType || "-"}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Booking class</dt>
          <dd className="mt-1 text-sm text-gray-900">{bookingClass || "-"}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Flight Scope</dt>
          <dd className="mt-1 text-sm text-gray-900">{flightScope || "-"}</dd>
        </div>
      </dl>
    </div>
  );
};

export default FlightSpecialInformation;

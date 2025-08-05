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
        <div className="flex lg:gap-2">
          <span className="-ml-4 lg:ml-0 bg-red-100 text-red-800 p-4 rounded-full text-xs lg:text-sm font-medium">
            Expires {expires}
          </span>
        </div>
      </div>
      <dl className="grid grid-cols-1  grid-rows-3 gap-y-3 gap-3  sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="inline mr-1" fill="#6D7280" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path></svg>
            Sales Period
          </dt>
          <dd className="mt-1 text-sm text-gray-900 pl-6">{salesPeriod}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6d7280" className="inline mr-1" viewBox="0 0 256 256"><path d="M224,216a8,8,0,0,1-8,8H72a8,8,0,1,1,0-16H216A8,8,0,0,1,224,216Zm24-80v24a8,8,0,0,1-8,8H61.07a39.75,39.75,0,0,1-38.31-28.51L8.69,92.6A16,16,0,0,1,24,72h8a8,8,0,0,1,5.65,2.34L59.32,96H81.81l-9-26.94A16,16,0,0,1,88,48h8a8,8,0,0,1,5.66,2.34L147.32,96H208A40,40,0,0,1,248,136Zm-16,0a24,24,0,0,0-24-24H144a8,8,0,0,1-5.65-2.34L92.69,64H88l12.49,37.47A8,8,0,0,1,92.91,112H56a8,8,0,0,1-5.66-2.34L28.69,88H24l14.07,46.9a23.85,23.85,0,0,0,23,17.1H232Z"></path></svg>
            Travel Period
          </dt>
          <dd className="mt-1 pl-6 text-sm text-gray-900">
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
          <dt className="text-sm font-medium text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6D7280" className="inline mr-1" viewBox="0 0 256 256"><path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.73,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.27,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-11.55,39.29c-4.79,5-9.75,10.17-12.38,16.52-2.52,6.1-2.63,13.07-2.73,19.82-.1,7-.21,14.33-3.32,17.43s-10.39,3.22-17.43,3.32c-6.75.1-13.72.21-19.82,2.73-6.35,2.63-11.52,7.59-16.52,12.38S132,224,128,224s-9.15-4.92-14.11-9.69-10.17-9.75-16.52-12.38c-6.1-2.52-13.07-2.63-19.82-2.73-7-.1-14.33-.21-17.43-3.32s-3.22-10.39-3.32-17.43c-.1-6.75-.21-13.72-2.73-19.82-2.63-6.35-7.59-11.52-12.38-16.52S32,132,32,128s4.92-9.14,9.69-14.11,9.75-10.17,12.38-16.52c2.52-6.1,2.63-13.07,2.73-19.82.1-7,.21-14.33,3.32-17.43S70.51,56.9,77.55,56.8c6.75-.1,13.72-.21,19.82-2.73,6.35-2.63,11.52-7.59,16.52-12.38S124,32,128,32s9.15,4.92,14.11,9.69,10.17,9.75,16.52,12.38c6.1,2.52,13.07,2.63,19.82,2.73,7,.1,14.33.21,17.43,3.32s3.22,10.39,3.32,17.43c.1,6.75.21,13.72,2.73,19.82,2.63,6.35,7.59,11.52,12.38,16.52S224,124,224,128,219.08,137.14,214.31,142.11ZM120,96a24,24,0,1,0-24,24A24,24,0,0,0,120,96ZM88,96a8,8,0,1,1,8,8A8,8,0,0,1,88,96Zm72,40a24,24,0,1,0,24,24A24,24,0,0,0,160,136Zm0,32a8,8,0,1,1,8-8A8,8,0,0,1,160,168Zm13.66-74.34-80,80a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,11.32Z"></path></svg>
            Discount
          </dt>
          <dd className="mt-1 text-sm text-gray-900 pl-6">{discount || "-"}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6d7280" className="inline mr-1" viewBox="0 0 256 256"><path d="M235.92,199A8,8,0,0,1,225,195.92L155.32,72H136v8a8,8,0,0,1-16,0V72H100.68L31,195.92A8,8,0,0,1,17,188.08L82.32,72H24a8,8,0,0,1,0-16H232a8,8,0,0,1,0,16H173.68L239,188.08A8,8,0,0,1,235.92,199ZM128,112a8,8,0,0,0-8,8v16a8,8,0,0,0,16,0V120A8,8,0,0,0,128,112Zm0,56a8,8,0,0,0-8,8v16a8,8,0,0,0,16,0V176A8,8,0,0,0,128,168Z"></path></svg>
            Trip type
          </dt>
          <dd className="mt-1 text-sm text-gray-900 pl-6">{tripType || "-"}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6d7280" className="inline mr-1" viewBox="0 0 256 256"><path d="M232,104a8,8,0,0,0,8-8V64a16,16,0,0,0-16-16H32A16,16,0,0,0,16,64V96a8,8,0,0,0,8,8,24,24,0,0,1,0,48,8,8,0,0,0-8,8v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160a8,8,0,0,0-8-8,24,24,0,0,1,0-48ZM32,167.2a40,40,0,0,0,0-78.4V64H88V192H32Zm192,0V192H104V64H224V88.8a40,40,0,0,0,0,78.4Z"></path></svg>
            Booking class
          </dt>
          <dd className="mt-1 text-sm text-gray-900 pl-6">{bookingClass || "-"}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6d7280" className="inline mr-1" viewBox="0 0 256 256"><path d="M208,96H147.32L101.66,50.34A8,8,0,0,0,96,48H88A16,16,0,0,0,72.83,69.06l9,26.94H59.32L37.66,74.34A8,8,0,0,0,32,72H24A16,16,0,0,0,8.69,92.6l14.07,46.89A39.75,39.75,0,0,0,61.07,168H240a8,8,0,0,0,8-8V136A40,40,0,0,0,208,96Zm24,56H61.07a23.85,23.85,0,0,1-23-17.1L24,88h4.68l21.66,21.66A8,8,0,0,0,56,112h36.9a8,8,0,0,0,7.59-10.53L88,64h4.68l45.66,45.66A8,8,0,0,0,144,112h64a24,24,0,0,1,24,24Zm-8,48a16,16,0,1,1-16-16A16,16,0,0,1,224,200Zm-96,0a16,16,0,1,1-16-16A16,16,0,0,1,128,200Z"></path></svg>
            Flight Scope
          </dt>
          <dd className="mt-1 text-sm text-gray-900 pl-6">{flightScope || "-"}</dd>
        </div>
      </dl>
    </div>
  );
};

export default FlightSpecialInformation;

type FlightInfoCardProps = {
  departureAirport: string;
  departureAirportCode: string;
  arrivalAirport: string;
  arrivalAirportCode: string;
};

export default function FlightInfoCard({
  departureAirport,
  departureAirportCode,
  arrivalAirport,
  arrivalAirportCode,
}: FlightInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl lg:rounded-3xl p-4 sm:p-6 lg:p-6 shadow-md w-full">      <div className="space-y-3 sm:space-y-4 lg:space-y-4">
        <div className="flex justify-between sm:grid sm:grid-cols-2 lg:grid-cols-2 border-b pb-3 sm:pb-4 lg:pb-4">
          <div className="font-medium text-sm sm:text-base lg:text-base text-gray-700">Departure Airport</div>
          <div className="text-sm sm:text-base lg:text-base text-right sm:text-left break-words">{departureAirport}</div>
        </div>

        <div className="flex justify-between sm:grid sm:grid-cols-2 lg:grid-cols-2 border-b pb-3 sm:pb-4 lg:pb-4">
          <div className="font-medium text-sm sm:text-base lg:text-base text-gray-700">Departure Airport Code</div>
          <div className="text-sm sm:text-base lg:text-base text-right sm:text-left font-mono">{departureAirportCode}</div>
        </div>

        <div className="flex justify-between sm:grid sm:grid-cols-2 lg:grid-cols-2 border-b pb-3 sm:pb-4 lg:pb-4">
          <div className="font-medium text-sm sm:text-base lg:text-base text-gray-700">Arrival Airport</div>
          <div className="text-sm sm:text-base lg:text-base text-right sm:text-left break-words">{arrivalAirport}</div>
        </div>

        <div className="flex justify-between sm:grid sm:grid-cols-2 lg:grid-cols-2">
          <div className="font-medium text-sm sm:text-base lg:text-base text-gray-700">Arrival Airport Code</div>
          <div className="text-sm sm:text-base lg:text-base text-right sm:text-left font-mono">{arrivalAirportCode}</div>
        </div>
      </div>
    </div>
  );
}

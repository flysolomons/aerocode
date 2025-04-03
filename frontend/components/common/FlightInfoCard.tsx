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
    <div className="bg-white rounded-3xl p-6 shadow-md">
      <div className="space-y-4">
        <div className="grid grid-cols-2 border-b pb-4">
          <div className="font-medium">Departure Airport</div>
          <div>{departureAirport}</div>
        </div>

        <div className="grid grid-cols-2 border-b pb-4">
          <div className="font-medium">Departure Airport Code</div>
          <div>{departureAirportCode}</div>
        </div>

        <div className="grid grid-cols-2 border-b pb-4">
          <div className="font-medium">Arrival Airport</div>
          <div>{arrivalAirport}</div>
        </div>

        <div className="grid grid-cols-2">
          <div className="font-medium">Arrival Airport Code</div>
          <div>{arrivalAirportCode}</div>
        </div>
      </div>
    </div>
  );
}

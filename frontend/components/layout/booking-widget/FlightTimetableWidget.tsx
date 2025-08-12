"use client";
import { useState, useEffect, useCallback } from "react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import RadioButton from "@/components/ui/buttons/RadioButton";
import { SingleDatePicker } from "@/components/ui/single-date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon, MapPinIcon } from "lucide-react";
import {
  fetchAllAirports,
  fetchArrivalDestinationsForOrigin,
  AirportData,
  ArrivalAirport,
} from "@/graphql/BookingWidgetQuery";

export default function FlightTimetableWidget() {
  const [departureLocation, setDepartureLocation] = useState("");
  const [arrivalLocation, setArrivalLocation] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [tripType, setTripType] = useState<"one" | "two">("one"); // "one" = Round Trip, "two" = One Way
  
  // Airport data states - same as booking widget
  const [allAirports, setAllAirports] = useState<AirportData[]>([]);
  const [arrivalAirports, setArrivalAirports] = useState<AirportData[]>([]);
  const [selectedDeparture, setSelectedDeparture] = useState<AirportData | null>(null);
  const [selectedArrival, setSelectedArrival] = useState<AirportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingArrivals, setIsLoadingArrivals] = useState<boolean>(false);

  // State for dropdown controls
  const [isDeparturePopoverOpen, setIsDeparturePopoverOpen] = useState(false);
  const [isArrivalPopoverOpen, setIsArrivalPopoverOpen] = useState(false);
  
  // Search state
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showValidation, setShowValidation] = useState<boolean>(false);

  const handleTripTypeChange = (option: "one" | "two") => {
    setTripType(option);
    if (option === "two") {
      // Clear return date when switching to one-way
      setReturnDate(undefined);
    }
  };

  // Fetch airport data on component mount - same as booking widget
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        setIsLoading(true);
        const airports = await fetchAllAirports();
        setAllAirports(airports);
        // Initialize arrival airports with all airports
        setArrivalAirports(airports);
      } catch (error) {
        console.error("Error fetching airports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAirports();
  }, []);

  // Memoized function to fetch arrival destinations - same as booking widget
  const fetchArrivalsForOrigin = useCallback(
    async (departureAirport: string) => {
      setIsLoadingArrivals(true);
      try {
        const arrivals = await fetchArrivalDestinationsForOrigin(departureAirport);
        
        // Convert ArrivalAirport[] to AirportData[] format
        const arrivalAirportsData = arrivals.map(arrival => ({
          code: arrival.arrivalAirportCode,
          city: arrival.arrivalAirport,
          name: arrival.arrivalAirport,
        }));
        
        setArrivalAirports(arrivalAirportsData);

        // Clear selectedArrival if current selection is not valid for this origin
        if (selectedArrival && !arrivalAirportsData.some(a => a.code === selectedArrival.code)) {
          setSelectedArrival(null);
          setArrivalLocation("");
        }
      } catch (error) {
        console.error("Error fetching arrivals:", error);
      } finally {
        setIsLoadingArrivals(false);
      }
    },
    [selectedArrival?.code]
  );

  // When selectedDeparture changes, fetch arrival airports for that origin
  useEffect(() => {
    if (selectedDeparture?.code) {
      fetchArrivalsForOrigin(selectedDeparture.code);
    }
  }, [selectedDeparture?.code, fetchArrivalsForOrigin]);

  // Simplified search handler - only search body with itineraries
  const handleSearch = useCallback(() => {
    if (selectedDeparture && selectedArrival && departureDate && (tripType === "two" || returnDate)) {
      setIsSearching(true);
      setShowValidation(false);

      // Format date as YYYY-MM-DD
      function formatDate(date: Date) {
        return date.toISOString().slice(0, 10);
      }

      const searchObj = {
        itineraries: [
          {
            originLocationCode: selectedDeparture.code,
            destinationLocationCode: selectedArrival.code,
            departureDateTime: formatDate(departureDate),
          },
        ],
      };

      // Add return itinerary for round trips
      if (tripType === "one" && returnDate) {
        searchObj.itineraries.push({
          originLocationCode: selectedArrival.code,
          destinationLocationCode: selectedDeparture.code,
          departureDateTime: formatDate(returnDate),
        });
      }

      // Create form and submit as POST request
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://uat.digital.airline.amadeus.com/ie/booking/timetable?lang=en-GB";
      form.style.display = "none";

      // Create hidden input with search data
      const searchInput = document.createElement("input");
      searchInput.type = "hidden";
      searchInput.name = "search";
      searchInput.value = JSON.stringify(searchObj);
      form.appendChild(searchInput);

      document.body.appendChild(form);
      form.submit();
    } else {
      setShowValidation(true);
    }
  }, [selectedDeparture, selectedArrival, departureDate, returnDate, tripType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
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
            {/* Departure Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flying From?
              </label>
              <Popover
                open={isDeparturePopoverOpen}
                onOpenChange={setIsDeparturePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <button className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className={selectedDeparture ? "text-gray-900 text-sm" : "text-gray-400 text-sm"}>
                        {selectedDeparture ? `${selectedDeparture.city} (${selectedDeparture.code})` : "Departure city or airport"}
                      </span>
                    </div>
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="mt-1 p-0 w-[--radix-popover-trigger-width] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto z-[75]"
                  style={{
                    maxHeight: allAirports.length > 5 ? "20rem" : "auto",
                  }}
                  align="start"
                  side="bottom"
                  avoidCollisions={false}
                >
                  {isLoading ? (
                    <div className="px-4 py-3 text-gray-500">Loading airports...</div>
                  ) : allAirports.length > 0 ? (
                    allAirports.map((airport) => (
                      <div
                        key={airport.code}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedDeparture(airport);
                          setDepartureLocation(`${airport.city} (${airport.code})`);
                          setIsDeparturePopoverOpen(false);
                        }}
                      >
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {airport.city}
                          </div>
                          <div className="text-xs text-gray-500">{airport.code}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 p-3">No destinations found</div>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            {/* Arrival Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flying To?
              </label>
              <Popover
                open={isArrivalPopoverOpen}
                onOpenChange={setIsArrivalPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <button className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className={selectedArrival ? "text-gray-900 text-sm" : "text-gray-400 text-sm"}>
                        {selectedArrival ? `${selectedArrival.city} (${selectedArrival.code})` : "Arrival city or airport"}
                      </span>
                    </div>
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="mt-1 p-0 w-[--radix-popover-trigger-width] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto z-[75]"
                  style={{
                    maxHeight: arrivalAirports.length > 5 ? "20rem" : "auto",
                  }}
                  align="start"
                  side="bottom"
                  avoidCollisions={false}
                >
                  {isLoadingArrivals ? (
                    <div className="px-4 py-3 text-gray-500">Loading destinations...</div>
                  ) : arrivalAirports.length > 0 ? (
                    arrivalAirports.map((airport) => (
                      <div
                        key={airport.code}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedArrival(airport);
                          setArrivalLocation(`${airport.city} (${airport.code})`);
                          setIsArrivalPopoverOpen(false);
                        }}
                      >
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {airport.city}
                          </div>
                          <div className="text-xs text-gray-500">{airport.code}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 p-3">No destinations found</div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Date Selection */}
          <div className={`grid gap-4 sm:gap-6 ${tripType === "two" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
            <SingleDatePicker
              date={departureDate}
              onSelect={setDepartureDate}
              placeholder={tripType === "two" ? "Select travel date" : "Select departure date"}
              label={tripType === "two" ? "Travel Date" : "Departure Date"}
              className="w-full"
            />
            
            {tripType === "one" && (
              <SingleDatePicker
                date={returnDate}
                onSelect={setReturnDate}
                placeholder="Select return date"
                label="Return Date"
                className="w-full"
                minDate={departureDate}
              />
            )}
          </div>

          {/* Validation message */}
          {showValidation && (
            <div className="text-red-500 text-sm text-center mb-4">
              Please select departure location, arrival location, and travel date(s).
            </div>
          )}

          <div className="flex justify-center pt-2 sm:pt-4">
            <button
              type="submit"
              disabled={isSearching}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                isSearching
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
              }`}
            >
              {isSearching && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{isSearching ? "Searching..." : "View Timetable"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

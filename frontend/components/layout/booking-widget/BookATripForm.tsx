"use client";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import RadioButton from "@/components/ui/buttons/RadioButton";
import { Travelers } from "./TravelerDropDown";
import {
  fetchDepartureDestinations,
  fetchArrivalDestinations,
  DepartureAirport,
  ArrivalAirport,
} from "@/graphql/BookingWidgetQuery";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function BookATripForm() {
  //Initialize default values for travelers.
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 1,
    children: 0,
    infants: 0,
  });

  //Oneway or return
  const [isOneWay, setIsOneWay] = useState<boolean>(false);

  // State for date picker
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [isDepartureDateOpen, setIsDepartureDateOpen] =
    useState<boolean>(false);
  const [isReturnDateOpen, setIsReturnDateOpen] = useState<boolean>(false);

  // State for departure and arrival airports
  const [departureAirports, setDepartureAirports] = useState<
    DepartureAirport[]
  >([]);
  const [arrivalAirports, setArrivalAirports] = useState<ArrivalAirport[]>([]);
  const [selectedDeparture, setSelectedDeparture] =
    useState<DepartureAirport | null>(null);
  const [selectedArrival, setSelectedArrival] = useState<ArrivalAirport | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State to control the airport popovers
  const [isArrivalPopoverOpen, setIsArrivalPopoverOpen] =
    useState<boolean>(false);
  const [isDeparturePopoverOpen, setIsDeparturePopoverOpen] =
    useState<boolean>(false); // State to control the travelers popover
  const [isTravelersPopoverOpen, setIsTravelersPopoverOpen] =
    useState<boolean>(false);
  const [isTravelersMobileOpen, setIsTravelersMobileOpen] =
    useState<boolean>(false);

  // Ref for travelers mobile dropdown to handle outside clicks
  const travelersMobileRef = useRef<HTMLDivElement>(null);

  // Fetch airport data on component mount
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        setIsLoading(true);
        const departures = await fetchDepartureDestinations();
        const arrivals = await fetchArrivalDestinations();

        setDepartureAirports(departures);
        setArrivalAirports(arrivals);
      } catch (error) {
        console.error("Error fetching airports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAirports();
  }, []);

  // Handle outside clicks for travelers mobile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        travelersMobileRef.current &&
        !travelersMobileRef.current.contains(event.target as Node) &&
        isTravelersMobileOpen
      ) {
        setIsTravelersMobileOpen(false);
      }
    };

    if (isTravelersMobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTravelersMobileOpen]);

  // Handle changes to traveler counts
  const handleChange = (
    type: keyof Travelers,
    action: "increment" | "decrement"
  ) => {
    setTravelers((prev) => {
      const newTravelers = { ...prev };

      if (action === "increment") {
        newTravelers[type] += 1;
      } else {
        newTravelers[type] -= 1;
      }

      return newTravelers;
    });
  };

  // Format travelers for display
  const formatTravelers = (): string => {
    const parts: string[] = [];

    if (travelers.adults > 0) {
      parts.push(
        `${travelers.adults} Adult${travelers.adults !== 1 ? "s" : ""}`
      );
    }

    if (travelers.children > 0) {
      parts.push(
        `${travelers.children} Child${travelers.children !== 1 ? "ren" : ""}`
      );
    }

    if (travelers.infants > 0) {
      parts.push(
        `${travelers.infants} Infant${travelers.infants !== 1 ? "s" : ""}`
      );
    }

    return parts.length > 0 ? parts.join(", ") : "";
  };

  const handleSearch = () => {
    // Handle search with selected airports
    if (selectedDeparture && selectedArrival) {
      console.log("Searching for flights...");
      console.log(
        "From:",
        selectedDeparture.departureAirport,
        selectedDeparture.departureAirportCode
      );
      console.log(
        "To:",
        selectedArrival.arrivalAirport,
        selectedArrival.arrivalAirportCode
      );
      console.log("Date range:", dateRange);
      console.log("Travelers:", travelers);
      console.log("Is one way:", isOneWay);
      // Implement search functionality or navigation here
    } else {
      alert("Please select both departure and arrival airports");
    }
  };
  return (
    <div className="px-4 py-3 flex flex-col items-center space-y-4">
      {/* Mobile: Heading */}
      <h2 className="block md:hidden text-xl font-bold text-blue-500 mb-2">
        Book a Trip
      </h2>
      <RadioButton
        optionOne="Round Trip"
        optionTwo="One Way"
        onOptionChange={(value: string) => setIsOneWay(value === "One Way")}
      />
      {/* search form */}
      <div className="flex flex-col md:flex-row w-full md:items-center md:border md:border-gray-200 md:rounded-full md:px-2 md:shadow-md space-y-4 md:space-y-0 py-2 md:py-0">
        <div className="w-full md:flex-1">
          {/* Desktop: Use Popover */}
          <div className="hidden md:block">
            <Popover
              open={isDeparturePopoverOpen}
              onOpenChange={setIsDeparturePopoverOpen}
            >
              <PopoverTrigger asChild className="w-full">
                <div className="cursor-pointer px-6 py-3">
                  <label className="block text-left text-xs text-black font-semibold cursor-pointer">
                    Flying from?
                  </label>
                  <input
                    type="text"
                    placeholder="Select destination"
                    className="w-full text-sm outline-none text-gray-700 cursor-pointer"
                    readOnly
                    value={
                      selectedDeparture
                        ? `${selectedDeparture.departureAirport} (${selectedDeparture.departureAirportCode})`
                        : ""
                    }
                  />
                </div>
              </PopoverTrigger>

              <PopoverContent
                className="mt-1 p-0 w-[--radix-popover-trigger-width] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto"
                style={{
                  maxHeight: departureAirports.length > 3 ? "12rem" : "auto",
                }}
                align="start"
                side="bottom"
                sideOffset={4}
              >
                {isLoading ? (
                  <div className="text-gray-500 p-3">
                    Loading destinations...
                  </div>
                ) : departureAirports.length > 0 ? (
                  departureAirports.map((airport, index) => (
                    <div
                      key={index}
                      className="hover:bg-gray-100 cursor-pointer p-3"
                      onClick={() => {
                        setSelectedDeparture(airport);
                        setIsDeparturePopoverOpen(false);
                      }}
                    >
                      <div className="text-black text-sm">
                        {airport.departureAirport}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 p-3">No destinations found</div>
                )}
              </PopoverContent>
            </Popover>
          </div>
          {/* Mobile: Use inline dropdown that pushes content */}
          <div className="block md:hidden">
            <div
              className="cursor-pointer border-2 border-gray-300 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-white px-4 py-3 hover:border-blue-300"
              onClick={() => setIsDeparturePopoverOpen(!isDeparturePopoverOpen)}
            >
              <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1">
                Flying from?
              </label>
              <input
                type="text"
                placeholder="Select destination"
                className="w-full text-sm outline-none text-gray-800 cursor-pointer placeholder-gray-400"
                readOnly
                value={
                  selectedDeparture
                    ? `${selectedDeparture.departureAirport} (${selectedDeparture.departureAirportCode})`
                    : ""
                }
              />
            </div>
            {/* Mobile dropdown that pushes content down */}
            {isDeparturePopoverOpen && (
              <div className="w-full bg-white border-2 border-gray-300 rounded-xl shadow-lg mt-2 max-h-48 overflow-y-auto transition-all duration-400 ease-in-out transform animate-in slide-in-from-top-1 fade-in-0 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-1 data-[state=closed]:fade-out-0">
                {isLoading ? (
                  <div className="text-gray-500 p-3">
                    Loading destinations...
                  </div>
                ) : departureAirports.length > 0 ? (
                  departureAirports.map((airport, index) => (
                    <div
                      key={index}
                      className="hover:bg-gray-100 cursor-pointer p-3 border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setSelectedDeparture(airport);
                        setIsDeparturePopoverOpen(false);
                      }}
                    >
                      <div className="text-black text-sm">
                        {airport.departureAirport}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 p-3">No destinations found</div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>
        <div className="w-full md:flex-1">
          {/* Desktop: Use Popover */}
          <div className="hidden md:block">
            <Popover
              open={isArrivalPopoverOpen}
              onOpenChange={setIsArrivalPopoverOpen}
            >
              <PopoverTrigger asChild className="w-full">
                <div className="cursor-pointer px-6 py-3">
                  <label className="block text-left text-xs text-black font-semibold cursor-pointer">
                    Flying to?
                  </label>
                  <input
                    type="text"
                    placeholder="Select destination"
                    className="w-full text-sm outline-none text-gray-700 cursor-pointer"
                    readOnly
                    value={
                      selectedArrival
                        ? `${selectedArrival.arrivalAirport} (${selectedArrival.arrivalAirportCode})`
                        : ""
                    }
                  />
                </div>
              </PopoverTrigger>

              <PopoverContent
                className="mt-1 p-0 w-[--radix-popover-trigger-width] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto"
                style={{
                  maxHeight: arrivalAirports.length > 3 ? "12rem" : "auto",
                }}
                align="start"
                side="bottom"
                sideOffset={4}
              >
                {isLoading ? (
                  <div className="text-gray-500 p-3">
                    Loading destinations...
                  </div>
                ) : arrivalAirports.length > 0 ? (
                  arrivalAirports.map((airport, index) => (
                    <div
                      key={index}
                      className="hover:bg-gray-100 cursor-pointer p-3"
                      onClick={() => {
                        setSelectedArrival(airport);
                        setIsArrivalPopoverOpen(false);
                      }}
                    >
                      <div className="text-black text-sm">
                        {airport.arrivalAirport}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 p-3">No destinations found</div>
                )}
              </PopoverContent>
            </Popover>
          </div>
          {/* Mobile: Use inline dropdown that pushes content */}
          <div className="block md:hidden">
            <div
              className="cursor-pointer border-2 border-gray-300 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-white px-4 py-3 hover:border-blue-300"
              onClick={() => setIsArrivalPopoverOpen(!isArrivalPopoverOpen)}
            >
              <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1">
                Flying to?
              </label>
              <input
                type="text"
                placeholder="Select destination"
                className="w-full text-sm outline-none text-gray-800 cursor-pointer placeholder-gray-400"
                readOnly
                value={
                  selectedArrival
                    ? `${selectedArrival.arrivalAirport} (${selectedArrival.arrivalAirportCode})`
                    : ""
                }
              />
            </div>
            {/* Mobile dropdown that pushes content down */}
            {isArrivalPopoverOpen && (
              <div className="w-full bg-white border-2 border-gray-300 rounded-xl shadow-lg mt-2 max-h-48 overflow-y-auto transition-all duration-400 ease-in-out transform animate-in slide-in-from-top-1 fade-in-0 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-1 data-[state=closed]:fade-out-0">
                {isLoading ? (
                  <div className="text-gray-500 p-3">
                    Loading destinations...
                  </div>
                ) : arrivalAirports.length > 0 ? (
                  arrivalAirports.map((airport, index) => (
                    <div
                      key={index}
                      className="hover:bg-gray-100 cursor-pointer p-3 border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setSelectedArrival(airport);
                        setIsArrivalPopoverOpen(false);
                      }}
                    >
                      <div className="text-black text-sm">
                        {airport.arrivalAirport}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 p-3">No destinations found</div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>
        {/* Desktop: Combined date picker */}
        <div className="hidden md:flex w-full md:flex-1 border border-gray-200 rounded-3xl shadow-md px-4 py-3 md:border-0 md:rounded-none md:shadow-none md:px-6 md:py-3 bg-white md:bg-transparent">
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <div className="flex-1 cursor-pointer">
                <PopoverTrigger asChild>
                  <div className="w-full">
                    <label className="block text-left text-xs text-black font-semibold cursor-pointer">
                      Departure
                    </label>
                    <input
                      type="text"
                      placeholder="Pick a date"
                      className="w-full text-sm outline-none text-black cursor-pointer"
                      readOnly
                      value={
                        dateRange.from
                          ? format(dateRange.from, "dd MMM, yyyy")
                          : ""
                      }
                      onClick={() => setIsDatePickerOpen(true)}
                    />
                  </div>
                </PopoverTrigger>
              </div>

              <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>

              <div className="flex-1 cursor-pointer">
                <PopoverTrigger asChild>
                  <div
                    className={`w-full ${
                      isOneWay ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <label className="block text-left text-xs text-black font-semibold cursor-pointer">
                      Return
                    </label>
                    <input
                      type="text"
                      placeholder={isOneWay ? "One way flight" : "Pick a date"}
                      className="w-full text-sm outline-none text-black cursor-pointer"
                      readOnly
                      disabled={isOneWay}
                      value={
                        !isOneWay && dateRange.to
                          ? format(dateRange.to, "dd MMM, yyyy")
                          : ""
                      }
                      onClick={() => setIsDatePickerOpen(true)}
                    />
                  </div>
                </PopoverTrigger>
              </div>

              <PopoverContent
                className="w-auto mt-4 p-0 bg-white border border-gray-200 rounded-md shadow-lg"
                align="center"
              >
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range) {
                      setDateRange(range);
                      if (range.to) {
                        setIsDatePickerOpen(false);
                      }
                    }
                  }}
                  numberOfMonths={2}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </div>
          </Popover>
        </div>
        {/* Mobile: Separate departure date card */}
        <div className="block md:hidden w-full">
          <Popover
            open={isDepartureDateOpen}
            onOpenChange={setIsDepartureDateOpen}
          >
            <div
              className="cursor-pointer border-2 border-gray-300 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-white px-4 py-3 hover:border-blue-300"
              onClick={() => setIsDepartureDateOpen(!isDepartureDateOpen)}
            >
              <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1">
                Departure
              </label>
              <input
                type="text"
                placeholder="Pick departure date"
                className="w-full text-sm outline-none text-gray-800 cursor-pointer placeholder-gray-400"
                readOnly
                value={
                  dateRange.from ? format(dateRange.from, "dd MMM, yyyy") : ""
                }
              />
            </div>
            <PopoverContent
              className="w-auto mt-4 p-0 bg-white border-2 border-gray-300 rounded-xl shadow-lg"
              align="center"
            >
              <Calendar
                initialFocus
                mode="single"
                defaultMonth={dateRange.from}
                selected={dateRange.from}
                onSelect={(date) => {
                  if (date) {
                    setDateRange({ ...dateRange, from: date });
                    setIsDepartureDateOpen(false);
                  }
                }}
                numberOfMonths={1}
                disabled={{ before: new Date() }}
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* Mobile: Separate return date card */}
        {!isOneWay && (
          <div className="block md:hidden w-full">
            <Popover open={isReturnDateOpen} onOpenChange={setIsReturnDateOpen}>
              <div
                className={`cursor-pointer border-2 border-gray-300 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-white px-4 py-3 hover:border-blue-300 ${
                  isOneWay ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() =>
                  !isOneWay && setIsReturnDateOpen(!isReturnDateOpen)
                }
              >
                <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1">
                  Return
                </label>
                <input
                  type="text"
                  placeholder="Pick return date"
                  className="w-full text-sm outline-none text-gray-800 cursor-pointer placeholder-gray-400"
                  readOnly
                  disabled={isOneWay}
                  value={
                    !isOneWay && dateRange.to
                      ? format(dateRange.to, "dd MMM, yyyy")
                      : ""
                  }
                />
              </div>
              <PopoverContent
                className="w-auto mt-4 p-0 bg-white border-2 border-gray-300 rounded-xl shadow-lg"
                align="center"
              >
                <Calendar
                  initialFocus
                  mode="single"
                  defaultMonth={dateRange.to || dateRange.from}
                  onSelect={(date) => {
                    if (date) {
                      setDateRange({ ...dateRange, to: date });
                      setIsReturnDateOpen(false);
                    }
                  }}
                  numberOfMonths={1}
                  disabled={{ before: dateRange.from || new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>
        {/* Desktop: Use Popover */}
        <div className="hidden md:flex w-full md:flex-1 flex border border-gray-200 rounded-3xl shadow-md md:border-0 md:rounded-none md:shadow-none bg-white md:bg-transparent">
          <div className="flex-1 cursor-pointer">
            <Popover
              open={isTravelersPopoverOpen}
              onOpenChange={setIsTravelersPopoverOpen}
            >
              <PopoverTrigger
                asChild
                className="w-full px-4 py-3 md:px-6 md:py-3"
              >
                <div className="w-full h-full text-left">
                  <label className="block text-left text-xs text-black font-semibold cursor-pointer">
                    Travelling with?
                  </label>
                  <input
                    type="text"
                    placeholder="Select travellers"
                    className="w-full text-sm outline-none text-gray-700 cursor-pointer"
                    readOnly
                    value={formatTravelers()}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="mt-1 p-0 w-[--radix-popover-trigger-width] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto"
                align="start"
              >
                <div className=" bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                  {/* Adults */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm font-semibold text-black">Adults</p>
                      <p className="text-xs text-gray-500">Ages 13 or above</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50"
                        onClick={() => handleChange("adults", "decrement")}
                        disabled={travelers.adults <= 1}
                        aria-label="Decrease adults"
                      >
                        -
                      </button>
                      <span className="text-sm text-black">
                        {travelers.adults}
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50"
                        onClick={() => handleChange("adults", "increment")}
                        disabled={travelers.adults >= 9}
                        aria-label="Increase adults"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm font-semibold text-black">
                        Children
                      </p>
                      <p className="text-xs text-gray-500">Ages 2–12</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50"
                        onClick={() => handleChange("children", "decrement")}
                        disabled={travelers.children <= 0}
                        aria-label="Decrease children"
                      >
                        -
                      </button>
                      <span className="text-sm text-black">
                        {travelers.children}
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50"
                        onClick={() => handleChange("children", "increment")}
                        disabled={travelers.children >= 9}
                        aria-label="Increase children"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-black">
                        Infants
                      </p>
                      <p className="text-xs text-gray-500">Under 2</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50"
                        onClick={() => handleChange("infants", "decrement")}
                        disabled={travelers.infants <= 0}
                        aria-label="Decrease infants"
                      >
                        -
                      </button>
                      <span className="text-sm text-black">
                        {travelers.infants}
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50"
                        onClick={() => handleChange("infants", "increment")}
                        disabled={travelers.infants >= 9}
                        aria-label="Increase infants"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {/* Mobile: Use inline dropdown that pushes content */}
        <div className="block md:hidden" ref={travelersMobileRef}>
          <div
            className="cursor-pointer border-2 border-gray-300 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-white px-4 py-3 hover:border-blue-300"
            onClick={() => setIsTravelersMobileOpen(!isTravelersMobileOpen)}
          >
            <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1">
              Travelling with?
            </label>
            <input
              type="text"
              placeholder="Select travellers"
              className="w-full text-sm outline-none text-gray-800 cursor-pointer placeholder-gray-400"
              readOnly
              value={formatTravelers()}
            />
          </div>
          {/* Mobile dropdown that pushes content down */}
          {isTravelersMobileOpen && (
            <div className="w-full bg-white border-2 border-gray-300 rounded-xl shadow-lg mt-2 transition-all duration-400 ease-in-out transform animate-in slide-in-from-top-1 fade-in-0 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-1 data-[state=closed]:fade-out-0">
              <div className="p-4">
                {/* Adults */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm font-semibold text-black">Adults</p>
                    <p className="text-xs text-gray-500">Ages 13 or above</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50"
                      onClick={() => handleChange("adults", "decrement")}
                      disabled={travelers.adults <= 1}
                      aria-label="Decrease adults"
                    >
                      -
                    </button>
                    <span className="text-sm text-black">
                      {travelers.adults}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50"
                      onClick={() => handleChange("adults", "increment")}
                      disabled={travelers.adults >= 9}
                      aria-label="Increase adults"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm font-semibold text-black">Children</p>
                    <p className="text-xs text-gray-500">Ages 2–12</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50"
                      onClick={() => handleChange("children", "decrement")}
                      disabled={travelers.children <= 0}
                      aria-label="Decrease children"
                    >
                      -
                    </button>
                    <span className="text-sm text-black">
                      {travelers.children}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50"
                      onClick={() => handleChange("children", "increment")}
                      disabled={travelers.children >= 9}
                      aria-label="Increase children"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-black">Infants</p>
                    <p className="text-xs text-gray-500">Under 2</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50"
                      onClick={() => handleChange("infants", "decrement")}
                      disabled={travelers.infants <= 0}
                      aria-label="Decrease infants"
                    >
                      -
                    </button>
                    <span className="text-sm text-black">
                      {travelers.infants}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50"
                      onClick={() => handleChange("infants", "increment")}
                      disabled={travelers.infants >= 9}
                      aria-label="Increase infants"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Desktop: Original button */}
        <div className="hidden md:flex items-center justify-end w-auto">
          <button
            className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-colors"
            onClick={handleSearch}
          >
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
          </button>
        </div>
      </div>
      {/* Mobile: Fixed bottom search button */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-6 py-4 z-50">
        <button
          className="w-full bg-blue-500 text-white py-4 rounded-full hover:bg-blue-600 transition-colors text-sm font-medium"
          onClick={handleSearch}
        >
          Search Flights
        </button>
      </div>
    </div>
  );
}

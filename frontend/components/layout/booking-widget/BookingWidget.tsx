"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import RadioButton from "@/components/ui/buttons/RadioButton";
import TravelerDropdown from "./TravelerDropDown";
import { Travelers } from "./TravelerDropDown";
import {
  fetchDepartureDestinations,
  fetchArrivalDestinations,
  DepartureAirport,
  ArrivalAirport,
} from "@/graphql/BookingWidgetQuery";

import { Calendar } from "@/components/ui/calendar";
import DateRangePicker from "./DateRangePicker";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function BookingWidget() {
  //Initialize default values for travelers.
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 1,
    children: 0,
    infants: 0,
  });

  //Oneway or return
  // TODO: Hook up with datepicker component to show return date field depend on oneway/return
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
  const [isLoading, setIsLoading] = useState<boolean>(true); // State to control the airport popovers
  const [isArrivalPopoverOpen, setIsArrivalPopoverOpen] =
    useState<boolean>(false);
  const [isDeparturePopoverOpen, setIsDeparturePopoverOpen] =
    useState<boolean>(false);
  // State to control the travelers popover
  const [isTravelersPopoverOpen, setIsTravelersPopoverOpen] =
    useState<boolean>(false);
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

  return (
    <div className="relative flex flex-col items-center h-1/2 text-white animate__animated animate__fadeInUp">
      <div className="w-[70.5rem] bg-white rounded-[2rem] shadow-lg">
        <div className="flex border-b">
          <div className="flex border-b-2 border-b-blue-500 px-4 py-3 h-12 w-[11rem]">
            <button className="text-blue-500 text-sm font-semibold w-[11rem] text-center">
              Book a Trip
            </button>
          </div>
          <div className="flex px-4 py-3 h-12 w-[11rem]">
            <button className="text-gray-500 font-semibold text-sm hover:text-gray-700 w-[11rem] text-center">
              Manage Booking
            </button>
          </div>
        </div>

        <div className="px-4 py-3 flex flex-col items-center space-y-4">
          <RadioButton
            optionOne="Round Trip"
            optionTwo="One Way"
            onOptionChange={(value: string) => setIsOneWay(value === "One Way")}
          />
          {/* search form */}
          <div className="flex w-full items-center border border-gray-200 rounded-full px-2 shadow-md">
            {" "}
            <div className="flex-1 cursor-pointer">
              <Popover
                open={isDeparturePopoverOpen}
                onOpenChange={setIsDeparturePopoverOpen}
              >
                <PopoverTrigger asChild className="w-full px-6 py-3">
                  <div className="w-full h-full text-left">
                    <label className="block text-xs text-black font-semibold cursor-pointer">
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
                </PopoverTrigger>{" "}
                <PopoverContent
                  className="mt-1 p-0 w-[--radix-popover-trigger-width] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto"
                  style={{
                    maxHeight: departureAirports.length > 3 ? "12rem" : "auto",
                  }}
                  align="start"
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
                    <div className="text-gray-500 p-3">
                      No destinations found
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-[1px] h-10 bg-gray-200"></div>
            <div className="flex-1 cursor-pointer">
              <Popover
                open={isArrivalPopoverOpen}
                onOpenChange={setIsArrivalPopoverOpen}
              >
                <PopoverTrigger asChild className="w-full px-6 py-3">
                  <div className="w-full h-full text-left">
                    <label className="block text-xs text-black font-semibold cursor-pointer">
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
                </PopoverTrigger>{" "}
                <PopoverContent
                  className="mt-1 p-0 w-[--radix-popover-trigger-width] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto"
                  style={{
                    maxHeight: arrivalAirports.length > 3 ? "12rem" : "auto",
                  }}
                  align="start"
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
                    <div className="text-gray-500 p-3">
                      No destinations found
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-[1px] h-10 bg-gray-200"></div>{" "}
            <div className="flex-1 px-6 py-3">
              <Popover
                open={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
              >
                <div className="flex gap-4">
                  <div className="flex-1 cursor-pointer">
                    <PopoverTrigger asChild>
                      <div className="w-full">
                        <label className="block text-xs text-black font-semibold cursor-pointer">
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

                  <div className="w-[1px] h-10 bg-gray-200"></div>
                  <div className="flex-1 cursor-pointer">
                    <PopoverTrigger>
                      <div
                        className={
                          isOneWay ? "opacity-50 pointer-events-none" : ""
                        }
                      >
                        <label className="block text-xs text-black font-semibold cursor-pointer">
                          Return
                        </label>
                        <input
                          type="text"
                          placeholder={
                            isOneWay ? "One way flight" : "Pick a date"
                          }
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
            <div className="w-[1px] h-10 bg-gray-200"></div>
            <div className="flex-1 flex">
              {/* <TravelerDropdown onChange={setTravelers} /> */}
              {/** 
              <div className="px-6 py-3">
                <label className="block text-xs text-black font-semibold">
                  Travelling with?
                </label>
                <input
                  type="text"
                  placeholder="1 Adult, 1 Child, 1 Infant"
                  className="w-full text-sm outline-none text-black"
                />
              </div>
              */}{" "}
              <div className="flex-1 cursor-pointer">
                <Popover
                  open={isTravelersPopoverOpen}
                  onOpenChange={setIsTravelersPopoverOpen}
                >
                  <PopoverTrigger asChild className="w-full px-6 py-3">
                    <div className="w-full h-full text-left">
                      <label className="block text-xs text-black font-semibold cursor-pointer">
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
                  </PopoverTrigger>{" "}
                  <PopoverContent
                    className="mt-1 p-0 w-[--radix-popover-trigger-width] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto"
                    align="start"
                  >
                    <div className=" bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                      {/* Adults */}
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-sm font-semibold text-black">
                            Adults
                          </p>
                          <p className="text-xs text-gray-500">
                            Ages 13 or above
                          </p>
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
                            onClick={() =>
                              handleChange("children", "decrement")
                            }
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
                            onClick={() =>
                              handleChange("children", "increment")
                            }
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
              {/* <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-colors"
                  onClick={() => {
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
                      // Implement search functionality or navigation here
                    } else {
                      alert(
                        "Please select both departure and arrival airports"
                      );
                    }
                  }}
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
              </div> */}{" "}
            </div>
            <div className="flex items-center justify-end">
              <button
                className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-colors"
                onClick={() => {
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
                    // Implement search functionality or navigation here
                  } else {
                    alert("Please select both departure and arrival airports");
                  }
                }}
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
        </div>
      </div>
    </div>
  );
}

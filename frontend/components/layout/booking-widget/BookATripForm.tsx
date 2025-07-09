"use client";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import RadioButton from "@/components/ui/buttons/RadioButton";
import { Travelers } from "./TravelerDropDown";
import { DateRangePicker } from "@/components/ui/date-picker";
import {
  fetchDepartureDestinations,
  fetchArrivalDestinations,
  DepartureAirport,
  ArrivalAirport,
} from "@/graphql/BookingWidgetQuery";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BookATripFormProps {
  onModalStateChange?: (isActive: boolean) => void;
  preselectedDeparture?: {
    departureAirport: string;
    departureAirportCode: string;
  };
  preselectedArrival?: {
    arrivalAirport: string;
    arrivalAirportCode: string;
  };
}

export default function BookATripForm({
  onModalStateChange,
  preselectedDeparture,
  preselectedArrival,
}: BookATripFormProps) {
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

  // Desktop modal state
  const [isDesktopModalActive, setIsDesktopModalActive] =
    useState<boolean>(false);

  // State to control the airport popovers
  const [isArrivalPopoverOpen, setIsArrivalPopoverOpen] =
    useState<boolean>(false);
  const [isDeparturePopoverOpen, setIsDeparturePopoverOpen] =
    useState<boolean>(false); // State to control the travelers popover
  const [isTravelersPopoverOpen, setIsTravelersPopoverOpen] =
    useState<boolean>(false);
  const [isTravelersMobileOpen, setIsTravelersMobileOpen] =
    useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false); // Ref for travelers mobile dropdown to handle outside clicks and refs for form inputs
  const travelersMobileRef = useRef<HTMLDivElement>(null);
  const travelersInputRef = useRef<HTMLDivElement>(null);

  // Refs for form inputs to handle scrolling
  const departureInputRef = useRef<HTMLDivElement>(null);
  const arrivalInputRef = useRef<HTMLDivElement>(null); // Function to scroll input into better view when dropdown opens
  const scrollInputIntoView = (
    inputRef: React.RefObject<HTMLDivElement | null>
  ) => {
    if (inputRef.current && window.innerWidth < 768) {
      // Only on mobile
      const element = inputRef.current;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;

      // Check if dropdown would extend below viewport or if input is in bottom half
      const dropdownHeight = 200; // Estimated dropdown height
      const spaceBelow = viewport - rect.bottom;
      const isInBottomHalf = rect.top > viewport / 2;

      if (spaceBelow < dropdownHeight || isInBottomHalf) {
        // Use scrollIntoView with block: 'start' to position element at top of viewport
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }
  };

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

  // Handle preselected airports when data is loaded
  useEffect(() => {
    if (departureAirports.length > 0 && preselectedDeparture) {
      const preselectedDepartureAirport = departureAirports.find(
        (airport) =>
          airport.departureAirportCode ===
          preselectedDeparture.departureAirportCode
      );
      if (preselectedDepartureAirport) {
        setSelectedDeparture(preselectedDepartureAirport);
      }
    }

    if (arrivalAirports.length > 0 && preselectedArrival) {
      const preselectedArrivalAirport = arrivalAirports.find(
        (airport) =>
          airport.arrivalAirportCode === preselectedArrival.arrivalAirportCode
      );
      if (preselectedArrivalAirport) {
        setSelectedArrival(preselectedArrivalAirport);
      }
    }
  }, [
    departureAirports,
    arrivalAirports,
    preselectedDeparture,
    preselectedArrival,
  ]);

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
  // Function to handle desktop modal activation
  const handleDesktopInputClick = () => {
    if (window.innerWidth >= 768) {
      // Only on desktop
      // Close all open dropdowns before activating modal
      setIsDeparturePopoverOpen(false);
      setIsArrivalPopoverOpen(false);
      setIsTravelersPopoverOpen(false);

      setIsDesktopModalActive(true);
      onModalStateChange?.(true);
      // Scroll to top when modal is activated
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  // Function to close desktop modal
  const closeDesktopModal = () => {
    // Close all open dropdowns when closing modal
    setIsDeparturePopoverOpen(false);
    setIsArrivalPopoverOpen(false);
    setIsTravelersPopoverOpen(false);

    setIsDesktopModalActive(false);
    onModalStateChange?.(false);
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
    if (selectedDeparture && selectedArrival && dateRange.from) {
      setIsSearching(true);

      // Simulate search delay
      setTimeout(() => {
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
        setIsSearching(false);
      }, 2000);
    } else {
      if (!selectedDeparture || !selectedArrival) {
        alert("Please select both departure and arrival airports");
      } else if (!dateRange.from) {
        alert("Please select travel dates");
      }
    }
  };

  // Check if search form is valid
  const isSearchFormValid =
    selectedDeparture && selectedArrival && dateRange.from;
  return (
    <>
      {/* Desktop Overlay */}
      {isDesktopModalActive && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-85 z-[60] transition-opacity duration-300 ease-in-out hidden md:block" />
      )}
      <div
        className={`px-4 py-2 md:py-3 flex flex-col min-h-[calc(100vh-12rem)] md:min-h-0 transition-all duration-500 ease-in-out ${
          isDesktopModalActive ? "md:-mt-[18rem] md:relative md:z-[70]" : ""
        }`}
      >
        {/* Desktop Close Button */}
        {isDesktopModalActive && (
          <button
            onClick={closeDesktopModal}
            className="hidden md:flex absolute right-4 top-4 w-8 h-8 bg-white rounded-full shadow-lg items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200 z-[80]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <div className="flex-1 flex flex-col items-center space-y-3 md:space-y-4">
          <div className="relative mt-2 md:mt-0">
            <RadioButton
              optionOne="Round Trip"
              optionTwo="One Way"
              onOptionChange={(option) => {
                const isNowOneWay = option === "two"; // "two" corresponds to "One Way"
                setIsOneWay(isNowOneWay);
                // Clear return date when switching to one way
                if (isNowOneWay) {
                  setDateRange((prev) => ({ ...prev, to: undefined }));
                }
              }}
            />
          </div>
          {/* search form */}
          <div className="flex flex-col bg-white md:flex-row w-full md:items-center md:border md:border-gray-200 md:rounded-full md:px-2 md:shadow-md space-y-4 md:space-y-0 py-2 md:py-0 pb-2 md:pb-0">
            <div className="w-full md:flex-1">
              {/* Desktop: Use Popover */}
              <div className="hidden md:block">
                <Popover
                  open={isDeparturePopoverOpen}
                  onOpenChange={(open) => {
                    if (open && !isDesktopModalActive) {
                      // Only trigger modal if we're not already in modal state
                      handleDesktopInputClick();
                    }
                    setIsDeparturePopoverOpen(open);
                  }}
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
                    className="mt-1 p-0 w-[--radix-popover-trigger-width] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto z-[75]"
                    style={{
                      maxHeight:
                        departureAirports.length > 3 ? "12rem" : "auto",
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
                      <div className="text-gray-500 p-3">
                        No destinations found
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
              {/* Mobile: Use inline dropdown that pushes content */}
              <div className="block md:hidden" ref={departureInputRef}>
                <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1 ml-1">
                  Flying from?
                </label>
                <div
                  className="cursor-pointer border-2 border-gray-400 md:border-gray-300 rounded-3xl transition-all duration-300 ease-in-out bg-white px-4 py-3 sm:px-4 sm:py-4 hover:border-blue-300 active:border-blue-500 min-h-[50px] flex items-center relative shadow-sm md:shadow-none"
                  onClick={() => {
                    const newState = !isDeparturePopoverOpen;
                    setIsDeparturePopoverOpen(newState);
                    if (newState) {
                      // Close other dropdowns
                      setIsArrivalPopoverOpen(false);
                      setIsTravelersMobileOpen(false);
                      // Add haptic feedback for iOS
                      if (navigator.vibrate) {
                        navigator.vibrate(10);
                      }
                    }
                  }}
                >
                  {/* Add loading indicator */}
                  {isLoading && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder={
                      isLoading ? "Loading..." : "Select destination"
                    }
                    className={`w-full text-sm outline-none text-gray-800 cursor-pointer placeholder-gray-400 ${
                      isLoading ? "pl-8" : ""
                    }`}
                    readOnly
                    value={
                      selectedDeparture
                        ? `${selectedDeparture.departureAirport} (${selectedDeparture.departureAirportCode})`
                        : ""
                    }
                  />
                  {/* Add selected indicator */}
                  {selectedDeparture && (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <svg
                        className="w-3 h-3 text-white"
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
                  {/* Add chevron indicator */}
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isDeparturePopoverOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Mobile bottom overlay */}
                {isDeparturePopoverOpen && (
                  <>
                    {/* Backdrop with blur effect */}
                    <div
                      className="fixed inset-0 backdrop-blur-[2px] bg-black bg-opacity-25 z-[90] animate-in fade-in-0 duration-700 ease-out"
                      style={{
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: "100vw",
                        height: "100vh",
                        margin: 0,
                        padding: 0,
                      }}
                      onClick={() => setIsDeparturePopoverOpen(false)}
                    />
                    {/* Bottom sheet */}
                    <div
                      className="fixed inset-x-0 bottom-0 z-[100] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out flex flex-col"
                      style={{ height: "80vh", maxHeight: "600px" }}
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="departure-modal-title"
                    >
                      {/* Handle bar */}
                      <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                      </div>
                      {/* Sticky Header */}
                      <div className="sticky top-0 z-10 bg-white px-6 pt-0 pb-4">
                        <h3
                          id="departure-modal-title"
                          className="text-lg font-semibold text-gray-900"
                        >
                          Flying from?
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Select your departure destination
                        </p>
                        {/* Search bar for large lists */}
                        {departureAirports.length > 5 && (
                          <div className="mt-3 relative">
                            <input
                              type="text"
                              placeholder="Search destinations..."
                              className="w-full px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg
                              className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </div>
                        )}
                        {/* Horizontal line after header text */}
                        <div className="w-full h-px bg-gray-200 mt-4"></div>
                      </div>
                      {/* Content */}
                      <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                          <div className="flex items-center justify-center h-32">
                            <div className="text-gray-500">
                              Loading destinations...
                            </div>
                          </div>
                        ) : departureAirports.length > 0 ? (
                          <div className="divide-y divide-gray-100">
                            {departureAirports.map((airport, index) => (
                              <div
                                key={index}
                                className="px-6 py-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors duration-150"
                                onClick={() => {
                                  setSelectedDeparture(airport);
                                  setIsDeparturePopoverOpen(false);
                                }}
                              >
                                <div className="text-gray-900 font-medium">
                                  {airport.departureAirport}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {airport.departureAirportCode}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-32">
                            <div className="text-gray-500">
                              No destinations found
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>
            <div className="w-full md:flex-1">
              {/* Desktop: Use Popover */}
              <div className="hidden md:block">
                <Popover
                  open={isArrivalPopoverOpen}
                  onOpenChange={(open) => {
                    if (open && !isDesktopModalActive) {
                      // Only trigger modal if we're not already in modal state
                      handleDesktopInputClick();
                    }
                    setIsArrivalPopoverOpen(open);
                  }}
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
                    className="mt-1 p-0 w-[--radix-popover-trigger-width] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto z-[75]"
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
                      <div className="text-gray-500 p-3">
                        No destinations found
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
              {/* Mobile: Use inline dropdown that pushes content */}
              <div className="block md:hidden" ref={arrivalInputRef}>
                <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1 ml-1">
                  Flying to?
                </label>
                <div
                  className="cursor-pointer border-2 border-gray-400 md:border-gray-300 rounded-3xl transition-all duration-300 ease-in-out bg-white px-4 py-3 sm:px-4 sm:py-4 hover:border-blue-300 active:border-blue-500 min-h-[50px] flex items-center relative shadow-sm md:shadow-none"
                  onClick={() => {
                    const newState = !isArrivalPopoverOpen;
                    setIsArrivalPopoverOpen(newState);
                    if (newState) {
                      // Close other dropdowns
                      setIsDeparturePopoverOpen(false);
                      setIsTravelersMobileOpen(false);
                      // Add haptic feedback for iOS
                      if (navigator.vibrate) {
                        navigator.vibrate(10);
                      }
                    }
                  }}
                >
                  {/* Add loading indicator */}
                  {isLoading && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder={
                      isLoading ? "Loading..." : "Select destination"
                    }
                    className={`w-full text-sm outline-none text-gray-800 cursor-pointer placeholder-gray-400 ${
                      isLoading ? "pl-8" : ""
                    }`}
                    readOnly
                    value={
                      selectedArrival
                        ? `${selectedArrival.arrivalAirport} (${selectedArrival.arrivalAirportCode})`
                        : ""
                    }
                  />
                  {/* Add selected indicator */}
                  {selectedArrival && (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <svg
                        className="w-3 h-3 text-white"
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
                  {/* Add chevron indicator */}
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isArrivalPopoverOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Mobile bottom overlay */}
                {isArrivalPopoverOpen && (
                  <>
                    {/* Backdrop with blur effect */}
                    <div
                      className="fixed inset-0 backdrop-blur-[2px] bg-black bg-opacity-25 z-[90] animate-in fade-in-0 duration-700 ease-out"
                      style={{
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: "100vw",
                        height: "100vh",
                        margin: 0,
                        padding: 0,
                      }}
                      onClick={() => setIsArrivalPopoverOpen(false)}
                    />

                    {/* Bottom sheet */}
                    <div
                      className="fixed inset-x-0 bottom-0 z-[100] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out flex flex-col"
                      style={{ height: "80vh", maxHeight: "600px" }}
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="arrival-modal-title"
                    >
                      {/* Handle bar */}
                      <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                      </div>

                      {/* Sticky Header */}
                      <div className="sticky top-0 z-10 bg-white px-6 pt-0 pb-4">
                        <h3
                          id="arrival-modal-title"
                          className="text-lg font-semibold text-gray-900"
                        >
                          Flying to?
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Select your arrival destination
                        </p>
                        {/* Search bar for large lists */}
                        {arrivalAirports.length > 5 && (
                          <div className="mt-3 relative">
                            <input
                              type="text"
                              placeholder="Search destinations..."
                              className="w-full px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg
                              className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </div>
                        )}
                        {/* Horizontal line after header text */}
                        <div className="w-full h-px bg-gray-200 mt-4"></div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                          <div className="flex items-center justify-center h-32">
                            <div className="text-gray-500">
                              Loading destinations...
                            </div>
                          </div>
                        ) : arrivalAirports.length > 0 ? (
                          <div className="divide-y divide-gray-100">
                            {arrivalAirports.map((airport, index) => (
                              <div
                                key={index}
                                className="px-6 py-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors duration-150"
                                onClick={() => {
                                  setSelectedArrival(airport);
                                  setIsArrivalPopoverOpen(false);
                                }}
                              >
                                <div className="text-gray-900 font-medium">
                                  {airport.arrivalAirport}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {airport.arrivalAirportCode}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-32">
                            <div className="text-gray-500">
                              No destinations found
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>
            {/* Desktop: Combined date picker */}
            <div className="hidden md:flex w-full md:flex-1">
              <DateRangePicker
                dateRange={dateRange}
                onSelect={(range) =>
                  setDateRange(range || { from: undefined, to: undefined })
                }
                placeholder={isOneWay ? "Travel Date" : "Travel Dates"}
                variant="desktop"
                mode={isOneWay ? "single" : "range"}
                onClick={handleDesktopInputClick}
                sideOffset={8}
              />
            </div>
            {/* Mobile: Combined date picker */}
            <div className="block md:hidden w-full">
              <DateRangePicker
                dateRange={dateRange}
                onSelect={(range) =>
                  setDateRange(range || { from: undefined, to: undefined })
                }
                placeholder={isOneWay ? "Travel Date" : "Travel Dates"}
                variant="mobile"
                mode={isOneWay ? "single" : "range"}
              />
            </div>
            <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>
            {/* Desktop: Use Popover */}
            <div className="hidden md:flex w-full md:flex-1 flex border border-gray-200 rounded-3xl shadow-md md:border-0 md:rounded-none md:shadow-none bg-white md:bg-transparent">
              <div className="flex-1 cursor-pointer">
                <Popover
                  open={isTravelersPopoverOpen}
                  onOpenChange={(open) => {
                    if (open && !isDesktopModalActive) {
                      // Only trigger modal if we're not already in modal state
                      handleDesktopInputClick();
                    }
                    setIsTravelersPopoverOpen(open);
                  }}
                >
                  <PopoverTrigger
                    asChild
                    className="w-full px-4 py-3 md:px-6 md:py-3"
                  >
                    <div className="w-full h-full text-left cursor-pointer">
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
                    className="mt-1 p-0 w-[--radix-popover-trigger-width] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto z-[75]"
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
                          <span className="text-sm text-black font-medium">
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
                          <span className="text-sm text-black font-medium">
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
                          <span className="text-sm text-black font-medium">
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
              <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1 ml-1">
                Travelling with?
              </label>
              <div
                className="cursor-pointer border-2 border-gray-400 md:border-gray-300 rounded-3xl transition-all duration-300 ease-in-out bg-white px-4 py-3 sm:px-4 sm:py-4 hover:border-blue-300 active:border-blue-500 min-h-[50px] flex items-center relative shadow-sm md:shadow-none"
                onClick={() => {
                  const newState = !isTravelersMobileOpen;
                  setIsTravelersMobileOpen(newState);
                  if (newState) {
                    // Close other dropdowns
                    setIsDeparturePopoverOpen(false);
                    setIsArrivalPopoverOpen(false);
                    // Add haptic feedback for iOS
                    if (navigator.vibrate) {
                      navigator.vibrate(10);
                    }
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Select travellers"
                  className="w-full text-sm outline-none text-gray-800 cursor-pointer placeholder-gray-400"
                  readOnly
                  value={formatTravelers()}
                />
                {/* Add traveler count indicator */}
                {travelers.adults + travelers.children + travelers.infants >
                  1 && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs text-white font-medium">
                      {travelers.adults +
                        travelers.children +
                        travelers.infants}
                    </span>
                  </div>
                )}
                {/* Add chevron indicator */}
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isTravelersMobileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Mobile bottom overlay */}
              {isTravelersMobileOpen && (
                <>
                  {/* Backdrop with blur effect */}
                  <div
                    className="fixed inset-0 backdrop-blur-[2px] bg-black bg-opacity-25 z-[90] animate-in fade-in-0 duration-700 ease-out"
                    style={{
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: "100vw",
                      height: "100vh",
                      margin: 0,
                      padding: 0,
                    }}
                    onClick={() => setIsTravelersMobileOpen(false)}
                  />

                  {/* Bottom sheet */}
                  <div
                    className="fixed inset-x-0 bottom-0 z-[100] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out flex flex-col"
                    style={{ height: "80vh", maxHeight: "600px" }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="travelers-modal-title"
                  >
                    {/* Handle bar */}
                    <div className="flex justify-center pt-3 pb-2">
                      <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                    {/* Sticky Header */}
                    <div className="sticky top-0 z-10 bg-white px-6 pt-0 pb-4">
                      <h3
                        id="travelers-modal-title"
                        className="text-lg font-semibold text-gray-900"
                      >
                        Travelling with?
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Select number of travelers
                      </p>
                      {/* Total count display */}
                      <div className="mt-2 px-3 py-1 bg-blue-50 rounded-full inline-block">
                        <span className="text-sm text-blue-700 font-medium">
                          Total:{" "}
                          {travelers.adults +
                            travelers.children +
                            travelers.infants}{" "}
                          passenger
                          {travelers.adults +
                            travelers.children +
                            travelers.infants !==
                          1
                            ? "s"
                            : ""}
                        </span>
                      </div>
                      {/* Horizontal line after header text */}
                      <div className="w-full h-px bg-gray-200 mt-4"></div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-2">
                      {/* Adults */}
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-base font-semibold text-black">
                            Adults
                          </p>
                          <p className="text-sm text-gray-500">
                            Ages 13 or above
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            onClick={() => handleChange("adults", "decrement")}
                            disabled={travelers.adults <= 1}
                            aria-label="Decrease adults"
                          >
                            -
                          </button>
                          <span className="text-lg text-black font-medium min-w-[2rem] text-center">
                            {travelers.adults}
                          </span>
                          <button
                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            onClick={() => handleChange("adults", "increment")}
                            disabled={travelers.adults >= 9}
                            aria-label="Increase adults"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-base font-semibold text-black">
                            Children
                          </p>
                          <p className="text-sm text-gray-500">Ages 2–12</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            onClick={() =>
                              handleChange("children", "decrement")
                            }
                            disabled={travelers.children <= 0}
                            aria-label="Decrease children"
                          >
                            -
                          </button>
                          <span className="text-lg text-black font-medium min-w-[2rem] text-center">
                            {travelers.children}
                          </span>
                          <button
                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50 hover:bg-gray-50 transition-colors"
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
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-base font-semibold text-black">
                            Infants
                          </p>
                          <p className="text-sm text-gray-500">Under 2</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            onClick={() => handleChange("infants", "decrement")}
                            disabled={travelers.infants <= 0}
                            aria-label="Decrease infants"
                          >
                            -
                          </button>
                          <span className="text-lg text-black font-medium min-w-[2rem] text-center">
                            {travelers.infants}
                          </span>
                          <button
                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-black disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            onClick={() => handleChange("infants", "increment")}
                            disabled={travelers.infants >= 9}
                            aria-label="Increase infants"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Continue button */}
                    <div className="px-6 py-4 border-t border-gray-200">
                      <button
                        onClick={() => setIsTravelersMobileOpen(false)}
                        className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Desktop: Original button */}
            <div className="hidden md:flex items-center justify-end w-auto">
              <button
                className={`p-4 rounded-full transition-colors flex items-center gap-2 disabled:cursor-not-allowed ${
                  isSearchFormValid && !isSearching
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500"
                }`}
                onClick={handleSearch}
                disabled={!isSearchFormValid || isSearching}
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
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
                )}
                <span className="text-sm font-medium">
                  {isSearching ? "Searching..." : "Search"}
                </span>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile: Search button always under form */}
        <div className="md:hidden pt-4 bg-white px-0 py-3">
          <button
            className={`w-full py-3 rounded-full transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 shadow-lg ${
              isSearchFormValid && !isSearching
                ? "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 cursor-pointer"
                : ""
            } disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-100 disabled:text-white`}
            onClick={
              isSearchFormValid && !isSearching ? handleSearch : undefined
            }
            disabled={!isSearchFormValid || isSearching}
          >
            {isSearching && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>
              {isSearching
                ? "Searching Flights..."
                : !isSearchFormValid
                ? "Complete form to search"
                : "Search Flights"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

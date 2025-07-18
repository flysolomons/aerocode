"use client";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import RadioButton from "@/components/ui/buttons/RadioButton";
import { Travelers } from "./TravelerDropDown";
import { DateRangePicker } from "@/components/ui/date-picker";
import {
  fetchDepartureDestinations,
  fetchArrivalDestinations,
  fetchArrivalDestinationsForOrigin,
  fetchOriginsForArrivalDestination,
  DepartureAirport,
  ArrivalAirport,
} from "@/graphql/BookingWidgetQuery";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCurrency } from "@/contexts/CurrencyContext";

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
  const { selectedCurrency } = useCurrency();

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
  const [isLoadingArrivals, setIsLoadingArrivals] = useState<boolean>(false);

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
  const arrivalInputRef = useRef<HTMLDivElement>(null);

  // Refs for swipe gesture handling
  const departureOverlayRef = useRef<HTMLDivElement>(null);
  const arrivalOverlayRef = useRef<HTMLDivElement>(null);
  const travelersOverlayRef = useRef<HTMLDivElement>(null);

  // Touch gesture state
  const [touchStart, setTouchStart] = useState<{
    y: number;
    time: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0); // Function to scroll input into better view when dropdown opens
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

  // When selectedDeparture changes, fetch arrival airports for that origin
  useEffect(() => {
    if (selectedDeparture) {
      setIsLoadingArrivals(true);
      fetchArrivalDestinationsForOrigin(
        selectedDeparture.departureAirport
      ).then((arrivals) => {
        setArrivalAirports(arrivals);
        // Only clear selectedArrival if arrivals are not empty and current selection is not valid
        if (arrivals.length > 0) {
          if (
            selectedArrival &&
            !arrivals.some(
              (a) => a.arrivalAirport === selectedArrival.arrivalAirport
            )
          ) {
            setSelectedArrival(null);
          }
        }
        // If arrivals is empty, keep previous selection and show message in UI
        setIsLoadingArrivals(false);
      });
    }
  }, [selectedDeparture]);

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

  // Ensure popover states are closed on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsDeparturePopoverOpen(false);
        setIsArrivalPopoverOpen(false);
        setIsTravelersPopoverOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    // Call once on mount to ensure correct state
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Touch gesture handlers for swipe-down dismissal
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only handle touch events from the header area, not from interactive buttons
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest('[role="button"]') ||
      target.closest("div[onClick]")
    ) {
      return;
    }

    const touch = e.touches[0];
    setTouchStart({
      y: touch.clientY,
      time: Date.now(),
    });
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !isDragging) return;

    // Only handle touch events from the header area, not from interactive buttons
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest('[role="button"]') ||
      target.closest("div[onClick]")
    ) {
      return;
    }

    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStart.y;

    // Only allow downward swipes
    if (deltaY > 0) {
      // Prevent default scrolling behavior when dragging
      e.preventDefault();
      setDragOffset(deltaY);
      // Add some resistance - the further you drag, the more resistance
      const resistance = Math.max(0.3, 1 - deltaY / 300);
      setDragOffset(deltaY * resistance);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !isDragging) return;

    // Only handle touch events from the header area, not from interactive buttons
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest('[role="button"]') ||
      target.closest("div[onClick]")
    ) {
      return;
    }

    const touch = e.changedTouches[0];
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;
    const velocity = Math.abs(deltaY) / deltaTime;

    // Dismiss if:
    // 1. Dragged down more than 100px, OR
    // 2. Fast swipe (velocity > 0.5) with at least 50px drag
    const shouldDismiss = deltaY > 100 || (velocity > 0.5 && deltaY > 50);

    if (shouldDismiss) {
      // Dismiss the appropriate overlay
      if (isDeparturePopoverOpen) {
        setIsDeparturePopoverOpen(false);
      } else if (isArrivalPopoverOpen) {
        setIsArrivalPopoverOpen(false);
      } else if (isTravelersMobileOpen) {
        setIsTravelersMobileOpen(false);
      }
    }

    // Reset touch state
    setTouchStart(null);
    setIsDragging(false);
    setDragOffset(0);
  };

  // Prevent default touch behavior on overlays to avoid conflicts
  const handleTouchCancel = () => {
    setTouchStart(null);
    setIsDragging(false);
    setDragOffset(0);
  };

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
    if (selectedDeparture && selectedArrival && dateRange.from) {
      // Set searching state
      setIsSearching(true);

      // Build the GET URL for Amadeus booking engine with correct structure
      const baseUrl = "https://uat.digital.airline.amadeus.com/ie/booking";
      // Build the search object
      // Helper to format date in Solomon Islands timezone (UTC+11) as ISO 8601 date string
      function formatSolomonDate(date: Date) {
        // Get UTC midnight for the selected date
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        // Create a date at midnight local time
        const localMidnight = new Date(year, month, day, 0, 0, 0);
        // Solomon Islands is UTC+11, so subtract the timezone offset to get the correct date in UTC
        // This ensures the date is interpreted as the selected local date
        const solomonOffset = -11 * 60; // in minutes
        const utcDate = new Date(
          localMidnight.getTime() - solomonOffset * 60000
        );
        return utcDate.toISOString().slice(0, 10);
      }

      const searchObj: any = {
        travelers: [{ passengerTypeCode: "ADT" }],
        commercialFareFamilies: ["CFFSOLO", "CFFSOLOBIS"],
        itineraries: [
          {
            originLocationCode: selectedDeparture.departureAirportCode,
            destinationLocationCode: selectedArrival.arrivalAirportCode,
            departureDateTime: formatSolomonDate(dateRange.from),
          },
        ],
      };
      // Add return itinerary if round trip
      if (dateRange.to && !isOneWay) {
        searchObj.itineraries.push({
          originLocationCode: selectedArrival.arrivalAirportCode,
          destinationLocationCode: selectedDeparture.departureAirportCode,
          departureDateTime: formatSolomonDate(dateRange.to),
        });
      }

      // Build portalFacts
      const portalFacts = JSON.stringify([
        { key: "OfficeID", value: "HIRIE08AA" },
        { key: "countryCode", value: selectedCurrency?.countryCode || "AU" }, // Use selected currency's country code
      ]);

      // Build query string
      const params = new URLSearchParams({
        lang: "en-GB",
        search: encodeURIComponent(JSON.stringify(searchObj)),
        portalFacts,
        trace: "true",
      });

      // Redirect immediately
      window.location.href = `${baseUrl}?${params.toString()}`;
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
        className={`px-4 py-4 md:py-3 flex flex-col h-full md:min-h-0 transition-all duration-500 ease-in-out ${
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
        <div className="flex-1 flex flex-col items-center space-y-3 md:space-y-4 min-h-0">
          <div className="relative mt-2 md:mt-0 w-full md:w-auto px-0 md:px-0">
            <div className="w-full md:w-auto [&>*]:w-full [&>*]:md:w-auto [&_*]:w-full [&_*]:md:w-auto [&_button]:w-full [&_button]:md:w-auto">
              <RadioButton
                optionOne="Round Trip"
                optionTwo="One Way"
                onOptionChange={(option) => {
                  const isNowOneWay = option === "two"; // "two" corresponds to "One Way"
                  setIsOneWay(isNowOneWay);
                  // Clear return date when switching to one way
                  if (isNowOneWay) {
                    setDateRange((prev) => ({ ...prev, to: undefined }));
                  } else {
                    // When switching back to round trip, ensure return date is undefined
                    // so it shows "(Return date?)" placeholder without tick
                    setDateRange((prev) => ({
                      from: prev.from,
                      to: undefined,
                    }));
                  }
                  // Add haptic feedback for mobile
                  if (navigator.vibrate && window.innerWidth < 768) {
                    navigator.vibrate(10);
                  }
                }}
              />
            </div>
          </div>
          {/* search form */}
          <div className="flex-1 flex flex-col w-full space-y-4 md:space-y-0 min-h-0">
            <div className="flex flex-col bg-white md:flex-row w-full md:items-center md:border md:border-gray-200 md:rounded-full md:px-2 md:shadow-md space-y-4 md:space-y-0 py-2 md:py-0 pb-2 md:pb-0">
              <div className="w-full md:flex-1">
                {/* Desktop: Use Popover */}
                <div className="hidden md:block">
                  {" "}
                  <Popover
                    open={isDeparturePopoverOpen && window.innerWidth >= 768}
                    onOpenChange={(open) => {
                      // Only allow opening on desktop
                      if (window.innerWidth < 768) {
                        return;
                      }

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
                          departureAirports.length > 5 ? "20rem" : "auto",
                      }}
                      align="start"
                      side="bottom"
                      avoidCollisions={false}
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
                            <div className="text-xs text-gray-500 mt-1">
                              {airport.departureAirportCode}
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
                  <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1 ml-2">
                    Flying from?
                  </label>
                  <div
                    className="cursor-pointer border border-gray-300 rounded-3xl transition-all duration-300 ease-in-out bg-gradient-to-br from-white to-gray-50 px-4 py-3 sm:px-4 sm:py-4 min-h-[50px] flex items-center relative shadow-md hover:shadow-lg md:shadow-none"
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
                      <div className="flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#2B8A1E"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-circle-check-big-icon lucide-circle-check-big"
                        >
                          <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                          <path d="m9 11 3 3L22 4" />
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
                        className="fixed inset-0 backdrop-blur-[2px] bg-gray-900/20 z-[55] animate-in fade-in-0 duration-700 ease-out md:hidden"
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDeparturePopoverOpen(false);
                        }}
                      />
                      {/* Bottom sheet */}
                      <div
                        ref={departureOverlayRef}
                        className="fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-[24px] shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out flex flex-col md:hidden"
                        style={{
                          height: "75vh",
                          transform:
                            isDragging && isDeparturePopoverOpen
                              ? `translateY(${dragOffset}px)`
                              : "none",
                          transition: isDragging
                            ? "none"
                            : "transform 0.3s ease-out",
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="departure-modal-title"
                      >
                        {/* Handle bar */}
                        <div
                          className="flex justify-center pt-3 pb-2"
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          onTouchCancel={handleTouchCancel}
                        >
                          <div
                            className={`h-1 rounded-full transition-all duration-200 ${
                              isDragging && isDeparturePopoverOpen
                                ? "bg-blue-400 w-16"
                                : "bg-gray-400 w-12"
                            }`}
                          ></div>
                        </div>
                        {/* Header */}
                        <div
                          className="bg-white px-6 py-3"
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          onTouchCancel={handleTouchCancel}
                        >
                          <h3
                            id="departure-modal-title"
                            className="text-lg font-semibold text-gray-900"
                          >
                            Flying from?
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Select your departure destination
                          </p>
                          {/* Horizontal line after header text */}
                          <div className="w-full h-px bg-gray-200 mt-3"></div>
                        </div>
                        {/* Content */}
                        <div
                          className="flex-1 overflow-y-auto pb-4 pt-1"
                          onTouchStart={(e) => e.stopPropagation()}
                          onTouchMove={(e) => e.stopPropagation()}
                          onTouchEnd={(e) => e.stopPropagation()}
                        >
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
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
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
                    open={isArrivalPopoverOpen && window.innerWidth >= 768}
                    onOpenChange={(open) => {
                      // Only allow opening on desktop
                      if (window.innerWidth < 768) {
                        return;
                      }

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
                        maxHeight:
                          arrivalAirports.length > 5 ? "20rem" : "auto",
                      }}
                      align="start"
                      side="bottom"
                      avoidCollisions={false}
                      sideOffset={4}
                    >
                      {isLoadingArrivals ? (
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
                            <div className="text-xs text-gray-500 mt-1">
                              {airport.arrivalAirportCode}
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
                  <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1 ml-2">
                    Flying to?
                  </label>
                  <div
                    className="cursor-pointer border border-gray-300 rounded-3xl transition-all duration-300 ease-in-out bg-gradient-to-br from-white to-gray-50 px-4 py-3 sm:px-4 sm:py-4 min-h-[50px] flex items-center relative shadow-md hover:shadow-lg md:shadow-none"
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
                      <div className="flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#2B8A1E"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-circle-check-big-icon lucide-circle-check-big"
                        >
                          <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                          <path d="m9 11 3 3L22 4" />
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
                        className="fixed inset-0 backdrop-blur-[2px] bg-gray-900/20 z-[55] animate-in fade-in-0 duration-700 ease-out md:hidden"
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsArrivalPopoverOpen(false);
                        }}
                      />

                      {/* Bottom sheet */}
                      <div
                        ref={arrivalOverlayRef}
                        className="fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-[24px] shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out flex flex-col md:hidden"
                        style={{
                          height: "75vh",
                          transform:
                            isDragging && isArrivalPopoverOpen
                              ? `translateY(${dragOffset}px)`
                              : "none",
                          transition: isDragging
                            ? "none"
                            : "transform 0.3s ease-out",
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="arrival-modal-title"
                      >
                        {/* Handle bar */}
                        <div
                          className="flex justify-center pt-3 pb-2"
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          onTouchCancel={handleTouchCancel}
                        >
                          <div
                            className={`h-1 rounded-full transition-all duration-200 ${
                              isDragging && isArrivalPopoverOpen
                                ? "bg-blue-400 w-16"
                                : "bg-gray-400 w-12"
                            }`}
                          ></div>
                        </div>

                        {/* Header */}
                        <div
                          className="bg-white px-6 py-3"
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          onTouchCancel={handleTouchCancel}
                        >
                          <h3
                            id="arrival-modal-title"
                            className="text-lg font-semibold text-gray-900"
                          >
                            Flying to?
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Select your arrival destination
                          </p>
                          {/* Horizontal line after header text */}
                          <div className="w-full h-px bg-gray-200 mt-3"></div>
                        </div>

                        {/* Content */}
                        <div
                          className="flex-1 overflow-y-auto pb-4 pt-1"
                          onTouchStart={(e) => e.stopPropagation()}
                          onTouchMove={(e) => e.stopPropagation()}
                          onTouchEnd={(e) => e.stopPropagation()}
                        >
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
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
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
                    open={isTravelersPopoverOpen && window.innerWidth >= 768}
                    onOpenChange={(open) => {
                      // Only allow opening on desktop
                      if (window.innerWidth < 768) {
                        return;
                      }

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
                              onClick={() =>
                                handleChange("adults", "decrement")
                              }
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
                              onClick={() =>
                                handleChange("adults", "increment")
                              }
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
                              onClick={() =>
                                handleChange("infants", "decrement")
                              }
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
                              onClick={() =>
                                handleChange("infants", "increment")
                              }
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
                {" "}
                <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1 ml-2">
                  Travelling with?
                </label>
                <div
                  className="cursor-pointer border border-gray-300 rounded-3xl transition-all duration-300 ease-in-out bg-gradient-to-br from-white to-gray-50 px-4 py-3 sm:px-4 sm:py-4 min-h-[50px] flex items-center relative shadow-md hover:shadow-lg md:shadow-none"
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
                  {/* Add traveler selected indicator */}
                  {travelers.adults + travelers.children + travelers.infants >
                    0 && (
                    <div className="flex items-center justify-center mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#2B8A1E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-circle-check-big-icon lucide-circle-check-big"
                      >
                        <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
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
                      className="fixed inset-0 backdrop-blur-[2px] bg-gray-900/20 z-[55] animate-in fade-in-0 duration-700 ease-out md:hidden"
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsTravelersMobileOpen(false);
                      }}
                    />

                    {/* Bottom sheet */}
                    <div
                      ref={travelersOverlayRef}
                      className="fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-[24px] shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out flex flex-col md:hidden"
                      style={{
                        height: "75vh",
                        transform:
                          isDragging && isTravelersMobileOpen
                            ? `translateY(${dragOffset}px)`
                            : "none",
                        transition: isDragging
                          ? "none"
                          : "transform 0.3s ease-out",
                      }}
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="travelers-modal-title"
                    >
                      {/* Handle bar */}
                      <div
                        className="flex justify-center pt-3 pb-2"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchCancel}
                      >
                        <div
                          className={`h-1 rounded-full transition-all duration-200 ${
                            isDragging && isTravelersMobileOpen
                              ? "bg-blue-400 w-16"
                              : "bg-gray-400 w-12"
                          }`}
                        ></div>
                      </div>
                      {/* Header */}
                      <div
                        className="bg-white px-6 py-3"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchCancel}
                      >
                        <h3
                          id="travelers-modal-title"
                          className="text-lg font-semibold text-gray-900"
                        >
                          Travelling with?
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Select number of travelers
                        </p>
                        {/* Horizontal line after header text */}
                        <div className="w-full h-px bg-gray-200 mt-3"></div>
                      </div>
                      {/* Content */}
                      <div
                        className="flex-1 overflow-y-auto px-6 py-1 pb-4"
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                      >
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
                              onClick={() =>
                                handleChange("adults", "decrement")
                              }
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
                              onClick={() =>
                                handleChange("adults", "increment")
                              }
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
                              onClick={() =>
                                handleChange("infants", "decrement")
                              }
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
                              onClick={() =>
                                handleChange("infants", "increment")
                              }
                              disabled={travelers.infants >= 9}
                              aria-label="Increase infants"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Continue button */}
                      <div
                        className="px-6 py-4 border-t border-gray-200"
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsTravelersMobileOpen(false);
                          }}
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
                    !isSearching
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500"
                  }`}
                  onClick={handleSearch}
                  disabled={isSearching}
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
                  <span
                    className={`text-sm font-medium transition-all duration-700 ease-in-out ${
                      isDesktopModalActive ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      maxWidth: isDesktopModalActive ? "100px" : "0px",
                      overflow: "hidden",
                      display: isDesktopModalActive ? "inline-block" : "none",
                    }}
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile: Search button inside form container */}
            <div className="md:hidden pt-4 px-0 pb-2 mt-auto">
              <button
                className={`w-full py-3 rounded-full transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl ${
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
        </div>
      </div>

    </>
  );
}

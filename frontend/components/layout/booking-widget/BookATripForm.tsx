"use client";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import RadioButton from "@/components/ui/buttons/RadioButton";
import { DateRangePicker } from "@/components/ui/date-picker";
import {
  fetchAllAirports,
  fetchArrivalDestinationsForOrigin,
  AirportData,
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

export interface Travelers {
  adults: number;
  children: number;
  infants: number;
}

const BookATripForm = memo(function BookATripForm({
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
  const [allAirports, setAllAirports] = useState<AirportData[]>([]);
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
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showValidation, setShowValidation] = useState<boolean>(false);

  // Search filter states
  const [departureSearchTerm, setDepartureSearchTerm] = useState<string>("");
  const [arrivalSearchTerm, setArrivalSearchTerm] = useState<string>(""); // Ref for travelers mobile dropdown to handle outside clicks and refs for form inputs
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
        const airports = await fetchAllAirports();
        setAllAirports(airports);
        // Initialize arrival airports with all airports
        setArrivalAirports(
          airports.map((airport) => ({
            arrivalAirport: airport.city,
            arrivalAirportCode: airport.code,
          }))
        );
      } catch (error) {
        console.error("Error fetching airports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAirports();
  }, []);

  // Memoized function to fetch arrival destinations
  const fetchArrivalsForOrigin = useCallback(
    async (departureAirport: string) => {
      setIsLoadingArrivals(true);
      try {
        const arrivals = await fetchArrivalDestinationsForOrigin(
          departureAirport
        );
        setArrivalAirports(arrivals);

        // Clear selectedArrival if:
        // 1. No arrivals available for this origin, OR
        // 2. Current selection is not valid for this origin
        if (arrivals.length === 0) {
          setSelectedArrival(null);
        } else if (
          selectedArrival &&
          !arrivals.some(
            (a) => a.arrivalAirport === selectedArrival.arrivalAirport
          )
        ) {
          setSelectedArrival(null);
        }
      } catch (error) {
        console.error("Error fetching arrivals:", error);
      } finally {
        setIsLoadingArrivals(false);
      }
    },
    [selectedArrival?.arrivalAirport]
  );

  // When selectedDeparture changes, fetch arrival airports for that origin
  useEffect(() => {
    if (selectedDeparture?.departureAirportCode) {
      fetchArrivalsForOrigin(selectedDeparture.departureAirportCode);
    }
  }, [selectedDeparture?.departureAirportCode, fetchArrivalsForOrigin]);

  // Handle preselected airports when data is loaded
  useEffect(() => {
    if (allAirports.length > 0 && preselectedDeparture) {
      const preselectedDepartureAirport = allAirports.find(
        (airport) => airport.code === preselectedDeparture.departureAirportCode
      );
      if (preselectedDepartureAirport) {
        setSelectedDeparture({
          departureAirport: preselectedDepartureAirport.city,
          departureAirportCode: preselectedDepartureAirport.code,
        });
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
    allAirports.length,
    arrivalAirports.length,
    preselectedDeparture?.departureAirportCode,
    preselectedArrival?.arrivalAirportCode,
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

  // Memoized handler for traveler count changes
  const handleChange = useCallback(
    (type: keyof Travelers, action: "increment" | "decrement") => {
      setTravelers((prev) => {
        const newTravelers = { ...prev };

        if (action === "increment") {
          newTravelers[type] += 1;
        } else {
          newTravelers[type] -= 1;
        }

        return newTravelers;
      });
    },
    []
  );
  // Memoized function to handle desktop modal activation
  const handleDesktopInputClick = useCallback(() => {
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
  }, [onModalStateChange]);
  // Memoized function to close desktop modal
  const closeDesktopModal = useCallback(() => {
    // Close all open dropdowns when closing modal
    setIsDeparturePopoverOpen(false);
    setIsArrivalPopoverOpen(false);
    setIsTravelersPopoverOpen(false);

    // Clear search terms
    setDepartureSearchTerm("");
    setArrivalSearchTerm("");

    setIsDesktopModalActive(false);
    onModalStateChange?.(false);
  }, [onModalStateChange]);

  // Memoized travelers formatter
  const formatTravelers = useMemo((): string => {
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
  }, [travelers.adults, travelers.children, travelers.infants]);

  // Memoized search handler
  const handleSearch = useCallback(() => {
    if (
      selectedDeparture &&
      selectedArrival &&
      dateRange.from &&
      (isOneWay || dateRange.to)
    ) {
      setIsSearching(true);
      setShowValidation(false);

      const baseUrl = "https://uat.digital.airline.amadeus.com/ie/booking";

      function formatSolomonDate(date: Date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const localMidnight = new Date(year, month, day, 0, 0, 0);
        const solomonOffset = -11 * 60; // in minutes
        const utcDate = new Date(
          localMidnight.getTime() - solomonOffset * 60000
        );
        return utcDate.toISOString().slice(0, 10);
      }
      // Build travelers array based on form selection
      const travelersArray = [];

      // Add adults
      for (let i = 0; i < travelers.adults; i++) {
        travelersArray.push({ passengerTypeCode: "ADT" });
      }

      // Add children
      for (let i = 0; i < travelers.children; i++) {
        travelersArray.push({ passengerTypeCode: "CHD" });
      }

      // Add infants
      for (let i = 0; i < travelers.infants; i++) {
        travelersArray.push({ passengerTypeCode: "INF" });
      }

      const searchObj: any = {
        travelers: travelersArray,
        commercialFareFamilies: ["CFFSOLO", "CFFSOLOBIS"],
        itineraries: [
          {
            originLocationCode: selectedDeparture.departureAirportCode,
            destinationLocationCode: selectedArrival.arrivalAirportCode,
            departureDateTime: formatSolomonDate(dateRange.from),
          },
        ],
      };

      if (dateRange.to && !isOneWay) {
        searchObj.itineraries.push({
          originLocationCode: selectedArrival.arrivalAirportCode,
          destinationLocationCode: selectedDeparture.departureAirportCode,
          departureDateTime: formatSolomonDate(dateRange.to),
        });
      }

      const portalFacts = JSON.stringify([
        { key: "OfficeID", value: "HIRIE08AA" },
        { key: "countryCode", value: selectedCurrency?.countryCode || "AU" },
      ]);

      // Create form and submit as POST request
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `${baseUrl}?lang=en-GB`;
      form.style.display = "none";

      // Create hidden inputs with original field names
      const searchInput = document.createElement("input");
      searchInput.type = "hidden";
      searchInput.name = "search";
      searchInput.value = JSON.stringify(searchObj);
      form.appendChild(searchInput);

      const portalFactsInput = document.createElement("input");
      portalFactsInput.type = "hidden";
      portalFactsInput.name = "portalFacts";
      portalFactsInput.value = portalFacts;
      form.appendChild(portalFactsInput);

      const traceInput = document.createElement("input");
      traceInput.type = "hidden";
      traceInput.name = "trace";
      traceInput.value = "true";
      form.appendChild(traceInput);

      document.body.appendChild(form);
      form.submit();
    } else {
      setShowValidation(true);
    }
  }, [
    selectedDeparture,
    selectedArrival,
    dateRange.from,
    dateRange.to,
    isOneWay,
    selectedCurrency,
    travelers,
  ]);

  // Memoized filtered airports for search functionality
  const filteredDepartureAirports = useMemo(() => {
    if (!departureSearchTerm) return allAirports;
    return allAirports.filter(
      (airport) =>
        airport.city
          .toLowerCase()
          .includes(departureSearchTerm.toLowerCase()) ||
        airport.code.toLowerCase().includes(departureSearchTerm.toLowerCase())
    );
  }, [allAirports, departureSearchTerm]);

  const filteredArrivalAirports = useMemo(() => {
    if (!arrivalSearchTerm) return arrivalAirports;
    return arrivalAirports.filter(
      (airport) =>
        airport.arrivalAirport
          .toLowerCase()
          .includes(arrivalSearchTerm.toLowerCase()) ||
        airport.arrivalAirportCode
          .toLowerCase()
          .includes(arrivalSearchTerm.toLowerCase())
    );
  }, [arrivalAirports, arrivalSearchTerm]);

  // Memoized validation flags for better performance
  const isSearchFormValid = useMemo(
    () =>
      selectedDeparture &&
      selectedArrival &&
      dateRange.from &&
      (isOneWay || dateRange.to),
    [selectedDeparture, selectedArrival, dateRange.from, dateRange.to, isOneWay]
  );

  const isDepartureError = useMemo(
    () => showValidation && !selectedDeparture,
    [showValidation, selectedDeparture]
  );
  const isArrivalError = useMemo(
    () => showValidation && !selectedArrival,
    [showValidation, selectedArrival]
  );
  const isDatesError = useMemo(
    () => showValidation && (!dateRange.from || (!isOneWay && !dateRange.to)),
    [showValidation, dateRange.from, dateRange.to, isOneWay]
  );
  const isReturnDateMissing = useMemo(
    () => !isOneWay && dateRange.from && !dateRange.to,
    [isOneWay, dateRange.from, dateRange.to]
  );
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
            className="hidden md:flex absolute right-4 top-4 w-8 h-8 bg-white hover:bg-red-200 rounded-full shadow-lg items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200 z-[80]"
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

                      // Clear search term when closing
                      if (!open && !selectedDeparture) {
                        setDepartureSearchTerm("");
                      }
                    }}
                  >
                    <PopoverTrigger asChild className="w-full">
                      <div className="cursor-pointer px-6 py-3">
                        <div className="flex justify-between items-center">
                          <label className="text-left text-xs text-black font-semibold cursor-pointer">
                            Flying from?
                          </label>
                          {isDepartureError && (
                            <span className="text-red-500 text-xs">
                              This field is required
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Select destination"
                          className="w-full text-sm outline-none text-gray-700 cursor-pointer bg-transparent"
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
                      className="mt-1 p-0 w-[calc(var(--radix-popover-trigger-width)*1.5)] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-hidden z-[75]"
                      style={{
                        maxHeight: "28rem",
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
                      ) : (
                        <>
                          {/* Search input */}
                          <div className="p-3 border-b border-gray-100 bg-gray-50">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search destinations..."
                                value={departureSearchTerm}
                                onChange={(e) =>
                                  setDepartureSearchTerm(e.target.value)
                                }
                                className="w-full pl-9 pr-3 py-2 text-base sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                                autoFocus
                              />
                              <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
                          </div>
                          {/* Airports list */}
                          <div className="max-h-80 overflow-y-auto">
                            {filteredDepartureAirports.length > 0 ? (
                              filteredDepartureAirports.map(
                                (airport, index) => (
                                  <div
                                    key={index}
                                    className="hover:bg-gray-100 cursor-pointer p-3 border-b border-gray-50 last:border-b-0 flex items-center gap-3"
                                    onClick={() => {
                                      setSelectedDeparture({
                                        departureAirport: airport.city,
                                        departureAirportCode: airport.code,
                                      });
                                      if (showValidation)
                                        setShowValidation(false);
                                      setDepartureSearchTerm("");
                                      setIsDeparturePopoverOpen(false);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-gray-400 flex-shrink-0"
                                    >
                                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                                      <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <div className="flex-1">
                                      <div className="text-black text-sm font-medium">
                                        {airport.city}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {airport.code}
                                      </div>
                                    </div>
                                  </div>
                                )
                              )
                            ) : (
                              <div className="text-gray-500 p-3 text-center">
                                {departureSearchTerm
                                  ? "No destinations match your search"
                                  : "No destinations found"}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Mobile: Use inline dropdown that pushes content */}
                <div className="block md:hidden" ref={departureInputRef}>
                  <div className="flex justify-between items-center mb-1 ml-2 mr-2">
                    <label className="text-left text-xs text-gray-600 font-semibold cursor-pointer">
                      Flying from?
                    </label>
                    {isDepartureError && (
                      <span className="text-red-500 text-xs">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div
                    className={`cursor-pointer rounded-3xl transition-all duration-300 ease-in-out bg-gray-50 px-4 py-3 sm:px-4 sm:py-4 min-h-[50px] flex items-center relative shadow-md hover:shadow-lg md:shadow-none border ${
                      isDepartureError ? "border-red-500" : "border-gray-300"
                    }`}
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
                        <div className="w-4 h-4 border-[1.5px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder={
                        isLoading ? "Loading..." : "Select destination"
                      }
                      className={`w-full text-sm outline-none text-gray-800 cursor-pointer placeholder-gray-400 bg-transparent ${
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
                          <p className="text-sm text-gray-500 mt-1 mb-4">
                            Select your departure destination
                          </p>
                          {/* Search input */}
                          <div className="relative mb-4">
                            <input
                              type="text"
                              placeholder="Search destinations..."
                              value={departureSearchTerm}
                              onChange={(e) => setDepartureSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-3 py-3 text-base sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                            />
                            <svg
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
                          {/* Horizontal line after search input */}
                          <div className="w-full h-px bg-gray-200"></div>
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
                          ) : filteredDepartureAirports.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                              {filteredDepartureAirports.map((airport, index) => (
                                <div
                                  key={index}
                                  className="px-6 py-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center gap-3"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedDeparture({
                                      departureAirport: airport.city,
                                      departureAirportCode: airport.code,
                                    });
                                    if (showValidation)
                                      setShowValidation(false);
                                    setDepartureSearchTerm("");
                                    setIsDeparturePopoverOpen(false);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-400 flex-shrink-0"
                                  >
                                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  <div className="flex-1">
                                    <div className="text-gray-900 font-medium">
                                      {airport.city}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                      {airport.code}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-32">
                              <div className="text-gray-500">
                                {departureSearchTerm ? 'No destinations match your search' : 'No destinations found'}
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

                      // Clear search term when closing
                      if (!open && !selectedArrival) {
                        setArrivalSearchTerm("");
                      }
                    }}
                  >
                    <PopoverTrigger asChild className="w-full">
                      <div className="cursor-pointer px-6 py-3">
                        <div className="flex justify-between items-center">
                          <label className="text-left text-xs text-black font-semibold cursor-pointer">
                            Flying to?
                          </label>
                          {isArrivalError && (
                            <span className="text-red-500 text-xs">
                              This field is required
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Select destination"
                          className="w-full text-sm outline-none text-gray-700 cursor-pointer bg-transparent"
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
                      className="mt-1 p-0 w-[calc(var(--radix-popover-trigger-width)*1.5)] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-hidden z-[75]"
                      style={{
                        maxHeight: "28rem",
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
                      ) : (
                        <>
                          {/* Search input */}
                          <div className="p-3 border-b border-gray-100 bg-gray-50">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search destinations..."
                                value={arrivalSearchTerm}
                                onChange={(e) =>
                                  setArrivalSearchTerm(e.target.value)
                                }
                                className="w-full pl-9 pr-3 py-2 text-base sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                                autoFocus
                              />
                              <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
                          </div>
                          {/* Airports list */}
                          <div className="max-h-80 overflow-y-auto">
                            {filteredArrivalAirports.length > 0 ? (
                              filteredArrivalAirports.map((airport, index) => (
                                <div
                                  key={index}
                                  className="hover:bg-gray-100 cursor-pointer p-3 border-b border-gray-50 last:border-b-0 flex items-center gap-3"
                                  onClick={() => {
                                    setSelectedArrival(airport);
                                    if (showValidation)
                                      setShowValidation(false);
                                    setArrivalSearchTerm("");
                                    setIsArrivalPopoverOpen(false);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-400 flex-shrink-0"
                                  >
                                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  <div className="flex-1">
                                    <div className="text-black text-sm font-medium">
                                      {airport.arrivalAirport}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {airport.arrivalAirportCode}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-500 p-3 text-center">
                                {arrivalSearchTerm
                                  ? "No destinations match your search"
                                  : "No destinations found"}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Mobile: Use inline dropdown that pushes content */}
                <div className="block md:hidden" ref={arrivalInputRef}>
                  <div className="flex justify-between items-center mb-1 ml-2 mr-2">
                    <label className="text-left text-xs text-gray-600 font-semibold cursor-pointer">
                      Flying to?
                    </label>
                    {isArrivalError && (
                      <span className="text-red-500 text-xs">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div
                    className={`cursor-pointer rounded-3xl transition-all duration-300 ease-in-out bg-gray-50 px-4 py-3 sm:px-4 sm:py-4 min-h-[50px] flex items-center relative shadow-md hover:shadow-lg md:shadow-none border ${
                      isArrivalError ? "border-red-500" : "border-gray-300"
                    }`}
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
                        <div className="w-4 h-4 border-[1.5px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder={
                        isLoading ? "Loading..." : "Select destination"
                      }
                      className={`w-full text-sm outline-none text-gray-800 cursor-pointer placeholder-gray-400 bg-transparent ${
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
                          <p className="text-sm text-gray-500 mt-1 mb-4">
                            Select your arrival destination
                          </p>
                          {/* Search input */}
                          <div className="relative mb-4">
                            <input
                              type="text"
                              placeholder="Search destinations..."
                              value={arrivalSearchTerm}
                              onChange={(e) => setArrivalSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-3 py-3 text-base sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
                            />
                            <svg
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
                          {/* Horizontal line after search input */}
                          <div className="w-full h-px bg-gray-200"></div>
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
                          ) : filteredArrivalAirports.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                              {filteredArrivalAirports.map((airport, index) => (
                                <div
                                  key={index}
                                  className="px-6 py-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center gap-3"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedArrival(airport);
                                    if (showValidation)
                                      setShowValidation(false);
                                    setArrivalSearchTerm("");
                                    setIsArrivalPopoverOpen(false);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-400 flex-shrink-0"
                                  >
                                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  <div className="flex-1">
                                    <div className="text-gray-900 font-medium">
                                      {airport.arrivalAirport}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                      {airport.arrivalAirportCode}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-32">
                              <div className="text-gray-500">
                                {arrivalSearchTerm ? 'No destinations match your search' : 'No destinations found'}
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
                  onSelect={(range) => {
                    setDateRange(range || { from: undefined, to: undefined });
                    if (showValidation) setShowValidation(false);
                  }}
                  placeholder={isOneWay ? "Travel Date" : "Travel Dates"}
                  variant="desktop"
                  mode={isOneWay ? "single" : "range"}
                  onClick={handleDesktopInputClick}
                  isError={isDatesError && !isReturnDateMissing}
                  errorMessage="This field is required"
                  showReturnDateError={isReturnDateMissing}
                  sideOffset={8}
                />
              </div>
              {/* Mobile: Combined date picker */}
              <div className="block md:hidden w-full">
                <DateRangePicker
                  dateRange={dateRange}
                  onSelect={(range) => {
                    setDateRange(range || { from: undefined, to: undefined });
                    if (showValidation) setShowValidation(false);
                  }}
                  placeholder={isOneWay ? "Travel Date" : "Travel Dates"}
                  variant="mobile"
                  mode={isOneWay ? "single" : "range"}
                  isError={isDatesError && !isReturnDateMissing}
                  errorMessage="This field is required"
                  showReturnDateError={isReturnDateMissing}
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
                          className="w-full text-sm outline-none text-gray-700 cursor-pointer bg-transparent"
                          readOnly
                          value={formatTravelers}
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className="mt-1 p-0 w-[calc(var(--radix-popover-trigger-width)*1.5)] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto z-[75]"
                      style={{
                        maxHeight: "28rem",
                      }}
                      align="end"
                    >
                      <div className=" bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                        {/* Adults */}
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <p className="text-sm font-semibold text-black">
                              Adults
                            </p>
                            <p className="text-xs text-gray-500">Ages 13+</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="w-9 h-9 flex items-center justify-center border-[1.5px] border-blue-500 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                              onClick={() =>
                                handleChange("adults", "decrement")
                              }
                              disabled={travelers.adults <= 1}
                              aria-label="Decrease adults"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="text-sm text-black font-medium min-w-[1.5rem] text-center">
                              {travelers.adults}
                            </span>
                            <button
                              className="w-9 h-9 flex items-center justify-center border-[1.5px] border-blue-500 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                              onClick={() =>
                                handleChange("adults", "increment")
                              }
                              disabled={travelers.adults >= 9}
                              aria-label="Increase adults"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Children */}
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <p className="text-sm font-semibold text-black">
                              Children
                            </p>
                            <p className="text-xs text-gray-500">Ages 2–12</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="w-9 h-9 flex items-center justify-center border-[1.5px] border-blue-500 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                              onClick={() =>
                                handleChange("children", "decrement")
                              }
                              disabled={travelers.children <= 0}
                              aria-label="Decrease children"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="text-sm text-black font-medium min-w-[1.5rem] text-center">
                              {travelers.children}
                            </span>
                            <button
                              className="w-9 h-9 flex items-center justify-center border-[1.5px] border-blue-500 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                              onClick={() =>
                                handleChange("children", "increment")
                              }
                              disabled={travelers.children >= 9}
                              aria-label="Increase children"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Infants */}
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="text-sm font-semibold text-black">
                              Infants
                            </p>
                            <p className="text-xs text-gray-500">Under 2</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="w-9 h-9 flex items-center justify-center border-[1.5px] border-blue-500 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                              onClick={() =>
                                handleChange("infants", "decrement")
                              }
                              disabled={travelers.infants <= 0}
                              aria-label="Decrease infants"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="text-sm text-black font-medium min-w-[1.5rem] text-center">
                              {travelers.infants}
                            </span>
                            <button
                              className="w-9 h-9 flex items-center justify-center border-[1.5px] border-blue-500 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                              onClick={() =>
                                handleChange("infants", "increment")
                              }
                              disabled={travelers.infants >= 9}
                              aria-label="Increase infants"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
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
                  className="cursor-pointer border border-gray-300 rounded-3xl transition-all duration-300 ease-in-out bg-gray-50 px-4 py-3 sm:px-4 sm:py-4 min-h-[50px] flex items-center relative shadow-md hover:shadow-lg md:shadow-none"
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
                    className="w-full text-sm outline-none text-gray-800 cursor-pointer placeholder-gray-400 bg-transparent"
                    readOnly
                    value={formatTravelers}
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
                            <p className="text-sm text-gray-500">Ages 13+</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              className="w-11 h-11 flex items-center justify-center border-[1.5px] border-blue-500 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                              onClick={() =>
                                handleChange("adults", "decrement")
                              }
                              disabled={travelers.adults <= 1}
                              aria-label="Decrease adults"
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
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="text-lg text-black font-medium min-w-[2rem] text-center">
                              {travelers.adults}
                            </span>
                            <button
                              className="w-11 h-11 flex items-center justify-center border-[1.5px] border-blue-500 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                              onClick={() =>
                                handleChange("adults", "increment")
                              }
                              disabled={travelers.adults >= 9}
                              aria-label="Increase adults"
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
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
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
                              className="w-11 h-11 flex items-center justify-center border-[1.5px] border-blue-500 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                              onClick={() =>
                                handleChange("children", "decrement")
                              }
                              disabled={travelers.children <= 0}
                              aria-label="Decrease children"
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
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="text-lg text-black font-medium min-w-[2rem] text-center">
                              {travelers.children}
                            </span>
                            <button
                              className="w-11 h-11 flex items-center justify-center border-[1.5px] border-blue-500 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                              onClick={() =>
                                handleChange("children", "increment")
                              }
                              disabled={travelers.children >= 9}
                              aria-label="Increase children"
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
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
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
                              className="w-11 h-11 flex items-center justify-center border-[1.5px] border-blue-500 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                              onClick={() =>
                                handleChange("infants", "decrement")
                              }
                              disabled={travelers.infants <= 0}
                              aria-label="Decrease infants"
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
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="text-lg text-black font-medium min-w-[2rem] text-center">
                              {travelers.infants}
                            </span>
                            <button
                              className="w-11 h-11 flex items-center justify-center border-[1.5px] border-blue-500 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                              onClick={() =>
                                handleChange("infants", "increment")
                              }
                              disabled={travelers.infants >= 9}
                              aria-label="Increase infants"
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
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
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
                className="w-full py-3 rounded-full transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-100 disabled:text-white"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>
                  {isSearching ? "Searching Flights..." : "Search Flights"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default BookATripForm;

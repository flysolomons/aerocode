
import { useState, useEffect } from "react";

// Interface for TravelerDropdown props
export interface TravelerDropdownProps {
  onChange: (travelers: Travelers) => void;
}

// Interface for travelers state
export interface Travelers {
  adults: number;
  children: number;
  infants: number;
}

export default function TravelerDropdown({ onChange }: TravelerDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 1,
    children: 0,
    infants: 0,
  });

  useEffect(() => {
    onChange(travelers); // Call onChange after travelers state updates (local)
  }, [travelers, onChange]);

  // Handle increment/decrement
  const handleChange = (type: keyof Travelers, operation: "increment" | "decrement") => {
    setTravelers((prev) => {
      const newTravelers = { ...prev };
      if (operation === "increment" && newTravelers[type] < 9) {
        newTravelers[type] += 1;
      } else if (operation === "decrement" && newTravelers[type] > (type === "adults" ? 1 : 0)) {
        newTravelers[type] -= 1;
      }
      return newTravelers;
    });
  };

  // Format display text
  const displayText = (): string => {
    const parts: string[] = [];
    if (travelers.adults > 0) parts.push(`${travelers.adults} Adult${travelers.adults > 1 ? "s" : ""}`);
    if (travelers.children > 0) parts.push(`${travelers.children} Child${travelers.children > 1 ? "ren" : ""}`);
    if (travelers.infants > 0) parts.push(`${travelers.infants} Infant${travelers.infants > 1 ? "s" : ""}`);
    return parts.join(", ") || "1 Adult";
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".relative")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div className="relative">
      <div
        className="w-full text-sm text-black cursor-pointer px-6 py-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <label className="block text-xs text-black font-semibold">Travelling with?</label>
        <div className="text-sm text-black">{displayText()}</div>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
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
              <span className="text-sm text-black">{travelers.adults}</span>
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
              <span className="text-sm text-black">{travelers.children}</span>
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
              <span className="text-sm text-black">{travelers.infants}</span>
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
      )}
    </div>
  );
}
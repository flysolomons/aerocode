"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface GeneralDropdownProps {
  headerHovered?: boolean;
  megaMenuActive?: boolean;
}

// Desktop General Dropdown Component - Memoized to prevent re-renders
const GeneralDropdown = React.memo(
  ({
    headerHovered = false,
    megaMenuActive = false,
  }: GeneralDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Close dropdown when header becomes transparent
    React.useEffect(() => {
      if (!headerHovered && !megaMenuActive) {
        setIsOpen(false);
      }
    }, [headerHovered, megaMenuActive]);

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <motion.button
            className="cursor-pointer p-1 lg:p-2 xl:p-1 flex items-center"
            initial={{ color: "#ffffff" }}
            animate={{
              color: headerHovered || megaMenuActive ? "#212061" : "#ffffff",
            }}
            transition={{
              duration: 0.25,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            aria-label="General"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 lg:h-6 lg:w-6 xl:h-6 xl:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {/* Removed the word 'General' for desktop */}
          </motion.button>
        </PopoverTrigger>
        <PopoverContent
          className="w-48 p-2"
          align="end"
          side="bottom"
          sideOffset={16}
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
            General
          </div>
          <div className="flex flex-col gap-1">
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md hover:bg-yellow-50 text-gray-700 text-sm font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/news"
              className="block px-3 py-2 rounded-md hover:bg-yellow-50 text-gray-700 text-sm font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              News
            </Link>
            <Link
              href="/travel-alerts"
              className="block px-3 py-2 rounded-md hover:bg-yellow-50 text-gray-700 text-sm font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Travel Alerts
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

GeneralDropdown.displayName = "GeneralDropdown";

export default GeneralDropdown;
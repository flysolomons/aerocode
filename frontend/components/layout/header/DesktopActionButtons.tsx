"use client";
import React from "react";
import { motion } from "framer-motion";
import { Currency } from "@/graphql/HeaderQuery";
import GeneralDropdown from "./GeneralDropdown";
import CurrencyDropdown from "./CurrencyDropdown";

interface DesktopActionButtonsProps {
  isHovered: boolean;
  isMegaMenuOpen: boolean;
  megaMenuCloseTimeout: NodeJS.Timeout | null;
  setMegaMenuCloseTimeout: (timeout: NodeJS.Timeout | null) => void;
  setActiveMegaMenu: (menu: string | null) => void;
  currencies: Currency[];
}

const DesktopActionButtons = React.memo(
  ({
    isHovered,
    isMegaMenuOpen,
    megaMenuCloseTimeout,
    setMegaMenuCloseTimeout,
    setActiveMegaMenu,
    currencies,
  }: DesktopActionButtonsProps) => {
    return (
      <div
        className="hidden xl:flex items-center justify-end gap-2 w-36 lg:w-40 xl:w-36"
        onMouseEnter={() => {
          // Clear any pending close timeout
          if (megaMenuCloseTimeout) {
            clearTimeout(megaMenuCloseTimeout);
            setMegaMenuCloseTimeout(null);
          }
          setActiveMegaMenu(null);
        }}
        style={{
          // Prevent flickering by ensuring icons maintain stable states
          transition: "none",
        }}
      >
        {/* General Dropdown - Use the component */}
        <GeneralDropdown
          headerHovered={isHovered}
          megaMenuActive={isMegaMenuOpen}
        />

        {/* Currency Dropdown - Use the component */}
        <CurrencyDropdown
          isDesktop={true}
          headerHovered={isHovered}
          megaMenuActive={isMegaMenuOpen}
          currencies={currencies}
        />
        <motion.button
          className="h-8 px-4 rounded-full text-sm font-medium transition-all duration-200 ease-out"
          initial={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#ffffff",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
          animate={{
            backgroundColor:
              isHovered || isMegaMenuOpen
                ? "transparent"
                : "rgba(255, 255, 255, 0.1)",
            color: isHovered || isMegaMenuOpen ? "#212061" : "#ffffff",
            borderColor:
              isHovered || isMegaMenuOpen
                ? "#212061"
                : "rgba(255, 255, 255, 0.2)",
          }}
          whileHover={{
            backgroundColor:
              isHovered || isMegaMenuOpen
                ? "rgba(33, 32, 97, 0.05)"
                : "rgba(255, 255, 255, 0.2)",
          }}
          transition={{
            duration: 0.25,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            border: "2px solid",
          }}
          aria-label="Contact"
        >
          Contact
        </motion.button>
      </div>
    );
  }
);

DesktopActionButtons.displayName = "DesktopActionButtons";

export default DesktopActionButtons;

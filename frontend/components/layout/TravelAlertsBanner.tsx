"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Info } from "lucide-react";
import { useTravelAlert } from "./TravelAlertContext";

interface TravelAlert {
  id: string;
  type: "warning" | "info" | "critical";
  title: string;
  message: string;
  link?: {
    text: string;
    url: string;
  };
}

const TravelAlertsBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { setHasTravelAlert } = useTravelAlert();

  const handleClose = () => {
    setIsAnimating(true);
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false);
      setHasTravelAlert(false);
    }, 300); // Match the transition duration
  };

  // Dummy data - will be replaced with backend data later
  // Show only the most recent/important alert
  const travelAlert: TravelAlert | null = {
    id: "1",
    type: "warning",
    title: "Travel Alert",
    message: "Flight delays expected due to severe weather in Honiara.",
    link: {
      text: "Read More",
      url: "/flight-status",
    },
  };

  const getAlertIcon = (type: TravelAlert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertStyles = (type: TravelAlert["type"]) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const getLinkStyles = (type: TravelAlert["type"]) => {
    switch (type) {
      case "critical":
        return "text-red-700 hover:text-red-900";
      case "warning":
        return "text-yellow-700 hover:text-yellow-900";
      case "info":
        return "text-blue-700 hover:text-blue-900";
      default:
        return "text-blue-700 hover:text-blue-900";
    }
  };

  if (!isVisible || !travelAlert) {
    return null;
  }

  return (
    <div
      className={`${getAlertStyles(
        travelAlert.type
      )} transition-all duration-300 ease-in-out ${
        isAnimating ? "h-0 opacity-0" : "h-[46px] opacity-100"
      }`}
      style={{
        overflow: "hidden",
      }}
    >
      <div className="max-w-[1128px] mx-auto h-[46px] px-4 md:px-0">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {getAlertIcon(travelAlert.type)}
            </div>
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <h3 className="font-semibold text-sm whitespace-nowrap">
                {travelAlert.title}:
              </h3>
              <p className="text-sm truncate">{travelAlert.message}</p>
              {travelAlert.link && (
                <a
                  href={travelAlert.link.url}
                  className={`text-sm font-medium underline hover:no-underline whitespace-nowrap ${getLinkStyles(
                    travelAlert.type
                  )}`}
                >
                  {travelAlert.link.text}
                </a>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-black/20"
            aria-label="Close travel alert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelAlertsBanner;

"use client";

import React, { useState, useEffect } from "react";
import { X, AlertTriangle, Info } from "lucide-react";
import { useTravelAlert } from "./TravelAlertContext";
import parse from "html-react-parser";
import { type ActiveTravelAlertPage } from "@/graphql/TravelAlertPageQuery";

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

interface TravelAlertsBannerProps {
  activeAlert: ActiveTravelAlertPage | null;
}

const TravelAlertsBanner: React.FC<TravelAlertsBannerProps> = ({
  activeAlert,
}) => {
  const [isVisible, setIsVisible] = useState(!!activeAlert?.activeAlert);
  const [isAnimating, setIsAnimating] = useState(false);
  const { setHasTravelAlert } = useTravelAlert();

  // Set hasTravelAlert based on whether there's an active alert
  useEffect(() => {
    const hasAlert = !!activeAlert?.activeAlert;
    setHasTravelAlert(hasAlert);
    setIsVisible(hasAlert);
  }, [activeAlert, setHasTravelAlert]);

  const handleClose = () => {
    setIsAnimating(true);
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false);
      setHasTravelAlert(false);
    }, 300); // Match the transition duration
  };

  // Transform server data to component format
  const travelAlert: TravelAlert | null = activeAlert?.activeAlert
    ? {
        id: activeAlert.activeAlert.createdAt, // Use createdAt as unique ID
        type: "warning", // Default to warning -
        title: activeAlert.activeAlert.title,
        message: activeAlert.activeAlert.content,
        link: {
          text: "Read More",
          url: activeAlert.url,
        },
      }
    : null;

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

  if (!travelAlert) {
    return (
      <div
        className="transition-all duration-300 ease-in-out h-0 opacity-0 overflow-hidden"
        style={{ height: "0px" }}
      />
    );
  }

  return (
    <div
      className={`${getAlertStyles(
        travelAlert.type
      )} transition-all duration-300 ease-in-out ${
        isAnimating || !isVisible ? "h-0 opacity-0" : "h-[46px] opacity-100"
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
              <h3 className="font-semibold text-sm whitespace-nowrap flex-shrink-0">
                {travelAlert.title}:
              </h3>
              <div className="text-sm flex-1 min-w-0 overflow-hidden">
                <div
                  className="truncate cursor-default"
                  title={activeAlert?.activeAlert.content}
                >
                  {parse(travelAlert.message)}
                </div>
              </div>
              {travelAlert.link && (
                <a
                  href={travelAlert.link.url}
                  className={`text-sm font-medium underline hover:no-underline whitespace-nowrap flex-shrink-0 ${getLinkStyles(
                    travelAlert.type
                  )}`}
                >
                  <span className="hidden sm:inline">
                    {travelAlert.link.text}
                  </span>
                  <span className="sm:hidden">More</span>
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

import React from "react";
import Link from "next/link";
import parse from "html-react-parser";
import { motion, AnimatePresence } from "framer-motion";

interface InfoCardProps {
  title: string;
  description: string;
  svg?: string; // Now optional, can be undefined
  url: string;
}

function InfoCard({ title, description, svg, url }: InfoCardProps) {
  // Function to extract URL from rich text if needed
  const extractUrl = (urlString: string): string => {
    // If it's already a plain URL, return as is
    if (
      urlString.startsWith("/") ||
      urlString.startsWith("http://") ||
      urlString.startsWith("https://")
    ) {
      return urlString;
    }

    // Try to extract URL from HTML anchor tag
    const linkMatch = urlString.match(/href\s*=\s*["']([^"']+)["']/i);
    if (linkMatch && linkMatch[1]) {
      return linkMatch[1];
    }

    // If no href found, return the original string (fallback)
    return urlString;
  };

  const actualUrl = extractUrl(url);
  // Check if URL is external (starts with http:// or https://) or internal
  const isExternalLink =
    actualUrl.startsWith("http://") || actualUrl.startsWith("https://");

  return (
    <div className="bg-white rounded-3xl p-3 sm:p-6 shadow-sm border border-gray-300 transition-transform hover:scale-105 h-40 sm:h-auto">
      <div className="flex-1 space-y-2 sm:space-y-4 w-full h-full flex flex-col">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-shrink-0">
            {svg ? (
              <img
                src={svg}
                alt={`${title} icon`}
                className="w-6 h-6 sm:w-10 sm:h-10"
              />
            ) : null}
          </div>
          <h3 className="text-base sm:text-xl font-semibold text-blue-500 text-left">
            {title}
          </h3>
        </div>
        <div className="text-sm sm:text-base text-gray-700 text-left flex-1 overflow-hidden">
          {/* Mobile: use line clamping for overflow truncation */}
          <div className="sm:hidden line-clamp-3">
            {parse(description)}
          </div>
          {/* Desktop: show full text */}
          <div className="hidden sm:block">
            {parse(description)}
          </div>
        </div>
        <div className="flex justify-start mt-auto">
          {isExternalLink ? (
            <motion.a
              href={actualUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => console.log("find out more is hovered!")}
              className="inline-flex items-center gap-1 sm:gap-2 text-slate-200 text-xs sm:text-sm hover:text-slate-300 bg-blue-500 px-2 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-blue-400 transition duration-300 whitespace-nowrap"
            >
              Find out more
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                className="sm:w-5 sm:h-5"
                fill="#e0e0e0"
                viewBox="0 0 256 256"
              >
                <path d="M128,136v64a8,8,0,0,1-16,0V155.32L45.66,221.66a8,8,0,0,1-11.32-11.32L100.68,144H56a8,8,0,0,1,0-16h64A8,8,0,0,1,128,136ZM208,32H80A16,16,0,0,0,64,48V96a8,8,0,0,0,16,0V48H208V176H160a8,8,0,0,0,0,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Z"></path>
              </svg>
            </motion.a>
          ) : (
            <Link href={actualUrl}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => console.log("find out more is hovered!")}
                className="inline-flex items-center gap-1 sm:gap-2 text-slate-200 text-xs sm:text-sm hover:text-slate-300 bg-blue-500 px-2 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-blue-400 transition duration-300 whitespace-nowrap cursor-pointer"
              >
                Find out more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  className="sm:w-5 sm:h-5"
                  fill="#e0e0e0"
                  viewBox="0 0 256 256"
                >
                  <path d="M128,136v64a8,8,0,0,1-16,0V155.32L45.66,221.66a8,8,0,0,1-11.32-11.32L100.68,144H56a8,8,0,0,1,0-16h64A8,8,0,0,1,128,136ZM208,32H80A16,16,0,0,0,64,48V96a8,8,0,0,0,16,0V48H208V176H160a8,8,0,0,0,0,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Z"></path>
                </svg>
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default InfoCard;

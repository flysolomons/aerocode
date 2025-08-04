"use client";

import React from "react";
/*import { ChevronDownIcon } from '@heroicons/react/24/outline';*/

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number; // index of initially open item (optional)
}

export default function Accordion({ items, defaultOpen }: AccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(
    defaultOpen ?? null
  );
  const accordionRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const toggleAccordion = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(openIndex === index ? null : index);
    
    // Scroll to the accordion item when opening
    if (isOpening && accordionRefs.current[index]) {
      // Small delay to allow content to render first
      setTimeout(() => {
        accordionRefs.current[index]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {items.map((item, index) => (
        <div 
          key={index} 
          ref={(el) => (accordionRefs.current[index] = el)}
          className={`${index !== 0 ? 'border-t border-gray-200' : ''}`}
        >
          <button
            className="flex w-full justify-between items-center text-left px-4 sm:px-6 py-4 sm:py-5 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
            onClick={() => toggleAccordion(index)}
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
              {item.title}
            </h3>
            <div className="flex-shrink-0">
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
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
          </button>
          {openIndex === index && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 animate-in slide-in-from-top-2 duration-200">
              <div className="pt-2 border-t border-gray-100">
                {item.content}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

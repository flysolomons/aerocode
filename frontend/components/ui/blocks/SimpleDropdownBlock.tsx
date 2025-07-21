import { useState } from "react";
import parse from "html-react-parser";
import { SimpleDropdownBlock as SimpleDropdownBlockType } from "@/graphql/genericPageQuery";

interface SimpleDropdownBlockProps {
  block: SimpleDropdownBlockType;
}

export default function SimpleDropdownBlock({ block }: SimpleDropdownBlockProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (!block.heading || !block.content) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-lg">
        <button
          onClick={toggleDropdown}
          className={`w-full px-6 py-5 text-left flex items-center justify-between transition-all duration-300 focus:outline-none ${
            isOpen
              ? "bg-yellow-50 hover:bg-yellow-200"
              : "hover:bg-gray-50"
          }`}
        >
          <h3 className={`text-lg sm:text-xl font-bold pr-4 transition-colors duration-300 ${
            isOpen ? "text-blue-600" : "text-gray-900"
          }`}>
            {block.heading}
          </h3>
          <span
            className={`flex-shrink-0 transform transition-all duration-300 ${
              isOpen ? "rotate-180 text-blue-600" : "text-gray-400"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </button>
        
        {isOpen && (
          <div className="px-6 pb-6 pt-2">
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              {parse(block.content)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
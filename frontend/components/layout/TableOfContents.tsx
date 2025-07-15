import { useState } from "react";
import Container from "@/components/layout/Container";

export interface TOCSection {
  id: string;
  label: string;
  hasContent: boolean;
}

interface TableOfContentsProps {
  sections: TOCSection[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

export default function TableOfContents({ 
  sections, 
  activeSection, 
  onSectionClick 
}: TableOfContentsProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (sections.length <= 1) {
    return null;
  }

  const handleMobileSectionClick = (sectionId: string) => {
    onSectionClick(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Horizontal Tabs */}
      <div className="hidden sm:block border-b border-gray-200 bg-white">
        <Container>
          <nav className="flex space-x-8 overflow-x-auto scrollbar-hide px-4 sm:px-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeSection === section.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </Container>
      </div>

      {/* Mobile Compact Jump to Section */}
      <div className="sm:hidden bg-white border-b border-gray-200">
        <Container>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-600">
                Jump to section
              </div>
              <div className="text-xs text-gray-400">
                Swipe →
              </div>
            </div>
            <div 
              className="flex gap-2 overflow-x-auto scrollbar-hide" 
              style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => onSectionClick(section.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
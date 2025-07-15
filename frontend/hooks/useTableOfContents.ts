import { useState, useEffect } from "react";
import { TOCSection } from "@/components/layout/TableOfContents";

interface UseTableOfContentsProps {
  sections: TOCSection[];
  scrollOffset?: number;
}

export function useTableOfContents({ 
  sections, 
  scrollOffset = 40 
}: UseTableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop - scrollOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + scrollOffset;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial active section

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, scrollOffset]);

  return {
    activeSection,
    scrollToSection,
  };
}
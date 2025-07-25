"use client";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface UnifiedMegaMenuProps {
  activeMegaMenu: string | null;
  finalMegaMenuData: any;
  setActiveMegaMenu: (menu: string | null) => void;
  setIsHovered: (hovered: boolean) => void;
}

// Unified Mega Menu Component - Single container that changes content
const UnifiedMegaMenu = React.memo(
  ({
    activeMegaMenu,
    finalMegaMenuData,
    setActiveMegaMenu,
    setIsHovered,
  }: UnifiedMegaMenuProps) => {
    const currentData = activeMegaMenu
      ? finalMegaMenuData[activeMegaMenu as keyof typeof finalMegaMenuData]
      : null;
    const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false);

    // Track if ANY megamenu is open (boolean state instead of specific menu)
    React.useEffect(() => {
      setIsMegaMenuOpen(!!activeMegaMenu);
    }, [!!activeMegaMenu]); // Only depend on boolean presence, not the specific value

    return (
      <>
        {/* Container - only animate based on boolean open/closed state */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.25,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 z-40 max-h-[calc(16rem-4rem)] sm:max-h-[calc(20rem-4rem)] lg:max-h-[calc(25rem-4rem)] overflow-y-auto hidden xl:block"
            >
              <div className="max-w-[70.5rem] mx-auto py-4 px-4 sm:px-6 lg:px-8 xl:px-0">
                {/* Content - animate only when switching between nav items */}
                <AnimatePresence mode="wait">
                  {currentData && (
                    <motion.div
                      key={activeMegaMenu}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.15,
                        ease: "easeInOut",
                      }}
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        {currentData.title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentData.sections.map(
                          (section: any, index: number) => (
                            <div key={index} className="space-y-3">
                              <h4 className="text-sm font-semibold uppercase text-blue-600">
                                {section.title}
                              </h4>
                              <ul className="space-y-2">
                                {section.items.map(
                                  (item: any, itemIndex: number) => (
                                    <li key={itemIndex}>
                                      <Link
                                        href={item.href || "#"}
                                        className="group block p-1.5 rounded-lg hover:bg-yellow-50 transition-colors"
                                        onClick={() => {
                                          setActiveMegaMenu(null);
                                          setIsHovered(false);
                                        }}
                                      >
                                        <div className="text-sm text-gray-800 group-hover:text-blue-600">
                                          {item.name}
                                        </div>
                                        {item.description && (
                                          <div className="text-xs text-gray-500">
                                            {item.description}
                                          </div>
                                        )}
                                      </Link>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )
                        )}
                      </div>
                      {/* Horizontal line at bottom */}
                      <div className="border-b border-gray-200 mt-4"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
);

UnifiedMegaMenu.displayName = "UnifiedMegaMenu";

export default UnifiedMegaMenu;

"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BreadcrumbNavProps {
  breadcrumbs?: string;
  className?: string;
}

export default function BreadcrumbNav({
  breadcrumbs,
  className = "",
}: BreadcrumbNavProps) {
  const [shouldCollapse, setShouldCollapse] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const breadcrumbRef = useRef<HTMLDivElement>(null);

  if (!breadcrumbs) return null;

  const breadcrumbParts = breadcrumbs.split("/").filter(Boolean);

  // Check if we should collapse based on screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  // Check if breadcrumbs overflow and need collapsing
  useEffect(() => {
    const checkOverflow = () => {
      if (!breadcrumbRef.current) return;

      // Force show all breadcrumbs temporarily to measure
      setShouldCollapse(false);

      setTimeout(() => {
        if (!breadcrumbRef.current) return;

        const container = breadcrumbRef.current;
        const isOverflowing = container.scrollWidth > container.clientWidth;
        const hasMany = breadcrumbParts.length > 3;

        setShouldCollapse(
          isOverflowing || hasMany || (isMobile && breadcrumbParts.length > 1)
        );
      }, 0);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [breadcrumbParts.length, isMobile]);

  // Helper function to format labels
  const formatLabel = (part: string, index: number) => {
    const isAfterNews =
      breadcrumbParts.includes("news") &&
      index > breadcrumbParts.indexOf("news");
    return isAfterNews
      ? "Article"
      : part.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }; // If we don't need to collapse, show all (desktop only with few items)
  if (!shouldCollapse && breadcrumbParts.length <= 3 && !isMobile) {
    return (
      <div ref={breadcrumbRef} className="overflow-hidden">
        <Breadcrumb className={className}>
          <BreadcrumbList className="text-white justify-center gap-1 sm:gap-1.5">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-white hover:text-white/80">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {breadcrumbParts.map((part, index) => {
              const href = "/" + breadcrumbParts.slice(0, index + 1).join("/");
              const label = formatLabel(part, index);
              const isLast = index === breadcrumbParts.length - 1;

              return (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator className="text-white/60" />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-white">
                        {label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={href}
                          className="text-white hover:text-white/80"
                        >
                          {label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
  }
  // If we need to collapse or have many parts, show: Home / First / ... / Last
  // On mobile, show even more collapsed version: Home / ... / Last
  const firstPart = breadcrumbParts[0];
  const lastPart = breadcrumbParts[breadcrumbParts.length - 1];

  const firstHref = "/" + firstPart;
  const firstLabel = formatLabel(firstPart, 0);
  const lastLabel = formatLabel(lastPart, breadcrumbParts.length - 1);
  // Get the middle parts for the dropdown
  const middleParts = isMobile
    ? breadcrumbParts.slice(0, -1) // On mobile, put ALL except last in dropdown (even first part)
    : breadcrumbParts.slice(1, -1); // On desktop, keep first part visible

  return (
    <div ref={breadcrumbRef} className="overflow-hidden">
      <Breadcrumb className={className}>
        <BreadcrumbList className="text-white justify-center gap-1 sm:gap-1.5">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="text-white hover:text-white/80">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {/* Show first part on desktop only */}
          {!isMobile && breadcrumbParts.length > 1 && (
            <>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={firstHref}
                    className="text-white hover:text-white/80"
                  >
                    {firstLabel}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}

          {/* Show dropdown if there are middle parts */}
          {middleParts.length > 0 && (
            <>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-white/60 hover:text-white/80">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Show more breadcrumbs</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-white border"
                  >
                    {middleParts.map((part, index) => {
                      const actualIndex = isMobile ? index : index + 1;
                      const href =
                        "/" +
                        breadcrumbParts.slice(0, actualIndex + 1).join("/");
                      const label = formatLabel(part, actualIndex);

                      return (
                        <DropdownMenuItem key={index} asChild>
                          <Link
                            href={href}
                            className="text-gray-900 hover:text-gray-700 cursor-pointer w-full"
                          >
                            {label}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
            </>
          )}

          {/* Always show last part */}
          {breadcrumbParts.length > 0 && (
            <>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">
                  {lastLabel}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

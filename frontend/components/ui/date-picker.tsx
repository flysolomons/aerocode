"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  labelClassName?: string;
  variant?: "mobile" | "desktop";
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Pick a date",
  disabled = false,
  className,
  label,
  labelClassName,
  variant = "mobile",
}: DatePickerProps) {
  const isMobile = variant === "mobile";

  return (
    <div className={cn("w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-auto",
              isMobile
                ? "px-5 py-1.5 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-white hover:border-blue-300"
                : "p-0 border-0 shadow-none bg-transparent hover:bg-transparent",
              !date && "text-gray-400"
            )}
            disabled={disabled}
          >
            <div className="flex flex-col items-start w-full">
              {label && (
                <label
                  className={cn(
                    "block text-left text-xs font-mono font-semibold cursor-pointer mb-1",
                    labelClassName ||
                      (isMobile ? "text-gray-600" : "text-black")
                  )}
                >
                  {label}
                </label>
              )}
              <div
                className={cn(
                  "flex items-center w-full",
                  isMobile ? "px-2 sm:px-0" : ""
                )}
              >
                {date ? (
                  <span className="text-gray-800 text-sm">
                    {format(date, "dd MMM, yyyy")}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">{placeholder}</span>
                )}
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[75]" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            disabled={(date) => date < new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface DateRangePickerProps {
  dateRange?: { from: Date | undefined; to?: Date | undefined };
  onSelect?: (
    range: { from: Date | undefined; to?: Date | undefined } | undefined
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fromLabel?: string;
  toLabel?: string;
  labelClassName?: string;
  variant?: "mobile" | "desktop";
  mode?: "single" | "range";
  onClick?: () => void;
  sideOffset?: number;
}

export function DateRangePicker({
  dateRange,
  onSelect,
  placeholder = "Pick a date range",
  disabled = false,
  className,
  fromLabel = "From",
  toLabel = "To",
  labelClassName,
  variant = "mobile",
  mode = "range",
  onClick,
  sideOffset = 4,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = variant === "mobile";

  if (isMobile) {
    return (
      <div className={cn("w-full", className)}>
        <div
          className="cursor-pointer border-2 border-gray-300 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-white px-5 py-1.5 sm:px-4 sm:py-3 hover:border-blue-300"
          onClick={() => setOpen(true)}
        >
          <label className="block text-left text-xs text-gray-600 font-semibold cursor-pointer mb-1">
            {placeholder}
          </label>
          <div className="flex items-center w-full px-2 sm:px-0">
            {dateRange?.from ? (
              mode === "range" && dateRange.to ? (
                <span className="text-gray-800 text-sm">
                  {format(dateRange.from, "dd MMM, yyyy")} -
                  {format(dateRange.to, "dd MMM, yyyy")}
                </span>
              ) : (
                <span className="text-gray-800 text-sm">
                  {format(dateRange.from, "dd MMM, yyyy")}
                </span>
              )
            ) : (
              <span className="text-gray-400 text-sm">
                {mode === "single"
                  ? "Select departure date"
                  : "Select departure and return dates"}
              </span>
            )}
          </div>
        </div>

        {/* Mobile bottom overlay */}
        {open && (
          <>
            {/* Backdrop with blur effect */}
            <div
              className="fixed inset-0 backdrop-blur-[2px] bg-black bg-opacity-25 z-[90] animate-in fade-in-0 duration-700 ease-out"
              style={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                width: "100vw",
                height: "100vh",
                margin: 0,
                padding: 0,
              }}
              onClick={() => setOpen(false)}
            />

            {/* Bottom sheet */}
            <div
              className="fixed inset-x-0 bottom-0 z-[100] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-0 duration-700 ease-out"
              style={{ height: "80vh", overflowY: "auto" }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              {/* Header */}
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {mode === "single" ? "Travel Date" : "Travel Dates"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === "single"
                    ? "Pick your departure date"
                    : "Pick your departure and return dates"}
                </p>
                {/* Horizontal line after header text */}
                <div className="w-full h-px bg-gray-200 mt-4"></div>
              </div>
              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-2">
                {mode === "single" ? (
                  <Calendar
                    initialFocus
                    mode="single"
                    defaultMonth={dateRange?.from}
                    selected={dateRange?.from}
                    onSelect={(date: Date | undefined) => {
                      onSelect?.(
                        date ? { from: date, to: undefined } : undefined
                      );
                      if (date && mode === "single") {
                        setOpen(false);
                      }
                    }}
                    disabled={(date) => date < new Date()}
                    isMobileOverlay={true}
                    classNames={{
                      day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100",
                    }}
                  />
                ) : (
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(
                      range:
                        | { from: Date | undefined; to?: Date | undefined }
                        | undefined
                    ) => {
                      onSelect?.(range);
                      // Don't auto-close for range mode - wait for Continue button
                    }}
                    numberOfMonths={1}
                    disabled={(date) => date < new Date()}
                    isMobileOverlay={true}
                    classNames={{
                      day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100",
                    }}
                  />
                )}
              </div>
              {/* Continue button for range mode only */}
              {mode === "range" && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <button
                    onClick={() => setOpen(false)}
                    disabled={!dateRange?.from}
                    className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Desktop version (unchanged)
  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-auto px-6 py-3 border-0 shadow-none bg-transparent hover:bg-transparent",
              !dateRange?.from && "text-gray-400"
            )}
            disabled={disabled}
            onClick={onClick}
          >
            <div className="flex flex-col items-start w-full">
              <label
                className={cn(
                  "block text-left text-xs font-semibold cursor-pointer mb-1 text-black",
                  labelClassName
                )}
              >
                {placeholder}
              </label>
              <div className="flex items-center w-full">
                {dateRange?.from ? (
                  mode === "range" && dateRange.to ? (
                    <span className="text-gray-800 text-sm">
                      {format(dateRange.from, "dd MMM, yyyy")} -
                      {format(dateRange.to, "dd MMM, yyyy")}
                    </span>
                  ) : (
                    <span className="text-gray-800 text-sm">
                      {format(dateRange.from, "dd MMM, yyyy")}
                    </span>
                  )
                ) : (
                  <span className="text-gray-400 text-sm">
                    {mode === "single"
                      ? "Select departure date"
                      : "Select departure and return dates"}
                  </span>
                )}
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 z-[75]"
          align={mode === "range" ? "center" : "start"}
          sideOffset={sideOffset}
          side="bottom"
          avoidCollisions={false}
        >
          {mode === "single" ? (
            <Calendar
              initialFocus
              mode="single"
              defaultMonth={dateRange?.from}
              selected={dateRange?.from}
              onSelect={(date: Date | undefined) => {
                onSelect?.(date ? { from: date, to: undefined } : undefined);
                if (date && mode === "single") {
                  setOpen(false);
                }
              }}
              disabled={(date) => date < new Date()}
              classNames={{
                day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100",
              }}
            />
          ) : (
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(
                range:
                  | { from: Date | undefined; to?: Date | undefined }
                  | undefined
              ) => {
                onSelect?.(range);
              }}
              numberOfMonths={2}
              disabled={(date) => date < new Date()}
              classNames={{
                day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100",
              }}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

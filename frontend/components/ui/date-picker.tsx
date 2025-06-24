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
            </div>{" "}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
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
}: DateRangePickerProps) {
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
                : "px-6 py-3 border-0 shadow-none bg-transparent hover:bg-transparent",
              !dateRange?.from && "text-gray-400"
            )}
            disabled={disabled}
            onClick={onClick}
          >
            <div className="flex flex-col items-start w-full">
              <label
                className={cn(
                  "block text-left text-xs font-semibold cursor-pointer mb-1",
                  labelClassName || (isMobile ? "text-gray-600" : "text-black")
                )}
              >
                {placeholder}
              </label>
              <div
                className={cn(
                  "flex items-center w-full",
                  isMobile ? "px-2 sm:px-0" : ""
                )}
              >
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
            </div>{" "}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {mode === "single" ? (
            <Calendar
              initialFocus
              mode="single"
              defaultMonth={dateRange?.from}
              selected={dateRange?.from}
              onSelect={(date: Date | undefined) => {
                onSelect?.(date ? { from: date, to: undefined } : undefined);
              }}
              disabled={(date) => date < new Date()}
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
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

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

interface SingleDatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  labelClassName?: string;
  minDate?: Date;
}

export function SingleDatePicker({
  date,
  onSelect,
  placeholder = "Pick a date",
  disabled = false,
  className,
  label,
  labelClassName,
  minDate,
}: SingleDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className={cn("block text-sm font-medium text-gray-700 mb-2", labelClassName)}>
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white h-auto min-h-[42px] sm:min-h-[50px]",
              !date && "text-gray-400"
            )}
            disabled={disabled}
          >
            <div className="flex items-center gap-2 w-full">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span className={date ? "text-gray-900" : "text-gray-400"}>
                {date ? format(date, "d MMM, yyyy") : placeholder}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[75]" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              onSelect?.(selectedDate);
              if (selectedDate) {
                setOpen(false);
              }
            }}
            disabled={(date) => {
              const today = new Date();
              const minimumDate = minDate || today;
              return date < minimumDate;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
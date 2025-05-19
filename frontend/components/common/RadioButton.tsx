"use client";
import { useState } from "react";

interface RadioButtonProps {
  optionOne: string;
  optionTwo: string;
  initialSelected?: "one" | "two";
  onOptionChange?: (option: "one" | "two") => void;
}

export default function RadioButton({
  optionOne,
  optionTwo,
  initialSelected = "one",
  onOptionChange,
}: RadioButtonProps) {
  const [selected, setSelected] = useState<"one" | "two">(initialSelected);

  const handleOptionClick = (option: "one" | "two") => {
    setSelected(option);
    if (onOptionChange) {
      onOptionChange(option);
    }
  };

  return (
    <div className="flex bg-white justify-center border-gray-200 border min-w-[12.5rem] rounded-full shadow-md p-0.5">
      <button
        className={`text-sm px-6 font-semibold py-2 min-w-[9.75rem] h-[2.5rem] rounded-full transition-colors ${
          selected === "one" ? "bg-blue-500 text-white" : "bg-white text-black"
        }`}
        onClick={() => handleOptionClick("one")}
        type="button"
      >
        {optionOne}
      </button>
      <button
        className={`text-sm px-6 font-semibold py-2 min-w-[9.75rem] h-[2.5rem] rounded-full transition-colors ${
          selected === "two" ? "bg-blue-500 text-white" : "bg-white text-black"
        }`}
        onClick={() => handleOptionClick("two")}
        type="button"
      >
        {optionTwo}
      </button>
    </div>
  );
}

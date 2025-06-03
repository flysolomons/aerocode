"use client";
import { useState } from "react";
import RadioButton from "./RadioButton";
import TravelerDropdown, {Travelers} from "./TravelerDropDown";


export default function BookingWidget() {
  //Initialize default values for travelers.
  const [travelers, setTravelers] = useState<Travelers>({ adults: 1, children: 0, infants: 0 });
  
  //Oneway or return 
  // TODO: Hook up with datepicker component to show return date field depend on oneway/return
  const [isOneWay, setIsOneWay] = useState<boolean>(false);

  return (
    <div className="relative flex flex-col items-center pt-8 h-1/2 text-white animate__animated animate__fadeInUp">
      <div className="w-[70.5rem] bg-white rounded-[2rem] shadow-lg">
        <div className="flex border-b">
          <div className="flex border-b-2 border-b-blue-500 px-4 py-3 h-12 w-[11rem]">
            <button className="text-blue-500 text-sm font-semibold w-[11rem] text-center">
              Book a Trip
            </button>
          </div>
          <div className="flex px-4 py-3 h-12 w-[11rem]">
            <button className="text-gray-500 font-semibold text-sm hover:text-gray-700 w-[11rem] text-center">
              Manage Booking
            </button>
          </div>
        </div>

        <div className="px-4 py-3 flex flex-col items-center space-y-4">
          <RadioButton optionOne="Round Trip" optionTwo="One Way" onOptionChange={(value: string) => setIsOneWay(value === "One Way")}/>

          {/* search form */}
          <div className="flex items-center border border-gray-200 rounded-full px-2 shadow-md">
            <div className="flex-1 px-6 py-3">
              <label className="block text-xs text-black font-semibold">
                Flying from?
              </label>
              <input
                type="text"
                placeholder="Search airport"
                className="w-full text-sm outline-none text-black"
              />
            </div>
            <div className="w-[1px] h-10 bg-gray-200"></div>
            <div className="flex-1 px-6 py-3">
              <label className="block text-xs text-black font-semibold">
                Flying to?
              </label>
              <input
                type="text"
                placeholder="Search destination"
                className="w-full text-sm outline-none text-black"
              />
            </div>
            <div className="w-[1px] h-10 bg-gray-200"></div>
            <div className="flex-1 px-6 py-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-black font-semibold">
                    Departure
                  </label>
                  <input
                    type="text"
                    placeholder="Add date"
                    className="w-full text-sm outline-none text-black"
                  />
                </div>
                <div className="w-[1px] h-10 bg-gray-200"></div>
                <div className="flex-1">
                  <label className="block text-xs text-black font-semibold">
                    Return
                  </label>
                  <input
                    type="text"
                    placeholder="11 Dec '25"
                    className="w-full text-sm outline-none text-black"
                  />
                </div>
              </div>
            </div>
            
            <div className="w-[1px] h-10 bg-gray-200"></div>
            <div className="flex-1 flex">
            <TravelerDropdown onChange={setTravelers} />
              {/** 
              <div className="px-6 py-3">
                <label className="block text-xs text-black font-semibold">
                  Travelling with?
                </label>
                <input
                  type="text"
                  placeholder="1 Adult, 1 Child, 1 Infant"
                  className="w-full text-sm outline-none text-black"
                />
              </div>
              */}
              <div className="flex items-center justify-center">
                <button className="bg-blue-500 text-white p-4 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

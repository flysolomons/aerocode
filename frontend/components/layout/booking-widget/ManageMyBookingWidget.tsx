"use client";
import { useState } from "react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

export default function ManageMyBookingWidget() {
  const [bookingReference, setBookingReference] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Managing booking:", { bookingReference, lastName });
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-md mb-6 sm:mb-8 lg:mb-12 bg-[url(/traditional_ring_section.png)] bg-no-repeat">
      <div className="w-full mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-500 mb-2 sm:mb-4 text-center">
          Manage My Booking
        </h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">
          Enter your booking reference and last name to view or modify your
          booking.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-2">


            {/* Booking Reference Input */}
            <div className="px-6 py-3 border-2 rounded-md border-gray-100 bg-white">
                    <label className="block text-left text-xs text-gray-600 font-semibold">
                      Booking Reference
                    </label>
                    <input
                      type="text"
                      name="booking-reference"
                      placeholder="Usually found on your ticket"
                      className="w-full text-sm outline-none text-gray-700"
                      value={bookingReference}
                      onChange={(e) => setBookingReference(e.target.value)}
                      required
                    />
                    {/* Icon */}
                    <div className="float-right">
                    
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        fill="#9e9e9e"
                        viewBox="0 0 256 256"
                        className="absolute -mt-2 pr-2"
                      >
                        <path d="M232,48V88a8,8,0,0,1-16,0V56H184a8,8,0,0,1,0-16h40A8,8,0,0,1,232,48ZM72,200H40V168a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16Zm152-40a8,8,0,0,0-8,8v32H184a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V168A8,8,0,0,0,224,160ZM32,96a8,8,0,0,0,8-8V56H72a8,8,0,0,0,0-16H32a8,8,0,0,0-8,8V88A8,8,0,0,0,32,96ZM80,80a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V88A8,8,0,0,0,80,80Zm104,88V88a8,8,0,0,0-16,0v80a8,8,0,0,0,16,0ZM144,80a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V88A8,8,0,0,0,144,80Zm-32,0a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V88A8,8,0,0,0,112,80Z"></path>
                      </svg>
                    </div>
                    
            </div>
            

             {/* Last Name Input */}
             <div className="px-6 py-3 border-2 rounded-md border-gray-100 bg-white">
                    <label className="block text-left text-xs text-gray-600 font-semibold">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last-name"
                      placeholder="enter your last name"
                      className="w-full text-sm outline-none text-gray-700"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                    {/* Icon */}
                    <div className="float-right">
                    
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        fill="#9e9e9e"
                        viewBox="0 0 256 256"
                        className="absolute -mt-2 pr-2"
                      >
                        <path d="M75.19,198.4a8,8,0,0,0,11.21-1.6,52,52,0,0,1,83.2,0,8,8,0,1,0,12.8-9.6A67.88,67.88,0,0,0,155,165.51a40,40,0,1,0-53.94,0A67.88,67.88,0,0,0,73.6,187.2,8,8,0,0,0,75.19,198.4ZM128,112a24,24,0,1,1-24,24A24,24,0,0,1,128,112Zm72-88H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V40A16,16,0,0,0,200,24Zm0,192H56V40H200ZM88,64a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,64Z"></path>
                      </svg>
                    </div>
                    
            </div>



          </div>

          <div className="flex justify-center pt-2 sm:pt-4">
            <PrimaryButton
              text="Retrieve Booking"
              onClick={() => handleSubmit}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { BelamaSignUpPage } from "@/graphql/BelamaPageQuery";
import { useMembershipStore } from '@/lib/store';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import iziToast, {IziToast} from "izitoast";
import 'izitoast/dist/css/iziToast.min.css';

interface BelamaSignUpTemplateProps {
  initialPage: BelamaSignUpPage;
}
// Map store title to membershipType value
const titleToMembershipType: { [key: string]: string } = {
  'belama business': 'business',
  'belama family': 'family',
  'belama max': 'max',
  'belama me': 'me',
  'belama plus': 'plus',
};

// Payment methods array
const paymentMethods = ['Cash', 'Card', 'Direct Deposit'];
const seatOptions = ['Window','Aisle'];


export default function BelamaSignUpTemplate({
  initialPage
}: BelamaSignUpTemplateProps){
  //Get Store
  const { price, key, title, reset } = useMembershipStore();
  
  const [membershipType, setMembershipType] = useState("");
  //Seat Selection States 
  const [isSeatSelectionPopOverOpen, setIsSeatSelectionPopOveOpen] = useState<boolean>();
  const [seatSelection, setSeatSelection] = useState("");
  
  //Payment States
  const [isPaymentPopOverOpen, setIsPaymentPopOverOpen] = useState<boolean>();
  const [paymentMethod, setPaymentMethod] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  //IziToast
  // Hook to ensure iziToast is initialized on client-side
  
  // Set membershipType based on title when component mounts
  useEffect(() => {
    if (title && titleToMembershipType[title.toLowerCase()]) {
      setMembershipType(titleToMembershipType[title.toLocaleLowerCase()]);
    }
  }, [title]); // Run when title changes

  const [formData, setFormData] = useState<Record<string,string>>({});
  
  // Handle manual membership type changes
  const handleMembershipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setMembershipType(newType);
    setFormData({}); // Reset form data when membership type changes
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setFormData({ ...formData, paymentMethod: method.toLowerCase() }); // Update formData
    setIsPaymentPopOverOpen(false);
  };

  //Handle Seat Selection 
  const handleSeatSelectionChange = (seat: string) =>{
    setSeatSelection(seat);
    setFormData({ ...formData, seatSelection: seat.toLowerCase() }); // Update formData
    setIsSeatSelectionPopOveOpen(false);
  };
  
  //Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      iziToast.warning({
        title: 'Caution',
        message: 'Please fill out all required fields correctly',
      });
      
      return;
    }
    console.log('Submitting:', { price, key, title });

    //SUBMIT DATA TO EMAIL PLAYER HERE
    // TODO: code email player here
    //Reset store after submission
    reset();
  };

  // Input Validation
  const validateInput = (name: string, value: string, memberIndex?: number): string => {
    if(name === 'Email'){
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
    }
    if(value.trim() === '') 
      return name + ' is required';
    
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    //Firstname Validate
    newErrors.firstname = validateInput('First name', formData.firstname || '');

    //Address Validate
    newErrors.address = validateInput('Address', formData.address || '');
    //Telephone validate 
    newErrors.telephone = validateInput('Telephone',formData.telephone || '');
    //Mobile validate 
    newErrors.mobile = validateInput('Mobile',formData.mobile || '');
    //Email validate 
    newErrors.email = validateInput('Email',formData.email || '');

    
    if (newErrors.address || newErrors.telephone || newErrors.mobile || newErrors.email || newErrors.firstname) {
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;

  }

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const error = validateInput(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const renderMemberPreferences = (memberCount: number) => {
    return (
      <div className="border p-4 rounded shadow mb-4 bg-white">
        <h3 className="font-semibold text-md pb-1">Special Requests</h3>
        <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">

          {/* Seat Selection Input */}
          <Popover
                open={isSeatSelectionPopOverOpen}
                onOpenChange={setIsSeatSelectionPopOveOpen}
              >
                <PopoverTrigger asChild className="w-full">
                  <div className="cursor-pointer px-6 py-3 border-2 rounded-md border-gray-100 ">
                  
                   <label className="block text-left text-xs text-gray-400 font-semibold cursor-pointer">
                    Seat
                    </label>
                    <input
                      type="text"
                      placeholder="Select Seat Preference"
                      className="w-full text-sm outline-none text-gray-700 cursor-pointer"
                      readOnly
                      value={seatSelection}
                    />
                    {/* Icon */}
                    <div className="float-right">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2"><path d="M224,232a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16H216A8,8,0,0,1,224,232Zm0-72v32a16,16,0,0,1-16,16H114.11a15.93,15.93,0,0,1-14.32-8.85l-58.11-116a16.1,16.1,0,0,1,0-14.32l22.12-44A16,16,0,0,1,85,17.56l33.69,14.22.47.22a16,16,0,0,1,7.15,21.46,1.51,1.51,0,0,1-.11.22L112,80l31.78,64L208,144A16,16,0,0,1,224,160Zm-16,0H143.77a15.91,15.91,0,0,1-14.31-8.85l-31.79-64a16.07,16.07,0,0,1,0-14.29l.12-.22L112,46.32,78.57,32.21A4.84,4.84,0,0,1,78.1,32L56,76,114.1,192H208Z"></path></svg>
                    </div>
                    
                  </div>
                </PopoverTrigger>

                <PopoverContent
                  className="mt-1 p-0 w-[--radix-popover-trigger-width] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto"
                  style={{
                    maxHeight:"auto",
                  }}
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                 
                 {seatOptions.map((seat) => (
                        <div
                          key={seat}
                          className="text-gray-500 p-3 hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleSeatSelectionChange(seat)}
                        >
                          {seat}
                        </div>
                  ))}
                </PopoverContent>
          </Popover>
          

          {/* Meal Preference Input */}
          <div className="px-6 py-3 border-2 rounded-md border-gray-100">
            <label className="block text-left text-xs text-gray-400 font-semibold">
              Meal 
            </label>
            <input
              type="text"
              name={`member${memberCount}MealPreference`}
              placeholder="Have anything special?"
              className="w-full text-sm outline-none text-gray-700"
              onChange={handleInputChange}
            />
            {/* Icon */}
            <div className="float-right">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2"><path d="M72,88V40a8,8,0,0,1,16,0V88a8,8,0,0,1-16,0ZM216,40V224a8,8,0,0,1-16,0V176H152a8,8,0,0,1-8-8,268.75,268.75,0,0,1,7.22-56.88c9.78-40.49,28.32-67.63,53.63-78.47A8,8,0,0,1,216,40ZM200,53.9c-32.17,24.57-38.47,84.42-39.7,106.1H200ZM119.89,38.69a8,8,0,1,0-15.78,2.63L112,88.63a32,32,0,0,1-64,0l7.88-47.31a8,8,0,1,0-15.78-2.63l-8,48A8.17,8.17,0,0,0,32,88a48.07,48.07,0,0,0,40,47.32V224a8,8,0,0,0,16,0V135.32A48.07,48.07,0,0,0,128,88a8.17,8.17,0,0,0-.11-1.31Z"></path></svg>        
            </div>
          </div>
          
        </div>
      </div>
    );
  };

  return (
    <>
      <SecondaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage.url}
        breadcrumbs={initialPage.url}
      />
      <div className="bg-gray-50 px-6 md:px-6 lg:px-0">
      <Container>
        <form onSubmit={handleSubmit}>
        <div className="py-12 space-y-8">
          
          <div className="border-2 border-gray-100 p-4 rounded-md bg-white bg-[url(/traditional_ring.png)] bg-center">
            <p className="text-yellow-800 text-sm bg-yellow-300 w-auto md:w-1/3 lg:w-1/4 p-1 pl-2 rounded-md -mt-8 mb-4 flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6e5102" viewBox="0 0 256 256" className="pr-1 mt-0">
              <path d="M149.61,85.71l-89.6,88a8,8,0,0,1-11.22,0L10.39,136a8,8,0,1,1,11.22-11.41L54.4,156.79l84-82.5a8,8,0,1,1,11.22,11.42Zm96.1-11.32a8,8,0,0,0-11.32-.1l-84,82.5-18.83-18.5a8,8,0,0,0-11.21,11.42l24.43,24a8,8,0,0,0,11.22,0l89.6-88A8,8,0,0,0,245.71,74.39Z"></path>
              </svg>
              You have selected
            </p>
            
            <div className="">
            <h3 className="text-blue-500 font-bold text-xl">{title}</h3>
            <p className="text-gray-500 text-xs md:text-sm lg:text-sm">{membershipType === "max" || membershipType ==="me" || membershipType === "plus" ?"Individual Membership": "Group Membership"}</p>
            </div>
            <div className="float-right">
              <h1 className="font-bold text-xl -mt-12 lg:text-2xl lg:-mt-14 lg:mr-6">SBD ${price}</h1>
              <p className="text-xs text-gray-400 md:text-sm lg:text-sm">Billed Annually</p>
            </div>
          </div>

          {membershipType && membershipType !== "" && (
            <>
              {membershipType === "business" && (
                <div className="border p-4 rounded shadow mb-4 bg-white">
                  <h3 className="text-md lg:text-lg font-semibold">
                    Personal Details 
                  </h3>
                  <span className="text-gray-400 text-xs md:text-sm lg:text-sm ">(Up to 3 Persons)</span>
                  {[1, 2, 3].map((member) => (
                    <div key={member} className="mb-4">
                      <h4 className="font-medium">Member {member}</h4>
                      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-2">
                        
                        {/* First Name Input */}
                        <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                          <label className="block text-left text-xs text-gray-400 font-semibold">
                            First Name
                          </label>
                          <input
                            type="text"
                            name={`member${member}FirstName`}
                            placeholder="First Name"
                            className="w-full text-sm outline-none text-gray-700"
                            onChange={handleInputChange}
                          />
                          {/* Icon */}
                          <div className="float-right">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                            </svg>
                          </div>
                          
                        </div>
                        {/* Surname Input */}
                        <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                          <label className="block text-left text-xs text-gray-400 font-semibold">
                            Surname 
                          </label>
                          <input
                            type="text"
                            name={`member${member}Surname`}
                            placeholder="Surname"
                            className="w-full text-sm outline-none text-gray-700"
                            onChange={handleInputChange}
                          />
                          {/* Icon */}
                          <div className="float-right">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {membershipType === "family" && (
                <div className="border p-4 rounded shadow mb-4 bg-white">
                  <h3 className="text-md font-semibold">
                    Personal Details 
                  </h3>
                  <span className="text-gray-400 text-xs md:text-sm lg:text-sm ">(2 Adults and 2-3 Children)</span>
                  <h4 className="font-medium mt-3 mb-2 text-gray-500">Adult</h4>
                  {[1, 2].map((adult) => (
                    <div key={`adult${adult}`} className="mb-4">
                   
                      <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                        {/* First Name Input */}
                        <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                          <label className="block text-left text-xs text-gray-400 font-semibold">
                            {`Adult ${adult}`}
                          </label>
                          <input
                            type="text"
                            name={`adult${adult}FirstName`}
                            placeholder="First Name"
                            className="w-full text-sm outline-none text-gray-700"
                            onChange={handleInputChange}
                          />
                          {/* Icon */}
                          <div className="float-right">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                            </svg>
                          </div>
                          
                        </div>
                        {/* Surname Input */}
                        <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                          <label className="block text-left text-xs text-gray-400 font-semibold">
                          {`Adult ${adult}`} 
                          </label>
                          <input
                            type="text"
                            name={`adult${adult}Surname`}
                            placeholder="Surname"
                            className="w-full text-sm outline-none text-gray-700"
                            onChange={handleInputChange}
                          />
                          {/* Icon */}
                          <div className="float-right">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                            </svg>
                          </div>
                        </div>
                      
                      </div>
                    </div>
                  ))}
                  <h4 className="font-medium mt-3 mb-2 text-gray-500">Children</h4>
                  
                  {[1, 2, 3].map((child) => (
                    
                    <div key={`child${child}`} className="mb-4">
                      
                      <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">

                        {/* Child Firstname Input */}
                        <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                          <label className="block text-left text-xs text-gray-400 font-semibold">
                            {`Child ${child}`}
                          </label>
                          <input
                            type="text"
                            name={`child${child}FirstName`}
                            placeholder="First name"
                            className="w-full text-sm outline-none text-gray-700"
                            onChange={handleInputChange}
                          />
                          {/* Icon */}
                          <div className="float-right">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                            </svg>
                          </div>
                          
                        </div>

                         {/* Child surname Input */}
                         <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                          <label className="block text-left text-xs text-gray-400 font-semibold">
                          {`child ${child}`} 
                          </label>
                          <input
                            type="text"
                            name={`child${child}Surname`}
                            placeholder="Surname"
                            className="w-full text-sm outline-none text-gray-700"
                            onChange={handleInputChange}
                          />
                          {/* Icon */}
                          <div className="float-right">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                            </svg>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {membershipType === "max" && (
                <div className="border p-4 rounded shadow mb-4 bg-white">
                  <h3 className="text-md font-semibold">
                    Personal Details 
                  </h3>
                  <span className="text-gray-400 text-xs md:text-sm lg:text-sm ">(One Person)</span>
                  <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    {/* First Name Input */}
                    <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                      <label className="block text-left text-xs text-gray-400 font-semibold">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        placeholder="Your Given Name"
                        className="w-full text-sm outline-none text-gray-700"
                        onChange={handleInputChange}
                      />
                      {/* Icon */}
                      <div className="float-right">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                        </svg>
                      </div>
                      {/* Error Message */}
                      {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
                    </div>
                    {/* Surname Input */}
                    <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                      <label className="block text-left text-xs text-gray-400 font-semibold">
                        Surname 
                      </label>
                      <input
                        type="text"
                        name="surname"
                        placeholder="Your Family Name"
                        className="w-full text-sm outline-none text-gray-700"
                        onChange={handleInputChange}
                      />
                      {/* Icon */}
                      <div className="float-right">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                        </svg>
                      </div>
                      {/* Error Message */}
                      {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                    </div>
                  </div>
                </div>
              )}
              {membershipType === "me" && (
                <div className="border p-4 rounded shadow mb-4 bg-white">
                  <h3 className="text-md font-semibold">
                    Personal Details 
                  </h3>
                  <span className="text-gray-400 text-xs md:text-sm lg:text-sm ">(One Person + One Guest)</span>
                  <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    {/* First Name Input */}
                    <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                      <label className="block text-left text-xs text-gray-400 font-semibold">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        placeholder="Your Given Name"
                        className="w-full text-sm outline-none text-gray-700"
                        onChange={handleInputChange}
                      />
                      {/* Icon */}
                      <div className="float-right">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                        </svg>
                      </div>
                      {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
                    </div>
                    {/* Surname Input */}
                    <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                      <label className="block text-left text-xs text-gray-400 font-semibold">
                        Surname 
                      </label>
                      <input
                        type="text"
                        name="surname"
                        placeholder="Your Family Name"
                        className="w-full text-sm outline-none text-gray-700"
                        onChange={handleInputChange}
                      />
                      {/* Icon */}
                      <div className="float-right">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                        </svg>
                      </div>
                      {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                    </div>
                  </div>
                </div>
              )}
              {membershipType === "plus" && (
                <div className="border p-4 rounded shadow mb-4 bg-white">
                  <h3 className="text-md font-semibold">
                    Personal Details
                  </h3>
                  <span className="text-gray-400 text-xs md:text-sm lg:text-sm ">(One Person + One Guest)</span>
                  <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    {/* First Name Input */}
                    <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                      <label className="block text-left text-xs text-gray-400 font-semibold">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        placeholder="Your Given Name"
                        className="w-full text-sm outline-none text-gray-700"
                        onChange={handleInputChange}
                      />
                      
                      {/* Icon */}
                      <div className="float-right">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                        </svg>
                      </div>
                      {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
                    </div>
                    {/* Surname Input */}
                    <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                      <label className="block text-left text-xs text-gray-400 font-semibold">
                        Surname 
                      </label>
                      <input
                        type="text"
                        name="surname"
                        placeholder="Your Family Name"
                        className="w-full text-sm outline-none text-gray-700"
                        onChange={handleInputChange}
                      />
                      {/* Icon */}
                      <div className="float-right">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                        </svg>
                      </div>
                      {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                    </div>
                    
                    
                  </div>
                </div>
              )}
              {/* Special Requests Section */}
              {membershipType === "business" && renderMemberPreferences(3)}
              {/* For Business */}
              {membershipType === "family" && renderMemberPreferences(5)}
              {/* 2 Adults + 3 Children */}
              {membershipType === "max" && renderMemberPreferences(1)}
              {/* 1 Member */}
              {membershipType === "me" && renderMemberPreferences(2)}
              {/* 1 Member + 1 Guest */}
              {membershipType === "plus" && renderMemberPreferences(2)}
              {/* 1 Member + 1 Guest */}
            </>
          )}

          {/* Always show Contact Details and Payment sections */}
          <div className="border p-4 rounded shadow mb-4 bg-white">
            <h3 className="text-md font-semibold">Contact Details</h3>
            <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {/* Address Input */}
              <div className="px-6 py-3 border-2 rounded-md border-gray-100 ">
                  <label className="block text-left text-xs text-gray-400 font-semibold">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Residential/Company Address"
                    className="w-full text-sm outline-none text-gray-700"
                    onChange={handleInputChange}
                  />
                  {/* Icon */}
                  <div className="float-right">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2"><path d="M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32L39.12,72A16,16,0,0,0,32,85.34V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM48,85.34,128,32V208H48ZM112,112v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm-32,0v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm0,56v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Zm32,0v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Z"></path></svg>
                  </div>
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* Telephone Input */}
              <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                  <label className="block text-left text-xs text-gray-400 font-semibold">
                    Telephone
                  </label>
                  <input
                    type="text"
                    name="telephone"
                    placeholder="Your Landline"
                    className="w-full text-sm outline-none text-gray-700"
                    onChange={handleInputChange}
                  />
                  {/* Icon */}
                  <div className="float-right">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                      <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path>
                    </svg>
                  </div>
                  {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
              </div>
              {/* Mobile Input */}
              <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                  <label className="block text-left text-xs text-gray-400 font-semibold">
                    Mobile
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Your mobile number"
                    className="w-full text-sm outline-none text-gray-700"
                    onChange={handleInputChange}
                  />
                  {/* Icon */}
                  <div className="float-right">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                      <path d="M176,16H80A24,24,0,0,0,56,40V216a24,24,0,0,0,24,24h96a24,24,0,0,0,24-24V40A24,24,0,0,0,176,16Zm8,200a8,8,0,0,1-8,8H80a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8ZM140,60a12,12,0,1,1-12-12A12,12,0,0,1,140,60Z"></path>
                    </svg>
                  </div>
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>
              {/* Email Input */}
              <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                  <label className="block text-left text-xs text-gray-400 font-semibold">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    placeholder="john@email.com"
                    className="w-full text-sm outline-none text-gray-700"
                    onChange={handleInputChange}
                  />

                  {/* Icon */}
                  <div className="float-right">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path>
                    </svg>
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
            </div>
          </div>

          <div className="border p-4 rounded shadow mb-4 bg-white">
            <h3 className="text-md font-semibold">Payment</h3>
            <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {/* Membership Number Input */}

              <div className="px-6 py-3 border-2 rounded-md border-gray-100">
                  <label className="block text-left text-xs text-gray-400 font-semibold">
                    Membership Number
                  </label>
                  <input
                    type="text"
                    name="membershipnumber"
                    placeholder="Only applicable if you have one"
                    className="w-full text-sm outline-none text-gray-700"
                    onChange={handleInputChange}
                  />
                  {/* Icon */}
                  <div className="float-right">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                      <path d="M200,112a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h40A8,8,0,0,1,200,112Zm-8,24H152a8,8,0,0,0,0,16h40a8,8,0,0,0,0-16Zm40-80V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Zm-80.26-34a8,8,0,1,1-15.5,4c-2.63-10.26-13.06-18-24.25-18s-21.61,7.74-24.25,18a8,8,0,1,1-15.5-4,39.84,39.84,0,0,1,17.19-23.34,32,32,0,1,1,45.12,0A39.76,39.76,0,0,1,135.75,166ZM96,136a16,16,0,1,0-16-16A16,16,0,0,0,96,136Z"></path>
                    </svg>
                  </div>
                  {errors.membershipnumber && <p className="text-red-500 text-xs mt-1">{errors.membershipnumber}</p>}
                  
              </div>

              {/* Payment Select Popover */}

              <Popover
                open={isPaymentPopOverOpen}
                onOpenChange={setIsPaymentPopOverOpen}
              >
                <PopoverTrigger asChild className="w-full">
                  <div className="cursor-pointer px-6 py-3 border-2 rounded-md border-gray-100">
                    <label className="block text-left text-xs text-gray-400 font-semibold cursor-pointer">
                        Method
                    </label>
                    <input
                      type="text"
                      placeholder="Select Payment Method"
                      className="w-full text-sm outline-none text-gray-700 cursor-pointer"
                      readOnly
                      value={paymentMethod}
                    />
                    {/* Icon */}
                    <div className="float-right">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a28,28,0,0,1-28,28h-4v8a8,8,0,0,1-16,0v-8H104a8,8,0,0,1,0-16h36a12,12,0,0,0,0-24H116a28,28,0,0,1,0-56h4V72a8,8,0,0,1,16,0v8h16a8,8,0,0,1,0,16H116a12,12,0,0,0,0,24h24A28,28,0,0,1,168,148Z"></path>
                      </svg>
                    </div>
                   
                  </div>
                </PopoverTrigger>

                <PopoverContent
                  className="mt-1 p-0 w-[--radix-popover-trigger-width] bg-white border text-sm border-gray-200 rounded-md shadow-lg overflow-auto"
                  style={{
                    maxHeight:"auto",
                  }}
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                 
                 {paymentMethods.map((method) => (
                        <div
                          key={method}
                          className="text-gray-500 p-3 hover:bg-blue-50 cursor-pointer"
                          onClick={() => handlePaymentMethodChange(method)}
                        >
                          {method}
                        </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <PrimaryButton text="Sign Up" onClick={()=>{handleSubmit}} />

        </div>
        </form>
      </Container>
      
      </div>
      
    </>
  );

}




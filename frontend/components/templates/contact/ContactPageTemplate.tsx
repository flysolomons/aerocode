"use client"
import { ContactPage } from "@/graphql/ContactPageQuery";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import { useState } from "react";
import ContactForm from "./ContactForm";

interface ContactPageTemplateProps{
    
    //TODO: Uncomment when API Handler is created
    initialPage: ContactPage;
}

export default function ContactPageTemplate({
    initialPage,
  }: ContactPageTemplateProps){
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    
    
    return(
        <>
            {/* Header Section */}
            <SecondaryHero
                title="Contact Us"
                image="/hero.jpg"
                breadcrumbs={"> Contact us"}
            />
            {/* Header Section End */}

            {/* Page Content */}
            <div className="bg-refx">
            <Container>
                <div className="py-8 px-8">
                    
                    {/* Reservation Contacts */}
                    <div id="reservationContacts" className="space-y-2 mb-16">
                        <div className="mb-8">
                            <h2 className="text-blue-500 font-bold text-2xl md:text-3xl lg:text-4xl md:font-semibold lg:font-semibold">Make Reservations?</h2>
                            <p className="text-gray-800 mt-3"> Ready to book your next adventure? Contact our reservation team for flight bookings and personalized support:  </p>
                        </div>
                        {/* List of reservation numbers */}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 mb-5">
                            {/* Reservation Card */}
                            <div className="space-y-2 bg-white rounded-2xl p-4 shadow-md">
                                <h2 className="text-xl text-blue-500 font-semibold">Solomon Islands</h2>
                                <div className="text-gray-700 space-y-1">
                                    <p className="text-sm mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path></svg>
                                        177 (local call)
                                    </p>
                                    <hr/>
                                    <div id="businessHours" className="text-sm">
                                        <p className="font-semibold text-xs bg-blue-50 text-blue-500 p-1 rounded-md text-center w-1/4 my-4">Open</p>
                                        <p className="my-1">Monday-Friday: 0800 - 1600</p>
                                        <p>Saturday: 08100 - 1200</p>
                                        <p className="font-semibold text-xs bg-blue-50 text-blue-500 p-1 w-1/4 rounded-md text-center my-4">Close</p>
                                        <p>Sunday/Public Holidays</p>

                                    </div>
                                    
                                </div>
                            </div>
                            {/* Reservation Card */}
                            <div className="space-y-2 bg-white rounded-2xl p-4 shadow-md">
                                <h2 className="text-xl text-blue-500 font-semibold">Honiara Travel Center</h2>
                                <div className="text-gray-700 space-y-1">
                                    {/* Phone */}
                                    <p className="text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path></svg>
                                        177 (local call)
                                    </p>
                                    {/* Email */}
                                    <p className="text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                        sales@flysolomons.com.sb
                                    </p>
                                    {/* Address */}
                                    <p className="text-sm mb-4 flex">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className=" mr-2 w-5 h-5"  fill="#212061" viewBox="0 0 256 256"><path d="M248,208H232V96a8,8,0,0,0,0-16H184V48a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16V208H24a8,8,0,0,0,0,16H248a8,8,0,0,0,0-16ZM216,96V208H184V96ZM56,48H168V208H144V160a8,8,0,0,0-8-8H88a8,8,0,0,0-8,8v48H56Zm72,160H96V168h32ZM72,80a8,8,0,0,1,8-8H96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,80Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H128A8,8,0,0,1,120,80ZM72,120a8,8,0,0,1,8-8H96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,120Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H128A8,8,0,0,1,120,120Z"></path></svg>
                                        </span>
                                        <span>
                                            Solomon Airlines Sales Office<br/>
                                            Mendana Avenue<br/> 
                                            Point Cruz
                                        </span>
                                        
                                    </p>
                                    <hr/>
                                    <div id="businessHours" className="text-sm">
                                        <p className="font-semibold text-xs bg-blue-50 text-blue-500 p-1 rounded-md text-center w-1/4 my-4">Open</p>
                                        <p className="my-1">Monday-Friday: 0800 - 1600</p>
                                        <p>Saturday: 08100 - 1200</p>
                                        <p className="font-semibold text-xs bg-blue-50 text-blue-500 p-1 w-1/4 rounded-md text-center my-4">Close</p>
                                        <p>Sunday/Public Holidays</p>

                                    </div>
                                    
                                </div>
                            </div>

                            {/* Reservation Card */}
                            <div className="space-y-2 bg-white rounded-2xl p-4 shadow-md">
                                <h2 className="text-xl text-blue-500 font-semibold">International</h2>
                                <div className="text-gray-700 space-y-1">
                                    {/* Phone Aus*/}
                                    <p className="text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path></svg>
                                        1300 894311 (Australia)
                                    </p>
                                    {/* Phone Fiji*/}
                                    <p className="text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path></svg>
                                        +6792298840 (Fiji)
                                    </p>
                                    {/* Phone New Zealand*/}
                                    <p className="text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path></svg>
                                        +61738605883 (International)
                                    </p>
                                    {/* Email */}
                                    <p className="text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                    reservations@flysolomons.com
                                    </p>
                                    
                                    <hr/>
                                    <div id="businessHours" className="text-sm">
                                        <p className="font-semibold text-xs bg-blue-50 text-blue-500 p-1 rounded-md text-center w-1/4 my-4">Open</p>
                                        <p className="my-1">Monday-Saturday: 0800 - 1800</p>
                                        <p>Sunday: 08100 - 1200</p>
                                        <p className="font-semibold text-xs bg-blue-50 text-blue-500 p-1 w-1/4 rounded-md text-center my-4">Close</p>
                                        <p>Sunday/Public Holidays</p>

                                        <p className="my-2">*Based on Solomon Islands Time (GMT +11)</p>

                                    </div>
                                    
                                </div>
                            </div>

                            {/* Reservation Card */}
                            <div className="space-y-2 bg-white rounded-2xl p-4 shadow-md">
                                <h2 className="text-xl text-blue-500 font-semibold">Solomon Holidays</h2>
                                <div className="text-gray-700 space-y-1">
                                    {/* Phone Aus*/}
                                    <p className="text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path></svg>
                                        +677 36362
                                    </p>
                                   
                                    {/* Email */}
                                    <p className="text-sm mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                        holidays@flysolomons.com
                                    </p>
                                    
                                    <hr/>
                                    <div id="businessHours" className="text-sm">
                                        <p className="font-semibold text-xs bg-blue-50 text-blue-500 p-1 rounded-md text-center w-1/4 my-4">Open</p>
                                        <p className="my-1">Monday-Friday: 0800 - 1600</p>
                                        <p className="font-semibold text-xs bg-blue-50 text-blue-500 p-1 w-1/4 rounded-md text-center my-4">Close</p>
                                        <p>Weekends/Public Holidays</p>

                                    </div>
                                    
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Group Booking */}
                    <div id="groupBookings" className="space-y-2 mb-16">
                        <div className="mb-8">
                            <h2 className="text-blue-500 font-bold text-2xl md:text-3xl lg:text-4xl md:font-semibold lg:font-semibold">Group Bookings</h2>
                            <p className="text-gray-800 mt-3">
                                Want to enquire or make a booking for your group? Please contact our Groups team who will be happy to provide a quote and make a booking for you. Please include number of passengers, travel dates and departure & arrival cities in your enquiry. 
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-gray-800 bg-white rounded-2xl p-4">
                                <h2 className="bg-blue-50 text-blue-500 p-1 w-2/4 rounded-md text-left my-4">Solomon Islands</h2>
                                <p>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                    groups_si@flysolomons.com.sb
                                </p>
                            </div>
                            <div className="text-gray-800 bg-white rounded-2xl p-4">
                                <h2 className="bg-blue-50 text-blue-500 p-1 w-1/4 rounded-md text-left my-4">Australia</h2>
                                <p>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                    groups@flysolomons.com
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cargo */}
                    <div id="cargo" className="space-y-2 mb-16">
                        <div className="mb-8">
                            <h2 className="text-blue-500 font-bold text-2xl md:text-3xl lg:text-4xl md:font-semibold lg:font-semibold">Cargo</h2>
                            <p className="text-gray-800 mt-3">
                                we fly your cargo world wide, 
                            </p>
                        </div>
                        <div className="grid grid-cols-3  gap-3">
                            <div className="text-gray-800 bg-white rounded-2xl p-4">
                                <h2>Australia</h2>
                                <p>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                    cargo@flysolomons.com
                                </p>
                            </div>
                            <div className="text-gray-800 bg-white rounded-2xl p-4">
                                <h2>Australia</h2>
                                <p> <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                    groups@flysolomons.com
                                </p>
                            </div>
                            <div className="text-gray-800 bg-white rounded-2xl p-4">
                                <h2>Australia</h2>
                                <p>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                    groups@flysolomons.com
                                </p>
                            </div>
                            <div className="text-gray-800 bg-white rounded-2xl p-4">
                                <h2>Australia</h2>
                                <p>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                    groups@flysolomons.com
                                </p>
                            </div>
                            <div className="text-gray-800 bg-white rounded-2xl p-4">
                                <h2>Australia</h2>
                                <p>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                    groups@flysolomons.com
                                </p>
                            </div>
                            
                        </div>
                    </div>


                    {/* Global Sales Agents */}
                   
                    <div id="globalSalesAgents" className="space-y-2 mb-16">
                        <div className="mb-8">
                            <h2 className="text-blue-500 font-bold text-2xl md:text-3xl lg:text-4xl md:font-semibold lg:font-semibold">Global Sales Agents</h2>
                            <p className="text-gray-800 mt-3">
                                we fly your cargo world wide, 
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-gray-800 bg-white rounded-2xl p-4">
                                <h2>Solomon Islands</h2>
                                <p>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                     groups_si@flysolomons.com.sb
                                </p>
                            </div>
                            <div className="text-gray-800 bg-white rounded-2xl p-4">
                                <h2>Australia</h2>
                                <p>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                     groups@flysolomons.com
                                </p>
                            </div>
                            <div className="text-gray-800 bg-white rounded-2xl p-4">
                                <h2>Australia</h2>
                                <p> 
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                    groups@flysolomons.com
                                </p>
                            </div>
                            <div className="text-gray-800 bg-white rounded-2xl p-4">
                                <h2>Australia</h2>
                                <p>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                    groups@flysolomons.com
                                </p>
                            </div>
                            <div className="text-gray-800 bg-white rounded-2xl p-4">
                                <h2>Australia</h2>
                                <p> 
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                    groups@flysolomons.com
                                </p>
                            </div>
                            
                        </div>
                    </div>

                    {/* Baggage Service Section*/}
                    <div id="baggageService" className="space-y-2 mb-16">
                        <div className="mb-8">
                            <h2 className="text-blue-500 font-bold text-2xl md:text-3xl lg:text-4xl md:font-semibold lg:font-semibold">Baggage Services</h2>
                            <p className="text-gray-800 mt-3">
                            For assistance with checked baggage including lost or damaged baggage, please send an email to  
                            </p>
                            <div className="text-gray-800 bg-white rounded-2xl p-4 mt-2">
                           
                                <p>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                    baggage.services@flysolomons.com.sb
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Feedback Service Section */}
                    <div id="baggageService" className="space-y-2 mb-16">
                        <div className="mb-8">
                            <h2 className="text-blue-500 font-bold text-2xl md:text-3xl lg:text-4xl md:font-semibold lg:font-semibold">Feedbacks</h2>
                            <p className="text-gray-800 mt-3">
                                If you wish to share feedback with us, please don't hesitate to email  
                            </p>
                            <div className="text-gray-800 bg-white rounded-2xl p-4 mt-2">
                           
                                <p> <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2" width="20" height="20" fill="#212061" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                    customercare@flysolomons.com
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </Container>

            {/* Contact form  Section */}
      
            <div
        className="relative h-[300px] sm:h-[400px] lg:h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            "/hero.jpg"
          })`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="text-center text-white px-4 sm:px-6 lg:px-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 lg:mb-6">
              Reach out to us now?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-8 leading-relaxed">
              contact us now with the awesome button below
            </p>
            <div className="space-x-2 sm:space-x-4 lg:space-x-4">
              <button
                onClick={openModal}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 lg:py-3 px-6 sm:px-8 lg:px-8 rounded-full transition-colors duration-300 text-sm sm:text-base lg:text-base"
              >
                Enquire
              </button>
            </div>
          </div>
        </div>
      </div>
      
            {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full md:w-full lg:w-[800px] mx-4 relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-blue-500 mb-4">
                Your Enquiry
              </h2>
              <ContactForm />
            </div>
          </div>
        )}
            </div>
            {/* Page Content End */}
        </>
    );
}
"use client"

import { useState } from "react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

export default function ContactForm(){
 
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
    };  
    
    return(
        <form onSubmit={handleSubmit}>
            
           
            {/* Subject Input */}
            <div className="px-6 py-3 border-2 rounded-md border-gray-100 mb-2">
                   <label className="block text-left text-xs text-gray-400 font-semibold">
                     Subject
                   </label>
                   <input
                     type="text"
                     name="subject"
                     placeholder="Nature of your Enquiry"
                     className="w-full text-sm outline-none text-gray-700"
                     onChange={handleChange}
                   />
                   {/* Icon */}
                   <div className="float-right">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                        <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H156.69A15.86,15.86,0,0,0,168,219.31L219.31,168A15.86,15.86,0,0,0,224,156.69V48A16,16,0,0,0,208,32ZM48,48H208V152H160a8,8,0,0,0-8,8v48H48ZM196.69,168,168,196.69V168Z"></path>
                      </svg>
                   </div>
                   {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>

            {/* Full Name Input */}
            <div className="px-6 py-3 border-2 rounded-md border-gray-100 mb-2">
                 <label className="block text-left text-xs text-gray-400 font-semibold">
                   Full name
                 </label>
                 <input
                   type="text"
                   name="fullname"
                   placeholder="Your full Name"
                   className="w-full text-sm outline-none text-gray-700"
                   onChange={handleChange}
                 />
                 {/* Icon */}
                 <div className="float-right">
                   <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                     <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                   </svg>
                 </div>
                 {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
            </div>

            {/* Email Input */}
            <div className="px-6 py-3 border-2 rounded-md border-gray-100 mb-2">
                 <label className="block text-left text-xs text-gray-400 font-semibold">
                   Email
                 </label>
                 <input
                   type="text"
                   name="fullname"
                   placeholder="Your email address so that we can reply to you"
                   className="w-full text-sm outline-none text-gray-700"
                   onChange={handleChange}
                 />
                 {/* Icon */}
                 <div className="float-right">
                 
                   <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                   <path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                   </svg>
                 </div>
                 {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
            </div>

            {/* Phone/Mobile Input */}
            <div className="px-6 py-3 border-2 rounded-md border-gray-100 mb-2">
                 <label className="block text-left text-xs text-gray-400 font-semibold">
                   Phone/Mobile
                 </label>
                 <input
                   type="text"
                   name="phonemobile"
                   placeholder="your phone/mobile number"
                   className="w-full text-sm outline-none text-gray-700"
                   onChange={handleChange}
                 />
                 {/* Icon */}
                 <div className="float-right">
                 
                   <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                   <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path>
                   </svg>
                 </div>
                 {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
            </div>

            {/* Message Input */}
            <div className="px-6 py-3 border-2 rounded-md border-gray-100 mb-3">
                 <label className="block text-left text-xs text-gray-400 font-semibold">
                   Message
                 </label>
                 <textarea
                  
                   name="message"
                   placeholder="describe your enquiry"
                   className="w-full text-sm outline-none text-gray-700 h-[130px]"
                  
                 />
                 {/* Icon */}
                 <div className="float-right">
                 
                   <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#9e9e9e" viewBox="0 0 256 256" className="absolute -mt-2 pr-2">
                   <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"></path>
                   </svg>
                 </div>
                 {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
            </div>
            
            {/* Submit button */}
            <PrimaryButton text="Submit" />
            
        </form>
    )
    
    
    
}
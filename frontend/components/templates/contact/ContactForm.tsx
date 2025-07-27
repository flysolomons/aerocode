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
                       <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
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
                     <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
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
                     <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
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
                     <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                   </svg>
                 </div>
                 {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
            </div>
            
            {/* Submit button */}
            <PrimaryButton text="Submit" />
            
        </form>
    )
    
    
    
}
"use client"
import { useRouter } from 'next/navigation';
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useMembershipStore } from '@/lib/store';

interface MembershipCardProps {
  title: string;
  price: string;
  features: string; // HTML content from RichTextBlock
  signUpUrl: string;
  isPopular: boolean;
  key?: number
  index: number
}

function MembershipCard({
  title,
  price,
  features,
  signUpUrl,
  isPopular,
  key,
  index
}: MembershipCardProps) {

  //TODO: create a util function for this in the util file
  const itemData = useMemo(() => {

    // Return empty array if not in browser (server-side)
    if (typeof window === "undefined") return [];
    const parser = new DOMParser();
    const featureData = parser.parseFromString(features, "text/html");
    const listItems = featureData.querySelectorAll("li");
    const items: string[] = [];
    
    listItems.forEach((item) => {
      const text = item.textContent?.trim();
      if (text) items.push(text); 
    });
    
    return items;
  }, [features]); // Recompute only if features changes

  //store Membership data on Click
  const router = useRouter();
  const { setMembership } = useMembershipStore();

  const handleClick = () => {
    // Store membership data
    setMembership({ price,key:index, title });
    // Navigate to sign-up page
    router.push(signUpUrl);
  };

  return (
    
    <>
      
      <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-3xl overflow-hidden w-full h-full shadow-md p-4 sm:p-6 lg:p-6 flex flex-col justify-between border-solid border-2 border-gray-50  bg-[url(/traditional_ring.png)]">
        <div className="space-y-6 sm:space-y-8 lg:space-y-8">
          {isPopular? (<span className="bg-yellow-300 px-4 py-2 rounded-full  text-blue-500 text-sm hover:bg-yellow-400 hover:text-blue-400">Most popular</span>) : ''}
          <div className="space-y-2 sm:space-y-6 lg:space-y-2 text-center">  
            <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold text-blue-500 break-words">
              {title}
            </h3>
            
            <p className="text-2xl sm:text-3xl lg:text-3xl font-bold font-sans">
              SBD {price}
              <span className="text-base sm:text-lg lg:text-lg font-normal">
                /year
              </span>
            </p>
          </div>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
          <div className="space-y-2 sm:space-y-4 lg:space-y-2">
            <p className="text-center text-xs sm:text-sm lg:text-sm font-light">
              This package includes...
            </p>
            {features && features.trim() ? (
              <div
                className="text-sm sm:text-base lg:text-base space-y-1 sm:space-y-0 lg:space-y-0 text-gray-500"
                
                
              >   
              <ul>
                  {itemData.map((item, i) => (
                    <li key={i} className="text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline-block pr-1" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
<linearGradient id="SVGID_1__8tZkVc2cOjdg_gr1" x1="37.081" x2="10.918" y1="10.918" y2="37.081" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#60fea4"></stop><stop offset=".033" stopColor="#6afeaa"></stop><stop offset=".197" stopColor="#97fec4"></stop><stop offset=".362" stopColor="#bdffd9"></stop><stop offset=".525" stopColor="#daffea"></stop><stop offset=".687" stopColor="#eefff5"></stop><stop offset=".846" stopColor="#fbfffd"></stop><stop offset="1" stopColor="#fff"></stop></linearGradient><circle cx="24" cy="24" r="18.5" fill="url(#SVGID_1__8tZkVc2cOjdg_gr1)"></circle><path fill="none" stroke="#10e36c" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3" d="M35.401,38.773C32.248,41.21,28.293,42.66,24,42.66C13.695,42.66,5.34,34.305,5.34,24	c0-2.648,0.551-5.167,1.546-7.448"></path><path fill="none" stroke="#10e36c" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3" d="M12.077,9.646C15.31,6.957,19.466,5.34,24,5.34c10.305,0,18.66,8.354,18.66,18.66	c0,2.309-0.419,4.52-1.186,6.561"></path><polyline fill="none" stroke="#10e36c" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3" points="16.5,23.5 21.5,28.5 32,18"></polyline>
</svg>
                       {item}
                    </li>
                  ))}

              </ul>
                           
              </div>
            ) : (
              <ul className="list-disc list-inside mt-2 text-sm sm:text-base lg:text-base space-y-1 sm:space-y-0 lg:space-y-0 text-left text-gray-700">
                <li className="text-gray-500">Priority check-in</li>
                <li><span><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#8092c6" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg></span>Preferential seating at check-in</li>
                <li>Express clearance in Brisbane</li>
                <li>Belama Lounge access in Honiara</li>
                <li>Benefits apply for the member + 1 guest</li>
              </ul>
            )}
          </div>
        </div>

        <div className="mt-4 sm:mt-6 lg:mt-0">
        <motion.button
            
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => console.log("find out more is hovered!")}
            className="inline-flex h-11 items-center gap-2 text-slate-200 text-xs sm:text-sm hover:text-slate-300 bg-blue-500 px-3 py-2 sm:px-4 sm:py-2 rounded-full hover:bg-blue-400 transition duration-300 whitespace-nowrap w-full justify-center"
            onClick={handleClick}
          >
            Sign up now 
          </motion.button>
          
        </div>
      </div>
    </>
    
  );
}

export default MembershipCard;

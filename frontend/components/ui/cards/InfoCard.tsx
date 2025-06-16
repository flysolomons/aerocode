import React from "react";
import { stripHtmlTags } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface InfoCardProps {
  title: string;
  description: string;
  svg: string;
  url: string;
}

function InfoCard({ title, description, svg, url }: InfoCardProps) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-300 transition-transform hover:scale-105">
      <div className="flex items-start gap-3">
        <div dangerouslySetInnerHTML={{ __html: svg }} />
        {/* <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div> */}

        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-semibold text-blue-500">{title}</h3>
          <p className="mt-1">{stripHtmlTags(description)}</p>
          <motion.a
            href={url}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => console.log("find out more is hovered!")}
            className="mt-2 flex text-slate-200 text-sm hover:text-slate-300 bg-blue-500 px-4 py-2 rounded-full w-1/2 hover:bg-blue-400 transition duration-300"
          >
            Find out more
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#e0e0e0"
              viewBox="0 0 256 256"
            >
              <path d="M128,136v64a8,8,0,0,1-16,0V155.32L45.66,221.66a8,8,0,0,1-11.32-11.32L100.68,144H56a8,8,0,0,1,0-16h64A8,8,0,0,1,128,136ZM208,32H80A16,16,0,0,0,64,48V96a8,8,0,0,0,16,0V48H208V176H160a8,8,0,0,0,0,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Z"></path>
            </svg>
          </motion.a>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;

import React from "react";

interface InfoCardProps {
  title: string;
  description: string;
}

function InfoCard({ title, description }: InfoCardProps) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-300">
      <div className="flex items-start gap-3">
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
          <p className="mt-1">{description}</p>
          <a
            href="#"
            className="mt-2 inline-block text-blue-400 hover:text-blue-700"
          >
            Find out more
          </a>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;

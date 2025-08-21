"use client";
import React from "react";

const CallToActionSection = () => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero.jpg')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-edmondsans text-white mb-6 sm:mb-8 px-4">
            Come Find Your Wings with Us!
          </h2>
          <div className="flex justify-center">
            <a
              href="https://www.linkedin.com/company/solomon-airlines"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors text-center inline-block text-sm sm:text-base"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;

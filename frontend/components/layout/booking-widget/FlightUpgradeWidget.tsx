"use client";
import { useState, useEffect } from "react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

export default function FlightUpgradeWidget() {
  const [lastName, setLastName] = useState("");
  const [recordLocator, setRecordLocator] = useState("");

  // Load jQuery, jQuery UI, and then Plusgrade script
  useEffect(() => {
    const jquerySrc = "https://code.jquery.com/jquery-3.7.1.min.js";
    const jqueryUISrc = "https://code.jquery.com/ui/1.14.0/jquery-ui.min.js";
    const jqueryUICSS =
      "https://code.jquery.com/ui/1.14.0/themes/ui-lightness/jquery-ui.css";
    const offerId = process.env.NEXT_PUBLIC_PLUSGRADE_OFFER_PID;

    console.log(offerId);
    if (!offerId) {
      console.error("NEXT_PUBLIC_PLUSGRADE_OFFER_PID is not configured");
      return;
    }

    const scriptSrc = `https://upgrade.plusgrade.com/offer/${offerId}/eligibility/lookup.js`;
    console.log("Loading Plusgrade script:", scriptSrc);

    // Load jQuery UI CSS
    if (!document.querySelector(`link[href="${jqueryUICSS}"]`)) {
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = jqueryUICSS;
      document.head.appendChild(cssLink);
    }

    // Check if jQuery and jQuery UI are already loaded
    if ((window as any).jQuery && (window as any).jQuery.ui) {
      console.log("jQuery and jQuery UI already loaded");
      loadPlusgradeScript(scriptSrc);
      return;
    }

    // Load jQuery first
    const jqScript = document.createElement("script");
    jqScript.type = "text/javascript";
    jqScript.src = jquerySrc;
    jqScript.async = true;

    jqScript.onload = () => {
      console.log("jQuery loaded successfully");
      loadJQueryUI();
    };

    jqScript.onerror = () => {
      console.error("Failed to load jQuery");
    };

    document.head.appendChild(jqScript);

    function loadJQueryUI() {
      const jqUIScript = document.createElement("script");
      jqUIScript.type = "text/javascript";
      jqUIScript.src = jqueryUISrc;
      jqUIScript.async = true;

      jqUIScript.onload = () => {
        console.log("jQuery UI loaded successfully");
        loadPlusgradeScript(scriptSrc);
      };

      jqUIScript.onerror = () => {
        console.error("Failed to load jQuery UI");
      };

      document.head.appendChild(jqUIScript);
    }

    function loadPlusgradeScript(src: string) {
      // Check if Plusgrade script is already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        console.log("Plusgrade script already loaded");
        return;
      }

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = src;
      script.async = true;

      script.onload = () => {
        console.log("Plusgrade script loaded successfully");
      };

      script.onerror = () => {
        console.error("Failed to load Plusgrade script");
      };

      document.head.appendChild(script);
    }

    return () => {
      // Cleanup scripts and CSS on unmount
      const existingJq = document.querySelector(`script[src="${jquerySrc}"]`);
      if (existingJq) {
        document.head.removeChild(existingJq);
      }
      const existingJqUI = document.querySelector(
        `script[src="${jqueryUISrc}"]`
      );
      if (existingJqUI) {
        document.head.removeChild(existingJqUI);
      }
      const existingCSS = document.querySelector(`link[href="${jqueryUICSS}"]`);
      if (existingCSS) {
        document.head.removeChild(existingCSS);
      }
      const existingScript = document.querySelector(
        `script[src="${scriptSrc}"]`
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-md mb-6 sm:mb-8 lg:mb-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-500 mb-2 sm:mb-4 text-center">
          Upgrade Your Flight
        </h2>
        <p className=" text-sm sm:text-base text-gray-500 text-left mb-6 sm:mb-8">
          If you have purchased a Solomon Airlines ticket more than 48 hours
          ago, please enter your details here to upgrade your flight.
        </p>

        <form id="pg_offering" className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Booking Reference Input */}
            <div className="px-6 py-3 border-2 rounded-md border-gray-100 ">
              <label className="block text-left text-xs text-gray-600 font-semibold">
                Booking Reference
              </label>
              <input
                type="text"
                name="pg_recordLocator"
                value={recordLocator}
                onChange={(e) => setRecordLocator(e.target.value)}
                placeholder="Usually found on your ticket"
                className="w-full text-sm outline-none text-gray-700"
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
            <div className="px-6 py-3 border-2 rounded-md border-gray-100 ">
              <label className="block text-left text-xs text-gray-600 font-semibold">
                Last Name
              </label>
              <input
                type="text"
                name="pg_lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="enter your last name"
                className="w-full text-sm outline-none text-gray-700"
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

          {/* Hidden Plusgrade fields */}
          <input
            name="pg_apiKey"
            value={process.env.NEXT_PUBLIC_PLUSGRADE_API_KEY}
            type="hidden"
          />
          <input name="pg_language" value="" type="hidden" />

          <div className="flex justify-center pt-2 sm:pt-4">
            <PrimaryButton text="Check Offers" type="submit" name="pg_submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

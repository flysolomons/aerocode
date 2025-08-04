type FlightInfoCardProps = {
  departureAirport: string;
  departureAirportCode: string;
  arrivalAirport: string;
  arrivalAirportCode: string;
};

export default function FlightInfoCard({
  departureAirport,
  departureAirportCode,
  arrivalAirport,
  arrivalAirportCode,
}: FlightInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl lg:rounded-3xl p-4 sm:p-6 lg:p-6 shadow-md w-full">      
      <div className="space-y-3 sm:space-y-4 lg:space-y-4">
        <div className="flex justify-between sm:grid sm:grid-cols-2 lg:grid-cols-2 border-b pb-3 sm:pb-4 lg:pb-4">
          <div className="font-medium text-sm sm:text-base lg:text-base text-gray-600 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4B5563" className="inline mr-2" viewBox="0 0 256 256"><path d="M176,216a8,8,0,0,1-8,8H24a8,8,0,0,1,0-16H168A8,8,0,0,1,176,216ZM247.86,93.15a8,8,0,0,1-3.76,5.39l-147.41,88a40.18,40.18,0,0,1-20.26,5.52,39.78,39.78,0,0,1-27.28-10.87l-.12-.12L13,145.8a16,16,0,0,1,4.49-26.21l3-1.47a8,8,0,0,1,6.08-.4l28.26,9.54L75,115.06,53.17,93.87A16,16,0,0,1,57.7,67.4l.32-.13,7.15-2.71a8,8,0,0,1,5.59,0L124.7,84.38,176.27,53.6a39.82,39.82,0,0,1,51.28,9.12l.12.15,18.64,23.89A8,8,0,0,1,247.86,93.15Zm-19.74-3.7-13-16.67a23.88,23.88,0,0,0-30.68-5.42l-54.8,32.72a8.06,8.06,0,0,1-6.87.64L68,80.58l-4,1.53.21.2L93.57,110.8a8,8,0,0,1-1.43,12.58L59.93,142.87a8,8,0,0,1-6.7.73l-28.67-9.67-.19.1-.37.17a.71.71,0,0,1,.13.12l36,35.26a23.85,23.85,0,0,0,28.42,3.18Z"></path></svg>  
            Departure Airport
          </div>
          <div className="text-sm sm:text-base lg:text-base text-right sm:text-left break-words bg-slate-50 rounded-sm w-1/4 p-2 text-gray-500">{departureAirport}</div>
        </div>

        <div className="flex justify-between sm:grid sm:grid-cols-2 lg:grid-cols-2 border-b pb-3 sm:pb-4 lg:pb-4">
          <div className="font-medium text-sm sm:text-base lg:text-base text-gray-600 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4B5563" className="inline mr-2" viewBox="0 0 256 256"><path d="M229.11,70.82A16,16,0,0,0,216,64H136V32h16a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16h16V64H40A16,16,0,0,0,25,85.47l26.19,72a16,16,0,0,0,15,10.53H96v64a8,8,0,0,0,16,0V168h32v64a8,8,0,0,0,16,0V168h29.82a16,16,0,0,0,15-10.53l26.19-72A16,16,0,0,0,229.11,70.82ZM110.68,152,97.58,80h60.84l-13.1,72ZM40,80H81.32l13.09,72H66.18Zm149.82,72H161.59l13.09-72H216Z"></path></svg>
            Departure Airport Code
          </div>
          <div className="text-sm sm:text-base lg:text-base text-right sm:text-left font-mono bg-slate-50 rounded-sm w-1/4 p-2 text-gray-500">{departureAirportCode}</div>
        </div>

        <div className="flex justify-between sm:grid sm:grid-cols-2 lg:grid-cols-2 border-b pb-3 sm:pb-4 lg:pb-4">
          <div className="font-medium text-sm sm:text-base lg:text-base text-gray-700 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4b5563" className="inline mr-2" viewBox="0 0 256 256"><path d="M256,216a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16H248A8,8,0,0,1,256,216Zm-26.16-24.3L53.21,142.24A40.12,40.12,0,0,1,24,103.72V48A16,16,0,0,1,45.06,32.82l5.47,1.82a8,8,0,0,1,5,4.87L66.13,68.88,96,77.39V48a16,16,0,0,1,21.06-15.18l5.47,1.82a8,8,0,0,1,4.85,4.5l22.5,53.63,60.84,17A40.13,40.13,0,0,1,240,148.32V184a8,8,0,0,1-10.16,7.7ZM224,148.32a24.09,24.09,0,0,0-17.58-23.13l-64.57-18a8,8,0,0,1-5.23-4.61L114,48.67,112,48V88a8,8,0,0,1-10.19,7.7l-44-12.54a8,8,0,0,1-5.33-5L41.79,48.59,40,48v55.72a24.09,24.09,0,0,0,17.53,23.12L224,173.45Z"></path></svg>
            Arrival Airport
          </div>
          <div className="text-sm sm:text-base lg:text-base text-right sm:text-left break-words bg-slate-50 rounded-sm w-1/4 p-2 text-gray-500">{arrivalAirport}</div>
        </div>

        <div className="flex justify-between sm:grid sm:grid-cols-2 lg:grid-cols-2">
          <div className="font-medium text-sm sm:text-base lg:text-base text-gray-700 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4B5563" className="inline mr-2" viewBox="0 0 256 256"><path d="M229.11,70.82A16,16,0,0,0,216,64H136V32h16a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16h16V64H40A16,16,0,0,0,25,85.47l26.19,72a16,16,0,0,0,15,10.53H96v64a8,8,0,0,0,16,0V168h32v64a8,8,0,0,0,16,0V168h29.82a16,16,0,0,0,15-10.53l26.19-72A16,16,0,0,0,229.11,70.82ZM110.68,152,97.58,80h60.84l-13.1,72ZM40,80H81.32l13.09,72H66.18Zm149.82,72H161.59l13.09-72H216Z"></path></svg>
            Arrival Airport Code
          </div>
          <div className="text-sm sm:text-base lg:text-base text-right sm:text-left font-mono bg-slate-50 rounded-sm w-1/4 p-2 text-gray-500">{arrivalAirportCode}</div>
        </div>
      </div>
    </div>
  );
}

export default function SignUP() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
      <div className="text-center space-y-2 sm:space-y-3">
        <h2 className="text-base sm:text-lg lg:text-xl font-medium text-slate-200">
          Stay up to date
        </h2>
        <p className="text-xs sm:text-sm text-indigo-300 leading-relaxed max-w-md mx-auto">
          Sign up to our newsletter and stay in touch with our news
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto">
        <div className="flex-1 flex items-center relative border-2 border-indigo-300 rounded-full pl-3 sm:pl-4 text-indigo-200 transition duration-300 ease focus-within:border-indigo-700 hover:border-cyan-100 shadow-sm focus-within:shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
          <input
            className="flex-1 bg-transparent placeholder:text-indigo-200 text-indigo-300 text-sm sm:text-base px-3 py-2 sm:py-3 focus:outline-none min-w-0"
            placeholder="Enter your email address..."
            type="email"
          />
        </div>
        <button className="bg-indigo-900 rounded-full w-full sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14 flex items-center justify-center hover:bg-indigo-700 transition duration-500 active:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-blue-600">
          <span className="text-sm font-medium text-white sm:hidden">
            Sign Up
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            className="hidden sm:block sm:w-6 sm:h-6 lg:w-7 lg:h-7"
            fill="#fafafa"
            viewBox="0 0 256 256"
          >
            <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

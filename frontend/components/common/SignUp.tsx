export default function SignUP() {
  return (
    <div className="grid grid-rows-2 items-center justify-center m-16 mt-8">
      <h2 className="row-auto text-center text-slate-200">Stay up to update</h2>
      <p className="text-xs text-center text-indigo-300 m-2">
        Sign up to our news lettter and stay in touch with our news
      </p>
      <div className="row-auto flex">
        <div className="w-full flex justify-end items-center relative border-2 border-indigo-300 rounded-full pl-2 mr-2 text-indigo-200 transition duration-300 ease  focus:border-indigo-700 hover:border-cyan-100 shadow-sm focus:shadow ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
            />
          </svg>
          <input
            className=" w-96 bg-transparent placeholder:text-indigo-200 text-indigo-300 text-sm  px-3 py-2 mr-3 focus:outline-none"
            placeholder="type your email address..."
          ></input>
        </div>
        <button className="bg-indigo-900 rounded-full w-24 h-10 justify-items-center hover:bg-indigo-700 transition duration-500 active:bg-lime-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
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

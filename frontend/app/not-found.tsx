"use client";
import { LottiePlayer } from "lottie-web";
import { useEffect, useRef, useState } from "react";

export default function NotFound() {
  const ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    import("lottie-web").then((Lottie) => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/lotties/lf_plane_stuck.json",
      });

      return () => animation.destroy();
    }
  }, [lottie]);

  return (
    <div className="min-h-scree flex flex-col justify-center h-svh items-center text-slate-500 bg-[url('/404.png')] bg-cover">
      <div className="h-auto bg-white justify-items-center p-10 rounded-lg animate__animated animate__fadeInUp">
        <div w-20 items-end ref={ref}></div>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
      </div>

      <a
        className="p-4 m-3 bg-orange-400 rounded-full text-orange-800 hover:bg-orange-500 hover:text-white animate__animated animate__fadeInUp"
        href="/"
      >
        Make a booking instead?
      </a>
    </div>
  );
}

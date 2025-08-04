
import PrimaryButton
 from "@/components/ui/buttons/PrimaryButton";
interface ReadyToFlyProps {
  buttonText: string;
  description?: string;
}
export default function ReadyToFly({
    buttonText,
    description
}: ReadyToFlyProps) {
  return (
    <>
      {/* Ready to fly section */}
      <div className="text-center space-y-6 py-14 rounded-2xl border-4 border-white bg-[url('https://images.pexels.com/photos/1058959/pexels-photo-1058959.jpeg')] bg-cover  bg-center ">
            <h2 className="text-4xl sm:text-xl lg:text-5xl font-semibold text-white">
              Ready to Fly?
            </h2>
            {description && (<p className="text-white">{description}</p>)}
            <div className="m-auto w-3/4 lg:flex lg:justify-center">
            
              <PrimaryButton
                text={buttonText}
                onClick={() => {
                  const widget = document.querySelector(
                    ".stripped-booking-widget"
                  );
                  if (widget) {
                    widget.scrollIntoView({ behavior: "smooth" });
                  } else {
                    // Fallback to scroll to top where the hero with booking widget is
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              />

              
            </div>
        </div>
    </>
  );
}

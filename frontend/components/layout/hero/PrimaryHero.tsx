// props: card title, image

import BookingWidget from "../booking-widget/BookingWidget";
import StrippedBookingWidget from "../booking-widget/StrippedBookingWidget";

interface PrimaryHeroProps {
  title: string;
  image: string;
  breadcrumbs?: string;
  widget?: string;
  showBookingWidget?: boolean;
}

export default function PrimaryHero({
  title,
  image,
  breadcrumbs,
  widget,
  showBookingWidget = true,
}: PrimaryHeroProps) {
  return (
    <main>
      <div className="relative">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
          <div className="absolute inset-0 bg-black/15"></div>
        </div>

        <div className="relative h-[calc(100vh)]">
          <div className="relative flex flex-col items-center justify-center h-1/2 text-white text-center">
            <h1 className="text-5xl font-bold mb-4">{title}</h1>
          </div>
          {showBookingWidget && (
            <>
              {widget === "stripped" ? (
                <StrippedBookingWidget />
              ) : (
                <BookingWidget />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

import DestinationCard from "../common/DestinationCard";

function Recommendations() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl text-center font-bold text-blue-500">
        Our Destinations
      </h2>

      <div className="grid grid-cols-3 gap-4 h-[25rem]">
        <DestinationCard title="Port Vila, Vanuatu" image="/image.jpg" />

        <div className="space-y-4 h-full">
          <div className="h-[12rem]">
            <DestinationCard title="Port Moresby, PNG" image="/image.jpg" />
          </div>

          <div className="h-[12rem]">
            <DestinationCard title="Nadi, Fiji" image="/image.jpg" />
          </div>
        </div>

        <DestinationCard title="Brisbane, Australia" image="/image.jpg" />
      </div>
    </div>
  );
}

export default Recommendations;

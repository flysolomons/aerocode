import RouteSpecial from "../common/RouteSpecialCard";

interface RouteSpecialSectionProps {
  heading: string;
  description: string;
}
export default function RouteSpecialSection({
  heading,
  description,
}: RouteSpecialSectionProps) {
  return (
    <>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl text-center font-bold text-blue-500">
            {heading}
          </h2>
          <span className="block text-center">{description}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 h-64">
          <RouteSpecial
            route="Honiara to Auckland"
            price="$650AUD"
            image="/image.jpg"
            specialName="Early Bird Sale"
          />
          <RouteSpecial
            route="Honiara to Auckland"
            price="$650AUD"
            image="/image.jpg"
            specialName="Early Bird Sale"
          />
          <RouteSpecial
            route="Honiara to Auckland"
            price="$650AUD"
            image="/image.jpg"
            specialName="Early Bird Sale"
          />
        </div>
      </div>
    </>
  );
}

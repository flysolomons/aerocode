import OtherNewsCard from "@/components/ui/cards/OtherNewsCard";

function OtherNewsSection() {
  return (
    <div className="bg-white p-4 shadow-md rounded-3xl">
      <h2 className="text-lg font-semibold text-blue-500 mb-4">
        In Other News
      </h2>
      <div className="space-y-2">
        <OtherNewsCard
          headline="Soar Into New Year Savings with our International Sale"
          image="/image.jpg"
          date="Jan 17th 2025"
        />
        <OtherNewsCard
          headline="Soar Into New Year Savings with our International Sale"
          image="/image.jpg"
          date="Jan 17th 2025"
        />
        <OtherNewsCard
          headline="Soar Into New Year Savings with our International Sale"
          image="/image.jpg"
          date="Jan 17th 2025"
        />
      </div>
    </div>
  );
}

export default OtherNewsSection;

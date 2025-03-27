import OtherNewsCard from "../common/OtherNewsCard";

function OtherNewsSection() {
  return (
    <div>
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

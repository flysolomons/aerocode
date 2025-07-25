import OtherNewsCard from "@/components/ui/cards/OtherNewsCard";

function OtherNewsSection() {
  return (
    <div className="bg-white p-3 sm:p-4 lg:p-6 shadow-md rounded-2xl sm:rounded-3xl w-full">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-500 mb-3 sm:mb-4 lg:mb-6">
        In Other News
      </h2>
      <div className="space-y-3 sm:space-y-4">
        <OtherNewsCard
          headline="International Sale is on!"
          image="/image.jpg"
          date="Jan 17th 2025"
        />
        <OtherNewsCard
          headline="International Sale is on!"
          image="/image.jpg"
          date="Jan 17th 2025"
        />
        <OtherNewsCard
          headline="International Sale is on!"
          image="/image.jpg"
          date="Jan 17th 2025"
        />
      </div>
    </div>
  );
}

export default OtherNewsSection;

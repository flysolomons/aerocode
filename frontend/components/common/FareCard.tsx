type FareCardProps = {
  family: string;
  price: string;
  currency: string;
  direction: string;
};

export default function FareCard({
  family,
  price,
  currency,
  direction,
}: FareCardProps) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-lg w-full h-full">
      <div className="flex flex-col items-center gap-2">
        <span className="text-blue-500 font-semibold text-xl">{family}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-semibold">{price}</span>
          <span className="text-lg font-semibold">{currency}</span>
        </div>
        <p className="text-sm">{direction}</p>
      </div>
    </div>
  );
}

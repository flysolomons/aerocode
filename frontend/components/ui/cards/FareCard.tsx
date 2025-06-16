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
    <div className="bg-white rounded-2xl sm:rounded-3xl lg:rounded-3xl p-3 sm:p-4 lg:p-4 shadow-lg w-full h-full">
      <div className="flex flex-col items-center gap-1 sm:gap-2 lg:gap-2">
        <span className="text-blue-500 font-semibold text-lg sm:text-xl lg:text-xl text-center break-words">
          {family}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-base sm:text-lg lg:text-lg font-semibold">
            {price}
          </span>
          <span className="text-base sm:text-lg lg:text-lg font-semibold">
            {currency}
          </span>
        </div>
        <p className="text-xs sm:text-sm lg:text-sm text-center break-words">
          {direction}
        </p>
      </div>
    </div>
  );
}

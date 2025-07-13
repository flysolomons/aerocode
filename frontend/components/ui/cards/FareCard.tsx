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
  // Format price with commas for thousands
  const formatPrice = (priceString: string): string => {
    // Ensure we have a string to work with
    const priceStr = String(priceString || "");

    // Remove any existing commas and parse as number
    const numericPrice = parseFloat(priceStr.replace(/,/g, ""));

    // If it's a valid number, format with commas
    if (!isNaN(numericPrice)) {
      return numericPrice.toLocaleString();
    }

    // If it's not a valid number, return original string
    return priceStr;
  };

  // Set background color with opacity using rgba
  let bgColor = "rgba(7, 101, 53, 0.6)"; // default #076535
  switch (family) {
    case "Saver":
      bgColor = "rgba(67, 172, 225, 0.6)"; // #43ace1
      break;
    case "Smart":
      bgColor = "rgba(250, 204, 21, 0.6)"; // #facc15
      break;
    case "Flexi":
      bgColor = "rgba(246, 137, 30, 0.6)"; // #f6891e
      break;
    case "Business":
      bgColor = "rgba(7, 101, 53, 0.5)"; // #076535
      break;
    default:
      bgColor = "rgba(153, 71, 29, 0.6)"; // #99471d
  }

  return (
    <div
      className="rounded-2xl sm:rounded-3xl lg:rounded-3xl p-3 sm:p-4 lg:p-4 shadow-lg w-full h-full"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex flex-col items-center gap-1 sm:gap-2 lg:gap-2">
        <span className="text-blue-500 font-semibold text-lg sm:text-xl lg:text-xl text-center break-words">
          {family}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-base sm:text-lg lg:text-lg font-semibold">
            {currency}
          </span>
          <span className="text-base sm:text-lg lg:text-lg">
            {formatPrice(price)}
          </span>
        </div>
        <p className="text-xs sm:text-sm lg:text-sm text-center break-words">
          {direction}
        </p>
      </div>
    </div>
  );
}

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
  let bgColor = "rgba(7, 101, 53)"; // default #076535
  switch (family) {
    case "Saver":
      bgColor = "rgba(67, 172, 225)"; // #43ace1
      break;
    case "Smart":
      bgColor = "rgba(250, 204, 21)"; // #facc15
      break;
    case "Flexi":
      bgColor = "rgba(246, 137, 30)"; // #f6891e
      break;
    case "Business":
      bgColor = "rgba(7, 101, 53)"; // #076535
      break;
    default:
      bgColor = "rgba(153, 71, 29)"; // #99471d
  }

  return (
    <div
      className="bg-white bg-[url(/traditional_ring_section.png)] bg-no-repeat bg-cover rounded-2xl sm:rounded-3xl lg:rounded-3xl p-3 sm:p-4 lg:p-4 shadow-lg w-full h-ful"
      style={{  }}
    >
      <div className="flex flex-col items-center gap-1 lg:gap-2 w-full space-y-4 ">
        <span
          className="font-semibold text-lg sm:text-xl lg:text-xl text-center break-words w-full"
          style={{
            backgroundColor: bgColor,
            color: "#fff",
            width: "100%",
            display: "block",
            padding: 6,
            margin: 0,
            borderRadius: "2rem",
          }}
        >
          {family}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-base md:text-lg lg:text-2xl">
            {currency}
          </span>
          <span className="text-base md:text-lg lg:text-4xl font-bold" >
            {formatPrice(price)}
          </span>
        </div>
        <p className="text-xs sm:text-sm lg:text-sm text-center break-words  p-2 text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" className="inline mr-2 -mt-2" viewBox="0 0 256 256"><path d="M221.66,181.66l-48,48a8,8,0,0,1-11.32-11.32L196.69,184H72a8,8,0,0,1-8-8V32a8,8,0,0,1,16,0V168H196.69l-34.35-34.34a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,221.66,181.66Z"></path></svg>
          {direction}
        </p>
      </div>
    </div>
  );
}

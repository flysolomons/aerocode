import PrimaryButton from "../buttons/PrimaryButton";

interface MembershipCardProps {
  title: string;
  price: string;
  signUpUrl?: string;
}

function MembershipCard({ title, price, signUpUrl }: MembershipCardProps) {
  return (
    <>
      <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-3xl overflow-hidden w-full h-full shadow-xl p-4 sm:p-6 lg:p-6 flex flex-col justify-between border-solid border-2 border-gray-300 bg-white">
        <div className="space-y-6 sm:space-y-8 lg:space-y-8">
          <div className="space-y-4 sm:space-y-6 lg:space-y-6 text-center">
            <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold text-blue-500 break-words">{title}</h3>
            <p className="text-2xl sm:text-3xl lg:text-3xl font-bold font-sans">
              SBD {price}
              <span className="text-base sm:text-lg lg:text-lg font-normal">/year</span>
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4 lg:space-y-4">
            <p className="text-center text-xs sm:text-sm lg:text-sm font-light">
              This package includes...
            </p>
            <ul className="list-disc list-inside mt-2 text-sm sm:text-base lg:text-base space-y-1 sm:space-y-0 lg:space-y-0 text-left">
              <li>Priority check-in</li>
              <li>Preferential seating at check-in</li>
              <li>Express clearance in Brisbane</li>
              <li>Belama Lounge access in Honiara</li>
              <li>Benefits apply for the member + 1 guest</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 lg:mt-0">
          <PrimaryButton text="Sign Up Now" href={signUpUrl} />
        </div>
      </div>
    </>
  );
}

export default MembershipCard;

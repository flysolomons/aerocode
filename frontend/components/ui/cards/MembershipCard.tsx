import PrimaryButton from "../buttons/PrimaryButton";

interface MembershipCardProps {
  title: string;
  price: string;
  signUpUrl?: string;
}

function MembershipCard({ title, price, signUpUrl }: MembershipCardProps) {
  return (
    <>
      <div className="relative rounded-3xl overflow-hidden w-full h-full shadow-xl p-6 flex flex-col justify-between border-solid border-2 border-gray-300 bg-white">
        <div className="space-y-8">
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-blue-500">{title}</h3>
            <p className="text-3xl font-bold font-sans">
              SBD {price}
              <span className="text-lg font-normal">/year</span>
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-center text-sm font-light">
              This package includes...
            </p>
            <ul className="list-disc list-inside mt-2">
              <li>Priority check-in</li>
              <li>Preferential seating at check-in</li>
              <li>Express clearance in Brisbane</li>
              <li>Belama Lounge access in Honiara</li>
              <li>Benefits apply for the member + 1 guest</li>
            </ul>
          </div>
        </div>

        <PrimaryButton text="Sign Up Now" href={signUpUrl} />
      </div>
    </>
  );
}

export default MembershipCard;

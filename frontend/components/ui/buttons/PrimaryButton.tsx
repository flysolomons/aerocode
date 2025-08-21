import Link from "next/link";

type PrimaryButtonProps = {
  text: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  name?: string;
  form?: string;
};

function PrimaryButton({
  text,
  onClick,
  href,
  type = "button",
  name,
  form,
}: PrimaryButtonProps) {
  if (href) {
    return (
      <div className="text-center w-full">
        <Link href={href}>
          <button className="bg-blue-500 text-white px-4 sm:px-6 lg:px-6 py-2 sm:py-2 lg:py-2 min-w-[10rem] sm:min-w-[12rem] lg:min-w-[12rem] h-[2.5rem] sm:h-[3rem] lg:h-[3rem] rounded-full font-semibold hover:bg-opacity-90 transition-colors text-sm sm:text-base lg:text-base w-full sm:w-auto lg:w-auto">
            {text}
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center w-full">
      <button
        className="bg-blue-500 text-white px-4 sm:px-6 lg:px-6 py-2 sm:py-2 lg:py-2 min-w-[10rem] sm:min-w-[12rem] lg:min-w-[12rem] h-[2.5rem] sm:h-[3rem] lg:h-[3rem] rounded-full font-semibold hover:bg-opacity-90 transition-colors text-sm sm:text-base lg:text-base w-full sm:w-auto lg:w-auto"
        onClick={onClick}
        type={type}
        name={name}
        form={form}
      >
        {text}
      </button>
    </div>
  );
}

export default PrimaryButton;

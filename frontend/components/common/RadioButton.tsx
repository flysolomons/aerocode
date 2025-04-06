interface RadioButtonProps {
  optionOne: string;
  optionTwo: string;
}

export default function RadioButton({
  optionOne,
  optionTwo,
}: RadioButtonProps) {
  return (
    <div className="flex bg-white justify-center border-gray-200 border min-w-[12.5rem] rounded-full shadow-md p-0.5">
      <button className="bg-blue-500 text-white text-sm px-6 font-semibold py-2 min-w-[9.75rem] h-[2.5rem] rounded-full">
        {optionOne}
      </button>
      <button className="bg-white text-black text-sm px-6 font-semibold py-2 min-w-[9.75rem] h-[2,5rem] rounded-full">
        {optionTwo}
      </button>
    </div>
  );
}

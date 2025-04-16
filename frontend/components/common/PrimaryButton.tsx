type PrimaryButtonProps = {
  text: string;
  onClick?: () => void; // Add onClick as an optional prop
};

function PrimaryButton({ text, onClick }: PrimaryButtonProps) {
  return (
    <div className="text-center">
      <button
        className="bg-blue-500 text-white px-6 py-2 min-w-[12rem] h-[3rem] rounded-full font-semibold hover:bg-opacity-90 transition-colors"
        onClick={onClick} // Attach the onClick handler
      >
        {text}
      </button>
    </div>
  );
}

export default PrimaryButton;

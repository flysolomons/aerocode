import parse from "html-react-parser";
interface TextBlockProps {
  block: {
    blockType: string;
    value?: string;
  };
}

export default function TextBlock({ block }: TextBlockProps) {
  return (
    <>
      {block.blockType === "TextBlock" && (
        <div className="text-left w-full">
          {block.value && (
            <div className="text-sm sm:text-base lg:text-base text-gray-600 leading-relaxed px-4 sm:px-6 lg:px-0 max-w-4xl mx-auto">
              {parse(block.value)}
            </div>
          )}
        </div>
      )}
    </>
  );
}

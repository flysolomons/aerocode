import { beautifyHtml } from "@/lib/beautifyHtml";

interface GenericSectionBlockProps {
  block: {
    blockType: string;
    heading?: string;
    text?: string;
  };
}

export default function GenericSectionBlock({ block }: GenericSectionBlockProps) {

  return (
    <div
      className={`flex flex-col lg:flex-row w-full lg:rounded-xl rounded-xl sm:rounded-3xl overflow-hidden bg-white shadow-lg p-3 sm:p-4 lg:p-6 min-h-[20rem] sm:min-h-[22rem] lg:h-auto `}
    >
    
      <div
        className={`"w-full" p-2 sm:p-4 lg:p-6`}
      >
        {block.heading && (
          <h2 className="text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-4 lg:mb-6 text-blue-500 font-semibold leading-tight break-words">
            {block.heading}
          </h2>
        )}
        {block.text && (
          <div className="text-sm sm:text-base lg:text-md leading-relaxed text-gray-500 break-words whitespace-pre-wrap">
            {beautifyHtml(block.text)}
          </div>
        )}
      </div>
    </div>
  );
}

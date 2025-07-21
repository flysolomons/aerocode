import { useState } from "react";
import parse from "html-react-parser";
import { AccordionBlock as AccordionBlockType } from "@/graphql/genericPageQuery";

interface AccordionBlockProps {
  block: AccordionBlockType;
}

export default function AccordionBlock({ block }: AccordionBlockProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  // Extract accordion items from the nested structure
  // Find the first block that has items (skip empty objects)
  const accordionItems =
    block.blocks?.find((b) => b.items && b.items.length > 0)?.items || [];

  if (!accordionItems.length) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {block.title && (
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
          {block.title}
        </h2>
      )}

      <div className="space-y-4">
        {accordionItems.map((item, index) => (
          <div
            key={index}
            className="rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <button
              onClick={() => toggleItem(index)}
              className={`w-full px-6 py-5 text-left flex items-center justify-between transition-all duration-300 focus:outline-none ${
                openItems.has(index)
                  ? "bg-yellow-50 hover:bg-yellow-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <h3
                className={`text-lg sm:text-xl font-bold pr-4 transition-colors duration-300 ${
                  openItems.has(index) ? "text-blue-600" : "text-gray-900"
                }`}
              >
                {item.heading}
              </h3>
              <span
                className={`flex-shrink-0 transform transition-all duration-300 ${
                  openItems.has(index)
                    ? "rotate-180 text-blue-600"
                    : "text-gray-400"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            {openItems.has(index) && (
              <div className="px-6 pb-6 pt-2">
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  {item.content && parse(item.content)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

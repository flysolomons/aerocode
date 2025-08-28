import React from "react";
import GridCardBlock from "./GridCardBlock";

interface GridCardSectionBlockProps {
  block: {
    blockType: string;
    heading?: string;
    blocks?: Array<{
      items?: Array<{
        blockType: string;
        heading?: string;
        text?: string;
        image?: {
          url: string;
        };
      }>;
    }>;
  };
}

export default function GridCardSectionBlock({
  block,
}: GridCardSectionBlockProps) {
  return (
    <>
      {block.blockType === "GridCardSectionBlock" && (
        <div className="w-full space-y-6 sm:space-y-8">
          {block.heading && (
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-6 text-center text-blue-500">
              {block.heading}
            </h2>
          )}
          {block.blocks?.map((listBlock, listIndex) => (
            <div
              key={listIndex}
              className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6 mt-2 sm:mt-4 lg:mt-4"
            >
              {listBlock.items?.map(
                (item, itemIndex) =>
                  item.blockType === "GridCardBlock" && (
                    <GridCardBlock key={itemIndex} item={item} />
                  )
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

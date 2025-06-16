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
        <div>
          {block.heading && (
            <h2 className="text-3xl font-bold mb-6 text-center">
              {block.heading}
            </h2>
          )}
          {block.blocks?.map((listBlock, listIndex) => (
            <div
              key={listIndex}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
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

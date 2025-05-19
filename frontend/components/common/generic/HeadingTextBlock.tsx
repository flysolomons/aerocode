import React from "react";

interface HeadingTextBlockProps {
  block: {
    blockType: string;
    heading?: string;
    text?: string;
  };
}

export default function HeadingTextBlock({ block }: HeadingTextBlockProps) {
  return (
    <div className="text-center">
      {block.heading && (
        <h2 className="text-2xl mb-2 text-gray-800 font-semibold">
          {block.heading}
        </h2>
      )}
      {block.text && <p>{block.text}</p>}
    </div>
  );
}

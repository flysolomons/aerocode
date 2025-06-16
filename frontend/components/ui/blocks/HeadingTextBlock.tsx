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
    <div className="text-center w-full space-y-2 sm:space-y-3 lg:space-y-2">
      {block.heading && (
        <h2 className="text-xl sm:text-2xl lg:text-2xl mb-1 sm:mb-2 lg:mb-2 text-gray-800 font-semibold px-4 sm:px-6 lg:px-0">
          {block.heading}
        </h2>
      )}
      {block.text && (
        <p className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed px-4 sm:px-6 lg:px-0 max-w-4xl mx-auto">
          {block.text}
        </p>
      )}
    </div>
  );
}

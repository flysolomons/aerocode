"use client";
import { useMemo } from "react";
import Link from "next/link";
import parse from "html-react-parser";
import GenericCardFull from "../cards/GenericCardVariants/GenericCardFull";

interface GridCardBlockProps {
  item: {
    blockType: string;
    heading?: string;
    text?: string;
    image?: {
      url: string;
    };
    url?: string;
  };
}

export default function GridCardBlock({ item }: GridCardBlockProps) {
  // Extract URL from rich text HTML using useMemo for consistent rendering
  const extractedUrl = useMemo(() => {
    if (!item.url) return null;

    try {
      // Use regex to extract href attribute from anchor tag
      const hrefMatch = item.url.match(/href="([^"]+)"/);
      return hrefMatch ? hrefMatch[1] : null;
    } catch (error) {
      console.error("Error extracting URL from rich text:", error);
      return null;
    }
  }, [item.url]);

  const description = useMemo(() => {
    return item.text ? parse(item.text) : null;
  }, [item.text]);

  // Always pass the extracted URL to GenericCardFull, let it handle the Link logic
  return (
    <GenericCardFull
      title={item.heading || ""} 
      image={item.image?.url || ""}
      url={extractedUrl || ""}
      subTitle={description}
    />
  );
}

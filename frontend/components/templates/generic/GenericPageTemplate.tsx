"use client";

import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import SectionBlock from "@/components/ui/blocks/SectionBlock";
import TextBlock from "@/components/ui/blocks/TextBlock";
import ImageBlock from "@/components/ui/blocks/ImageBlock";
import HeadingTextBlock from "@/components/ui/blocks/HeadingTextBlock";
import GridCardSectionBlock from "@/components/ui/blocks/GridCardSectionBlock";
import { GenericPage } from "@/graphql/genericPageQuery";

interface GenericPageTemplateProps {
  initialPage: GenericPage;
}

export default function GenericPageTemplate({
  initialPage,
}: GenericPageTemplateProps) {
  return (
    <div>
      {initialPage.heroTitle && initialPage.heroImage && (
        <SecondaryHero
          title={initialPage.heroTitle}
          image={initialPage.heroImage.url}
          breadcrumbs={initialPage.url}
        />
      )}{" "}
      <Container>
        <div className="py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16 px-4 sm:px-6 lg:px-8">
          {initialPage.description && (
            <div className="max-w-4xl mx-auto">
              <p className="text-sm sm:text-base lg:text-lg text-center text-gray-700 leading-relaxed">
                {initialPage.description}
              </p>
            </div>
          )}
          {initialPage.content.map((block, index) => (
            <div key={index}>
              {/* if it's a section block then pass it on to the section block componennt */}
              {block.blockType === "SectionBlock" && (
                <SectionBlock
                  block={{
                    ...block,
                    imagePosition:
                      block.imagePosition === "left" ||
                      block.imagePosition === "right"
                        ? block.imagePosition
                        : undefined,
                  }}
                />
              )}

              {/* if it's a text block then pass it on to the text block componennt */}
              {block.blockType === "TextBlock" && <TextBlock block={block} />}

              {/* if it's an image */}
              {block.blockType === "ImageBlock" && <ImageBlock block={block} />}

              {/* if it's a heading text block */}
              {block.blockType === "HeadingTextBlock" && (
                <HeadingTextBlock block={block} />
              )}

              {block.blockType === "GridCardSectionBlock" && (
                <GridCardSectionBlock block={block} />
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

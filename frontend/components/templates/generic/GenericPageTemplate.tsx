"use client";

import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import SectionBlock from "@/components/ui/blocks/SectionBlock";
import TextBlock from "@/components/ui/blocks/TextBlock";
import ImageBlock from "@/components/ui/blocks/ImageBlock";
import HeadingTextBlock from "@/components/ui/blocks/HeadingTextBlock";
import GridCardSectionBlock from "@/components/ui/blocks/GridCardSectionBlock";
import FullWidthImageBlock from "@/components/ui/blocks/FullWidthImageBlock";
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
      )}

      {/* Description section with container */}
      {initialPage.description && (
        <Container>
          <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm sm:text-base lg:text-base text-center text-gray-700 leading-relaxed">
                {initialPage.description}
              </p>
            </div>
          </div>
        </Container>
      )}

      {/* Content blocks */}
      <div className="space-y-8 sm:space-y-12 lg:space-y-16">
        {initialPage.content.map((block, index) => {
          // Full width blocks don't need container
          if (block.blockType === "FullWidthImageBlock") {
            return (
              <div key={index}>
                <FullWidthImageBlock block={block} />
              </div>
            );
          }

          // All other blocks get wrapped in container
          return (
            <Container key={index}>
              <div className="px-4 sm:px-6">
                {/* Section block */}
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

                {/* Text block */}
                {block.blockType === "TextBlock" && <TextBlock block={block} />}

                {/* Image block */}
                {block.blockType === "ImageBlock" && (
                  <ImageBlock block={block} />
                )}

                {/* Heading text block */}
                {block.blockType === "HeadingTextBlock" && (
                  <HeadingTextBlock block={block} />
                )}

                {/* Grid card section block */}
                {block.blockType === "GridCardSectionBlock" && (
                  <GridCardSectionBlock block={block} />
                )}
              </div>
            </Container>
          );
        })}
      </div>
    </div>
  );
}

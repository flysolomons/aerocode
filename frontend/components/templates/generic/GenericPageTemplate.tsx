"use client";

import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import SectionBlock from "@/components/common/generic/SectionBlock";
import TextBlock from "@/components/common/generic/TextBlock";
import ImageBlock from "@/components/common/generic/ImageBlock";
import HeadingTextBlock from "@/components/common/generic/HeadingTextBlock";
import GridCardSectionBlock from "@/components/common/generic/GridCardSectionBlock";
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

      <Container>
        <div className="py-12 space-y-16">
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

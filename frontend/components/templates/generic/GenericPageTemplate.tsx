"use client";

import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import SectionBlock from "@/components/ui/blocks/SectionBlock";
import TextBlock from "@/components/ui/blocks/TextBlock";
import ImageBlock from "@/components/ui/blocks/ImageBlock";
import HeadingTextBlock from "@/components/ui/blocks/HeadingTextBlock";
import GridCardSectionBlock from "@/components/ui/blocks/GridCardSectionBlock";
import FullWidthImageBlock from "@/components/ui/blocks/FullWidthImageBlock";
import TableBlock from "@/components/ui/blocks/TableBlock";
import AccordionBlock from "@/components/ui/blocks/AccordionBlock";
import SimpleDropdownBlock from "@/components/ui/blocks/SimpleDropdownBlock";
import ManageMyBookingWidget from "@/components/layout/booking-widget/ManageMyBookingWidget";
import FlightUpgradeWidget from "@/components/layout/booking-widget/FlightUpgradeWidget";
import { GenericPage } from "@/graphql/genericPageQuery";
import parse from "html-react-parser";

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
            <div className="mx-auto w-full">
              <div className="text-sm sm:text-base lg:text-base text-left text-gray-700 leading-relaxed">
                {parse(initialPage.description)}
              </div>
            </div>
          </div>
        </Container>
      )}

      {/* Widget section - appears before content */}
      {(initialPage.includeManageBookingWidget || initialPage.includeFlightUpgradeWidget) && (
        <Container>
          <div className="px-4 sm:px-6">
            {initialPage.includeManageBookingWidget && <ManageMyBookingWidget />}
            {initialPage.includeFlightUpgradeWidget && <FlightUpgradeWidget />}
          </div>
        </Container>
      )}

      {/* Content blocks */}
      <div className="space-y-8 sm:space-y-12 lg:space-y-16 ">
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
              <div className="px-4 sm:px-6 pb-8">
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

                {/* Table block */}
                {block.blockType === "DataTableBlock" && (
                  <TableBlock tableData={block.tableData} />
                )}

                {/* Accordion block */}
                {block.blockType === "AccordionBlock" && (
                  <AccordionBlock block={block} />
                )}

                {/* Simple dropdown block */}
                {block.blockType === "SimpleDropdownBlock" && (
                  <SimpleDropdownBlock block={block} />
                )}
              </div>
            </Container>
          );
        })}
      </div>
    </div>
  );
}

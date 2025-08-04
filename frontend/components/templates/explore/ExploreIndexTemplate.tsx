import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import GenericCard from "@/components/ui/cards/GenericCard";
import { ExploreIndexPage } from "@/graphql/ExplorePageQuery";
import parse from "html-react-parser";

interface ExploreProps {
  initialPage: ExploreIndexPage;
}
export default function ExploreIndexTemplate({ initialPage }: ExploreProps) {
  // console.log("Explore index children", initialPage);
  return (
    <>
      <SecondaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage?.url || "/default-hero.jpg"}
        breadcrumbs={initialPage.url}
      />
      <Container>
        <div className="py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16 px-4 sm:px-6">
          {/* Description */}

          {initialPage.description && (
            <div className="mx-auto w-full">
              <div className="text-sm sm:text-base lg:text-base text-left text-gray-600 leading-relaxed">
                {parse(initialPage.description)}
              </div>
            </div>
          )}

          {/* Explore options */}
          {(initialPage.children?.length ?? 0) > 0 && (
            <div className="space-y-6">
              {Array.from({
                length: Math.ceil((initialPage.children?.length ?? 0) / 3),
              }).map((_, rowIdx) => (
                <div
                  key={rowIdx}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
                >
                  {(initialPage.children ?? [])
                    .slice(rowIdx * 3, rowIdx * 3 + 3)
                    .map((child, idx) => (
                      <div key={idx} className="flex-1">
                        <GenericCard
                          title={child.title}
                          subTitle={child.subTitle}
                          image={child.heroImage?.url || "/image.jpg"}
                          url={child.url}
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}

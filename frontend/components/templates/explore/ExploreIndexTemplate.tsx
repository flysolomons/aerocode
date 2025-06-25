import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import GenericCard from "@/components/ui/cards/GenericCard";
import { ExploreIndexPage } from "@/graphql/ExplorePageQuery";
import { stripHtmlTags } from "@/lib/utils";

interface ExploreProps {
  initialPage: ExploreIndexPage;
}
export default function ExploreIndexTemplate({ initialPage }: ExploreProps) {
  console.log("Explore index children", initialPage.children);
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
              <p className="text-sm sm:text-base lg:text-base text-center text-gray-700 leading-relaxed">
                {stripHtmlTags(initialPage.description)}
              </p>
            </div>
          )}

          {/* Explore options */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-6">
            {initialPage.children &&
              initialPage.children.length > 0 &&
              initialPage.children.map((child, index) => (
                <GenericCard
                  key={index}
                  title={child.title}
                  subTitle={child.subTitle}
                  image={child.heroImage?.url || "/image.jpg"}
                  url={child.url}
                />
              ))}
          </div>
        </div>
      </Container>
    </>
  );
}

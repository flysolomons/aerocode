import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import GenericCard from "@/components/ui/cards/GenericCard";
import { DestinationIndexPage } from "@/graphql/DestinationIndexPageQuery";

interface ExploreProps {
  initialPage: DestinationIndexPage;
}
export default function DestinationIndexTemplate({
  initialPage,
}: ExploreProps) {
  return (
    <>
      <SecondaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage?.url || "/default-hero.jpg"}
        breadcrumbs={initialPage.url}
      />      <Container>
        <div className="py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16 px-4 sm:px-6 lg:px-8">
          {/* Description */}
          <div className="max-w-4xl mx-auto">
            <p className="text-sm sm:text-base lg:text-lg text-center text-gray-700 leading-relaxed">
              {initialPage.description}
            </p>
          </div>

          {/* Explore options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {initialPage.children &&
              initialPage.children.length > 0 &&
              initialPage.children.map((child, index) => (
                <GenericCard
                  key={index}
                  title={child.country}
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

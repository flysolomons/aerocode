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
      />
      <Container>
        <div className="py-12 space-y-16">
          {/* Description */}
          <span className="block text-center">{initialPage.description}</span>

          {/* Explore options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

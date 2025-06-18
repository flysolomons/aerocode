import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import GenericCard from "@/components/ui/cards/GenericCard";
import { ExperienceIndexPage } from "@/graphql/ExperiencePageQuery";
import { stripHtmlTags } from "@/lib/utils";

interface ExperienceProps {
  initialPage: ExperienceIndexPage;
}
export default function ExperienceIndexTemplate({
  initialPage,
}: ExperienceProps) {
  return (
    <>
      <SecondaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage?.url || "/default-hero.jpg"}
        breadcrumbs={initialPage.url}
      />
      <Container>
        <div className="py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16 px-4 sm:px-6 lg:px-8">
          {/* Description */}

          {initialPage.description && (
            <div className="max-w-4xl mx-auto">
              <p className="text-sm sm:text-base lg:text-lg text-center text-gray-700 leading-relaxed">
                {stripHtmlTags(initialPage.description)}
              </p>
            </div>
          )}


          {/* Experience options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {initialPage.children &&
              initialPage.children.length > 0 &&
              initialPage.children.map((child, index) => (
                <GenericCard
                  key={index}
                  title={child.title}
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

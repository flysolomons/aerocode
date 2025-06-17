import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import MembershipCard from "@/components/ui/cards/MembershipCard";
import Image from "next/image";
import { BelamaIndexPage } from "@/graphql/BelamaPageQuery";

interface BelamaIndexPageTemplateProps {
  initialPage: BelamaIndexPage;
}

export default function BelamaIndexPageTemplate({
  initialPage,
}: BelamaIndexPageTemplateProps) {
  return (
    <>
      {" "}
      <SecondaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage.url}
        breadcrumbs={initialPage.url}
      />
      <Container>
        <div className="py-8 sm:py-12 lg:py-12 space-y-12 sm:space-y-16 lg:space-y-16 px-4 sm:px-6 lg:px-8">
          {" "}
          {/* Description */}
          <p className="block text-center text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed max-w-4xl mx-auto">
            {initialPage.description}
          </p>
          <div className="space-y-6 sm:space-y-8 lg:space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl text-center font-bold text-blue-500">
              Individual Memberships
            </h2>{" "}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-4 min-h-[28rem] sm:min-h-[30rem] lg:h-[31rem]">
              {initialPage.individualMemberships.map((membership, index) => (
                <MembershipCard
                  key={index}
                  title={membership.title}
                  price={membership.price}
                  features={membership.features}
                  signUpUrl="/belama/sign-up"
                />
              ))}
            </div>
          </div>{" "}
          <Image
            src={initialPage.promoImage?.url || "/image.jpg"}
            alt="Where We Fly: International"
            width={4000}
            height={1000}
            className="w-full h-48 sm:h-64 lg:h-[25rem] rounded-2xl sm:rounded-3xl lg:rounded-3xl object-cover"
          />
          <div className="space-y-6 sm:space-y-8 lg:space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl text-center font-bold text-blue-500">
              Group Memberships
            </h2>{" "}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-4 min-h-[28rem] sm:min-h-[30rem] lg:h-[31rem]">
              {initialPage.groupMemberships.map((membership, index) => (
                <MembershipCard
                  key={index}
                  title={membership.title}
                  price={membership.price}
                  features={membership.features}
                  signUpUrl="/belama/sign-up"
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

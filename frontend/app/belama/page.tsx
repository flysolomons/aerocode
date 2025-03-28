import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";

export default function Belama() {
  return (
    <>
      <SecondaryHero
        title="Belama Club"
        image="/hero.jpg"
        breadcrumbs="Home > Belama"
      />
      <Container>
        <div className="py-12 space-y-16">
          {/* Description */}
          <span className="block text-center">
            We offer convenient flights between Australia, Fiji, Vanuatu, and
            Honiara, the vibrant capital of the Solomon Islands.
          </span>
          <div className="space-y-2">
            <h2 className="text-3xl text-center font-bold text-blue-500">
              Individual Memberships
            </h2>
          </div>
        </div>
      </Container>
    </>
  );
}

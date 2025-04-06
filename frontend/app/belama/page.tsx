import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import Image from "next/image";
import MembershipCard from "@/components/common/MembershipCard";

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
          <div className="space-y-8">
            <h2 className="text-3xl text-center font-bold text-blue-500">
              Individual Memberships
            </h2>

            <div className="grid grid-cols-3 gap-4 h-[31rem]">
              <MembershipCard title="Belama Me" price="$3,995.00" />
              <MembershipCard title="Belama Plus" price="$7,995.00" />
              <MembershipCard title="Belama Max" price="$9,995.00" />
            </div>
          </div>
          <Image
            src="/image.jpg"
            alt="Where We Fly: International"
            width={4000}
            height={1000}
            className="w-full h-[25rem] rounded-3xl object-cover"
          />

          <div className="space-y-8">
            <h2 className="text-3xl text-center font-bold text-blue-500">
              Group Memberships
            </h2>

            <div className="grid grid-cols-2 gap-4 h-[31rem]">
              <MembershipCard title="Belama Family" price="$3,995.00" />
              <MembershipCard title="Belama Business" price="$7,995.00" />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

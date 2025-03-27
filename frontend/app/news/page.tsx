import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import NewsCard from "@/components/common/NewsCard";
import PrimaryButton from "@/components/common/PrimaryButton";

export default function News() {
  return (
    <>
      <SecondaryHero
        title="Solomon Airlines News"
        image="./hero.jpg"
        breadcrumbs="Home > News"
      />
      <Container>
        <div className="py-12 space-y-16">
          <div className="grid grid-cols-3 gap-x-4 gap-y-16">
            <NewsCard
              headline="Soar Into New Year Savings with our International Sale"
              image="/image.jpg"
              date="Dec 18th 2024 9:00am"
              description="Save on Solomon Airlines international routes from Australia, New Zealand, Vanuatu and Solomon Islands for travel on selected dates between 30 January and 31 March, 1 and 31 May, 1 August and 30 November 2025, subject to availability. Sale ends 7 February 2025, unless sold out prior."
            />
            <NewsCard
              headline="Soar Into New Year Savings with our International Sale"
              image="/image.jpg"
              date="Dec 18th 2024 9:00am"
              description="Save on Solomon Airlines international routes from Australia, New Zealand, Vanuatu and Solomon Islands for travel on selected dates between 30 January and 31 March, 1 and 31 May, 1 August and 30 November 2025, subject to availability. Sale ends 7 February 2025, unless sold out prior."
            />
            <NewsCard
              headline="Soar Into New Year Savings with our International Sale"
              image="/image.jpg"
              date="Dec 18th 2024 9:00am"
              description="Save on Solomon Airlines international routes from Australia, New Zealand, Vanuatu and Solomon Islands for travel on selected dates between 30 January and 31 March, 1 and 31 May, 1 August and 30 November 2025, subject to availability. Sale ends 7 February 2025, unless sold out prior."
            />
            <NewsCard
              headline="Soar Into New Year Savings with our International Sale"
              image="/image.jpg"
              date="Dec 18th 2024 9:00am"
              description="Save on Solomon Airlines international routes from Australia, New Zealand, Vanuatu and Solomon Islands for travel on selected dates between 30 January and 31 March, 1 and 31 May, 1 August and 30 November 2025, subject to availability. Sale ends 7 February 2025, unless sold out prior."
            />
            <NewsCard
              headline="Soar Into New Year Savings with our International Sale"
              image="/image.jpg"
              date="Dec 18th 2024 9:00am"
              description="Save on Solomon Airlines international routes from Australia, New Zealand, Vanuatu and Solomon Islands for travel on selected dates between 30 January and 31 March, 1 and 31 May, 1 August and 30 November 2025, subject to availability. Sale ends 7 February 2025, unless sold out prior."
            />
            <NewsCard
              headline="Soar Into New Year Savings with our International Sale"
              image="/image.jpg"
              date="Dec 18th 2024 9:00am"
              description="Save on Solomon Airlines international routes from Australia, New Zealand, Vanuatu and Solomon Islands for travel on selected dates between 30 January and 31 March, 1 and 31 May, 1 August and 30 November 2025, subject to availability. Sale ends 7 February 2025, unless sold out prior."
            />
            <NewsCard
              headline="Soar Into New Year Savings with our International Sale"
              image="/image.jpg"
              date="Dec 18th 2024 9:00am"
              description="Save on Solomon Airlines international routes from Australia, New Zealand, Vanuatu and Solomon Islands for travel on selected dates between 30 January and 31 March, 1 and 31 May, 1 August and 30 November 2025, subject to availability. Sale ends 7 February 2025, unless sold out prior."
            />
            <NewsCard
              headline="Soar Into New Year Savings with our International Sale"
              image="/image.jpg"
              date="Dec 18th 2024 9:00am"
              description="Save on Solomon Airlines international routes from Australia, New Zealand, Vanuatu and Solomon Islands for travel on selected dates between 30 January and 31 March, 1 and 31 May, 1 August and 30 November 2025, subject to availability. Sale ends 7 February 2025, unless sold out prior."
            />
            <NewsCard
              headline="Soar Into New Year Savings with our International Sale"
              image="/image.jpg"
              date="Dec 18th 2024 9:00am"
              description="Save on Solomon Airlines international routes from Australia, New Zealand, Vanuatu and Solomon Islands for travel on selected dates between 30 January and 31 March, 1 and 31 May, 1 August and 30 November 2025, subject to availability. Sale ends 7 February 2025, unless sold out prior."
            />
          </div>
          <PrimaryButton text="View More Articles" />
        </div>
      </Container>
    </>
  );
}

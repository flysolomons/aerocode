import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Optional: for arrow icons

// Define the type for magazine data
interface Magazine {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  link: string;
}

// Sample magazine data (replace with your actual data)
const magazines: Magazine[] = [
  {
    id: 1,
    title: 'Solomons Skies - July 2025',
    description: 'Discover island adventures and local stories.',
    coverImage: '/magazine-issue-94.png', // Replace with actual URL
    link: '/magazines/solomons-skies-july-2025.pdf',
  },
  {
    id: 2,
    title: 'Solomon Islands Digital - Summer 2025',
    description: 'Explore vibrant culture and stunning landscapes.',
    coverImage: '/magazine-issue-93.png',
    link: '/magazines/solomon-islands-summer-2025.pdf',
  },
  {
    id: 3,
    title: 'Solomons Skies - April 2025',
    description: 'Stories of the Pacific await.',
    coverImage: '/magazine-issue-92.png',
    link: '/magazines/solomons-skies-april-2025.pdf',
  },
  {
    id: 4,
    title: 'Solomons Skies - April 2025',
    description: 'Stories of the Pacific await.',
    coverImage: '/magazine-issue-91.png',
    link: '/magazines/solomons-skies-april-2025.pdf',
  },
  {
    id: 6,
    title: 'Solomons Skies - April 2025',
    description: 'Stories of the Pacific await.',
    coverImage: '/magazine-issue-90.png',
    link: '/magazines/solomons-skies-april-2025.pdf',
  },
  {
    id: 7,
    title: 'Solomons Skies - April 2025',
    description: 'Stories of the Pacific await.',
    coverImage: '/magazine-issue-89.png',
    link: '/magazines/solomons-skies-april-2025.pdf',
  },
];

const MagazineCarousel: React.FC = () => {
  // Initialize Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true, // Infinite loop
    slidesToScroll: 1,
    align: 'start',
    containScroll: 'trimSnaps',
  });

  // Navigation functions
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  // Handle click tracking for analytics (replace with your analytics solution)
  const trackClick = (title: string) => {
    console.log(`Clicked magazine: ${title}`);
    // Example: gtag('event', 'magazine_click', { title });
  };

  return (
    <section className="py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-blue-500 mb-6">
          Our Stories in Flight
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Explore the beauty and culture of the Solomon Islands through our vibrant
          magazines.
        </p>
        <div className="relative">
          {/* Embla Carousel Container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {magazines.map((magazine) => (
                <div
                  key={magazine.id}
                  className="flex-[0_0_25%] min-w-0 px-2 sm:flex-[0_0_50%] md:flex-[0_0_25%] "
                >
                  <a
                    href={magazine.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden shadow-md transform transition-transform hover:scale-105"
                    onClick={() => trackClick(magazine.title)}
                  >
                    <img
                      src={magazine.coverImage}
                      alt={`Cover of ${magazine.title}`}
                      className="w-full aspect-[3/4] object-cover  rounded-lg border-4 border-white"
                      loading="lazy"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
          {/* Navigation Arrows */}
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MagazineCarousel;
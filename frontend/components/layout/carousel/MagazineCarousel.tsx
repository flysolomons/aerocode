import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // For navigation arrows
import { ImageBlock } from '@/graphql/AboutPageQuery';



interface Magazine {
  title?: string;
  image?: ImageBlock;
  document?: { url: string };
}

// Props for the MagazineCarousel component
interface MagazineCarouselProps {
  magazines?: Magazine[];
}

const MagazineCarousel: React.FC<MagazineCarouselProps> = ({magazines}) => {
  // Initialize Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
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

    
    <section className="py-10 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-blue-500 mb-6">
          Our Stories Inflight
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Explore the beauty and culture of the Solomon Islands through our vibrant magazines.
        </p>
        {/* Display magazine list if more than 0 */}
        <div className="relative">
          {/* Embla Carousel Container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {magazines?.map((magazine) => (
                <div
                  key={magazine.title}
                  className="flex-[0_0_100%] min-w-0 px-2 md:flex-[0_0_33.33%] md:min-w-[calc(100%/3)] lg:flex-[0_0_25%] lg:min-w-[calc(100%/4)]"
                >
                  <a
                    href={magazine.document?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden shadow-md transform transition-transform hover:scale-105"
                    onClick={() => trackClick(magazine.title || 'undefined')}
                  >
                    <img
                      src={magazine.image?.url}
                      alt={`Cover of ${magazine.title}`}
                      className="w-full aspect-[3/4] object-cover"
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
import React from "react";
import Image from "next/image";

//Story data
interface Story {
  title: string;
  subTitle?: string;
  image?: string; // Image for featured story; optional for others
  link: string; // Link to digital magazine
}
// Story data
interface StoryCarouselProps {
  stories?: Story[];
}

const storyCarousel: React.FC<StoryCarouselProps> = ({ stories }) => {
  // If stories is undefined or empty, render a fallback
  if (!stories || stories.length === 0) {
    return (
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-500 mb-6">
            Solomon Islands Stories
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Dive into personal stories and incredible experiences from the
            Solomon Islands.
          </p>
          <p className="text-center text-gray-500">No stories available.</p>
        </div>
      </section>
    );
  }

  // Featured story is the first in the array
  const featuredStory = stories[0];
  // Other stories for the accordion
  const otherStories = stories.slice(1);

  // Handle click tracking for analytics
  const trackClick = (title: string) => {
    console.log(`Clicked story: ${title}`);
    // gtag('event', 'story_click', { title });
  };

  return (
    <section className="py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-center mx-auto text-blue-500 mb-6 w-3/4 md:w-full lg:w-full">
          Solomon Islands Stories
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Dive into personal stories and incredible experiences from the Solomon
          Islands.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {/* Featured Story (Left) */}

          <div className="md:w-1/4">
            <a
              href={featuredStory.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg overflow-hidden shadow-md transform transition-transform hover:scale-105"
              onClick={() => trackClick(featuredStory.title)}
            >
              <div className="relative">
                <img
                  src={featuredStory.image}
                  alt={`Image for ${featuredStory.title}`}
                  className="w-full aspect-[3/4] object-cover rounded-lg"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] to-transparent flex items-end justify-start p-3 border-3 border-white rounded-lg">
                  <h3 className="text-lg font-semibold text-white text-left">
                    {featuredStory.title}
                    <span className="text-xs font-normal block text-left">
                      {featuredStory.subTitle}
                    </span>
                  </h3>
                </div>
              </div>
            </a>
          </div>
          {/* Expanded Accordion Items (Right) */}
          <div className="md:w-1/2 space-y-4">
            {otherStories.map((story) => (
              <div
                key={story.title}
                className="bg-white rounded-lg shadow-md p-1"
                role="region"
                aria-label={`Story: ${story.title}`}
              >
                <a
                  href={story.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-500 hover:text-blue-600 transition-colors text-base font-medium"
                  onClick={() => trackClick(story.title)}
                >
                  <div className="flex">
                    <div className="w-14 p-2">
                      <Image
                        src={story.image || "null"}
                        alt={story.title}
                        width={80}
                        height={80}
                        className="inline mt-1 mr-4 w-[80px]  aspect-square rounded "
                        placeholder="blur"
                      />
                    </div>

                    <div className="w-auto mt-2">
                      <span className="text-gray-500">{story.title}</span>
                      <p className="text-sm text-gray-400 font-normal line-clamp-1">
                        {story.subTitle}
                      </p>
                      {/* <span className='pb-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#5452c6" className='inline ml-1 mr-1' viewBox="0 0 256 256"><path d="M209.94,113.94l-96,96a48,48,0,0,1-67.88-67.88l96-96a48,48,0,0,1,67.88,67.88Z" opacity="0.2"></path><path d="M232,80a55.67,55.67,0,0,1-16.4,39.6l-30.07,30.06a8,8,0,0,1-11.31-11.32l30.07-30.06a40,40,0,1,0-56.57-56.56L117.66,81.77a8,8,0,0,1-11.32-11.32L136.4,40.4A56,56,0,0,1,232,80Zm-93.66,94.22-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z"></path></svg>
                            <span className="text-blue-300 text-sm font-normal">read full story</span>
                          </span> */}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default storyCarousel;

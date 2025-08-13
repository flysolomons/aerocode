import React from 'react';
import Image from 'next/image';

// Define the type for story data
interface Story {
  id: number;
  title: string;
  subTitle?: string;
  image?: string; // Image for featured story; optional for others
  link: string; // Link to magazine or specific article
}

// Sample story data (replace with your actual data)
const stories: Story[] = [
  {
    id: 1,
    title: 'The Last Wild Island', // Featured story
    subTitle: 'Tom Perry travels to the tiny remote island of Bellona, where men are men, caves are hotels and crayfish are plentiful.',
    image: '/sleeping-awesome.png', // Replace with actual URL
    link: '/magazines/solomon-islands-digital.pdf#page=30',
  },
  {
    id: 2,
    title: 'Sleeping with the Anemone',
    subTitle: 'Tom Perry travels to the tiny remote island of Bellona, where men are men, caves are hotels and crayfish are plentiful.',
    image: '/sleeping-awesome.png', // Replace with actual URL
    link: '/magazines/solomon-islands-digital.pdf#page=10',
  },
  {
    id: 3,
    title: 'On Island Time',
    subTitle: 'Finding solace is an easy task on a cruise that combines history, nature and culture.',
    image: '/sleeping-awesome.png', // Replace with actual URL
    link: '/magazines/solomon-islands-digital.pdf#page=15',
  },
  {
    id: 4,
    title: 'Hunting for Headspace',
    subTitle: 'Dave Cauldwell seeks solitude in a secluded in a part of the islands that has a cannibal past and a colourful present.',
    image: '/sleeping-awesome.png', // Replace with actual URL
    link: '/magazines/solomon-islands-digital.pdf#page=20',
  },
  {
    id: 5,
    title: 'Island Duels',
    subTitle: 'Tom Perry avoids being skewered at a festival that celebrates sorting out problems the old-fashioned way – by spear. ',
    image: '/sleeping-awesome.png', // Replace with actual URL
    link: '/magazines/solomon-islands-digital.pdf#page=25',
  },
  {
    id: 6,
    title: 'The Real Island Life',
    subTitle: 'Choose your adventure: a holiday can be more than sitting in a hammock or by a hotel swimming pool all day.',
    image: '/sleeping-awesome.png', // Replace with actual URL
    link: '/magazines/solomon-islands-digital.pdf#page=35',
  },
  {
    id: 7,
    title: 'Top Five Sol-id Stays',
    subTitle: 'Tom Perry travels to the tiny remote island of Bellona, where men are men, caves are hotels and crayfish are plentiful.',
    image: '/sleeping-awesome.png', // Replace with actual URL
    link: '/magazines/solomon-islands-digital.pdf#page=40',
  },
  {
    id: 8,
    title: 'The Mangrove Crab',
    subTitle: 'Tom Perry travels to the tiny remote island of Bellona, where men are men, caves are hotels and crayfish are plentiful.',
    image: '/sleeping-awesome.png', // Replace with actual URL
    link: '/magazines/solomon-islands-digital.pdf#page=45',
  },
];

const FeaturedStory: React.FC = () => {
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
        <h2 className="text-4xl font-bold text-center text-blue-500 mb-6">
          Solomon Islands Stories
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Dive into personal stories and incredible experiences from the Solomon Islands.
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
                    <span className='text-xs font-normal block text-left'>{featuredStory.subTitle}</span>
                  </h3>
                  
                </div>
              </div>
            </a>
          </div>
          {/* Expanded Accordion Items (Right) */}
          <div className="md:w-1/2 space-y-4">
            {otherStories.map((story) => (
              <div
                key={story.id}
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
                 <div className='flex'>
                  
                    <div className='w-14 p-2'>
                      <Image
                        src={story.image || 'null'}
                        alt={story.title}
                        width={80}
                        height={80}
                        className='inline mt-1 mr-4 w-[80px]  aspect-square rounded '
                        />
                    </div>
                   
                    <div className='w-auto mt-2'>

                          <span className="text-gray-500">{story.title}</span>
                          <p className="text-sm text-gray-400 font-normal line-clamp-1">{story.subTitle} 
                            
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

export default FeaturedStory;
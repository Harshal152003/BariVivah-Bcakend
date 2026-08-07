"use client"
import { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SuccessStories() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Sample success stories data
  const successStories = [
    {
      id: 1,
      name: "Ravi & Priya",
      location: "Mumbai, India",
      story: "We connected instantly through our shared values and interests. After 6 months of getting to know each other, we knew we were meant to be. Forever grateful for this platform!",
      image: "/api/placeholder/120/120"
    },
    {
      id: 2,
      name: "John & Sarah",
      location: "Toronto, Canada",
      story: "Despite living in different cities, we found each other here and knew it was fate. The compatibility matching was spot on! We just celebrated our first anniversary.",
      image: "/api/placeholder/120/120"
    },
    {
      id: 3,
      name: "Ahmed & Fatima",
      location: "Dubai, UAE",
      story: "Our families were thrilled when we found each other through this platform. The traditional values combined with modern approach helped us find true compatibility.",
      image: "/api/placeholder/120/120"
    },
    {
      id: 4,
      name: "Michael & Jessica",
      location: "Sydney, Australia",
      story: "After unsuccessful attempts on other platforms, we found each other here. The detailed profiles helped us connect on a deeper level before we even met in person.",
      image: "/api/placeholder/120/120"
    },
    {
      id: 5,
      name: "Raj & Anita",
      location: "London, UK",
      story: "Living abroad, we wanted someone who shared our cultural roots. This platform connected us, and now we're building our future together with shared values.",
      image: "/api/placeholder/120/120"
    },
    {
      id: 6,
      name: "David & Lisa",
      location: "New York, USA",
      story: "We both had specific preferences that were important to us. The advanced matching algorithm brought us together, and it's been perfect ever since our first date.",
      image: "/api/placeholder/120/120"
    }
  ];

  // Number of cards to show per view based on screen size
  const getVisibleCards = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return 2;
      if (window.innerWidth >= 768) return 2;
    }
    return 1;
  };

  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    setIsLoaded(true);
    setVisibleCards(getVisibleCards());

    const handleResize = () => {
      setVisibleCards(getVisibleCards());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex + visibleCards >= successStories.length
        ? 0
        : prevIndex + visibleCards
    );
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex - visibleCards < 0
        ? Math.max(0, successStories.length - visibleCards)
        : prevIndex - visibleCards
    );
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-secondary/5 to-primary/5 py-20">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl opacity-40"></div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Love Stories
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Celebrating <span className="text-primary">Success</span> Stories
            </h2>
            <p className="text-[#5C3F43] max-w-2xl mx-auto">
              Thousands of couples have found their perfect match through our platform.
              Here are some heartwarming journeys to inspire your own love story.
            </p>
          </div>

          {/* Testimonial cards */}
          <div className="relative">
            {/* Carousel navigation */}
            <div className="flex justify-between absolute top-1/2 left-0 right-0 -mt-6 px-2 md:px-4 z-10">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#5C3F43] hover:bg-primary/10 hover:text-primary transition-all"
                aria-label="Previous testimonials"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#5C3F43] hover:bg-primary/10 hover:text-primary transition-all"
                aria-label="Next testimonials"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Cards container with smooth transitions */}
            <div className="overflow-hidden py-8">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${(activeIndex * 100) / visibleCards}%)` }}
              >
                {successStories.map((story) => (
                  <div
                    key={story.id}
                    className={`w-full md:w-1/2 xl:w-1/2 flex-shrink-0 px-3 md:px-4`}
                  >
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full transform hover:-translate-y-1 transition-all duration-300">
                      <div className="relative">
                        {/* Decorative top border */}
                        <div className="h-2 bg-gradient-to-r from-secondary to-primary"></div>

                        {/* Quote icon */}
                        <div className="absolute -bottom-6 right-6 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shadow-md">
                          <Quote size={18} className="text-primary" />
                        </div>
                      </div>

                      <div className="p-6 pb-8 pt-10">
                        <p className="text-[#5C3F43] italic mb-6">"{story.story}"</p>

                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                            <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="ml-4">
                            <h4 className="font-semibold text-gray-800">{story.name}</h4>
                            <p className="text-sm text-primary">{story.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(successStories.length / visibleCards) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index * visibleCards)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${Math.floor(activeIndex / visibleCards) === index
                    ? 'w-6 bg-primary'
                    : 'bg-gray-300 hover:bg-primary/40'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Ready to write your own success story?</h3>
            <button className="px-8 py-3 bg-gradient-to-r from-secondary to-primary text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
              <span className="font-medium">Start Your Journey Today</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

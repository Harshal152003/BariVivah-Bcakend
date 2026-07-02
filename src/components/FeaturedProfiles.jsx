"use client"
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Briefcase, Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function FeaturedProfiles({ onAction }) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [initialRender, setInitialRender] = useState(false);
  const carouselRef = useRef(null);
  const cardsRef = useRef([]);

  const profiles = [
    {
      name: "Priya",
      age: 28,
      city: "Mumbai",
      profession: "Software Engineer",
      photo: "/people/people1.png"
    },
    {
      name: "Arjun",
      age: 31,
      city: "Delhi",
      profession: "Marketing Director",
      photo: "/people/people4.png"
    },
    {
      name: "Ananya",
      age: 27,
      city: "Bangalore",
      profession: "Doctor",
      photo: "/people/people2.png"
    },
    {
      name: "Vikram",
      age: 30,
      city: "Chennai",
      profession: "Architect",
      photo: "/people/vikram.jpg"
    },
    {
      name: "Neha",
      age: 29,
      city: "Kolkata",
      profession: "Fashion Designer",
      photo: "/people/people3.png"
    },
    {
      name: "Rohan",
      age: 32,
      city: "Pune",
      profession: "Investment Banker",
      photo: "/people/rohan.jpg"
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);


  const scrollToIndex = (index) => {
    let newIndex;
    if (index < 0) {
      newIndex = profiles.length - 1;
    } else if (index >= profiles.length) {
      newIndex = 0;
    } else {
      newIndex = index;
    }
    setCurrentIndex(newIndex);
  };

  const scrollLeft = () => {
    scrollToIndex(currentIndex - 1);
    if (cardsRef.current[currentIndex]) {
      cardsRef.current[currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  const scrollRight = () => {
    scrollToIndex(currentIndex + 1);
    if (cardsRef.current[currentIndex]) {
      cardsRef.current[currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  return (
    <div className="relative py-24 w-full overflow-hidden bg-white lg:px-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-40 left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl opacity-20"></div>
        <div className="absolute top-60 right-1/4 w-60 h-60 rounded-full bg-accent/20 blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold text-secondary mb-4 font-serif">Featured Profiles</h2>
          <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
            Meet some of our exceptional members looking for meaningful connections
          </p>
        </div>

        <div className="relative">
          {/* Carousel navigation buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 backdrop-blur-md text-primary rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 md:-left-6 hover:-translate-x-1"
            aria-label="Previous profile"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 backdrop-blur-md text-primary rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 md:-right-6 hover:translate-x-1"
            aria-label="Next profile"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel container */}
          <div
            ref={carouselRef}
            className="flex gap-8 overflow-x-auto pb-8 pt-4 px-2 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {profiles.map((profile, index) => (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className="flex-shrink-0 w-80 snap-center p-2"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-2 hover:border-[#7E5D8C] transition-all duration-300 transform hover:scale-105 group border border-gray-100 h-full flex flex-col">
                  {/* Profile image */}
                  <div className="relative h-96 overflow-hidden flex-shrink-0">
                    <Image
                      width={1920}
                      height={1080}
                      src={profile.photo}
                      alt={profile.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>

                    {/* Like button overlay */}
                    <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/60 transition-all duration-300 z-10">
                      <Heart size={20} className="text-white hover:text-primary transition-colors duration-300" />
                    </button>

                    {/* Name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <h3 className="text-2xl font-semibold mb-1">{profile.name}, {profile.age}</h3>
                    </div>
                  </div>

                  {/* Profile info */}
                  <div className="p-5 bg-white flex flex-col flex-grow">
                    <div className="space-y-3 mb-4 flex-grow">
                      <div className="flex items-center text-secondary/80">
                        <MapPin size={16} className="mr-2 text-primary" />
                        <span>{profile.city}</span>
                      </div>
                      <div className="flex items-center text-secondary/80">
                        <Briefcase size={16} className="mr-2 text-primary" />
                        <span>{profile.profession}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => onAction ? onAction(() => router.push('/dashboard')) : router.push('/dashboard')}
                      className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:from-secondary hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {profiles.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-primary/20 hover:bg-primary/40'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
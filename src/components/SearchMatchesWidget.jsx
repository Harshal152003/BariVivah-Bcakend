"use client"
import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchMatchesWidget({ onAction }) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState({
    ageMin: 25,
    ageMax: 35,
    gender: '',
    location: '',
    religion: ''
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAction) {
      onAction(() => {
        router.push(`/dashboard/search?gender=${filters.gender}&location=${filters.location}&religion=${filters.religion}&ageMin=${filters.ageMin}&ageMax=${filters.ageMax}`);
      });
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl overflow-hidden transform -mt-8 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
      <div className={`p-1 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-xl p-4 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center gap-2 md:gap-4">
              <h3 className="text-secondary font-semibold text-lg flex items-center md:mr-2 lg:mr-4 md:pr-2 lg:pr-4 md:border-r md:border-gray-200">
                <Heart className="text-primary mr-2" size={20} />
                <span className="whitespace-nowrap">Find Matches</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1 w-full">
                {/* Age Range Filter */}
                <div className="relative w-full">
                  <div className="absolute left-3 top-3 text-secondary/50">
                    <Calendar size={18} />
                  </div>
                  <div className="flex items-center w-full">
                    <select
                      name="ageMin"
                      value={filters.ageMin}
                      onChange={handleChange}
                      className="pl-10 py-2 pr-2 bg-white rounded-l-lg border border-r-0 border-gray-200 text-secondary text-sm focus:ring-1 focus:ring-primary focus:outline-none w-full"
                    >
                      {Array.from({ length: 30 }, (_, i) => i + 18).map(age => (
                        <option key={`min-${age}`} value={age}>{age}</option>
                      ))}
                    </select>
                    <span className="bg-white border-t border-b border-gray-200 py-2 px-2 text-secondary/70 text-sm whitespace-nowrap">to</span>
                    <select
                      name="ageMax"
                      value={filters.ageMax}
                      onChange={handleChange}
                      className="pr-4 py-2 pl-2 bg-white rounded-r-lg border border-l-0 border-gray-200 text-secondary text-sm focus:ring-1 focus:ring-primary focus:outline-none w-full"
                    >
                      {Array.from({ length: 42 }, (_, i) => i + 18).map(age => (
                        <option key={`max-${age}`} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gender Filter */}
                <div className="relative w-full">
                  <div className="absolute left-3 top-3 text-secondary/50">
                    <Users size={18} />
                  </div>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleChange}
                    className="pl-10 py-2 pr-4 bg-white rounded-lg border border-gray-200 text-secondary w-full text-sm focus:ring-1 focus:ring-primary focus:outline-none appearance-none"
                  >
                    <option value="">Looking for</option>
                    <option value="female">Bride</option>
                    <option value="male">Groom</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div className="relative w-full">
                  <div className="absolute left-3 top-3 text-secondary/50">
                    <MapPin size={18} />
                  </div>
                  <select
                    name="location"
                    value={filters.location}
                    onChange={handleChange}
                    className="pl-10 py-2 pr-4 bg-white rounded-lg border border-gray-200 text-secondary w-full text-sm focus:ring-1 focus:ring-primary focus:outline-none appearance-none"
                  >
                    <option value="">Any Location</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="chennai">Chennai</option>
                    <option value="kolkata">Kolkata</option>
                    <option value="international">International</option>
                  </select>
                </div>

                {/* Religion/Caste Filter */}
                <div className="relative w-full">
                  <div className="absolute left-3 top-3 text-secondary/50">
                    <Heart size={18} />
                  </div>
                  <select
                    name="religion"
                    value={filters.religion}
                    onChange={handleChange}
                    className="pl-10 py-2 pr-4 bg-white rounded-lg border border-gray-200 text-secondary w-full text-sm focus:ring-1 focus:ring-primary focus:outline-none appearance-none"
                  >
                    <option value="">Any Religion</option>
                    <option value="hindu">Hindu</option>
                    <option value="muslim">Muslim</option>
                    <option value="christian">Christian</option>
                    <option value="sikh">Sikh</option>
                    <option value="jain">Jain</option>
                    <option value="buddhist">Buddhist</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="flex-shrink-0 px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:from-secondary hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center whitespace-nowrap w-full sm:w-auto"
              >
                <Search size={18} className="mr-2" />
                <span className="font-medium">Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
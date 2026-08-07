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
    <div className="w-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden transform -mt-12 relative z-30 max-w-[1200px] mx-auto px-6 py-6 md:px-10 md:py-8 border border-gray-50">
      <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-4 md:gap-6 justify-between">
          
          {/* Looking For */}
          <div className="w-full md:flex-1">
            <label className="block text-[#5C3F43] text-[13px] font-medium mb-2 pl-2">Looking For</label>
            <div className="relative">
              <select
                name="gender"
                value={filters.gender}
                onChange={handleChange}
                className="w-full bg-[#f8f8f8] text-gray-800 rounded-[14px] px-5 py-3.5 appearance-none focus:outline-none focus:ring-1 focus:ring-primary text-[15px] font-medium cursor-pointer"
              >
                <option value="female">Bride</option>
                <option value="male">Groom</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#5C3F43]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Age Range */}
          <div className="w-full md:flex-[1.5]">
            <label className="block text-[#5C3F43] text-[13px] font-medium mb-2 pl-2">Age</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <select
                  name="ageMin"
                  value={filters.ageMin}
                  onChange={handleChange}
                  className="w-full bg-[#f8f8f8] text-gray-800 rounded-[14px] px-5 py-3.5 appearance-none focus:outline-none focus:ring-1 focus:ring-primary text-[15px] font-medium cursor-pointer"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 18).map(age => (
                    <option key={`min-${age}`} value={age}>{age}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#5C3F43]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              <span className="text-[#5C3F43] font-medium text-[15px]">to</span>
              <div className="relative flex-1">
                <select
                  name="ageMax"
                  value={filters.ageMax}
                  onChange={handleChange}
                  className="w-full bg-[#f8f8f8] text-gray-800 rounded-[14px] px-5 py-3.5 appearance-none focus:outline-none focus:ring-1 focus:ring-primary text-[15px] font-medium cursor-pointer"
                >
                  {Array.from({ length: 42 }, (_, i) => i + 18).map(age => (
                    <option key={`max-${age}`} value={age}>{age}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#5C3F43]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Religion */}
          <div className="w-full md:flex-1">
            <label className="block text-[#5C3F43] text-[13px] font-medium mb-2 pl-2">Religion</label>
            <div className="relative">
              <select
                name="religion"
                value={filters.religion}
                onChange={handleChange}
                className="w-full bg-[#f8f8f8] text-gray-800 rounded-[14px] px-5 py-3.5 appearance-none focus:outline-none focus:ring-1 focus:ring-primary text-[15px] font-medium cursor-pointer"
              >
                <option value="hindu">Hindu</option>
                <option value="muslim">Muslim</option>
                <option value="christian">Christian</option>
                <option value="sikh">Sikh</option>
                <option value="jain">Jain</option>
                <option value="buddhist">Buddhist</option>
                <option value="other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#5C3F43]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full md:w-auto h-[52px]">
            <button
              type="submit"
              className="w-full md:w-auto h-full px-10 bg-primary text-white rounded-[14px] hover:bg-primary/90 transition-all duration-300 flex items-center justify-center font-medium text-[16px]"
            >
              <Search size={18} className="mr-2" strokeWidth={2.5} />
              Search
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

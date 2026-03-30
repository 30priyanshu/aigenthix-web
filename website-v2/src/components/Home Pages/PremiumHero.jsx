import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { SEARCH_INDEX } from "../../lib/constants";

import image1 from "../IMAGES/Home Page images/PremiumHero images/image1.webp";
import image2 from "../IMAGES/Home Page images/PremiumHero images/image2.webp";
import image3 from "../IMAGES/Home Page images/PremiumHero images/image3.webp";
import image4 from "../IMAGES/Home Page images/PremiumHero images/image4.webp";
import image5 from "../IMAGES/Home Page images/PremiumHero images/image5.webp";

const IMAGES = [
  image1,
  image2,
  image3,
  image4,
  image5,
];

const QUICK_TAGS = [
  "Artificial Intelligence & ML",
  "Data Engineering",
  "Robotics",
  "Sahayak AI",
  "AI Interviewer",
];

const findMatches = (value) => {
  const normalizedValue = value.trim().toLowerCase();
  if (!normalizedValue) return [];
  return SEARCH_INDEX.filter(({ keywords }) =>
    keywords.some((keyword) => keyword.includes(normalizedValue))
  );
};

const PremiumHero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const matches = useMemo(() => findMatches(query), [query]);
  const suggestions = matches.slice(0, 8);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage((previous) => (previous + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(intervalId);
  }, []);

  const goToBestMatch = (value) => {
    const bestMatch = findMatches(value)[0];
    if (!bestMatch) {
      alert("No matching product/service found");
      return;
    }
    navigate(bestMatch.to);
  };

  return (
    <section className="w-full pt-28 pb-20 relative overflow-hidden font-serif bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        <div className="animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            Master Tomorrow&apos;s Skills Today
          </h2>
          <p className="mt-5 text-gray-700 text-lg">
            Transform your career with AI, Robotics, Enterprise Software &amp;
            Digital Innovation
          </p>
          <div className="mt-10 relative">
            <div className="flex items-center bg-white/70 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl overflow-hidden hover:scale-[1.02] transition duration-300">
              <input
                type="text"
                placeholder="Search Products or Services..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    goToBestMatch(query);
                  }
                }}
                className="w-full px-6 py-4 outline-none text-gray-800 bg-transparent"
              />
              <button
                onClick={() => goToBestMatch(query)}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              >
                <FaSearch />
                Search
              </button>
            </div>
            {query.trim() && suggestions.length > 0 && (
              <div className="absolute w-full bg-white shadow-xl rounded-xl mt-2 border z-20">
                {suggestions.map((item) => (
                  <button
                    key={`${item.category}-${item.to}`}
                    onClick={() => {
                      setQuery(item.label);
                      navigate(item.to);
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-indigo-50 transition"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {QUICK_TAGS.map((label) => (
              <button
                key={label}
                onClick={() => goToBestMatch(label)}
                className="px-5 py-2 bg-white shadow-md rounded-full text-sm hover:scale-105 hover:shadow-xl transition duration-300"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="relative h-[420px] w-full">
          {IMAGES.map((imageUrl, index) => (
            <img
              key={imageUrl}
              src={imageUrl}
              alt="slide"
              className={`absolute top-0 left-0 w-full h-full object-cover rounded-3xl shadow-xl transition-opacity duration-1000 ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
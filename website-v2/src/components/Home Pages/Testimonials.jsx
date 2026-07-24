import React, { useRef } from 'react';

// Import images
import timesGroupImg from '../IMAGES/time.jpeg';
import beamWellyImg from '../IMAGES/bean.jpeg';
import vincentCollegeImg from '../IMAGES/collage logo.png';

const testimonialsData = [
  {
    name: "TIMES Group",
    author: "Mr. Abhijeet Jagirdar",
    date: "29/4/2025",
    image: timesGroupImg,
    rating: 4,
    quote: "Team AiGENThix delivers transformative, future-ready solutions that drive real business impact — a trusted innovation partner blending ethical AI with deep industry expertise.",
  },
  {
    name: "BeamWelly",
    author: "Bhargavi Patnaik",
    date: "5/6/2025",
    image: beamWellyImg,
    rating: 5,
    quote: "Partnering with AiGENThix has been a game-changer — their AI-driven insights and ethical approach have elevated our operations to new heights. Their team's agility and deep technical expertise make them an invaluable strategic ally.",
  },
  {
    name: "St. Vincent Pallotti College",
    author: "Mrs. Khushi Khobragade",
    date: "18/3/2025",
    image: vincentCollegeImg,
    rating: 4,
    quote: "Collaborating with AiGENThix through our MoU has empowered our students with hands-on exposure to real-world AI applications. Their commitment to ethical innovation and skill development makes them a true academic-industry bridge.",
  },
];

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.691-.921 1.99 0l1.434 4.409a1 1 0 00.95.691h4.636c.969 0 1.371 1.24.588 1.81l-3.753 2.731a1 1 0 00-.364 1.118l1.434 4.409c.3.921-.755 1.688-1.54 1.118l-3.753-2.731a1 1 0 00-1.175 0l-3.753 2.731c-.784.57-1.838-.197-1.539-1.118l1.434-4.409a1 1 0 00-.364-1.118L2.02 9.837c-.783-.57-.381-1.81.588-1.81h4.636a1 1 0 00.95-.691l1.434-4.409z" />
      </svg>
    );
  }
  return <div className="flex justify-center mb-3">{stars}</div>;
};

const Testimonials = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-[#0D345B] py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4 text-center tracking-wider">
          Client Success Stories and Testimonials
        </h2>
        <p className="text-lg text-gray-300 mb-16 text-center max-w-3xl mx-auto">
          Hear directly from our partners about the transformative impact of AiGENThix solutions.
        </p>

        {/* Arrows */}
        <div className="hidden md:flex justify-between items-center absolute top-1/2 left-0 right-0 px-6 z-20">
          <button
            onClick={() => scroll('left')}
            className="bg-[#1a4f8d] hover:bg-[#245ea8] text-white p-3 rounded-full shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => scroll('right')}
            className="bg-[#1a4f8d] hover:bg-[#245ea8] text-white p-3 rounded-full shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Card Container */}
        <div
          ref={scrollRef}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible scroll-smooth snap-x snap-mandatory scrollbar-hide"
        >
          {testimonialsData.map((data, index) => (
            <div
              key={index}
              className="bg-[#0F396D] min-w-[85%] sm:min-w-[60%] md:min-w-0 p-8 rounded-xl shadow-2xl hover:shadow-3xl transition duration-500 transform hover:-translate-y-2 border border-[#1a4f8d] flex flex-col snap-center"
            >
              <div className="flex-grow">
                <div className="h-20 w-20 mx-auto mb-4 overflow-hidden rounded-full border-4 border-[#1a4f8d] shadow-lg">
                  <img
                    src={data.image}
                    alt={data.name}
                    className="object-cover w-full h-full grayscale hover:grayscale-0 transition duration-300"
                  />
                </div>

                <StarRating rating={data.rating} />

                <h3 className="text-2xl font-bold text-white mb-3 text-center">
                  {data.name}
                </h3>

                <p className="text-gray-300 text-base italic text-center mb-6 leading-relaxed">
                  &quot;{data.quote.substring(0, 100)}...&quot;
                </p>
              </div>

              <div className="text-center pt-4 border-t border-gray-700">
                <p className="text-sm font-medium text-white">{data.author}</p>
                <p className="text-xs text-gray-400 mt-1">{data.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

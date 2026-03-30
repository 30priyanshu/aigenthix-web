import React from 'react';

// NOTE: Since I cannot provide actual image files, I'm using placeholder URLs 
// for the new cards. You will need to replace these with your actual image imports.

// Placeholder imports for your original cards (assuming these paths are correct)
import blog1Img from '../IMAGES/blog1.jpg';
import blog2Img from '../IMAGES/blog2.jpg';
import blog3Img from '../IMAGES/blog3.jpg';

// --- Placeholder Images for New Cards (Replace with your actual imports) ---
const newBlog4Img = 'https://picsum.photos/seed/ai-ethics/500/350';
const newBlog5Img = 'https://picsum.photos/seed/ai-scalability/500/350';
const newBlog6Img = 'https://picsum.photos/seed/ai-finance/500/350';
// --------------------------------------------------------------------------


// --- Keyframe CSS for Continuous Loop Animation ---
const scrollAnimation = `
  @keyframes scrollLoop {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-50% - 16px)); } /* Moves half the content width + half the gap */
  }
`;

// Dynamically insert keyframes
try {
    const styleSheet = document.styleSheets[0];
    const rules = Array.from(styleSheet.cssRules).map(rule => rule.cssText);
    if (!rules.some(rule => rule.includes('@keyframes scrollLoop'))) {
        styleSheet.insertRule(scrollAnimation, styleSheet.cssRules.length);
    }
} catch (e) {
    console.warn("Could not insert CSS keyframes. Animations might not work.", e);
}


// Sample data for the blog posts, now with 6 entries
const blogPosts = [
    {
        tag: "AI Use Cases",
        date: "December 10, 2024",
        readTime: "8 min read",
        title: "AI agent for customer service: Key capabilities, use cases, benefits and...",
        excerpt: "AI agents enhance customer service by understanding inquiries, analyzing data, and generating accurate responses.",
        author: "Sarah Johnson",
        imagePath: blog1Img,
        authorImagePath: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=059669&color=fff&size=40',
    },
    {
        tag: "AI Technology",
        date: "December 5, 2024",
        readTime: "12 min read",
        title: "Agentic RAG: What it is, its types, applications and implementations",
        excerpt: "Agentic RAG represents a paradigm shift in information processing, offering a versatile toolkit for various industries and domains.",
        author: "Michael Chen",
        imagePath: blog2Img,
        authorImagePath: 'https://ui-avatars.com/api/?name=Michael+Chen&background=FBBF24&color=fff&size=40',
    },
    {
        tag: "Generative AI",
        date: "November 28, 2024",
        readTime: "15 min read",
        title: "Generative AI: Use cases, applications, solutions and...",
        excerpt: "Generative AI demonstrates versatile applications across diverse industries, leveraging its capacity to create novel content...",
        author: "Emily Rodriguez",
        imagePath: blog3Img,
        authorImagePath: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=EF4444&color=fff&size=40',
    },
    // --- THREE NEW CARDS ADDED HERE ---
    {
        tag: "AI Ethics",
        date: "November 20, 2024",
        readTime: "10 min read",
        title: "Building Trust: Key Principles for Ethical AI Development",
        excerpt: "Ensuring fairness, transparency, and accountability is paramount for the long-term adoption and societal benefit of AI technologies.",
        author: "David Lee",
        imagePath: newBlog4Img,
        authorImagePath: 'https://ui-avatars.com/api/?name=David+Lee&background=3B82F6&color=fff&size=40',
    },
    {
        tag: "Cloud Computing",
        date: "November 15, 2024",
        readTime: "9 min read",
        title: "Scalability in AI: Leveraging Cloud Infrastructure for Large Models",
        excerpt: "We explore how cloud environments provide the necessary power and flexibility to train and deploy increasingly massive AI models efficiently.",
        author: "Jessica T.",
        imagePath: newBlog5Img,
        authorImagePath: 'https://ui-avatars.com/api/?name=Jessica+T&background=10B981&color=fff&size=40',
    },
    {
        tag: "FinTech",
        date: "November 1, 2024",
        readTime: "7 min read",
        title: "Predictive Analytics: AI's Role in Modern Financial Risk Management",
        excerpt: "AI-driven models are transforming financial risk assessment by providing early warnings and deeper insights into market volatility and fraud.",
        author: "Robert Green",
        imagePath: newBlog6Img,
        authorImagePath: 'https://ui-avatars.com/api/?name=Robert+Green&background=F59E0B&color=fff&size=40',
    },
];

// Reusable component for a single blog card (No change to internal UI/UX)
const BlogCard = ({ post }) => {
    return (
        <div
            className="flex-shrink-0 w-80 lg:w-96 mx-2" // Ensure card does not shrink and has fixed width
            style={{ width: '300px' }} // Explicitly setting width for animation calculation
        >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 
                             transition duration-500 hover:shadow-2xl transform hover:-translate-y-2 group">
                {/* Image Area */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                        src={post.imagePath}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

                    {/* Tag Overlay */}
                    <span className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        {post.tag}
                    </span>
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col h-full">
                    {/* Metadata */}
                    <div className="flex justify-between text-xs text-gray-500 mb-3 font-medium">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {post.date}
                        </span>
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {post.readTime}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition duration-200 mb-3 leading-snug line-clamp-2">
                        <a href="#" className="block">{post.title}</a>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed line-clamp-3">
                        {post.excerpt}
                    </p>

                    {/* Footer (Author and Read More) */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex items-center">
                            <img
                                src={post.authorImagePath}
                                alt={post.author}
                                className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-blue-100"
                            />
                            <span className="text-sm font-semibold text-gray-700">{post.author}</span>
                        </div>

                        {/* Read More Link */}
                        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center group-hover:gap-2 transition-all duration-200">
                            Read more
                            <svg className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};


const Blog = () => {
    // Duplicate the posts to ensure a seamless loop animation (6 cards * 2 = 12 total in wrapper)
    const allPosts = [...blogPosts, ...blogPosts];

    return (
        <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-24 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Blog Heading */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-serif font-bold text-gray-800 tracking-tight mb-4">
                        AI Insights: Our Latest Blog Posts
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Stay informed with the latest insights, trends, and developments in AI technology and implementation
                    </p>
                </div>

                {/* --- Blog Cards SCROLLING Wrapper --- */}
                {/* The outer div hides the overflow */}
                <div className="overflow-hidden py-4">
                    {/* The inner div applies the continuous scroll animation */}
                    <div
                        className="flex"
                        style={{
                            width: 'calc(300px * 12 + 16px * 11)', // Total width for 12 cards + 11 gaps
                            animation: 'scrollLoop 60s linear infinite', // Adjust time for speed
                            gap: '16px', // Gap between cards (equivalent to Tailwind gap-4)
                        }}
                    >
                        {allPosts.map((post, index) => (
                            <BlogCard key={index} post={post} />
                        ))}
                    </div>
                </div>
                {/* --- END SCROLLING Wrapper --- */}

                {/* Button */}
                <div className="text-center mt-16">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-10 rounded-lg text-base transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        Show all Insights
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Blog;
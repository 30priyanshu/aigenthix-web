import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';



// Reusable component for a single blog card (No change to internal UI/UX)
const BlogCard = ({ post }) => {
    const fallbackImage = 'https://picsum.photos/seed/ai-ethics/500/350';
    return (
        <div
            className="flex-shrink-0 w-80 lg:w-96 mx-2" // Ensure card does not shrink and has fixed width
            style={{ width: '300px' }} // Explicitly setting width for animation calculation
        >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 
                             transition duration-500 hover:shadow-2xl transform hover:-translate-y-2 group h-full flex flex-col">
                {/* Image Area */}
                <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
                    <img
                        src={post.featured_image_url || fallbackImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

                    {/* Tag Overlay */}
                    <span className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        {post.category || 'Blog'}
                    </span>
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-grow">
                    {/* Metadata */}
                    <div className="flex justify-between text-xs text-gray-500 mb-3 font-medium">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recent'}
                        </span>
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {post.read_time || 5} min read
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition duration-200 mb-3 leading-snug line-clamp-2">
                        <Link to={`/blog/${post.slug}`} className="block">{post.title}</Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed line-clamp-3">
                        {post.excerpt || 'Read more about this topic in our detailed blog post...'}
                    </p>

                    {/* Footer (Author and Read More) */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex items-center">
                            <img
                                src={post.author_avatar_url || `https://ui-avatars.com/api/?name=${post.author_name || 'Admin'}&background=059669&color=fff&size=40`}
                                alt={post.author_name}
                                className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-blue-100"
                            />
                            <span className="text-sm font-semibold text-gray-700 truncate w-24">{post.author_name || 'Admin'}</span>
                        </div>

                        {/* Read More Link */}
                        <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center group-hover:gap-2 transition-all duration-200 flex-shrink-0">
                            Read more
                            <svg className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Blog = () => {
    const [blogPosts, setBlogPosts] = useState([]);

    useEffect(() => {
        blogService.getPageData().then(data => {
            if (data && data.latest) {
                setBlogPosts(data.latest);
            }
        }).catch(err => console.error("Error fetching blogs", err));
    }, []);

    // No more duplicating posts, each blog appears exactly once.
    const allPosts = blogPosts;

    const [isHovered, setIsHovered] = useState(false);
    const scrollContainerRef = React.useRef(null);

    useEffect(() => {
        if (isHovered || allPosts.length <= 3) return;
        
        let animationFrameId;
        let direction = 1; // 1 for right, -1 for left
        
        const scroll = () => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollLeft += direction * 0.5;
                
                // If reached the end, reverse direction
                if (scrollContainerRef.current.scrollLeft + scrollContainerRef.current.clientWidth >= scrollContainerRef.current.scrollWidth - 1) {
                    direction = -1;
                }
                // If reached the beginning, reverse direction
                else if (scrollContainerRef.current.scrollLeft <= 0) {
                    direction = 1;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };
        
        animationFrameId = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovered, allPosts.length]);

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

                {/* --- Blog Cards Wrapper --- */}
                <div 
                    className="overflow-x-auto hide-scrollbar py-4"
                    ref={scrollContainerRef}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{ scrollBehavior: 'auto' }}
                >
                    <div
                        className="flex"
                        style={{
                            gap: '16px',
                            width: 'max-content',
                            margin: allPosts.length <= 3 ? '0 auto' : '0'
                        }}
                    >
                        {allPosts.map((post, index) => (
                            <BlogCard key={`${post.slug}-${index}`} post={post} />
                        ))}
                        {allPosts.length === 0 && (
                            <div className="w-full text-center text-gray-500 py-10">
                                No blog posts available yet. Check back soon!
                            </div>
                        )}
                    </div>
                </div>
                {/* --- END Wrapper --- */}

                {/* Button */}
                <div className="text-center mt-16">
                    <Link to="/blog" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-10 rounded-lg text-base transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block">
                        Show all Insights
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Blog;
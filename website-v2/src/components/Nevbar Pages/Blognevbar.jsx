import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { blogService } from "../../services/blogService";
import { formatDate } from "../../utils/date";
import { optimizeImage } from "../../utils/image";
import { truncateText } from "../../utils/text";
import SEO from "../SEO";
import { breadcrumbSchema } from "../../lib/seo.schemas";

const BlogPage = () => {
  const [pageData, setPageData] = useState({
    featured: null,
    latest: [],
    popular: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      // Single optimized API call via shared blog service (uses SuccessResponse envelope).
      const data = await blogService.getPageData();

      setPageData({
        featured: data.featured,
        latest: data.latest || [],
        popular: data.popular || [],
        categories: data.categories || [],
      });
    } catch (error) {
      console.error("Failed to load blogs:", error);
      setError("Failed to load blogs. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-4 text-red-600">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
          <button
            onClick={loadBlogs}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white font-sans text-gray-800">
      <SEO
        title="AI Blog - Insights on Generative AI, ML & Technology - AiGENThix"
        description="Read the latest insights on Artificial Intelligence, Generative AI, Machine Learning, Robotics, and enterprise technology from AiGENThix experts."
        keywords="AI blog, artificial intelligence articles, generative AI insights, machine learning blog, technology trends, AiGENThix blog"
        structuredData={breadcrumbSchema([{ name: 'Blog', path: '/blog' }])}
      />
      {/* HERO SECTION */}
      <section
        className="text-center py-20 px-6 text-white"
        style={{
          background: "linear-gradient(135deg, #002B5B 0%, #004080 100%)",
          marginTop: "80px",
        }}
      >
        <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-6">
          Insights, Innovations & AI Stories
        </h1>
        <p className="text-lg text-gray-200 max-w-3xl mx-auto">
          Explore the latest perspectives from{" "}
          <span className="font-semibold">AiGENThix</span> — blending
          intelligence, ethics, and innovation to shape the future of
          technology.
        </p>
      </section>

      {/* FEATURED POST */}
      {pageData.featured && (
        <section className="py-20 px-6 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="lg:w-1/2">
                <img
                  src={optimizeImage(pageData.featured.featured_image_url, 800)}
                  alt={pageData.featured.title}
                  loading="eager"
                  className="w-full h-96 object-cover rounded-3xl shadow-lg"
                />
              </div>
              <div className="lg:w-1/2">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <p className="text-sm text-blue-600 font-semibold">FEATURED</p>
                  <span className="text-gray-400">•</span>
                  <p className="text-sm text-gray-600">{formatDate(pageData.featured.created_at)}</p>
                  {pageData.featured.author_name && (
                    <>
                      <span className="text-gray-400">•</span>
                      <p className="text-sm text-gray-600">{pageData.featured.author_name}</p>
                    </>
                  )}
                  {pageData.featured.read_time && (
                    <>
                      <span className="text-gray-400">•</span>
                      <p className="text-sm text-gray-600">{pageData.featured.read_time} min read</p>
                    </>
                  )}
                </div>

                {pageData.featured.tags && pageData.featured.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pageData.featured.tags.slice(0, 4).map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="text-4xl font-bold mb-4 text-gray-900 leading-tight">
                  {pageData.featured.title}
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  {pageData.featured.excerpt || truncateText(pageData.featured.content, 200)}
                </p>
                <Link
                  to={`/blog/${pageData.featured.slug}`}
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LATEST ARTICLES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold mb-10 text-gray-900 text-center">
            Latest Articles
          </h3>
          {pageData.latest.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-600 text-lg">No blogs published yet.</p>
              <p className="text-gray-500 text-sm mt-2">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {pageData.latest.map((post) => (
                <div
                  key={post.id}
                  className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={optimizeImage(post.featured_image_url, 600)}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {post.category && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-lg">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
                      <span>{formatDate(post.created_at)}</span>
                      {post.author_name && (
                        <>
                          <span>•</span>
                          <span>{post.author_name}</span>
                        </>
                      )}
                      {post.read_time && (
                        <>
                          <span>•</span>
                          <span>{post.read_time} min</span>
                        </>
                      )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                      {post.excerpt || truncateText(post.content, 120)}
                    </p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-all group/link"
                    >
                      Read More
                      <svg className="ml-1 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CATEGORY SECTION */}
      {pageData.categories.length > 0 && (
        <section className="py-20 px-6 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold mb-10 text-center">
              Explore by Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {pageData.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-gray-800 rounded-2xl p-6 hover:bg-blue-700 transition-all duration-300 cursor-pointer shadow-md transform hover:-translate-y-1"
                >
                  <h4 className="text-xl font-bold mb-2">{cat.name}</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    {cat.description || `Discover curated stories and research insights related to ${cat.name.toLowerCase()}.`}
                  </p>
                  <Link
                    to={`/blog?category=${encodeURIComponent(cat.name)}`}
                    className="inline-flex items-center text-blue-300 hover:text-white font-semibold transition-colors"
                  >
                    Explore
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER SECTION */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join our growing community of readers and receive curated AI news,
            insights, and case studies every week.
          </p>
          <form className="flex flex-col sm:flex-row items-center justify-center gap-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full sm:w-auto flex-grow px-5 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
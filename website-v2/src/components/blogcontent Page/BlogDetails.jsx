import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { blogService } from "../../services/blogService";
import { sanitizeHtml, escapeHtml } from "../../utils/security";
import { formatDate } from "../../utils/date";
import { optimizeImage } from "../../utils/image";
import LiteYouTube from "../LiteYouTube";
import SEO from "../SEO";
import { seoConfig } from "../../lib/seo.config";
import { breadcrumbSchema } from "../../lib/seo.schemas";

const YOUTUBE_IFRAME_RE = /<iframe[^>]*src=["']([^"']*(?:youtube\.com|youtu\.be)[^"']*)["'][^>]*(?:title=["']([^"']*)["'])?[^>]*><\/iframe>/gi;

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const viewIncremented = useRef(false);

  useEffect(() => {
    loadBlog();
    if (slug && !viewIncremented.current) {
      blogService.incrementView(slug);
      viewIncremented.current = true;
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => { viewIncremented.current = false; };
  }, [slug]);

  const loadBlog = async () => {
    setLoading(true);
    try {
      const blog = await blogService.getBlogBySlug(slug);
      setBlog(blog);
      loadRelatedBlogs(blog.category, blog.id);
    } catch (error) {
      console.error("Failed to load blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedBlogs = async (category, currentId) => {
    if (!category) return;
    try {
      const pageData = await blogService.getPageData();
      const related = (pageData.latest || [])
        .filter(b => b.category === category && b.id !== currentId)
        .slice(0, 3);
      setRelatedBlogs(related);
    } catch (error) {
      console.error("Failed to load related blogs:", error);
    }
  };

  const renderHtmlWithLiteYouTube = (html) => {
    const parts = [];
    let lastIndex = 0;
    let match;
    YOUTUBE_IFRAME_RE.lastIndex = 0;

    while ((match = YOUTUBE_IFRAME_RE.exec(html)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <div key={`html-${lastIndex}`} className="prose prose-lg max-w-none blog-content-html" dangerouslySetInnerHTML={{ __html: html.slice(lastIndex, match.index) }} style={{ color: '#374151', lineHeight: '1.75' }} />
        );
      }
      parts.push(<LiteYouTube key={`yt-${match.index}`} src={match[1]} title={match[2] || 'Video'} />);
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < html.length) {
      parts.push(
        <div key={`html-${lastIndex}`} className="prose prose-lg max-w-none blog-content-html" dangerouslySetInnerHTML={{ __html: html.slice(lastIndex) }} style={{ color: '#374151', lineHeight: '1.75' }} />
      );
    }

    return parts.length > 0 ? parts : (
      <div className="prose prose-lg max-w-none blog-content-html" dangerouslySetInnerHTML={{ __html: html }} style={{ color: '#374151', lineHeight: '1.75' }} />
    );
  };

  const renderContent = (content) => {
    if (!content) return "";

    if (content.includes('<p>') || content.includes('<h2>') || content.includes('<iframe>')) {
      const sanitized = sanitizeHtml(content, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
      });
      return renderHtmlWithLiteYouTube(sanitized);
    }

    // Handle Markdown-style content
    const paragraphs = content.split('\n\n');

    return paragraphs.map((para, index) => {
      // Headers
      if (para.startsWith('## ')) {
        return <h2 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{para.replace('## ', '')}</h2>;
      }
      if (para.startsWith('### ')) {
        return <h3 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{para.replace('### ', '')}</h3>;
      }
      if (para.startsWith('#### ')) {
        return <h4 key={index} className="text-xl font-bold text-gray-900 mt-5 mb-2">{para.replace('#### ', '')}</h4>;
      }

      // Bullet lists
      if (para.includes('\n- ')) {
        const items = para.split('\n- ').filter(i => i);
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            {items.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}
          </ul>
        );
      }

      // Numbered lists
      if (/^\d+\.\s/.test(para)) {
        const items = para.split(/\n\d+\.\s/).filter(i => i);
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 mb-6 text-gray-700">
            {items.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}
          </ol>
        );
      }

      // Blockquotes
      if (para.startsWith('> ')) {
        return (
          <blockquote key={index} className="border-l-4 border-blue-600 pl-4 py-2 my-6 italic text-gray-700 bg-blue-50 rounded-r-lg">
            {para.replace('> ', '')}
          </blockquote>
        );
      }

      // Code blocks
      if (para.startsWith('```')) {
        const code = para.replace(/```\w*\n?/, '').replace(/```$/, '');
        return (
          <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
            <code>{code}</code>
          </pre>
        );
      }

      // Regular paragraphs with formatting - sanitize after markdown conversion
      let text = para
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
        .replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
          // Validate URL before creating link
          const safeUrl = escapeHtml(url);
          const safeText = escapeHtml(linkText);
          return `<a href="${safeUrl}" class="text-blue-600 hover:underline hover:text-blue-800 transition-colors font-medium" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
        });

      // Sanitize the final HTML
      const sanitized = sanitizeHtml(text);

      return (
        <p
          key={index}
          className="text-gray-800 leading-relaxed text-base sm:text-lg mb-6"
          style={{ color: '#1f2937' }}
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
      );
    });
  };

  const getSocialIcon = (platform) => {
    const icons = {
      twitter: Twitter,
      linkedin: Linkedin,
      facebook: Facebook,
      instagram: Instagram,
      website: Globe
    };
    return icons[platform] || Globe;
  };

  const renderCTA = (position) => {
    if (!blog.cta_text || !blog.cta_url) return null;
    if (blog.cta_position !== position && blog.cta_position !== 'both') return null;

    const buttonClass = blog.cta_style === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : blog.cta_style === 'secondary'
        ? 'bg-gray-800 text-white hover:bg-gray-900'
        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700';

    return (
      <div className="my-8 text-center">
        <a
          href={blog.cta_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-8 py-4 ${buttonClass} font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105`}
        >
          {blog.cta_text}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareArticle = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog.title);

    const urls = {
      facebook: `https://facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ marginTop: "80px" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ marginTop: "80px" }}>
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h2>
          <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg"
          >
            ← Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  const authorSocials = [
    { platform: 'twitter', url: blog.author_twitter },
    { platform: 'linkedin', url: blog.author_linkedin },
    { platform: 'facebook', url: blog.author_facebook },
    { platform: 'instagram', url: blog.author_instagram },
    { platform: 'website', url: blog.author_website }
  ].filter(s => s.url);

  const articleSchema = blog ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.content?.substring(0, 160),
    image: blog.featured_image_url || seoConfig.defaultImage,
    datePublished: blog.published_at || blog.created_at,
    dateModified: blog.updated_at || blog.published_at || blog.created_at,
    author: {
      '@type': 'Person',
      name: blog.author_name || 'AiGENThix',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AiGENThix',
      logo: { '@type': 'ImageObject', url: `${seoConfig.siteUrl}/faviconlogo.jpeg` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${seoConfig.siteUrl}/blog/${slug}`,
    },
  } : null;

  const blogBreadcrumb = breadcrumbSchema([
    { name: 'Blog', path: '/blog' },
    ...(blog ? [{ name: blog.title, path: `/blog/${slug}` }] : []),
  ]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {blog && (
        <SEO
          title={`${blog.title} - AiGENThix Blog`}
          description={blog.excerpt || blog.content?.substring(0, 160)}
          keywords={blog.tags?.join(', ') || blog.category || 'AI, technology, AiGENThix'}
          image={blog.featured_image_url}
          type="article"
          article={{
            publishedTime: blog.published_at || blog.created_at,
            author: blog.author_name || 'AiGENThix',
          }}
          structuredData={[articleSchema, blogBreadcrumb].filter(Boolean)}
        />
      )}
      {/* HERO SECTION */}
      <section
        className="relative text-center text-white py-20 px-4 sm:px-8 md:px-16 lg:px-24"
        style={{
          background: "linear-gradient(135deg, #002B5B 0%, #004080 100%)",
          marginTop: "80px",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {blog.category && (
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                {blog.category}
              </span>
            )}
            {blog.tags && blog.tags.length > 0 && blog.tags.slice(0, 4).map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 text-sm rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {blog.title}
          </h1>
          <p className="max-w-3xl mx-auto text-gray-200 text-sm sm:text-base md:text-lg">
            {blog.excerpt || blog.content.substring(0, 200) + "..."}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg max-w-none"
            >
              {/* META INFO */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600 mb-6 sm:mb-8 border-b pb-4 sm:pb-6 border-gray-200 text-sm sm:text-base">
                {blog.author_name && (
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-700" />
                    <span className="font-medium">{blog.author_name}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-700" />
                  <span>{formatDate(blog.published_at || blog.created_at)}</span>
                </div>
                {blog.read_time && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-700" />
                    <span>{blog.read_time} min read</span>
                  </div>
                )}
              </div>

              {/* FEATURED IMAGE */}
              {blog.featured_image_url && (
                <img
                  src={optimizeImage(blog.featured_image_url, 1200)}
                  alt={blog.title}
                  loading="eager"
                  className="w-full h-56 sm:h-72 md:h-80 lg:h-96 object-cover rounded-2xl mb-6 sm:mb-8 shadow-lg"
                />
              )}

              {/* CTA TOP */}
              {renderCTA('top')}

              {/* BLOG CONTENT */}
              <div className="blog-content prose prose-lg max-w-none">
                {renderContent(blog.content)}
              </div>

              {/* CTA BOTTOM */}
              {renderCTA('bottom')}

              {/* RELEVANT ARTICLES */}
              {blog.relevant_articles && blog.relevant_articles.length > 0 && (
                <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    📚 Relevant Articles
                  </h3>
                  <div className="space-y-4">
                    {blog.relevant_articles.map((article, idx) => (
                      <a
                        key={idx}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200 group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                              {article.title}
                            </h4>
                            {article.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{article.description}</p>
                            )}
                            <p className="text-xs text-blue-600 truncate">{article.url}</p>
                          </div>
                          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* SHARE SECTION */}
              <div className="mt-10 sm:mt-12 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="font-semibold text-gray-900 text-center sm:text-left">
                    Share this article:
                  </span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => shareArticle('facebook')}
                      className="border border-blue-700 text-blue-700 p-2 rounded-full hover:bg-blue-700 hover:text-white transition-all"
                      title="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => shareArticle('twitter')}
                      className="border border-blue-700 text-blue-700 p-2 rounded-full hover:bg-blue-700 hover:text-white transition-all"
                      title="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => shareArticle('linkedin')}
                      className="border border-blue-700 text-blue-700 p-2 rounded-full hover:bg-blue-700 hover:text-white transition-all"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="border border-blue-700 text-blue-700 p-2 rounded-full hover:bg-blue-700 hover:text-white transition-all"
                      title="Copy link"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* BACK BUTTON */}
            <div className="flex justify-center mt-10">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                ← Back to Blogs
              </Link>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1 space-y-8">
            {/* AUTHOR CARD */}
            {blog.author_name && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center">
                {blog.author_avatar_url ? (
                  <img
                    src={blog.author_avatar_url}
                    alt={blog.author_name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-700 to-purple-700 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {blog.author_name.charAt(0)}
                  </div>
                )}
                <h3 className="font-bold text-lg mb-1">{blog.author_name}</h3>
                {blog.author_title && (
                  <p className="text-sm text-gray-600 mb-4">{blog.author_title}</p>
                )}
                {blog.author_bio && (
                  <p className="text-sm text-gray-700 mb-4">{blog.author_bio}</p>
                )}

                {authorSocials.length > 0 && (
                  <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-200">
                    {authorSocials.map((social, idx) => {
                      const Icon = getSocialIcon(social.platform);
                      return (
                        <a
                          key={idx}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                          title={social.platform}
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* RELATED ARTICLES */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <h3 className="font-bold text-lg mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group cursor-pointer flex items-center space-x-3"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={optimizeImage(post.featured_image_url, 400)}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        {post.category && (
                          <p className="text-xs sm:text-sm text-blue-700 font-semibold mb-1">
                            {post.category}
                          </p>
                        )}
                        <p className="font-medium text-sm sm:text-base text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {post.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* NEWSLETTER */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-700 to-purple-700 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">Subscribe to Newsletter</h3>
              <p className="text-sm text-white/90 mb-4">
                Get the latest AI insights delivered to your inbox.
              </p>
              <button className="w-full bg-white text-blue-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
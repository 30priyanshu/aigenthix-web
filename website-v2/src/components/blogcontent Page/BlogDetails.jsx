import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  Clock,
  ExternalLink,
  Copy,
  Check,
  ChevronDown
} from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGlobe, FaGithub } from "react-icons/fa";
import { blogService } from "../../services/blogService";
import { sanitizeHtml, escapeHtml } from "../../utils/security";
import { formatDate } from "../../utils/date";
import { optimizeImage } from "../../utils/image";
import LiteYouTube from "../LiteYouTube";
import SEO from "../SEO";
import { seoConfig } from "../../lib/seo.config";
import { breadcrumbSchema } from "../../lib/seo.schemas";

const YOUTUBE_IFRAME_RE = /<iframe[^>]*src=["']([^"']*(?:youtube\.com|youtu\.be)[^"']*)["'][^>]*(?:title=["']([^"']*)["'])?[^>]*><\/iframe>/gi;
const YOUTUBE_LINK_RE = /<a[^>]*href=["'](https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)[^"']*)["'][^>]*>.*?<\/a>|https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)[^\s<]*/gi;

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
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

    // Now process raw links in the remaining HTML parts
    const processLinks = (rawHtml) => {
      const linkParts = [];
      let lastLinkIndex = 0;
      let linkMatch;
      YOUTUBE_LINK_RE.lastIndex = 0;

      while ((linkMatch = YOUTUBE_LINK_RE.exec(rawHtml)) !== null) {
        if (linkMatch.index > lastLinkIndex) {
          linkParts.push(
            <div key={`html-link-${lastLinkIndex}`} className="prose prose-lg max-w-none blog-content-html" dangerouslySetInnerHTML={{ __html: rawHtml.slice(lastLinkIndex, linkMatch.index) }} style={{ color: '#374151', lineHeight: '1.75' }} />
          );
        }
        const videoId = linkMatch[2] || linkMatch[3];
        if (videoId) {
          linkParts.push(
            <div key={`yt-link-${linkMatch.index}`} className="my-8 rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <LiteYouTube src={`https://www.youtube.com/embed/${videoId}`} title='YouTube Video' />
            </div>
          );
        }
        lastLinkIndex = linkMatch.index + linkMatch[0].length;
      }

      if (lastLinkIndex < rawHtml.length) {
        linkParts.push(
          <div key={`html-link-${lastLinkIndex}`} className="prose prose-lg max-w-none blog-content-html" dangerouslySetInnerHTML={{ __html: rawHtml.slice(lastLinkIndex) }} style={{ color: '#374151', lineHeight: '1.75' }} />
        );
      }
      return linkParts.length > 0 ? linkParts : (
        <div className="prose prose-lg max-w-none blog-content-html" dangerouslySetInnerHTML={{ __html: rawHtml }} style={{ color: '#374151', lineHeight: '1.75' }} />
      );
    };

    const finalParts = parts.length > 0 ? parts : processLinks(html);
    
    // If we already split by iframe, we still need to process links in the HTML chunks
    if (parts.length > 0) {
      return parts.map((part, i) => {
        if (part.type === 'div' && part.props.dangerouslySetInnerHTML) {
          return <React.Fragment key={i}>{processLinks(part.props.dangerouslySetInnerHTML.__html)}</React.Fragment>;
        }
        return part;
      });
    }
    
    return finalParts;
  };

  const renderContent = (content) => {
    if (!content) return "";

    if (content.includes('<p>') || content.includes('<h2>') || content.includes('<iframe>') || content.includes('youtu')) {
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
      twitter: <FaTwitter className="h-5 w-5" style={{ color: '#1DA1F2' }} />,
      linkedin: <FaLinkedin className="h-5 w-5" style={{ color: '#0A66C2' }} />,
      facebook: <FaFacebook className="h-5 w-5" style={{ color: '#1877F2' }} />,
      instagram: <FaInstagram className="h-5 w-5" style={{ color: '#E4405F' }} />,
      website: <FaGlobe className="h-5 w-5" style={{ color: '#000000' }} />
    };
    return icons[platform] || <FaGlobe className="h-5 w-5" />;
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
    <div className="bg-white min-h-screen font-sans">
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ marginTop: "80px" }}>
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* MAIN CONTENT - LEFT SIDE (70%) */}
          <div className="w-full lg:w-[70%]">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* META INFO */}
              <div className="flex flex-col gap-6 text-gray-500 mb-8 border-b border-gray-100 pb-6">
                <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Published: {formatDate(blog.created_at)}</span>
                  </div>
                  {blog.updated_at && blog.updated_at !== blog.created_at && (
                    <div className="flex items-center space-x-2 text-gray-600 font-semibold italic">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {formatDate(blog.updated_at)}</span>
                    </div>
                  )}
                  {blog.read_time && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{blog.read_time} min read</span>
                    </div>
                  )}
                  {blog.category && (
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold tracking-wide uppercase">
                      {blog.category}
                    </div>
                  )}
                  
                  {/* Share Icons in Meta row */}
                  <div className="flex items-center space-x-3 ml-auto">
                    <button onClick={() => shareArticle('twitter')} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500" title="Share on Twitter">
                      <FaTwitter className="h-4 w-4" />
                    </button>
                    <button onClick={() => shareArticle('linkedin')} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500" title="Share on LinkedIn">
                      <FaLinkedin className="h-4 w-4" />
                    </button>
                    <button onClick={copyToClipboard} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500" title="Copy link">
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Author and Fact-Checker Row */}
                <div className="flex flex-wrap items-start gap-10 mt-2">
                  {blog.author_name && (
                    <div className="relative group flex items-center space-x-4 cursor-pointer">
                      {blog.author_avatar_url ? (
                        <img src={blog.author_avatar_url} alt={blog.author_name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">By</div>
                        <div className="font-bold text-gray-900 text-[15px] hover:text-blue-600 transition-colors">{blog.author_name}</div>
                        <div className="flex items-center gap-3 mt-1">
                          {blog.author_twitter && <a href={blog.author_twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1DA1F2] transition-colors"><FaTwitter className="w-[14px] h-[14px]" /></a>}
                          {blog.author_linkedin && <a href={blog.author_linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#0A66C2] transition-colors"><FaLinkedin className="w-[14px] h-[14px]" /></a>}
                          {blog.author_facebook && <a href={blog.author_facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors"><FaFacebook className="w-[14px] h-[14px]" /></a>}
                          {blog.author_instagram && <a href={blog.author_instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#E4405F] transition-colors"><FaInstagram className="w-[14px] h-[14px]" /></a>}
                        </div>
                      </div>
                      
                      {/* Tooltip */}
                      {blog.author_bio && (
                        <div className="absolute bottom-full left-0 mb-3 hidden group-hover:block w-72 p-4 bg-gray-900 text-white text-sm rounded-xl z-20 shadow-2xl transition-all">
                          <div className="font-semibold mb-1 text-base">{blog.author_name}</div>
                          <p className="text-gray-300 leading-relaxed text-[13px]">{blog.author_bio}</p>
                          <div className="absolute top-full left-6 -mt-1 border-8 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  )}

                  {blog.fact_checker_name && (
                    <div className="relative group flex items-center space-x-4 cursor-pointer">
                      {blog.fact_checker_avatar_url ? (
                        <img src={blog.fact_checker_avatar_url} alt={blog.fact_checker_name} className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-blue-50 p-0.5" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100">
                          <Check className="h-6 w-6 text-blue-500" />
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-blue-600 flex items-center gap-1 font-semibold uppercase tracking-wider">
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          Fact-Checked by
                        </div>
                        <div className="font-bold text-gray-900 text-[15px] hover:text-blue-600 transition-colors">{blog.fact_checker_name}</div>
                      </div>
                      
                      {/* Tooltip */}
                      {blog.fact_checker_bio && (
                        <div className="absolute bottom-full left-0 mb-3 hidden group-hover:block w-72 p-4 bg-gray-900 text-white text-sm rounded-xl z-20 shadow-2xl transition-all">
                          <div className="font-semibold mb-1 text-base">{blog.fact_checker_name}</div>
                          <p className="text-gray-300 leading-relaxed text-[13px]">{blog.fact_checker_bio}</p>
                          <div className="absolute top-full left-6 -mt-1 border-8 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* FEATURED IMAGE */}
              {blog.featured_image_url && (
                <img
                  src={optimizeImage(blog.featured_image_url, 1200)}
                  alt={blog.title}
                  loading="eager"
                  className="w-full h-auto max-h-[500px] object-cover rounded-xl mb-10 shadow-sm"
                />
              )}

              {/* SHARE SECTION (GROWW STYLE - HORIZONTAL) */}
              <div className="mb-8 p-4 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                <span className="font-semibold text-gray-700 text-sm">
                  Share this article
                </span>
                <div className="flex items-center space-x-4">
                  <button onClick={() => shareArticle('facebook')} className="hover:opacity-80 transition-opacity" title="Share on Facebook">
                    <FaFacebook className="h-6 w-6" style={{ color: '#1877F2' }} />
                  </button>
                  <button onClick={() => shareArticle('twitter')} className="hover:opacity-80 transition-opacity" title="Share on Twitter">
                    <FaTwitter className="h-6 w-6" style={{ color: '#1DA1F2' }} />
                  </button>
                  <button onClick={() => shareArticle('linkedin')} className="hover:opacity-80 transition-opacity" title="Share on LinkedIn">
                    <FaLinkedin className="h-6 w-6" style={{ color: '#0A66C2' }} />
                  </button>
                  <button onClick={copyToClipboard} className="text-gray-500 hover:text-gray-800 transition-colors" title="Copy link">
                    {copied ? <Check className="h-6 w-6 text-green-500" /> : <Copy className="h-6 w-6" />}
                  </button>
                </div>
              </div>

              {/* CTA TOP */}
              {renderCTA('top')}

              {/* BLOG CONTENT */}
              <div className="blog-content prose prose-lg max-w-none text-gray-800">
                {renderContent(blog.content)}
              </div>

              {/* CTA BOTTOM */}
              {renderCTA('bottom')}

              {/* RELEVANT ARTICLES */}
              {blog.relevant_articles && blog.relevant_articles.length > 0 && (
                <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Relevant References
                  </h3>
                  <div className="space-y-3">
                    {blog.relevant_articles.map((article, idx) => (
                      <a
                        key={idx}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-100 group"
                      >
                        <div className="flex-1 pr-4">
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h4>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* AUTHOR DETAILS SECTION (BOTTOM) */}
              {blog.author_name && (
                <div className="mt-16">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">About Author</h3>
                  <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6">
                    {blog.author_avatar_url ? (
                      <img src={blog.author_avatar_url} alt={blog.author_name} className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white flex-shrink-0" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center shadow-md border-4 border-white flex-shrink-0">
                        <User className="h-10 w-10 text-gray-500" />
                      </div>
                    )}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{blog.author_name}</h3>
                    {blog.author_title && (
                      <p className="text-blue-600 font-medium mb-3">{blog.author_title}</p>
                    )}
                    {blog.author_bio && (
                      <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">{blog.author_bio}</p>
                    )}
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      {blog.author_twitter && <a href={blog.author_twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-colors"><FaTwitter className="w-4 h-4" /></a>}
                      {blog.author_linkedin && <a href={blog.author_linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors"><FaLinkedin className="w-4 h-4" /></a>}
                      {blog.author_facebook && <a href={blog.author_facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1877F2] hover:border-[#1877F2] transition-colors"><FaFacebook className="w-4 h-4" /></a>}
                      {blog.author_instagram && <a href={blog.author_instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#E4405F] hover:border-[#E4405F] transition-colors"><FaInstagram className="w-4 h-4" /></a>}
                      {blog.author_github && <a href={blog.author_github} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-colors"><FaGithub className="w-4 h-4" /></a>}
                      {blog.author_website && <a href={blog.author_website} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:border-blue-500 transition-colors"><FaGlobe className="w-4 h-4" /></a>}
                    </div>
                  </div>
                  </div>
                </div>
              )}

              {/* FAQs SECTION */}
              {blog.faqs && blog.faqs.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {blog.faqs.map((faq, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:border-blue-200 transition-colors">
                        <button
                          onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                          className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 focus:outline-none"
                        >
                          <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                          <ChevronDown className={`w-5 h-5 text-blue-600 transition-transform duration-300 flex-shrink-0 ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="px-6 pb-5 pt-1 text-gray-600 leading-relaxed text-[15px]">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.article>

            {/* ALL TOPICS (BOTTOM) */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">All Topics</h3>
              <div className="flex flex-wrap gap-3">
                {['AI', 'Technology', 'Machine Learning', 'Generative AI', 'Data Engineering', 'Robotics'].map((topic, i) => (
                  <Link key={i} to={`/blog?category=${topic.toLowerCase()}`} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-full text-sm transition-colors">
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR - RIGHT SIDE (30%) */}
          <div className="w-full lg:w-[30%] space-y-8 lg:pl-4 lg:sticky lg:top-32 lg:self-start">
            
            {/* CTA CARD */}
            <div className="bg-[#002B5B] text-white p-8 rounded-2xl shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-3">Empower Your Business with AI</h3>
              <p className="text-sm text-gray-300 mb-6">Join leading enterprises and start your AI transformation today.</p>
              <Link to="/contact">
                <button className="w-full bg-[#00e676] hover:bg-[#00c853] text-[#002B5B] py-3 rounded-xl font-bold transition-colors">
                  CONTACT US
                </button>
              </Link>
            </div>

            {/* RECENT POSTS */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-4 pb-3 border-b border-gray-100">Recent Posts</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((post) => (
                    <Link
                      key={`recent-${post.id}`}
                      to={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h4 className="text-[15px] font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(post.published_at || post.created_at)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED POSTS (Can be different list or same context) */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-4 pb-3 border-b border-gray-100">Related Posts</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((post) => (
                    <Link
                      key={`related-${post.id}`}
                      to={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h4 className="text-[15px] font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(post.published_at || post.created_at)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* NEWSLETTER WIDGET */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl shadow-sm text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Subscribe to our Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">Get the latest AI insights and news delivered to your inbox weekly.</p>
              <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Your email address" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" required />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">Subscribe</button>
              </form>
            </div>

            {/* ADVERTISEMENT PLACEHOLDER */}
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg group cursor-pointer border border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop" alt="AI Masterclass" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded w-max mb-2 shadow-sm">Advertisement</span>
                <h3 className="text-white font-bold text-xl mb-1 leading-tight">Mastering Generative AI</h3>
                <p className="text-gray-300 text-xs mb-4">Join our exclusive 4-week bootcamp and build real AI applications.</p>
                <span className="text-sm font-semibold text-[#00e676] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Enroll Now <span aria-hidden="true">→</span>
                </span>
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
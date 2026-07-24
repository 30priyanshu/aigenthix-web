import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';
import SEO from '../SEO';

const BlogEditor = () => {
  // --- STATE FOR ALL BLOG FIELDS ---

  // Basic Info
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');

  // Content
  const [content, setContent] = useState('');

  // Author Details
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState('');
  
  // Author Social Links
  const [authorTwitter, setAuthorTwitter] = useState('');
  const [authorLinkedin, setAuthorLinkedin] = useState('');
  const [authorFacebook, setAuthorFacebook] = useState('');
  const [authorInstagram, setAuthorInstagram] = useState('');
  const [authorWebsite, setAuthorWebsite] = useState('');

  // SEO & Extras
  const [readTime, setReadTime] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  
  // Call to Action (CTA)
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [ctaPosition, setCtaPosition] = useState('none');
  const [ctaStyle, setCtaStyle] = useState('primary');

  // --- MS WORD-LIKE QUILL CONFIGURATION ---
  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'font', 'size', 'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script', 'align', 'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  const handleSave = () => {
    const blogData = {
      title, slug, category, tags: tags.split(',').map(t => t.trim()), excerpt, featured_image_url: featuredImageUrl,
      content,
      author_name: authorName, author_title: authorTitle, author_bio: authorBio, author_avatar_url: authorAvatarUrl,
      author_twitter: authorTwitter, author_linkedin: authorLinkedin, author_facebook: authorFacebook, author_instagram: authorInstagram, author_website: authorWebsite,
      read_time: readTime, meta_title: metaTitle, meta_description: metaDescription, meta_keywords: metaKeywords,
      cta_text: ctaText, cta_url: ctaUrl, cta_position: ctaPosition, cta_style: ctaStyle
    };
    
    console.log("Saving blog payload:", blogData);
    alert("Blog payload generated! Check console to see the data structure ready for backend.");
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-24 pb-12 font-sans">
      <SEO title="CMS Blog Editor - AiGENThix" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Create Blog Post</h1>
            <p className="text-gray-500 mt-1">Complete the fields below to publish a new article.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/blog" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Cancel
            </Link>
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#002B5B] text-white font-bold rounded-lg hover:bg-blue-800 transition-colors shadow-lg"
            >
              Save & Publish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Content & Basic Info */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Section 1: Basic Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-5 border-b pb-2">Basic Information</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Blog Title *</label>
                  <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" placeholder="Enter an engaging title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (URL)</label>
                    <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="my-awesome-post" value={slug} onChange={(e) => setSlug(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="e.g. Artificial Intelligence" value={category} onChange={(e) => setCategory(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (Comma separated)</label>
                  <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="AI, Machine Learning, Tech" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Featured Image URL</label>
                  <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="https://example.com/image.jpg" value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt (Short Summary)</label>
                  <textarea className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white h-24 resize-none" placeholder="Brief summary for the blog listing page..." value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Section 2: Rich Text Editor */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-5 border-b pb-2">Content Editor (MS Word Style)</h2>
              <div className="bg-white">
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent} 
                  modules={modules}
                  formats={formats}
                  className="h-[500px] mb-12"
                />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Author, SEO, Settings */}
          <div className="xl:col-span-1 space-y-8">
            
            {/* Section 3: Author Details */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Author Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Name</label>
                  <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Title</label>
                  <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. Lead Data Scientist" value={authorTitle} onChange={(e) => setAuthorTitle(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Avatar URL</label>
                  <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500" value={authorAvatarUrl} onChange={(e) => setAuthorAvatarUrl(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Bio</label>
                  <textarea className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 h-20 resize-none" value={authorBio} onChange={(e) => setAuthorBio(e.target.value)} />
                </div>
                
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Social Links</h3>
                  <div className="space-y-2">
                    <input type="text" className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-xs" placeholder="Twitter URL" value={authorTwitter} onChange={(e) => setAuthorTwitter(e.target.value)} />
                    <input type="text" className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-xs" placeholder="LinkedIn URL" value={authorLinkedin} onChange={(e) => setAuthorLinkedin(e.target.value)} />
                    <input type="text" className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-xs" placeholder="Website URL" value={authorWebsite} onChange={(e) => setAuthorWebsite(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: SEO & Meta */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">SEO & Display</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Read Time (mins)</label>
                  <input type="number" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500" value={readTime} onChange={(e) => setReadTime(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Meta Title</label>
                  <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Meta Description</label>
                  <textarea className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 h-16 resize-none" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Section 5: Call To Action */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Call To Action (CTA)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Position</label>
                  <select className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500" value={ctaPosition} onChange={(e) => setCtaPosition(e.target.value)}>
                    <option value="none">None</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                {ctaPosition !== 'none' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Button Text</label>
                      <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500" value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Button URL</label>
                      <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Button Style</label>
                      <select className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500" value={ctaStyle} onChange={(e) => setCtaStyle(e.target.value)}>
                        <option value="primary">Primary (Blue)</option>
                        <option value="secondary">Secondary (Dark)</option>
                        <option value="gradient">Gradient</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Live Preview Section */}
        {content && (
          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#002B5B]">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Live Preview Output</h2>
            <div className="prose prose-lg max-w-none blog-content-html bg-gray-50 p-6 rounded-xl border border-gray-100" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
        
      </div>
    </div>
  );
};

export default BlogEditor;

import { BlogsApi, ProductsApi, ServicesApi, IndustriesApi, RDApi, UsersApi } from '../services/api';

export const SCHEMAS = {
    blogs: {
        id: 'blogs',
        title: 'Blogs',
        api: BlogsApi,
        fields: [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'slug', label: 'Slug', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'text', required: true },
            { name: 'tags', label: 'Tags (comma separated)', type: 'text', required: false },
            { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: false },
            { name: 'featured_image_url', label: 'Featured Image URL', type: 'image', required: true },
            { name: 'featured_image_alt', label: 'Featured Image Alt Text (Required for SEO)', type: 'text', required: true },
            { name: 'content', label: 'Content', type: 'richtext', required: true },
            
            // Author Fields
            { name: 'author_id', label: 'Select Main Author', type: 'author_single_select', required: true },
            { name: 'author_ids', label: 'Select Contributors', type: 'authors_multi_select', required: false },
            
            // Fact Checker Fields
            { name: 'fact_checker_ids', label: 'Select Fact Checkers', type: 'fact_checkers_multi_select', required: false },
            
            // FAQs
            { name: 'faqs', label: 'Frequently Asked Questions', type: 'faq_list', required: false },
            
            // SEO & CTA
            { name: 'read_time', label: 'Read Time (mins)', type: 'number', required: false },
            { name: 'schema_type', label: 'Schema Type', type: 'schema_select', required: false },
            { name: 'show_toc', label: 'Show Table of Contents', type: 'toggle', required: false },
            { name: 'meta_title', label: 'Meta Title', type: 'text', required: false },
            { name: 'meta_description', label: 'Meta Description', type: 'textarea', required: false },
            { name: 'cta_text', label: 'CTA Button Text', type: 'text', required: false },
            { name: 'cta_url', label: 'CTA URL', type: 'text', required: false },
            { 
                name: 'ad_category', 
                label: 'Advertisement Category', 
                type: 'select', 
                options: [
                    { value: '', label: 'None' },
                    { value: 'products', label: 'Aigenthix Products' },
                    { value: 'services', label: 'Consulting Services' },
                    { value: 'courses', label: 'Training & Courses' }
                ],
                required: false 
            }
        ]
    },
    products: {
        id: 'products',
        title: 'Products',
        api: ProductsApi,
        fields: [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'slug', label: 'Slug', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: true },
            { name: 'image_url', label: 'Product Image URL', type: 'text', required: false },
            { name: 'hero_image_url', label: 'Hero Background Image URL', type: 'text', required: false },
            { name: 'expertise_header', label: 'Platform Capabilities Header', type: 'text', required: false, isContentData: true },
            { name: 'expertise_description', label: 'Platform Capabilities Description', type: 'textarea', required: false, isContentData: true },
            { name: 'expertise_cards', label: 'Platform Capabilities Cards (Up to 6)', type: 'cards_grid', required: false, isContentData: true },
            { name: 'demo_video_url', label: 'Demo Video URL (YouTube link)', type: 'text', required: false },
            { name: 'demo_description', label: 'Demo Description', type: 'textarea', required: false },
            { name: 'highlights', label: 'Highlights / Why Choose Us (Comma separated)', type: 'textarea', required: false },
            { name: 'content_data', label: 'Raw Content Data (JSON format, Advanced)', type: 'textarea', required: false },
        ]
    },
    services: {
        id: 'services',
        title: 'Services',
        api: ServicesApi,
        fields: [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'slug', label: 'Slug', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: true },
            { name: 'icon_url', label: 'Icon URL', type: 'text', required: false },
            { name: 'expertise_header', label: 'Expertise Header (For Cards Grid)', type: 'text', required: false, isContentData: true },
            { name: 'expertise_description', label: 'Expertise Description', type: 'textarea', required: false, isContentData: true },
            { name: 'expertise_cards', label: 'Expertise Cards (Up to 6)', type: 'cards_grid', required: false, isContentData: true },
            { name: 'extra_details', label: 'Advanced Extra Sections (Dynamic UI)', type: 'extra_details_list', required: false, isContentData: true },
            { name: 'cta_title', label: 'CTA Title', type: 'text', required: false },
            { name: 'cta_description', label: 'CTA Description', type: 'textarea', required: false },
            { name: 'cta_text', label: 'CTA Button Text', type: 'text', required: false },
            { name: 'cta_url', label: 'CTA URL', type: 'text', required: false },
            { name: 'content_data', label: 'Raw Content Data (JSON format, Advanced)', type: 'textarea', required: false },
        ]
    },
    industries: {
        id: 'industries',
        title: 'Industries',
        api: IndustriesApi,
        fields: [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'slug', label: 'Slug', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: true },
            { name: 'image_url', label: 'Hero Image URL', type: 'text', required: false },
            { name: 'expertise_header', label: 'Capabilities Header', type: 'text', required: false, isContentData: true },
            { name: 'expertise_description', label: 'Capabilities Description', type: 'textarea', required: false, isContentData: true },
            { name: 'expertise_cards', label: 'Capabilities Cards (Up to 6)', type: 'cards_grid', required: false, isContentData: true },
            { name: 'extra_details', label: 'Advanced Extra Sections (Dynamic UI)', type: 'extra_details_list', required: false, isContentData: true },
            { name: 'cta_title', label: 'CTA Title', type: 'text', required: false },
            { name: 'cta_description', label: 'CTA Description', type: 'textarea', required: false },
            { name: 'cta_text', label: 'CTA Button Text', type: 'text', required: false },
            { name: 'cta_url', label: 'CTA URL', type: 'text', required: false },
            { name: 'content_data', label: 'Advanced Content Data (JSON format)', type: 'textarea', required: false },
        ]
    },
    rd: {
        id: 'rd',
        title: 'R&D',
        api: RDApi,
        fields: [
            { name: 'project_name', label: 'Project Name', type: 'text', required: true },
            { name: 'slug', label: 'Slug', type: 'text', required: true },
            { name: 'summary', label: 'Summary', type: 'textarea', required: true },
            { name: 'details', label: 'Details', type: 'textarea', required: true },
            { name: 'content_data', label: 'Content Data (JSON format)', type: 'textarea', required: false },
        ]
    }
};

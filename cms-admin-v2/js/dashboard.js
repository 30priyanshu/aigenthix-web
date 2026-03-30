/**
 * Dashboard Page Controller
 * Handles blog listing, search, filter, bulk actions, and preview.
 * Depends on: config.js, utils.js, auth.js, api.js
 */

(function () {
    'use strict';

    // Require authentication
    if (!Auth.requireAuth()) return;

    // ============================================
    // State
    // ============================================
    let blogs = [];
    let filteredBlogs = [];
    let selectedIds = new Set();
    let currentFilter = 'all';
    let searchQuery = '';

    // ============================================
    // DOM Elements
    // ============================================
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const userName = document.getElementById('user-name');
    const refreshBtn = document.getElementById('refresh-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // Stats
    const statTotal = document.getElementById('stat-total');
    const statPublished = document.getElementById('stat-published');
    const statDraft = document.getElementById('stat-draft');
    const statFeatured = document.getElementById('stat-featured');

    // Search & Filter
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const filterTabs = document.querySelectorAll('.filter-tab');

    // Bulk Actions
    const bulkActionsBar = document.getElementById('bulk-actions');
    const selectedCountEl = document.getElementById('selected-count');
    const bulkPublishBtn = document.getElementById('bulk-publish');
    const bulkUnpublishBtn = document.getElementById('bulk-unpublish');
    const bulkDeleteBtn = document.getElementById('bulk-delete');
    const bulkCancelBtn = document.getElementById('bulk-cancel');

    // Blog List
    const blogList = document.getElementById('blog-list');
    const emptyState = document.getElementById('empty-state');
    const emptyTitle = document.getElementById('empty-title');
    const emptySubtitle = document.getElementById('empty-subtitle');
    const emptyCta = document.getElementById('empty-cta');
    const errorState = document.getElementById('error-state');
    const errorMessage = document.getElementById('error-message');
    const retryBtn = document.getElementById('retry-btn');

    // Preview Modal
    const previewModal = document.getElementById('preview-modal');
    const closePreviewBtn = document.getElementById('close-preview');
    const previewImage = document.getElementById('preview-image');
    const previewStatus = document.getElementById('preview-status');
    const previewCategory = document.getElementById('preview-category');
    const previewDate = document.getElementById('preview-date');
    const previewReadTime = document.getElementById('preview-read-time');
    const previewTitle = document.getElementById('preview-title');
    const previewAuthor = document.getElementById('preview-author');
    const previewExcerpt = document.getElementById('preview-excerpt');
    const previewTags = document.getElementById('preview-tags');
    const previewSlug = document.getElementById('preview-slug');

    // ============================================
    // Initialization
    // ============================================
    function init() {
        // Set user name
        const user = Auth.getUser();
        if (user?.name) {
            userName.textContent = user.name;
        }

        // Bind events
        bindEvents();

        // Load blogs
        loadBlogs();
    }

    function bindEvents() {
        // Refresh button
        refreshBtn.addEventListener('click', loadBlogs);

        // Logout button
        logoutBtn.addEventListener('click', () => Auth.logout());

        // Search input with debounce
        searchInput.addEventListener('input', Utils.debounce((e) => {
            searchQuery = e.target.value.trim();
            clearSearchBtn.classList.toggle('hidden', !searchQuery);
            applyFilters();
        }, 300));

        // Clear search
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            clearSearchBtn.classList.add('hidden');
            applyFilters();
        });

        // Filter tabs
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentFilter = tab.dataset.filter;
                applyFilters();
            });
        });

        // Bulk actions
        bulkPublishBtn.addEventListener('click', handleBulkPublish);
        bulkUnpublishBtn.addEventListener('click', handleBulkUnpublish);
        bulkDeleteBtn.addEventListener('click', handleBulkDelete);
        bulkCancelBtn.addEventListener('click', clearSelection);

        // Retry button
        retryBtn.addEventListener('click', loadBlogs);

        // Close preview modal
        closePreviewBtn.addEventListener('click', closePreview);
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) closePreview();
        });

        // ESC to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !previewModal.classList.contains('hidden')) {
                closePreview();
            }
        });
    }

    // ============================================
    // Data Loading
    // ============================================
    async function loadBlogs() {
        showLoading();

        try {
            blogs = await BlogsApi.getAll();
            updateStats();
            applyFilters();
            showContent();
        } catch (error) {
            console.error('Failed to load blogs:', error);
            showError(error.message);
        }
    }

    // ============================================
    // UI State Management
    // ============================================
    function showLoading() {
        loadingScreen.classList.remove('hidden');
        mainContent.classList.add('hidden');
    }

    function showContent() {
        loadingScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        errorState.classList.add('hidden');
    }

    function showError(message) {
        loadingScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        blogList.classList.add('hidden');
        emptyState.classList.add('hidden');
        errorState.classList.remove('hidden');
        errorMessage.textContent = message;
    }

    // ============================================
    // Stats
    // ============================================
    function updateStats() {
        const total = blogs.length;
        const published = blogs.filter(b => b.published).length;
        const draft = blogs.filter(b => !b.published).length;
        const featured = blogs.filter(b => b.is_featured).length;

        statTotal.textContent = total;
        statPublished.textContent = published;
        statDraft.textContent = draft;
        statFeatured.textContent = featured;
    }

    // ============================================
    // Filtering
    // ============================================
    function applyFilters() {
        let result = [...blogs];

        // Apply filter
        if (currentFilter === 'published') {
            result = result.filter(b => b.published);
        } else if (currentFilter === 'draft') {
            result = result.filter(b => !b.published);
        } else if (currentFilter === 'featured') {
            result = result.filter(b => b.is_featured);
        }

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(b =>
                (b.title || '').toLowerCase().includes(query) ||
                (b.category && b.category.toLowerCase().includes(query)) ||
                (b.author_name && b.author_name.toLowerCase().includes(query))
            );
        }

        filteredBlogs = result;
        renderBlogList();
    }

    // ============================================
    // Rendering
    // ============================================
    function renderBlogList() {
        // Clear previous
        blogList.innerHTML = '';
        errorState.classList.add('hidden');

        if (filteredBlogs.length === 0) {
            blogList.classList.add('hidden');
            emptyState.classList.remove('hidden');

            if (searchQuery || currentFilter !== 'all') {
                emptyTitle.textContent = 'No blogs match your filter';
                emptySubtitle.textContent = 'Try adjusting your search or filter';
                emptyCta.classList.add('hidden');
            } else {
                emptyTitle.textContent = 'No blogs yet';
                emptySubtitle.textContent = 'Create your first blog post to get started';
                emptyCta.classList.remove('hidden');
            }
            return;
        }

        blogList.classList.remove('hidden');
        emptyState.classList.add('hidden');

        // Render each blog
        filteredBlogs.forEach(blog => {
            const row = createBlogRow(blog);
            blogList.appendChild(row);
        });
    }

    function createBlogRow(blog) {
        const row = document.createElement('div');
        row.className = 'blog-row';
        row.dataset.id = blog.id;

        const isSelected = selectedIds.has(blog.id);

        row.innerHTML = `
      <!-- Checkbox -->
      <div class="checkbox-cell hide-mobile">
        <button class="checkbox-btn ${isSelected ? 'checked' : ''}" data-action="toggle-select" data-id="${blog.id}">
          ${isSelected ? checkboxCheckedIcon : checkboxIcon}
        </button>
      </div>

      <!-- Title & Info -->
      <div>
        <h3 class="title line-clamp-1">${Utils.escapeHtml(blog.title)}</h3>
        <p class="excerpt line-clamp-1">${Utils.escapeHtml(blog.excerpt) || 'No excerpt'}</p>
        <p class="meta">by ${Utils.escapeHtml(blog.author_name) || 'Unknown'} • ${Utils.formatDate(blog.created_at)}</p>
      </div>

      <!-- Category -->
      <div class="hide-mobile">
        ${blog.category
                ? `<span class="badge badge-gray">${Utils.escapeHtml(blog.category)}</span>`
                : '<span class="text-muted">—</span>'
            }
      </div>

      <!-- Status -->
      <div class="flex items-center gap-sm">
        <span class="badge ${blog.published ? 'badge-green' : 'badge-yellow'}">
          ${blog.published ? eyeIcon + ' Published' : eyeOffIcon + ' Draft'}
        </span>
        ${blog.is_featured ? `<span style="color: var(--color-accent-yellow);">${starFilledIcon}</span>` : ''}
      </div>

      <!-- Actions -->
      <div class="actions">
        <button class="action-btn" data-action="preview" data-id="${blog.id}" title="Preview">
          ${eyeIcon}
        </button>
        <a href="blog-edit.html?id=${blog.id}" class="action-btn edit" title="Edit">
          ${editIcon}
        </a>
        <button class="action-btn star ${blog.is_featured ? 'active' : ''}" data-action="toggle-featured" data-id="${blog.id}" title="${blog.is_featured ? 'Unfeature' : 'Feature'}">
          ${blog.is_featured ? starFilledIcon : starIcon}
        </button>
        <button class="action-btn publish" data-action="toggle-publish" data-id="${blog.id}" title="${blog.published ? 'Unpublish' : 'Publish'}">
          ${blog.published ? eyeOffIcon : eyeIcon}
        </button>
        <button class="action-btn delete" data-action="delete" data-id="${blog.id}" title="Delete">
          ${trashIcon}
        </button>
      </div>
    `;

        // Bind action buttons
        row.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', handleAction);
        });

        return row;
    }

    // ============================================
    // Action Handlers
    // ============================================
    async function handleAction(e) {
        const action = e.currentTarget.dataset.action;
        const id = parseInt(e.currentTarget.dataset.id, 10);

        switch (action) {
            case 'toggle-select':
                toggleSelect(id);
                break;
            case 'preview':
                showPreview(id);
                break;
            case 'toggle-featured':
                await toggleFeatured(id);
                break;
            case 'toggle-publish':
                await togglePublish(id);
                break;
            case 'delete':
                await deleteBlog(id);
                break;
        }
    }

    // ============================================
    // Selection
    // ============================================
    function toggleSelect(id) {
        if (selectedIds.has(id)) {
            selectedIds.delete(id);
        } else {
            selectedIds.add(id);
        }
        updateBulkActionsBar();
        renderBlogList();
    }

    function clearSelection() {
        selectedIds.clear();
        updateBulkActionsBar();
        renderBlogList();
    }

    function updateBulkActionsBar() {
        const count = selectedIds.size;
        selectedCountEl.textContent = count;
        bulkActionsBar.classList.toggle('hidden', count === 0);
    }

    // ============================================
    // Blog Actions
    // ============================================
    async function toggleFeatured(id) {
        // Optimistic update
        const blogIndex = blogs.findIndex(b => b.id === id);
        if (blogIndex === -1) return;

        const previousState = blogs[blogIndex].is_featured;
        blogs[blogIndex].is_featured = !previousState;
        
        // Re-render immediately
        updateStats();
        applyFilters();

        try {
            await BlogsApi.toggleFeatured(id);
            Utils.showToast('Featured status updated', 'success');
        } catch (error) {
            // Revert on error
            blogs[blogIndex].is_featured = previousState;
            updateStats();
            applyFilters();
            Utils.showToast(error.message, 'error');
        }
    }

    async function togglePublish(id) {
        // Optimistic update
        const blogIndex = blogs.findIndex(b => b.id === id);
        if (blogIndex === -1) return;

        const previousState = blogs[blogIndex].published;
        blogs[blogIndex].published = !previousState;
        
        // Re-render immediately
        updateStats();
        applyFilters();

        try {
            await BlogsApi.togglePublish(id);
            Utils.showToast('Publish status updated', 'success');
        } catch (error) {
            // Revert on error
            blogs[blogIndex].published = previousState;
            updateStats();
            applyFilters();
            Utils.showToast(error.message, 'error');
        }
    }

    async function deleteBlog(id) {
        if (!Utils.confirm('Delete this blog? This cannot be undone.')) return;

        // Optimistic update
        const blogIndex = blogs.findIndex(b => b.id === id);
        if (blogIndex === -1) return;

        const deletedBlog = blogs[blogIndex];
        blogs.splice(blogIndex, 1);
        
        // Remove from selection if present
        if (selectedIds.has(id)) {
            selectedIds.delete(id);
            updateBulkActionsBar();
        }

        // Re-render immediately
        updateStats();
        applyFilters();

        try {
            await BlogsApi.delete(id);
            Utils.showToast('Blog deleted', 'success');
        } catch (error) {
            // Revert on error
            blogs.splice(blogIndex, 0, deletedBlog);
            updateStats();
            applyFilters();
            Utils.showToast(error.message, 'error');
        }
    }

    // ============================================
    // Bulk Actions
    // ============================================
    async function handleBulkPublish() {
        if (!selectedIds.size) return;

        try {
            await BlogsApi.bulkPublish(Array.from(selectedIds));
            clearSelection();
            await loadBlogs();
            Utils.showToast('Blogs published', 'success');
        } catch (error) {
            Utils.showToast(error.message, 'error');
        }
    }

    async function handleBulkUnpublish() {
        if (!selectedIds.size) return;

        try {
            await BlogsApi.bulkUnpublish(Array.from(selectedIds));
            clearSelection();
            await loadBlogs();
            Utils.showToast('Blogs unpublished', 'success');
        } catch (error) {
            Utils.showToast(error.message, 'error');
        }
    }

    async function handleBulkDelete() {
        if (!selectedIds.size) return;
        if (!Utils.confirm(`Delete ${selectedIds.size} blogs? This cannot be undone.`)) return;

        try {
            await BlogsApi.bulkDelete(Array.from(selectedIds));
            clearSelection();
            await loadBlogs();
            Utils.showToast('Blogs deleted', 'success');
        } catch (error) {
            Utils.showToast(error.message, 'error');
        }
    }

    // ============================================
    // Preview Modal
    // ============================================
    function showPreview(id) {
        const blog = blogs.find(b => b.id === id);
        if (!blog) return;

        // Populate modal
        previewImage.src = blog.featured_image_url || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80';
        previewImage.alt = blog.title;

        previewStatus.textContent = blog.published ? 'Published' : 'Draft';
        previewStatus.className = `badge ${blog.published ? 'badge-green' : 'badge-yellow'}`;

        previewCategory.textContent = blog.category || 'Uncategorized';
        previewCategory.classList.toggle('hidden', !blog.category);

        previewDate.textContent = Utils.formatDate(blog.created_at);
        previewReadTime.textContent = blog.read_time ? `${blog.read_time} min read` : '';

        previewTitle.textContent = blog.title;
        previewAuthor.textContent = blog.author_name ? `By ${blog.author_name}` : '';
        previewExcerpt.textContent = blog.excerpt || '';
        previewSlug.textContent = blog.slug;

        // Tags
        previewTags.innerHTML = '';
        if (blog.tags && blog.tags.length) {
            blog.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'tag';
                tagEl.textContent = `#${tag}`;
                previewTags.appendChild(tagEl);
            });
            previewTags.classList.remove('hidden');
        } else {
            previewTags.classList.add('hidden');
        }

        // Show modal
        previewModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closePreview() {
        previewModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // ============================================
    // SVG Icons
    // ============================================
    const checkboxIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>`;
    const checkboxCheckedIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`;
    const eyeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeOffIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    const editIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
    const starIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    const starFilledIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    const trashIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;

    // ============================================
    // Start
    // ============================================
    init();
})();

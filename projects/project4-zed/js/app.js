// app.js - Main application controller

// DOM Elements
const openFormBtn = document.getElementById('openFormBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const cancelFormBtn = document.getElementById('cancelFormBtn');
const addLinkModal = document.getElementById('addLinkModal');
const addLinkForm = document.getElementById('addLinkForm');
const linksGrid = document.getElementById('linksGrid');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
    renderLinks();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Modal controls
    openFormBtn.addEventListener('click', openModal);
    closeFormBtn.addEventListener('click', closeModal);
    cancelFormBtn.addEventListener('click', closeModal);
    addLinkModal.addEventListener('click', (e) => {
        if (e.target === addLinkModal) closeModal();
    });

    // Form submission
    addLinkForm.addEventListener('submit', handleFormSubmit);

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });

    console.log('Event listeners attached');
}

// Open modal
function openModal() {
    addLinkModal.classList.add('active');
    console.log('Modal opened');
}

// Close modal
function closeModal() {
    addLinkModal.classList.remove('active');
    addLinkForm.reset();
    console.log('Modal closed');
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('linkTitle').value.trim(),
        url: document.getElementById('linkUrl').value.trim(),
        category: document.getElementById('linkCategory').value,
        price: document.getElementById('linkPrice').value.trim()
    };

    console.log('Form submitted with data:', formData);

    // Validate URL
    if (!isValidUrl(formData.url)) {
        alert('Please enter a valid URL');
        return;
    }

    // Handle optional image upload
    const imageInput = document.getElementById('linkImage');
    if (imageInput.files && imageInput.files[0]) {
        const imageFile = imageInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            formData.thumbnail = e.target.result;
            // Save to storage after image is loaded
            Storage.addLink(formData);
            closeModal();
            renderLinks();
        };
        
        reader.readAsDataURL(imageFile);
    } else {
        // No image uploaded, save without thumbnail
        formData.thumbnail = null;
        Storage.addLink(formData);
        closeModal();
        renderLinks();
    }
}

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Fetch thumbnail from URL (simplified version)
async function fetchThumbnail(url) {
    // Note: Due to CORS restrictions, we'll use a placeholder approach
    // In a real app, you'd use a backend proxy or API service
    
    // For now, generate a gradient based on category or use a service
    // Returning null will use the CSS gradient background
    
    console.log('Attempting to fetch thumbnail for:', url);
    
    // You could integrate with services like:
    // - https://www.screenshotmachine.com/
    // - https://urlbox.io/
    // - or use Open Graph image meta tags via a proxy
    
    return null; // Will use CSS gradient as fallback
}

// Render links to the grid
function renderLinks() {
    const allLinks = Storage.getLinks();
    const filteredLinks = Categorizer.filterLinks(allLinks, Categorizer.currentFilter);
    const sortedLinks = Categorizer.sortLinks(filteredLinks);

    console.log('Rendering links:', sortedLinks.length, 'items');

    // Show/hide empty state
    if (sortedLinks.length === 0) {
        linksGrid.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }
    
    emptyState.classList.remove('show');

    // Build HTML for links
    linksGrid.innerHTML = sortedLinks.map(link => createLinkCard(link)).join('');

    // Attach delete event listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDelete(parseInt(btn.dataset.id));
        });
    });
}

// Create HTML for a single link card
function createLinkCard(link) {
    const categoryClass = Categorizer.getCategoryClass(link.category);
    const categoryEmoji = Categorizer.getCategoryEmoji(link.category);
    const hasImage = link.thumbnail && link.thumbnail !== null;
    const cardClass = hasImage ? 'link-card' : 'link-card no-image';
    
    return `
        <article class="${cardClass}" data-id="${link.id}">
            ${hasImage ? `
                <img 
                    src="${link.thumbnail}" 
                    alt="${link.title}"
                    class="link-thumbnail"
                >
            ` : ''}
            <div class="link-content">
                <div class="link-header">
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-title">
                        ${link.title}
                    </a>
                    <button class="delete-btn" data-id="${link.id}" title="Delete link">🗑️</button>
                </div>
                <span class="link-category ${categoryClass}">
                    ${categoryEmoji} ${link.category}
                </span>
                ${link.price ? `<div class="link-price">${link.price}</div>` : ''}
            </div>
        </article>
    `;
}

// Handle filter button click
function handleFilterClick(e) {
    const category = e.target.dataset.category;
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Set filter and re-render
    Categorizer.setFilter(category);
    renderLinks();
    
    console.log('Filter changed to:', category);
}

// Handle delete
function handleDelete(id) {
    if (confirm('Are you sure you want to delete this link?')) {
        Storage.deleteLink(id);
        renderLinks();
        console.log('Link deleted, ID:', id);
    }
}

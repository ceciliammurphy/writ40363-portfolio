/**
 * app.js - Main Application Logic for WASHD
 * Handles event listeners and app initialization
 */

// Icon options for each category
const CATEGORY_ICONS = {
    'events': {
        'party': 'Party',
        'theater': 'Theater',
        'movie': 'Movie',
        'concert': 'Concert',
        'other': 'Other'
    },
    'shopping': {
        'clothes': 'Clothes',
        'makeup': 'Makeup',
        'shoes': 'Shoes',
        'jewelry': 'Jewelry',
        'hair': 'Hair',
        'bags': 'Bags',
        'home': 'Home',
        'other': 'Other'
    },
    'social-media': {
        'instagram': 'Instagram',
        'tiktok': 'TikTok',
        'twitter': 'Twitter',
        'youtube': 'YouTube',
        'other': 'Other'
    },
    'other': {
        'link': 'Link',
        'bookmark': 'Bookmark',
        'note': 'Note',
        'idea': 'Idea'
    }
};

// DOM Elements
const elements = {
    // Navigation
    homeBtn: document.getElementById('home-btn'),
    addBeadBtn: document.getElementById('add-bead-btn'),
    
    // Modal
    modal: document.getElementById('bead-modal'),
    modalOverlay: document.querySelector('.modal-overlay'),
    modalClose: document.querySelector('.modal-close'),
    modalTitle: document.getElementById('modal-title'),
    
    // Form
    beadForm: document.getElementById('bead-form'),
    beadId: document.getElementById('bead-id'),
    beadUrl: document.getElementById('bead-url'),
    beadTitle: document.getElementById('bead-title'),
    beadCategory: document.getElementById('bead-category'),
    categorySuggestion: document.getElementById('category-suggestion'),
    iconSelectorGroup: document.getElementById('icon-selector-group'),
    iconOptions: document.getElementById('icon-options'),
    iconError: document.getElementById('icon-error'),
    cancelBtn: document.getElementById('cancel-btn'),
    submitBtn: document.getElementById('submit-btn'),
    
    // Error displays
    urlError: document.getElementById('url-error'),
    titleError: document.getElementById('title-error'),
    categoryError: document.getElementById('category-error'),
    
    // Category bubbles
    categoryBubbles: document.querySelectorAll('.category-bubble'),
    
    // Views
    homeView: document.getElementById('home-view'),
    categoryView: document.getElementById('category-view')
};

/**
 * Initialize the application
 */
function init() {
    console.log('🫧 WASHD App Starting...');
    
    // Initialize board (updates counts and shows home view)
    Board.init();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('✅ WASHD App Ready!');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Home button
    elements.homeBtn?.addEventListener('click', () => {
        Board.showView('home');
    });
    
    // Add bead button
    elements.addBeadBtn?.addEventListener('click', () => {
        openModal();
    });
    
    // Category bubbles
    elements.categoryBubbles.forEach(bubble => {
        bubble.addEventListener('click', () => {
            const category = bubble.dataset.category;
            Board.showView('category', category);
        });
    });
    
    // Modal close buttons
    elements.modalClose?.addEventListener('click', closeModal);
    elements.cancelBtn?.addEventListener('click', closeModal);
    elements.modalOverlay?.addEventListener('click', closeModal);
    
    // Form submission
    elements.beadForm?.addEventListener('submit', handleFormSubmit);
    
    // URL input - auto-detect category
    elements.beadUrl?.addEventListener('input', handleUrlInput);
    
    // Category change - populate icon options
    elements.beadCategory?.addEventListener('change', handleCategoryChange);
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.modal.hasAttribute('hidden')) {
            closeModal();
        }
    });
}

/**
 * Open modal for adding/editing bead
 * @param {Object} bead - Bead object (for editing), or null for new bead
 */
function openModal(bead = null) {
    const isEditing = bead !== null;
    
    // Update modal title
    elements.modalTitle.textContent = isEditing ? 'Edit Bead' : 'Add New Bead';
    elements.submitBtn.textContent = isEditing ? 'Update Bead' : 'Save Bead';
    
    // Populate form if editing
    if (isEditing) {
        elements.beadId.value = bead.id;
        elements.beadUrl.value = bead.url;
        elements.beadTitle.value = bead.title;
        elements.beadCategory.value = bead.category;
        
        // Populate icons and select the bead's icon
        handleCategoryChange();
        
        // Select the icon after icons are populated
        setTimeout(() => {
            if (bead.icon) {
                const iconBtn = elements.iconOptions.querySelector(`[data-icon="${bead.icon}"]`);
                if (iconBtn) {
                    selectIcon(iconBtn);
                }
            }
        }, 50);
    } else {
        elements.beadForm.reset();
        elements.beadId.value = '';
        elements.categorySuggestion.textContent = '';
        elements.iconSelectorGroup.style.display = 'none';
    }
    
    // Clear errors
    clearFormErrors();
    
    // Show modal
    elements.modal.removeAttribute('hidden');
    elements.beadUrl.focus();
    
    console.log(isEditing ? '✏️ Editing bead' : '➕ Adding new bead');
}

/**
 * Close modal
 */
function closeModal() {
    elements.modal.setAttribute('hidden', '');
    elements.beadForm.reset();
    elements.iconSelectorGroup.style.display = 'none';
    clearFormErrors();
    
    console.log('✖️ Modal closed');
}

/**
 * Handle URL input for auto-detection
 */
function handleUrlInput() {
    const url = elements.beadUrl.value.trim();
    
    if (url.length > 0) {
        const suggestion = Categorizer.getSuggestionMessage(url);
        elements.categorySuggestion.textContent = suggestion;
        
        // Auto-select category if suggestion exists and category not yet selected
        if (suggestion && !elements.beadCategory.value) {
            const detectedCategory = Categorizer.detectCategory(url);
            if (detectedCategory) {
                elements.beadCategory.value = detectedCategory;
                handleCategoryChange(); // Trigger icon selector
            }
        }
    } else {
        elements.categorySuggestion.textContent = '';
    }
}

/**
 * Handle category change - populate icon options
 */
function handleCategoryChange() {
    const category = elements.beadCategory.value;
    
    if (!category) {
        elements.iconSelectorGroup.style.display = 'none';
        return;
    }
    
    // Show icon selector
    elements.iconSelectorGroup.style.display = 'block';
    
    // Get icons for this category
    const icons = CATEGORY_ICONS[category] || CATEGORY_ICONS['other'];
    
    // Populate icon options
    elements.iconOptions.innerHTML = '';
    Object.entries(icons).forEach(([iconKey, label]) => {
        const iconBtn = document.createElement('button');
        iconBtn.type = 'button';
        iconBtn.className = 'icon-option';
        iconBtn.setAttribute('data-icon', iconKey);
        iconBtn.setAttribute('aria-label', label);
        iconBtn.setAttribute('role', 'radio');
        iconBtn.setAttribute('aria-checked', 'false');
        
        // Create icon image element
        const iconImg = document.createElement('img');
        iconImg.src = `images/${iconKey}-icon.png`;
        iconImg.alt = label;
        iconImg.className = 'icon-image';
        
        iconBtn.appendChild(iconImg);
        iconBtn.addEventListener('click', () => selectIcon(iconBtn));
        
        elements.iconOptions.appendChild(iconBtn);
    });
    
    console.log(`🎨 Loaded ${Object.keys(icons).length} icons for ${category}`);
}

/**
 * Select an icon option
 * @param {HTMLElement} iconBtn - The clicked icon button
 */
function selectIcon(iconBtn) {
    // Remove selection from all icons
    elements.iconOptions.querySelectorAll('.icon-option').forEach(btn => {
        btn.classList.remove('selected');
        btn.setAttribute('aria-checked', 'false');
    });
    
    // Mark this icon as selected
    iconBtn.classList.add('selected');
    iconBtn.setAttribute('aria-checked', 'true');
    
    // Clear icon error if any
    elements.iconError.textContent = '';
    
    console.log(`🎯 Selected icon: ${iconBtn.dataset.icon}`);
}

/**
 * Get selected icon
 * @returns {string|null} Selected icon emoji or null
 */
function getSelectedIcon() {
    const selectedBtn = elements.iconOptions.querySelector('.icon-option.selected');
    return selectedBtn ? selectedBtn.dataset.icon : null;
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearFormErrors();
    
    // Get selected icon
    const selectedIcon = getSelectedIcon();
    
    // Validate form
    const formData = {
        url: elements.beadUrl.value.trim(),
        title: elements.beadTitle.value.trim(),
        category: elements.beadCategory.value,
        icon: selectedIcon
    };
    
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length > 0) {
        displayFormErrors(errors);
        return;
    }
    
    // Check if editing or adding
    const beadId = elements.beadId.value;
    const isEditing = beadId !== '';
    
    try {
        if (isEditing) {
            // Update existing bead
            Storage.updateBead(beadId, formData);
            console.log('✅ Bead updated');
        } else {
            // Add new bead
            Storage.addBead(formData);
            console.log('✅ Bead added');
        }
        
        // Close modal
        closeModal();
        
        // Refresh view
        if (Board.currentView === 'category') {
            Board.showView('category', Board.currentCategory);
        } else {
            Board.updateCategoryCounts();
        }
        
    } catch (error) {
        console.error('Error saving bead:', error);
        alert('Error saving bead. Please try again.');
    }
}

/**
 * Validate form data
 * @param {Object} data - Form data
 * @returns {Object} Object with error messages (empty if valid)
 */
function validateForm(data) {
    const errors = {};
    
    // Validate URL
    if (!data.url) {
        errors.url = 'URL is required';
    } else if (!isValidUrl(data.url)) {
        errors.url = 'Please enter a valid URL (must start with http:// or https://)';
    }
    
    // Validate title
    if (!data.title) {
        errors.title = 'Title is required';
    } else if (data.title.length < 2) {
        errors.title = 'Title must be at least 2 characters';
    }
    
    // Validate category
    if (!data.category) {
        errors.category = 'Please select a category';
    }
    
    // Validate icon
    if (!data.icon) {
        errors.icon = 'Please select an icon';
    }
    
    return errors;
}

/**
 * Check if URL is valid
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Display form errors
 * @param {Object} errors - Error messages
 */
function displayFormErrors(errors) {
    if (errors.url) {
        elements.urlError.textContent = errors.url;
        elements.beadUrl.classList.add('error');
    }
    
    if (errors.title) {
        elements.titleError.textContent = errors.title;
        elements.beadTitle.classList.add('error');
    }
    
    if (errors.category) {
        elements.categoryError.textContent = errors.category;
        elements.beadCategory.classList.add('error');
    }
    
    if (errors.icon) {
        elements.iconError.textContent = errors.icon;
    }
}

/**
 * Clear form errors
 */
function clearFormErrors() {
    elements.urlError.textContent = '';
    elements.titleError.textContent = '';
    elements.categoryError.textContent = '';
    elements.iconError.textContent = '';
    
    elements.beadUrl.classList.remove('error');
    elements.beadTitle.classList.remove('error');
    elements.beadCategory.classList.remove('error');
}

/**
 * Handle bead edit
 * @param {string} beadId - ID of bead to edit
 */
function handleEditBead(beadId) {
    const bead = Storage.getBeadById(beadId);
    if (bead) {
        openModal(bead);
    } else {
        console.error('Bead not found:', beadId);
    }
}

/**
 * Handle bead delete
 * @param {string} beadId - ID of bead to delete
 */
function handleDeleteBead(beadId) {
    const bead = Storage.getBeadById(beadId);
    if (!bead) {
        console.error('Bead not found:', beadId);
        return;
    }
    
    const confirmed = confirm(`Delete "${bead.title}"?`);
    
    if (confirmed) {
        Storage.deleteBead(beadId);
        console.log('🗑️ Bead deleted');
        
        // Refresh current view
        if (Board.currentView === 'category') {
            Board.showView('category', Board.currentCategory);
        } else {
            Board.updateCategoryCounts();
        }
    }
}

// Make edit/delete handlers available globally for dynamically created elements
window.handleEditBead = handleEditBead;
window.handleDeleteBead = handleDeleteBead;

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

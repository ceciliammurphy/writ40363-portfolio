/**
 * board.js - View Management and UI Updates for WASHD
 * Handles rendering and view transitions
 */

const Board = {
    currentView: 'home',
    currentCategory: null,

    /**
     * Initialize the board
     */
    init() {
        console.log('🎨 Initializing Board...');
        this.updateCategoryCounts();
        this.showView('home');
    },

    /**
     * Show a specific view
     * @param {string} viewName - 'home', 'category', or 'profile'
     * @param {string} category - Category name (for category view)
     */
    showView(viewName, category = null) {
        console.log(`📍 Switching to view: ${viewName}${category ? ` (${category})` : ''}`);

        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
            view.setAttribute('hidden', '');
        });

        // Show requested view
        const viewElement = document.getElementById(`${viewName}-view`);
        if (viewElement) {
            viewElement.classList.add('active');
            viewElement.removeAttribute('hidden');
        }

        // Update current view tracking
        this.currentView = viewName;
        this.currentCategory = category;

        // Handle view-specific logic
        if (viewName === 'category' && category) {
            this.renderCategoryView(category);
        } else if (viewName === 'home') {
            this.updateCategoryCounts();
        }

        // Show/hide add button based on view
        const addButton = document.getElementById('add-bead-btn');
        if (addButton) {
            addButton.style.display = (viewName === 'home' || viewName === 'category') ? 'flex' : 'none';
        }
    },

    /**
     * Update category bubble counts
     */
    updateCategoryCounts() {
        const counts = Storage.getCategoryCounts();

        // Update count displays
        Object.entries(counts).forEach(([category, count]) => {
            const countElement = document.querySelector(`[data-count="${category}"]`);
            if (countElement) {
                countElement.textContent = count;
            }

            // Update bubble size based on count
            const bubble = document.querySelector(`[data-category="${category}"]`);
            if (bubble) {
                bubble.removeAttribute('data-size');
                if (count === 0) {
                    bubble.setAttribute('data-size', 'small');
                } else if (count >= 10) {
                    bubble.setAttribute('data-size', 'xlarge');
                } else if (count >= 5) {
                    bubble.setAttribute('data-size', 'large');
                }
            }
        });

        console.log('📊 Updated category counts');
    },

    /**
     * Render category view with beads
     * @param {string} category - Category to display
     */
    renderCategoryView(category) {
        const beads = Storage.getBeadsByCategory(category);
        const container = document.getElementById('beads-container');
        const titleElement = document.getElementById('category-title');

        if (!container || !titleElement) {
            console.error('❌ Category view elements not found');
            return;
        }

        // Update title
        titleElement.textContent = Categorizer.getCategoryDisplayName(category);

        // Clear container
        container.innerHTML = '';

        if (beads.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No beads yet! Click the + button to add one.</p>
                </div>
            `;
            return;
        }

        // Render beads
        beads.forEach((bead, index) => {
            const beadElement = this.createBeadElement(bead, index);
            container.appendChild(beadElement);
        });

        console.log(`✨ Rendered ${beads.length} beads for category: ${category}`);
    },

    /**
     * Create a bead DOM element
     * @param {Object} bead - Bead data
     * @param {number} index - Bead index for animation delay
     * @returns {HTMLElement} Bead element
     */
    createBeadElement(bead, index) {
        const beadDiv = document.createElement('div');
        beadDiv.className = 'bead';
        beadDiv.style.setProperty('--bead-index', index);

        // Use custom icon or default to link icon
        const icon = bead.icon || 'link';
        const iconHTML = `<img src="images/${icon}-icon.png" alt="" class="bead-icon-img">`;

        beadDiv.innerHTML = `
            <a href="${bead.url}" class="bead-link" target="_blank" rel="noopener noreferrer" aria-label="${this.escapeHtml(bead.title)}">
                <span class="bead-icon" aria-hidden="true">${iconHTML}</span>
                <span class="bead-tooltip">${this.escapeHtml(bead.title)}</span>
            </a>
            <div class="bead-controls">
                <button class="bead-control-btn btn-edit" 
                        data-bead-id="${bead.id}"
                        aria-label="Edit ${bead.title}">
                </button>
                <button class="bead-control-btn btn-delete" 
                        data-bead-id="${bead.id}"
                        aria-label="Delete ${bead.title}">
                </button>
            </div>
        `;

        return beadDiv;
    },

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Refresh current view
     */
    refresh() {
        if (this.currentView === 'category' && this.currentCategory) {
            this.renderCategoryView(this.currentCategory);
        } else if (this.currentView === 'home') {
            this.updateCategoryCounts();
        }
        console.log('🔄 Refreshed current view');
    },

    /**
     * Show success message
     * @param {string} message - Message to display
     */
    showSuccess(message) {
        console.log(`✅ ${message}`);
        // Could add a toast notification here in the future
    },

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        console.error(`❌ ${message}`);
        alert(message); // Simple alert for now
    }
};

// Make Board available globally
window.Board = Board;

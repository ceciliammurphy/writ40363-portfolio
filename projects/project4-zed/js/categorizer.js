/**
 * categorizer.js - URL Auto-Detection for WASHD
 * Suggests categories based on URL patterns
 */

const Categorizer = {
    /**
     * Category URL patterns
     */
    patterns: {
        'events': [
            'eventbrite.com',
            'meetup.com',
            'ticketmaster.com',
            'seatgeek.com'
        ],
        'shopping': [
            'amazon.com',
            'etsy.com',
            'therealreal.com',
            'sephora.com'
        ],
        'social-media': [
            'instagram.com',
            'twitter.com',
            'x.com',
            'tiktok.com',
            'youtube.com',
            'facebook.com',
            'linkedin.com',
            'snapchat.com'
        ]
    },

    /**
     * Detect category from URL
     * @param {string} url - URL to analyze
     * @returns {string|null} Suggested category or null if no match
     */
    detectCategory(url) {
        try {
            // Normalize URL
            const normalizedUrl = url.toLowerCase().trim();
            
            // Check each category's patterns
            for (const [category, patterns] of Object.entries(this.patterns)) {
                for (const pattern of patterns) {
                    if (normalizedUrl.includes(pattern)) {
                        console.log(`🔍 Auto-detected category: ${category} (matched: ${pattern})`);
                        return category;
                    }
                }
            }

            console.log('🔍 No category match found, suggesting "other"');
            return null;
        } catch (error) {
            console.error('❌ Error detecting category:', error);
            return null;
        }
    },

    /**
     * Get friendly category name
     * @param {string} category - Category slug
     * @returns {string} Display name
     */
    getCategoryDisplayName(category) {
        const names = {
            'events': 'Events',
            'shopping': 'Shopping',
            'social-media': 'Social Media',
            'other': 'Other'
        };
        return names[category] || 'Other';
    },

    /**
     * Get suggestion message for UI
     * @param {string} url - URL to analyze
     * @returns {string} Suggestion message
     */
    getSuggestionMessage(url) {
        const category = this.detectCategory(url);
        if (category) {
            const displayName = this.getCategoryDisplayName(category);
            return `💡 Suggested: ${displayName}`;
        }
        return '';
    },

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean} Whether URL is valid
     */
    isValidUrl(url) {
        try {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            return urlPattern.test(url);
        } catch (error) {
            return false;
        }
    },

    /**
     * Normalize URL (add https:// if missing)
     * @param {string} url - URL to normalize
     * @returns {string} Normalized URL
     */
    normalizeUrl(url) {
        const trimmed = url.trim();
        if (!/^https?:\/\//i.test(trimmed)) {
            return `https://${trimmed}`;
        }
        return trimmed;
    }
};

// Make Categorizer available globally
window.Categorizer = Categorizer;

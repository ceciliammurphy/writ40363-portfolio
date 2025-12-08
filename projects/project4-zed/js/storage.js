/**
 * storage.js
 * Handles all localStorage operations for WASHD beads
 */

const STORAGE_KEY = 'washd-beads';

const Storage = {
    /**
     * Get all beads from localStorage
     * @returns {Array} Array of bead objects
     */
    getAllBeads() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading beads from storage:', error);
            return [];
        }
    },

    /**
     * Get beads by category
     * @param {string} category - Category name (events, shopping, social-media, other)
     * @returns {Array} Filtered array of beads
     */
    getBeadsByCategory(category) {
        const allBeads = this.getAllBeads();
        return allBeads.filter(bead => bead.category === category);
    },

    /**
     * Get count of beads in each category
     * @returns {Object} Object with category counts
     */
    getCategoryCounts() {
        const allBeads = this.getAllBeads();
        const counts = {
            events: 0,
            shopping: 0,
            'social-media': 0,
            other: 0
        };

        allBeads.forEach(bead => {
            if (counts.hasOwnProperty(bead.category)) {
                counts[bead.category]++;
            }
        });

        return counts;
    },

    /**
     * Add a new bead
     * @param {Object} beadData - Bead data {title, url, category}
     * @returns {Object} The created bead with id
     */
    addBead(beadData) {
        try {
            const allBeads = this.getAllBeads();
            const newBead = {
                id: this.generateId(),
                title: beadData.title.trim(),
                url: beadData.url.trim(),
                category: beadData.category
            };

            allBeads.push(newBead);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allBeads));
            
            console.log('Bead added:', newBead);
            return newBead;
        } catch (error) {
            console.error('Error adding bead:', error);
            throw error;
        }
    },

    /**
     * Update an existing bead
     * @param {string} id - Bead ID
     * @param {Object} updates - Updated data {title, url, category}
     * @returns {Object|null} Updated bead or null if not found
     */
    updateBead(id, updates) {
        try {
            const allBeads = this.getAllBeads();
            const index = allBeads.findIndex(bead => bead.id === id);

            if (index === -1) {
                console.warn('Bead not found:', id);
                return null;
            }

            allBeads[index] = {
                ...allBeads[index],
                title: updates.title.trim(),
                url: updates.url.trim(),
                category: updates.category
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(allBeads));
            
            console.log('Bead updated:', allBeads[index]);
            return allBeads[index];
        } catch (error) {
            console.error('Error updating bead:', error);
            throw error;
        }
    },

    /**
     * Delete a bead
     * @param {string} id - Bead ID
     * @returns {boolean} True if deleted, false if not found
     */
    deleteBead(id) {
        try {
            const allBeads = this.getAllBeads();
            const filteredBeads = allBeads.filter(bead => bead.id !== id);

            if (filteredBeads.length === allBeads.length) {
                console.warn('Bead not found:', id);
                return false;
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBeads));
            
            console.log('Bead deleted:', id);
            return true;
        } catch (error) {
            console.error('Error deleting bead:', error);
            throw error;
        }
    },

    /**
     * Get a single bead by ID
     * @param {string} id - Bead ID
     * @returns {Object|null} Bead object or null if not found
     */
    getBeadById(id) {
        const allBeads = this.getAllBeads();
        return allBeads.find(bead => bead.id === id) || null;
    },

    /**
     * Generate a unique ID for beads
     * @returns {string} Unique ID
     */
    generateId() {
        return `bead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Clear all beads (for testing/reset)
     * @returns {boolean} Success status
     */
    clearAll() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            console.log('All beads cleared');
            return true;
        } catch (error) {
            console.error('Error clearing beads:', error);
            return false;
        }
    }
};

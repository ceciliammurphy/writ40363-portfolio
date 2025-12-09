// storage.js - Handle localStorage operations for link collection

const Storage = {
    // Key for localStorage
    STORAGE_KEY: 'linkCollection',

    // Get all links from localStorage
    getLinks() {
        try {
            const links = localStorage.getItem(this.STORAGE_KEY);
            return links ? JSON.parse(links) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    },

    // Save links to localStorage
    saveLinks(links) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(links));
            console.log('Links saved successfully:', links.length, 'items');
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // Add a new link
    addLink(linkData) {
        const links = this.getLinks();
        const newLink = {
            id: Date.now(),
            title: linkData.title,
            url: linkData.url,
            category: linkData.category,
            price: linkData.price || null,
            thumbnail: linkData.thumbnail || null,
            createdAt: new Date().toISOString()
        };
        links.push(newLink);
        this.saveLinks(links);
        console.log('New link added:', newLink);
        return newLink;
    },

    // Delete a link by ID
    deleteLink(id) {
        let links = this.getLinks();
        const initialLength = links.length;
        links = links.filter(link => link.id !== id);
        
        if (links.length < initialLength) {
            this.saveLinks(links);
            console.log('Link deleted, ID:', id);
            return true;
        }
        console.warn('Link not found for deletion, ID:', id);
        return false;
    },

    // Clear all links (for testing/debugging)
    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('All links cleared');
    }
};

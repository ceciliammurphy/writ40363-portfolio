// categorizer.js - Filter and categorize links

const Categorizer = {
    // Current active filter
    currentFilter: 'all',

    // Filter links by category
    filterLinks(links, category) {
        console.log('Filtering by category:', category);
        if (category === 'all') {
            return links;
        }
        return links.filter(link => link.category === category);
    },

    // Sort links (can be expanded for different sort options)
    sortLinks(links, sortBy = 'newest') {
        const sorted = [...links];
        
        switch(sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'title':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return sorted;
        }
    },

    // Set active filter
    setFilter(category) {
        this.currentFilter = category;
        console.log('Active filter set to:', category);
    },

    // Get category emoji
    getCategoryEmoji(category) {
        const emojis = {
            'event': '🎉',
            'fashion': '👗',
            'social media': '📱'
        };
        return emojis[category] || '🔗';
    },

    // Get category class for styling
    getCategoryClass(category) {
        return `category-${category.replace(/\s+/g, '-')}`;
    }
};

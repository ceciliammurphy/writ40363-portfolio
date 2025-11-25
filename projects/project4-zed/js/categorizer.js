// ===================================
// CATEGORIZER.JS - Smart Link Categorization
// ===================================

// Keyword lists for auto-categorization
const EVENTS_KEYWORDS = [
    'ticket', 'concert', 'show', 'event', 'festival', 
    'game', 'tour', 'performance', 'theater', 'theatre', 
    'venue', 'gig'
];

const SHOPPING_KEYWORDS = [
    'shop', 'store', 'cart', 'product', 'item', 
    'purchase', 'sale', 'deal', 'retail', 
    'amazon', 'etsy', 'ebay'
];

// Check if text contains any of the keywords
function containsKeywords(text, keywords) {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword));
}

// Determine which default boards a link should be added to
export function categorizeLink(url, title, date = null, price = null) {
    const boardIds = [];
    const combinedText = `${url} ${title}`;
    
    // 1. Check for Events keywords (highest priority)
    if (containsKeywords(combinedText, EVENTS_KEYWORDS)) {
        boardIds.push(1); // Events board ID
    }
    // 2. Else, check for Shopping keywords
    else if (containsKeywords(combinedText, SHOPPING_KEYWORDS)) {
        boardIds.push(2); // Shopping board ID
    }
    // 3. Else, use metadata as fallback
    else {
        // Has date but no price → Events
        if (date && !price) {
            boardIds.push(1);
        }
        // Has price but no date → Shopping
        else if (price && !date) {
            boardIds.push(2);
        }
        // Has both date and price → Shopping (fallback)
        else if (date && price) {
            boardIds.push(2);
        }
    }
    
    // Always add to Source (board ID 3)
    boardIds.push(3);
    
    // Remove duplicates (just in case)
    return [...new Set(boardIds)];
}

// Get board names for display (for debugging/confirmation)
export function getBoardNamesForLink(url, title, date, price) {
    const boardIds = categorizeLink(url, title, date, price);
    const boardNames = {
        1: "Events",
        2: "Shopping",
        3: "Source"
    };
    return boardIds.map(id => boardNames[id]);
}

// ===================================
// STORAGE.JS - LocalStorage Management
// ===================================

const STORAGE_KEY = 'linkBoardApp';

// Initialize default data structure
const DEFAULT_DATA = {
    user: {
        name: "Your Name",
        bio: "Your bio goes here. Share a bit about yourself and what you're collecting!"
    },
    boards: [
        {
            id: 1,
            name: "Events",
            type: "default",
            description: "Concerts, shows, and events",
            created: new Date().toISOString()
        },
        {
            id: 2,
            name: "Shopping",
            type: "default",
            description: "Products and items to buy",
            created: new Date().toISOString()
        },
        {
            id: 3,
            name: "Source",
            type: "default",
            description: "All your saved links",
            created: new Date().toISOString()
        }
    ],
    links: [],
    nextBoardId: 4,
    nextLinkId: 1
};

// Get all data from localStorage
export function getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        // First time - initialize with defaults
        saveData(DEFAULT_DATA);
        return DEFAULT_DATA;
    }
    return JSON.parse(data);
}

// Save all data to localStorage
export function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Get user profile
export function getUser() {
    const data = getData();
    return data.user;
}

// Update user profile
export function updateUser(name, bio) {
    const data = getData();
    data.user.name = name;
    data.user.bio = bio;
    saveData(data);
}

// Get all boards
export function getBoards() {
    const data = getData();
    return data.boards;
}

// Get a single board by ID
export function getBoardById(id) {
    const data = getData();
    return data.boards.find(board => board.id === parseInt(id));
}

// Add a new board
export function addBoard(name, description = "") {
    const data = getData();
    const newBoard = {
        id: data.nextBoardId,
        name: name,
        type: "custom",
        description: description,
        created: new Date().toISOString()
    };
    data.boards.push(newBoard);
    data.nextBoardId++;
    saveData(data);
    return newBoard;
}

// Delete a board (and remove it from all links)
export function deleteBoard(boardId) {
    const data = getData();
    
    // Don't allow deleting default boards
    const board = data.boards.find(b => b.id === boardId);
    if (board && board.type === "default") {
        return false;
    }
    
    // Remove board
    data.boards = data.boards.filter(b => b.id !== boardId);
    
    // Remove board reference from all links
    data.links.forEach(link => {
        link.boards = link.boards.filter(id => id !== boardId);
    });
    
    saveData(data);
    return true;
}

// Get all links
export function getLinks() {
    const data = getData();
    return data.links;
}

// Get links for a specific board
export function getLinksByBoard(boardId) {
    const data = getData();
    return data.links.filter(link => link.boards.includes(boardId));
}

// Get a single link by ID
export function getLinkById(id) {
    const data = getData();
    return data.links.find(link => link.id === id);
}

// Add a new link
export function addLink(url, title, date = null, price = null, boardIds = []) {
    const data = getData();
    const newLink = {
        id: data.nextLinkId,
        url: url,
        title: title,
        date: date,
        price: price,
        boards: boardIds,
        created: new Date().toISOString()
    };
    data.links.push(newLink);
    data.nextLinkId++;
    saveData(data);
    return newLink;
}

// Update a link
export function updateLink(linkId, updates) {
    const data = getData();
    const linkIndex = data.links.findIndex(link => link.id === linkId);
    if (linkIndex !== -1) {
        data.links[linkIndex] = { ...data.links[linkIndex], ...updates };
        saveData(data);
        return data.links[linkIndex];
    }
    return null;
}

// Remove a link from a specific board (or delete entirely if no boards left)
export function removeLinkFromBoard(linkId, boardId) {
    const data = getData();
    const link = data.links.find(l => l.id === linkId);
    if (link) {
        link.boards = link.boards.filter(id => id !== boardId);
        
        // If link has no boards left, delete it entirely
        if (link.boards.length === 0) {
            data.links = data.links.filter(l => l.id !== linkId);
        }
        
        saveData(data);
        return true;
    }
    return false;
}

// Delete a link entirely
export function deleteLink(linkId) {
    const data = getData();
    data.links = data.links.filter(link => link.id !== linkId);
    saveData(data);
    return true;
}

// Reset all data (for testing)
export function resetData() {
    saveData(DEFAULT_DATA);
    return DEFAULT_DATA;
}

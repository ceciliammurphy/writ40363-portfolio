// ===================================
// BOARD.JS - Board Detail Page Logic
// ===================================

import * as storage from './storage.js';

// DOM Elements
const boardTitle = document.getElementById('boardTitle');
const boardMeta = document.getElementById('boardMeta');
const sortSelect = document.getElementById('sortSelect');
const linksContainer = document.getElementById('linksContainer');
const emptyState = document.getElementById('emptyState');
const deleteBoardBtn = document.getElementById('deleteBoardBtn');
const navUserName = document.getElementById('navUserName');

// Current board
let currentBoard = null;
let currentLinks = [];

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    loadBoardFromURL();
    loadUserName();
    setupEventListeners();
});

// Get board ID from URL parameter
function loadBoardFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const boardId = parseInt(urlParams.get('id'));
    
    if (!boardId) {
        // No board ID, redirect to home
        window.location.href = 'index.html';
        return;
    }
    
    currentBoard = storage.getBoardById(boardId);
    
    if (!currentBoard) {
        // Board not found, redirect to home
        alert('Board not found');
        window.location.href = 'index.html';
        return;
    }
    
    // Load board data
    displayBoard();
    loadLinks();
}

// Load user name for navigation
function loadUserName() {
    const user = storage.getUser();
    navUserName.textContent = user.name;
}

// Display board header information
function displayBoard() {
    boardTitle.textContent = currentBoard.name;
    
    // Show/hide delete button (can't delete default boards)
    if (currentBoard.type === 'default') {
        deleteBoardBtn.style.display = 'none';
    } else {
        deleteBoardBtn.style.display = 'block';
    }
    
    updateBoardMeta();
}

// Update board metadata (link count)
function updateBoardMeta() {
    const linkCount = currentLinks.length;
    boardMeta.textContent = `${linkCount} ${linkCount === 1 ? 'link' : 'links'}`;
}

// Load and display links for this board
function loadLinks() {
    currentLinks = storage.getLinksByBoard(currentBoard.id);
    sortLinks();
    displayLinks();
}

// Sort links based on selected option
function sortLinks() {
    const sortBy = sortSelect.value;
    
    switch(sortBy) {
        case 'date-desc':
            currentLinks.sort((a, b) => {
                if (!a.date) return 1;
                if (!b.date) return -1;
                return new Date(b.date) - new Date(a.date);
            });
            break;
        case 'date-asc':
            currentLinks.sort((a, b) => {
                if (!a.date) return 1;
                if (!b.date) return -1;
                return new Date(a.date) - new Date(b.date);
            });
            break;
        case 'price-asc':
            currentLinks.sort((a, b) => {
                if (a.price === null) return 1;
                if (b.price === null) return -1;
                return a.price - b.price;
            });
            break;
        case 'price-desc':
            currentLinks.sort((a, b) => {
                if (a.price === null) return 1;
                if (b.price === null) return -1;
                return b.price - a.price;
            });
            break;
        case 'title-asc':
            currentLinks.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
}

// Display all links
function displayLinks() {
    linksContainer.innerHTML = '';
    
    if (currentLinks.length === 0) {
        // Show empty state
        linksContainer.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    // Hide empty state, show links
    linksContainer.style.display = 'grid';
    emptyState.style.display = 'none';
    
    currentLinks.forEach(link => {
        const linkCard = createLinkCard(link);
        linksContainer.appendChild(linkCard);
    });
}

// Create a single link card element
function createLinkCard(link) {
    const card = document.createElement('article');
    card.className = 'link-card';
    card.dataset.linkId = link.id;
    
    // Format date if exists
    let dateHTML = '';
    if (link.date) {
        const dateObj = new Date(link.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        dateHTML = `<span class="link-date">📅 ${formattedDate}</span>`;
    }
    
    // Format price if exists
    let priceHTML = '';
    if (link.price !== null && link.price !== undefined) {
        priceHTML = `<span class="link-price">💰 $${link.price.toFixed(2)}</span>`;
    }
    
    card.innerHTML = `
        <div class="link-content">
            <h3 class="link-title">${escapeHTML(link.title)}</h3>
            <a href="${escapeHTML(link.url)}" class="link-url" target="_blank" rel="noopener noreferrer">
                ${escapeHTML(link.url)}
            </a>
            <div class="link-metadata">
                ${dateHTML}
                ${priceHTML}
            </div>
        </div>
        <div class="link-actions">
            <button class="btn-icon" aria-label="Remove from board" data-action="remove" data-link-id="${link.id}">
                🗑️
            </button>
        </div>
    `;
    
    // Add remove button event listener
    const removeBtn = card.querySelector('[data-action="remove"]');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleRemoveLink(link.id);
    });
    
    return card;
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Sort dropdown
    sortSelect.addEventListener('change', () => {
        sortLinks();
        displayLinks();
    });
    
    // Delete board button
    deleteBoardBtn.addEventListener('click', handleDeleteBoard);
}

// ===================================
// ACTION HANDLERS
// ===================================

// Remove link from this board
function handleRemoveLink(linkId) {
    const link = storage.getLinkById(linkId);
    if (!link) return;
    
    const confirmMsg = `Remove "${link.title}" from ${currentBoard.name}?`;
    if (!confirm(confirmMsg)) return;
    
    // Remove from board
    storage.removeLinkFromBoard(linkId, currentBoard.id);
    
    // Reload links
    loadLinks();
}

// Delete the entire board
function handleDeleteBoard() {
    const confirmMsg = `Delete "${currentBoard.name}" board? This cannot be undone.`;
    if (!confirm(confirmMsg)) return;
    
    const success = storage.deleteBoard(currentBoard.id);
    
    if (success) {
        // Redirect to home
        window.location.href = 'index.html';
    } else {
        alert('Cannot delete default boards');
    }
}

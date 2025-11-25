// ===================================
// APP.JS - Main Application Logic for index.html
// ===================================

import * as storage from './storage.js';
import { categorizeLink } from './categorizer.js';

// DOM Elements
const profileName = document.getElementById('profileName');
const profileDescription = document.getElementById('profileDescription');
const navUserName = document.getElementById('navUserName');
const boardsContainer = document.getElementById('boardsContainer');
const addLinkBtn = document.getElementById('addLinkBtn');
const addBoardBtn = document.getElementById('addBoardBtn');
const addLinkModal = document.getElementById('addLinkModal');
const addBoardModal = document.getElementById('addBoardModal');
const addLinkForm = document.getElementById('addLinkForm');
const addBoardForm = document.getElementById('addBoardForm');
const boardCheckboxes = document.getElementById('boardCheckboxes');
const viewButtons = document.querySelectorAll('.view-btn');

// Current view mode (load from localStorage or default to waterfall)
let currentView = localStorage.getItem('currentView') || 'waterfall';

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadBoards();
    setupEventListeners();
    restoreViewPreference();
});

// Load user profile data
function loadUserProfile() {
    const user = storage.getUser();
    profileName.textContent = user.name;
    profileDescription.textContent = user.bio;
    navUserName.textContent = user.name;
}

// Restore saved view preference
function restoreViewPreference() {
    // Set active button
    viewButtons.forEach(btn => {
        if (btn.dataset.view === currentView) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Apply view to boards
    const boards = storage.getBoards();
    displayBoards(boards);
    
    // Initialize carousel if needed
    if (currentView === 'carousel') {
        setTimeout(() => {
            boardsContainer.scrollLeft = 0;
            updateCarouselCards();
        }, 50);
    }
}

// Load and display all boards
function loadBoards() {
    const boards = storage.getBoards();
    displayBoards(boards);
}

// Display boards based on current view
function displayBoards(boards) {
    boardsContainer.innerHTML = '';
    
    // Apply view-specific class
    boardsContainer.className = 'boards-container';
    if (currentView === 'carousel') {
        boardsContainer.classList.add('view-carousel');
    } else if (currentView === 'list') {
        boardsContainer.classList.add('view-list');
    }
    
    boards.forEach(board => {
        const boardCard = createBoardCard(board);
        boardsContainer.appendChild(boardCard);
    });
}

// Create a single board card element
function createBoardCard(board) {
    const links = storage.getLinksByBoard(board.id);
    const linkCount = links.length;
    
    const card = document.createElement('article');
    card.className = 'board-card';
    card.dataset.boardId = board.id;
    
    // Generate gradient based on board type
    const gradient = getBoardGradient(board);
    
    card.innerHTML = `
        <div class="board-thumbnail" style="background: ${gradient};">
            <h3 class="board-name">${board.name}</h3>
            <div class="link-preview">
                <span class="link-count">${linkCount} ${linkCount === 1 ? 'link' : 'links'}</span>
            </div>
        </div>
    `;
    
    // Click to navigate to board detail page
    card.addEventListener('click', () => {
        window.location.href = `board.html?id=${board.id}`;
    });
    
    return card;
}

// Get gradient color for board thumbnail
function getBoardGradient(board) {
    const gradients = {
        'Events': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'Shopping': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'Source': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    };
    
    // Use predefined gradient for default boards, random for custom
    if (gradients[board.name]) {
        return gradients[board.name];
    }
    
    // Generate random gradient for custom boards
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 60) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%) 0%, hsl(${hue2}, 70%, 50%) 100%)`;
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Add Link button
    addLinkBtn.addEventListener('click', openAddLinkModal);
    
    // Add Board button
    addBoardBtn.addEventListener('click', openAddBoardModal);
    
    // Modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Cancel buttons in forms
    document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
    
    // Form submissions
    addLinkForm.addEventListener('submit', handleAddLink);
    addBoardForm.addEventListener('submit', handleAddBoard);
    
    // View toggle buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', handleViewChange);
    });
    
    // Carousel scroll effect
    boardsContainer.addEventListener('scroll', handleCarouselScroll);
}

// ===================================
// MODAL FUNCTIONS
// ===================================

function openAddLinkModal() {
    // Populate board checkboxes
    const boards = storage.getBoards();
    boardCheckboxes.innerHTML = '';
    
    boards.forEach(board => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" name="boards" value="${board.id}">
            ${board.name}
        `;
        boardCheckboxes.appendChild(label);
    });
    
    addLinkModal.classList.add('active');
    addLinkModal.setAttribute('aria-hidden', 'false');
}

function openAddBoardModal() {
    addBoardModal.classList.add('active');
    addBoardModal.setAttribute('aria-hidden', 'false');
}

function closeModals() {
    addLinkModal.classList.remove('active');
    addBoardModal.classList.remove('active');
    addLinkModal.setAttribute('aria-hidden', 'true');
    addBoardModal.setAttribute('aria-hidden', 'true');
    
    // Reset forms
    addLinkForm.reset();
    addBoardForm.reset();
}

// ===================================
// FORM HANDLERS
// ===================================

function handleAddLink(e) {
    e.preventDefault();
    
    const url = document.getElementById('linkUrl').value.trim();
    const title = document.getElementById('linkTitle').value.trim();
    const date = document.getElementById('linkDate').value || null;
    const price = parseFloat(document.getElementById('linkPrice').value) || null;
    
    // Get manually selected boards
    const selectedBoards = Array.from(document.querySelectorAll('input[name="boards"]:checked'))
        .map(cb => parseInt(cb.value));
    
    // Auto-categorize to default boards
    const autoCategorizedBoards = categorizeLink(url, title, date, price);
    
    // Combine manual + auto (remove duplicates)
    const allBoards = [...new Set([...selectedBoards, ...autoCategorizedBoards])];
    
    // Add the link
    storage.addLink(url, title, date, price, allBoards);
    
    // Close modal and refresh
    closeModals();
    loadBoards();
    
    // Optional: Show success message
    console.log(`Link added to ${allBoards.length} board(s)`);
}

function handleAddBoard(e) {
    e.preventDefault();
    
    const name = document.getElementById('boardName').value.trim();
    const description = document.getElementById('boardDescription').value.trim();
    
    // Add the board
    storage.addBoard(name, description);
    
    // Close modal and refresh
    closeModals();
    loadBoards();
    
    console.log(`Board "${name}" created`);
}

// ===================================
// VIEW TOGGLE
// ===================================

function handleViewChange(e) {
    const btn = e.currentTarget;
    const view = btn.dataset.view;
    
    // Update active state
    viewButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update current view
    currentView = view;
    
    // Save preference to localStorage
    localStorage.setItem('currentView', view);
    
    // Reload boards with new view
    const boards = storage.getBoards();
    displayBoards(boards);
    
    // Initialize carousel effect if carousel view
    if (currentView === 'carousel') {
        setTimeout(() => {
            // Reset scroll to beginning (first card centered)
            boardsContainer.scrollLeft = 0;
            updateCarouselCards();
        }, 50);
    }
}

// ===================================
// CAROUSEL 3D EFFECT
// ===================================

function handleCarouselScroll() {
    if (currentView === 'carousel') {
        requestAnimationFrame(updateCarouselCards);
    }
}

function updateCarouselCards() {
    if (currentView !== 'carousel') return;
    
    const cards = boardsContainer.querySelectorAll('.board-card');
    const containerRect = boardsContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        
        // Calculate distance from center (-1 to 1)
        const distance = (cardCenter - containerCenter) / (containerRect.width / 2);
        
        // Only apply effects if card is not centered (threshold of 0.1)
        if (Math.abs(distance) < 0.1) {
            // Card is centered - flat, full size, full opacity
            card.style.transform = 'translateX(0) rotateY(0deg) scale(1)';
            card.style.opacity = '1';
            card.style.zIndex = '100';
        } else {
            // Calculate rotation and scale based on distance
            const rotation = distance * 25; // Max 25deg rotation
            const scale = 1 - Math.abs(distance) * 0.2; // Scale down to 0.8
            const opacity = 1 - Math.abs(distance) * 0.3; // Fade to 0.7
            
            // Apply 3D transforms
            card.style.transform = `
                translateX(0) 
                rotateY(${rotation}deg) 
                scale(${scale})
            `;
            card.style.opacity = opacity;
            card.style.zIndex = Math.round((1 - Math.abs(distance)) * 100);
        }
    });
}

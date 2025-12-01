// ==========================================
// PROJECT 3: PERSONAL DATA DASHBOARD
// LAB16: fetch() and JSON Basics
// ==========================================

console.log('Dashboard app loaded!');
console.log('LAB16: Learning fetch() API');

// ==========================================
// WEATHER WIDGET
// ==========================================

// Function to load weather data
function loadWeather() {
  console.log('🌤️ Loading weather data...');

  fetch('./data/weather.json')
    .then(response => {
      console.log('✅ Got response:', response);
      return response.json();
    })
    .then(data => {
      console.log('✅ Weather data loaded:', data);
      displayWeather(data);
    })
    .catch(error => {
      console.error('❌ Error loading weather:', error);
      displayWeatherError();
    });
}

// Function to display weather data in the DOM
function displayWeather(weather) {
  console.log('📊 Displaying weather data...');

  const weatherDisplay = document.getElementById('weather-display');

  weatherDisplay.innerHTML = `
    <div class="weather-current">
      <div class="weather-icon">${weather.icon}</div>
      <div class="weather-temp">${weather.temperature}°F</div>
      <div class="weather-location">${weather.location}</div>
      <div class="weather-condition">${weather.condition}</div>
    </div>
    <div class="weather-details">
      <div class="weather-detail">
        <span>💧 Humidity</span>
        <strong>${weather.humidity}%</strong>
      </div>
      <div class="weather-detail">
        <span>💨 Wind Speed</span>
        <strong>${weather.windSpeed} mph</strong>
      </div>
      <div class="weather-detail">
        <span>🌡️ Feels Like</span>
        <strong>${weather.feelsLike}°F</strong>
      </div>
    </div>
  `;

  console.log('✅ Weather displayed successfully!');
}

// Function to show error message if weather data fails to load
function displayWeatherError() {
  const weatherDisplay = document.getElementById('weather-display');

  weatherDisplay.innerHTML = `
    <div class="error-message">
      <div class="error-icon">⚠️</div>
      <p>Could not load weather data</p>
      <p class="error-hint">Check console for details</p>
    </div>
  `;
}

// Load weather data when page loads
loadWeather();


// ==========================================
// QUOTES WIDGET
// ==========================================

// Global variable to store all quotes
let allQuotes = [];
let currentQuoteIndex = -1; // Track current quote to avoid repeats

// Function to load quotes from JSON
function loadQuotes() {
  console.log('Loading quotes...');

  fetch('data/quotes.json')
    .then(response => {
      console.log('Got quotes response:', response);
      return response.json();
    })
    .then(data => {
      console.log('Quotes data:', data);
      allQuotes = data; // Store quotes in global variable
      displayRandomQuote(); // Show first quote
    })
    .catch(error => {
      console.error('Error loading quotes:', error);
      displayQuotesError();
    });
}

// Function to display a random quote
function displayRandomQuote() {
  // Make sure we have quotes loaded
  if (allQuotes.length === 0) {
    console.error('No quotes available');
    return;
  }

  // Get random index (different from current)
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * allQuotes.length);
  } while (randomIndex === currentQuoteIndex && allQuotes.length > 1);

  currentQuoteIndex = randomIndex;
  const quote = allQuotes[randomIndex];

  // Display the quote
  const quotesDisplay = document.getElementById('quotes-display');
  quotesDisplay.innerHTML = `
    <div class="quote-card">
      <div class="quote-text">"${quote.text}"</div>
      <div class="quote-author">— ${quote.author}</div>
    </div>
  `;

  console.log('Displayed quote:', quote);
}

// Copy current quote to clipboard
function copyQuoteToClipboard() {
  const quoteTextEl = document.querySelector('.quote-text');
  const quoteAuthorEl = document.querySelector('.quote-author');

  if (!quoteTextEl || !quoteAuthorEl) {
    alert('No quote available to copy yet!');
    return;
  }

  const quoteText = quoteTextEl.textContent;
  const quoteAuthor = quoteAuthorEl.textContent;
  const fullQuote = `${quoteText}\n${quoteAuthor}`;

  navigator.clipboard.writeText(fullQuote)
    .then(() => {
      alert('Quote copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy quote:', err);
    });
}

// Function to show error message
function displayQuotesError() {
  const quotesDisplay = document.getElementById('quotes-display');
  quotesDisplay.innerHTML = `
    <div class="error-message">
      ⚠️ Could not load quotes
    </div>
  `;
}

// Set up "New Quote" + "Copy" buttons
function setupQuotesButton() {
  const newQuoteBtn = document.getElementById('new-quote-btn');
  const copyQuoteBtn = document.getElementById('copy-quote-btn');

  if (newQuoteBtn) {
    newQuoteBtn.addEventListener('click', () => {
      console.log('New quote button clicked!');
      displayRandomQuote();
    });
  }

  if (copyQuoteBtn) {
    copyQuoteBtn.addEventListener('click', () => {
      console.log('Copy quote button clicked!');
      copyQuoteToClipboard();
    });
  }
}

// Initialize quotes on page load
loadQuotes();
setupQuotesButton();


// ========================================
// TASKS WIDGET (with due dates)
// ========================================

// Load tasks from localStorage
function loadTasks() {
  const tasksJSON = localStorage.getItem('dashboardTasks');
  if (tasksJSON) {
    return JSON.parse(tasksJSON);
  } else {
    return [];
  }
}

// Save tasks to localStorage
function saveTasks(tasks) {
  localStorage.setItem('dashboardTasks', JSON.stringify(tasks));
  console.log('Tasks saved:', tasks);
}

// Sort tasks by due date (soonest first)
function sortTasksByDueDate(tasks) {
  return tasks.sort((a, b) => {
    const timeA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const timeB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

    if (timeA === timeB) return 0;
    return timeA < timeB ? -1 : 1;
  });
}

// Display all tasks
function displayTasks() {
  let tasks = loadTasks();
  const tasksList = document.getElementById('tasks-list');

  // If no tasks, show message
  if (tasks.length === 0) {
    tasksList.innerHTML = `
      <div class="no-tasks">
        No tasks yet. Add one above! ✨
      </div>
    `;
    updateTaskStats(tasks);
    return;
  }

  // Sort by due date (soonest first; tasks without dates at bottom)
  tasks = sortTasksByDueDate(tasks);

  // Clear existing tasks
  tasksList.innerHTML = '';

  // For "overdue" check, compare to today (no time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Display each task
  tasks.forEach((task) => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    // Main content (text + due date)
    const taskMain = document.createElement('div');
    taskMain.className = 'task-main';

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    taskMain.appendChild(taskText);

    // Due date (if present)
    if (task.dueDate) {
      const dueDateEl = document.createElement('span');
      dueDateEl.className = 'task-due-date';
      dueDateEl.textContent = `Due: ${task.dueDate}`;
      taskMain.appendChild(dueDateEl);

      const dueDateObj = new Date(task.dueDate);
      dueDateObj.setHours(0, 0, 0, 0);

      if (!task.completed && dueDateObj < today) {
        taskItem.classList.add('overdue');
      }
    }

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    // Assemble
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskMain);
    taskItem.appendChild(deleteBtn);

    tasksList.appendChild(taskItem);
  });

  updateTaskStats(tasks);
}

// Add a new task
function addTask(taskText, dueDate) {
  const tasks = loadTasks();

  const newTask = {
    text: taskText,
    completed: false,
    id: Date.now(),
    dueDate: dueDate || null
  };

  tasks.push(newTask);
  saveTasks(tasks);
  displayTasks();

  console.log('Task added:', newTask);
}

// Set up task form submission
function setupTaskForm() {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskDateInput = document.getElementById('task-date');

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    const taskDueDate = taskDateInput.value; // "YYYY-MM-DD" or ""

    if (taskText) {
      addTask(taskText, taskDueDate);
      taskInput.value = '';
      taskDateInput.value = '';
      taskInput.focus();
    }
  });
}

// Toggle task complete/incomplete (by id)
function toggleTask(taskId) {
  const tasks = loadTasks();
  const index = tasks.findIndex(task => task.id === taskId);

  if (index === -1) return;

  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  displayTasks();

  console.log('Task toggled:', tasks[index]);
}

// Delete a task (by id)
function deleteTask(taskId) {
  const tasks = loadTasks();
  const index = tasks.findIndex(task => task.id === taskId);

  if (index === -1) return;

  const taskToDelete = tasks[index];

  if (confirm(`Delete task: "${taskToDelete.text}"?`)) {
    tasks.splice(index, 1);
    saveTasks(tasks);
    displayTasks();

    console.log('Task deleted');
  }
}

// Update task statistics
function updateTaskStats(tasks) {
  const statsDiv = document.getElementById('task-stats');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  if (totalTasks === 0) {
    statsDiv.innerHTML = '';
    return;
  }

  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  statsDiv.innerHTML = `
    <div class="stat">Total: <strong>${totalTasks}</strong></div>
    <div class="stat">Completed: <strong>${completedTasks}</strong></div>
    <div class="stat">Pending: <strong>${pendingTasks}</strong></div>
    <div class="stat">Progress: <strong>${completionPercentage}%</strong></div>
  `;
}

// Initialize tasks when page loads
displayTasks();
setupTaskForm();


// ==========================================
// THEME MANAGEMENT
// ==========================================

function initializeTheme() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('dashboardTheme');

  if (savedTheme === 'dark') {
    document.body.classList.add('theme-dark');
    updateThemeIcon('dark');
  } else {
    updateThemeIcon('light');
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('theme-dark');

  // Save preference
  localStorage.setItem('dashboardTheme', isDark ? 'dark' : 'light');

  // Update icon
  updateThemeIcon(isDark ? 'dark' : 'light');

  console.log('Theme switched to:', isDark ? 'dark' : 'light');
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('.theme-icon');

  if (theme === 'dark') {
    themeIcon.textContent = '☀️'; // Sun for dark mode (to switch to light)
  } else {
    themeIcon.textContent = '🌙'; // Moon for light mode (to switch to dark)
  }
}

function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
}

// Call these when page loads
initializeTheme();
setupThemeToggle();

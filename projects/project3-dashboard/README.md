# Personal Dashboard

A responsive personal dashboard featuring weather, daily quotes, and full task management with due dates, theming, and local persistence.

## Features

- **Weather Widget**: Displays current weather conditions including temperature, humidity, wind speed, and “feels like,” loaded from weather.json.
- **Daily Quotes**: Loads a random inspirational quote from a JSON file.
    Includes:
    - “New Quote” button
    - Copy Quote to Clipboard functionality
    - Non-repeating randomizer
    - Smooth fade animation
- **Task Manager**: Add, complete, and delete personal tasks with:
    Stored due dates
    Due dates displayed with each task
    Overdue tasks automatically highlighted in red
    Tasks sorted by due date (soonest → latest)
    Task statistics (total, completed, pending)
    Persistent storage using localStorage
- **Dark/Light Theme**: Toggle between themes using CSS custom properties. User’s theme preference is saved and reloaded automatically.
- **Responsive Design**: Layout adapts to mobile, tablet, and desktop with CSS Grid + Flexbox.
- **Data Persistence**: Tasks and theme settings stored locally so they remain after refresh.

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Custom Properties, Animations)
- JavaScript (ES6+)
- fetch() API
- Clipboard API
- localStorage

## Live Demo

🔗 [View Live Dashboard](https://github.com/ceciliammurphy/writ40363-portfolio)

## Setup

1. Clone the repository
2. Open `index.html` in a web browser (use Live Server for development)
3. Customize `data/weather.json` and `data/quotes.json` with your own data

## Project Structure

\```
project3-dashboard/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles including themes
├── js/
│   └── app.js          # All JavaScript functionality
├── data/
│   ├── weather.json    # Weather data
│   └── quotes.json     # Quotes collection
└── README.md           # This file
\```

## Author

Cece Murphy

## License

MIT License
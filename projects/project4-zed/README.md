# Project Zed: AI-Assisted Web Application

> **WRIT 40363 - Digital Culture and Digital Arts**  
> Fall 2025 | Final Project

## 📋 Project Overview

This is **Project Zed**, an AI-assisted web application that builds on concepts from Projects 1–3 while introducing more advanced technical patterns. The goal was to design and develop a functional, aesthetic, and scalable Link Collection App — a personal, “it-girl inspired,” Pinterest-adjacent tool where users can save, categorize, and view links in a clean grid layout.

**Project Zed represents:**
✔️ My strongest integration of HTML, CSS, and JavaScript
✔️ A full modular architecture (3 separate JS modules)
✔️ Async handling for optional thumbnails
✔️ A refined design system
✔️ Deep collaboration with AI tools to push beyond my comfort zone

This project prioritizes **learning, iteration, and understanding over perfection.**

---

## 🎯 What is "Upskilling with AI"?

This project focuses on:
- Taking techniques from Projects 1-3 and pushing them further
- Learning new approaches through AI collaboration
- Building features I wasn't previously confident to tackle
- Refining code quality and design thinking
- Gaining insight from both successes and failures

**Important Note:** This project prioritizes learning and growth over perfection. A partially-working app with deep reflection is more valuable than a perfect app without understanding.

---

## 🚀 The Application

### Description
The Link Collection App lets users save and organize personal links in a stylish, responsive grid. It’s essentially “Pinterest’s type-A cousin”: a simple, aesthetic, self-curated inspo board without boards — instead, links can be filtered by category.

### Key Features
- Add links with:
   - Title
   - URL
   - Category (Event, Fashion, Social Media)
   - Optional price
   - Optional uploaded thumbnail
- Auto-rendered, responsive masonry-style grid
- Dynamic filtering by category
- Delete functionality
- Fully persistent data using localStorage
- Modular JS structure across three files
- A cohesive, pearly/creamy “it-girl” UI aesthetic

### Live Demo
🔗 https://ceciliammurphy.github.io/writ40363-portfolio/projects/project4-zed/ 

---

## 🛠️ Technologies Used

### Core Technologies
- **HTML5** - Semantic layout and modal/form structure
- **CSS3** - Variables, grid, responsive breakpoints, animations
- **JavaScript (ES6+)** - Modular architecture, DOM manipulation, async logic

### APIs & Libraries
- No external APIs (due to CORS limitations)
- Native FileReader API for handling user-uploaded images

### AI Development Tools
- ChatGPT – debugging, teaching new concepts, architecture support
- GitHub Copilot Chat – aesthetic decisions, CSS iterations, UI component logic
- Claude – alternative explanations for async behavior and grid concepts

---

## 💡 Upskilled Techniques

Below are the techniques this project demonstrates:

### From Project 1 (HTML/CSS Foundations)
- [X] Advanced CSS animations and transitions
- [X] CSS Grid or Flexbox layouts beyond basic grids
- [X] Custom CSS properties (variables) for theming
- [X] Responsive design with 3+ breakpoints
- [X] Advanced typography and design systems

### From Project 2 (JavaScript Fundamentals)
- [X] Complex DOM manipulation patterns
- [ ] Event delegation and advanced event handling
- [X] Data structures beyond simple arrays/objects
- [X] Form validation and error handling
- [X] Modular JavaScript (separation of concerns)

### From Project 3 (APIs & Advanced JS)
- [ ] Working with real external APIs
- [X] Advanced async patterns (Promise.all, error handling)
- [X] Complex state management across components
- [ ] Data visualization or processing
- [X] Progressive enhancement

### New Techniques (Learned via AI)
- [ ] New CSS features (container queries, modern selectors)
- [X] New JavaScript methods or patterns
- [ ] Accessibility features (ARIA, keyboard navigation)
- [ ] Performance optimization techniques
- [X] Modern development practices

---

## 📁 Project Structure

```
project-zed/
├── index.html
├── css/
│   └── main.css
├── js/
│   ├── app.js
│   ├── storage.js
│   └── categorizer.js
├── images/
├── AI_COLLABORATION_LOG.md
├── REFLECTION.md
└── README.md
└── CLAUDE.md              
```

---

## 🤖 AI Collaboration

This project was developed in partnership with AI development tools. Full documentation of the AI collaboration process can be found in [`AI_COLLABORATION_LOG.md`](./AI_COLLABORATION_LOG.md), including:

- Tools used
- Key insights
- Debugging sessions
- Concept-learning conversations
- Code review + refactoring sessions
- How I rewrote AI-generated patterns into my own code

**Key Principle:** AI was used as a learning accelerator and development partner, not as a replacement for understanding. Every line of code in this project can be explained and justified.

---

## 📝 Development Process

### Stage 1: Planning 
- Brainstormed features
- Established minimal UI layout
- Defined data model and categories

### Stage 2: Core Development
- Built JS modules
- Implemented localStorage
- Rendered cards + implemented filtering

### Stage 3 — Design & Styling
- Created CSS variables and aesthetic system
- Styled grid, cards, modal, form
- Fine-tuned animations

### Stage 4 — Enhancements
- Added FileReader support
- Improved validation
- Polished accessibility and responsiveness

### Stage 5 — Reflection
- Documented AI collaboration
- Completed learning reflection
- Finalized project for portfolio

---

## 🎓 Learning Outcomes

### Technical Skills Gained
- Building a real modular JS architecture
- Handling user-uploaded images asynchronously
- Designing responsive grid layouts with variable content sizes

### AI Collaboration Insights
- How to iterate with AI instead of copying it
- How to refine prompts over time
- How AI can act as a design partner, not just a code generator

*For detailed reflection on the learning journey, see [`REFLECTION.md`](./REFLECTION.md)*

---

## 🧪 Testing

The application has been tested on:
- ✅ Desktop browsers (Chrome, Firefox, Safari)
- ✅ Mobile devices (iOS, Android)
- ✅ Multiple screen sizes and breakpoints
- ✅ Accessibility (keyboard navigation, screen readers)

---

## 🚧 Known Issues & Future Enhancements

### Current Limitations
- No automatic thumbnail retrieval from URLs (CORS-related)
- No global sorting UI (though logic exists internally)

### Future Improvements
- Add drag-and-drop organization
- Add custom themes
- Add a “notes” field for each link
- Add keyword search across all links

---

## 🙏 Credits & Acknowledgments

### AI Tools
- **ChatGPT, Copilot, Claude** - Used for explanation, debugging, and iteration

### Resources 
- Instructor guidance on upskilling and documentation
- Class resources

### Inspiration
- Project 2
- Pinterest

---

## 📄 License

This project was created for educational purposes as part of WRIT 40363 at TCU.

---

## 📞 Contact

**Student:** Cecilia Murphy  
**Course:** WRIT 40363 
**Semester:** Fall 2025  
**Submission Date:** December 9, 2025

---

## 📚 Related Documentation

- **[AI Collaboration Log](./AI_COLLABORATION_LOG.md)** - Detailed AI partnership documentation
- **[Developer Reflection](./REFLECTION.md)** - 500-750 word reflection on the project
- **[Main Portfolio](../../)** - Link back to main portfolio site

---

*Built with curiosity, persistence, and strategic AI collaboration 🚀*

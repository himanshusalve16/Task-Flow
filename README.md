# TrackFlow

TrackFlow is a Notion-inspired productivity app built specifically for personal use, productivity tracking, and template management. It works completely offline and stores all data locally in your browser.

## Features

- **Dashboard System**: Create multiple workspaces (Work, Personal, Fitness, etc.) with custom pages and templates
- **Block-Based Editor**: Add various blocks to your pages:
  - ✅ Task checklists
  - 📅 Calendar with events
  - 📊 Habit tracker grid with streaks
  - 🧠 Markdown-supported notes
  - 🎯 Goal trackers with progress bars
  - 📈 Mood & journal logs
- **Template System**: Save any page as a template and load it into new pages
- **Local Storage**: All data stays on your device using localStorage/IndexedDB
- **Data Management**: Export/import your data as JSON files
- **PWA Ready**: Works on mobile and desktop browsers
- **Dark Mode**: Toggle between light and dark modes

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- React.js
- LocalStorage/IndexedDB for data persistence
- Styled Components for styling
- React Router for navigation
- React Beautiful DnD for drag-and-drop
- UUID for unique identifiers

## License

MIT

# Fact Checker App

A simple web application for checking and storing facts with their verification status.

## Features

- Add new facts with categories and verification status
- Search and filter facts by keyword, category, and verdict
- Edit and delete existing facts
- Persistent storage using IndexedDB (SQLite-like storage in the browser)
- Responsive design

## Technical Details

This application uses:

- HTML5 for structure
- CSS3 for styling
- Vanilla JavaScript for functionality
- IndexedDB for client-side storage (similar to SQLite)

## How to Use

1. Open `index.html` in a modern web browser
2. Add new facts using the form at the top
3. Search for facts using the search bar and filters
4. Edit or delete facts using the buttons on each fact card

## Data Structure

Each fact contains:

- Statement: The claim being fact-checked
- Category: The topic area (Science, History, Politics, etc.)
- Verdict: The verification status (True, False, Partially True, Unverified)
- Explanation: Details about why the verdict was assigned
- Sources: References used to verify the fact

## Browser Compatibility

This app works best in modern browsers that support IndexedDB:
- Chrome
- Firefox
- Safari
- Edge

## Limitations

- This is a client-side only application, so data is stored locally in the browser
- IndexedDB storage is limited by browser quotas (typically several MB)
- No user authentication or multi-user support

## Future Improvements

- Add user authentication
- Implement server-side storage with a real SQLite database
- Add image upload capability for evidence
- Implement fact sharing functionality

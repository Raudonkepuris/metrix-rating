# Metrix Rating Extension

## Overview

The Metrix Rating Extension is a browser extension designed to enhance the experience of viewing player profiles on Disc Golf Metrix. It displays player ratings and additional profile information in a convenient popup when hovering over player-related elements on the webpage.

## Features

- Displays player ratings directly on the competition page.
- Fetches and shows profile snippet on hover.
- Responsive design ensures the popup looks great on all screen sizes.
- Caches fetched data to improve performance and reduce unnecessary network requests.

## How It Was Made

This extension was "vibe coded"—a term for creating software with a focus on creativity, intuition and extensive use of GitHub Copilot.

## How It Works

1. When on competition screen the extension scans the webpage for player-related elements (e.g., `.player-cell`) and fetches player's data (rating, avatar and other numbers displayed on the profile).
2. Displays player's rating next to their name and when hovering over a player element, it shows the player's profile.
3. Data is cached locally to improve performance and reduce redundant network requests.

## Browser Support

Currently, this extension is only supported on **Firefox**. Support for other browsers (e.g., Chrome, Safari) might be added in the future if:

- I start using those browsers.
- Someone contributes a pull request (PR) to add support.

## Contributing

Contributions are welcome! If you'd like to add support for other browsers or improve the extension, feel free to submit a pull request.

const playerCells = document.querySelectorAll('.player-cell');

playerCells.forEach(async playerCell => {
    const profileLink = playerCell.querySelector('a.profile-link');
    if (profileLink) {
        try {
            const response = await fetch(profileLink.href);
            if (!response.ok) {
                console.error(`Failed to fetch ${profileLink.href}: ${response.statusText}`);
                return;
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const metrixRatingDiv = doc.querySelector('div.metrix-rating');
            const spanElement = metrixRatingDiv?.querySelector('span');

            if (spanElement) {
                const metrixRating = spanElement.textContent.trim();
                const ratingSpan = document.createElement('span');
                ratingSpan.textContent = ` (${metrixRating})`;
                playerCell.appendChild(ratingSpan);
            } else {
                console.error('No <span> element found inside div.metrix-rating.');
            }
        } catch (error) {
            console.error(`Error fetching or parsing ${profileLink.href}:`, error);
        }
    } else {
        console.error('No <a> element with class "profile-link" found in this player-cell.');
    }
});
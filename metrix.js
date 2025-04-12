const playerCells = document.querySelectorAll('.player-cell');

const cache = new Map(Object.entries(JSON.parse(localStorage.getItem('ratingsCache') || '{}')));

const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function appendRatingToCell(playerCell, metrixRating) {
    const ratingSpan = document.createElement('span');
    ratingSpan.textContent = ` (${metrixRating})`;
    playerCell.appendChild(ratingSpan);
}

playerCells.forEach(async playerCell => {
    const profileLink = playerCell.querySelector('a.profile-link');
    if (profileLink) {
        const cachedData = cache.get(profileLink.href);
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRATION_MS)) {
            appendRatingToCell(playerCell, cachedData.rating);
            return;
        }

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
                cache.set(profileLink.href, { rating: metrixRating, timestamp: Date.now() });
                localStorage.setItem('ratingsCache', JSON.stringify(Object.fromEntries(cache)));
                appendRatingToCell(playerCell, metrixRating);
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
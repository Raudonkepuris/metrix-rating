const playerCells = document.querySelectorAll('.player-cell');

const cache = new Map(Object.entries(JSON.parse(localStorage.getItem('ratingsCache') || '{}')));

const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function appendRatingToCell(playerCell, metrixRating, popupContent) {
    const ratingSpan = document.createElement('span');
    ratingSpan.textContent = ` (${metrixRating})`;
    ratingSpan.classList.add('rating-span');
    playerCell.appendChild(ratingSpan);

    // Create the popup
    const popup = document.createElement('div');
    popup.classList.add('rating-popup');
    popup.innerHTML = popupContent;
    popup.style.display = 'none';
    popup.style.position = 'absolute';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '10px';
    popup.style.zIndex = '1000';
    popup.style.width = '1100px'; // Set the width of the popup
    document.body.appendChild(popup);

    // Show popup on hover
    ratingSpan.addEventListener('mouseenter', (event) => {
        popup.style.display = 'block';
        popup.style.left = `${event.pageX + 10}px`;
        popup.style.top = `${event.pageY - popup.offsetHeight - 10}px`; // Position above the mouse
    });

    // Hide popup when not hovering
    ratingSpan.addEventListener('mouseleave', () => {
        popup.style.display = 'none';
    });
}

async function processPlayerCell(playerCell) {
    const profileLink = playerCell.querySelector('a.profile-link');
    if (profileLink) {
        const cachedData = cache.get(profileLink.href);
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRATION_MS)) {
            appendRatingToCell(playerCell, cachedData.rating, cachedData.popupContent);
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
            const profileCover = doc.querySelector('#content .profile-cover');
            const profileStats = doc.querySelector('#content .profile-stats');

            if (spanElement && profileCover && profileStats) {
                const metrixRating = spanElement.textContent.trim();
                const popupContent = `
                    <div class="popup-content">
                        ${profileCover.outerHTML}
                        ${profileStats.outerHTML}
                    </div>
                `;
                cache.set(profileLink.href, { rating: metrixRating, popupContent, timestamp: Date.now() });
                localStorage.setItem('ratingsCache', JSON.stringify(Object.fromEntries(cache)));
                appendRatingToCell(playerCell, metrixRating, popupContent);
            } else {
                console.error('Required elements not found in the fetched page.');
            }
        } catch (error) {
            console.error(`Error fetching or parsing ${profileLink.href}:`, error);
        }
    } else {
        console.error('No <a> element with class "profile-link" found in this player-cell.');
    }
}

(async () => {
    await Promise.all(Array.from(playerCells).map(processPlayerCell));
})();
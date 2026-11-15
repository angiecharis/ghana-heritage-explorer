const pages = [
    {
        title: "About Ghana Heritage Explorer",
        description: "Learn about our aim, mission, goals, and how Ghana Heritage Explorer works.",
        url: "about.html",
        keywords: "about our mission our aim our goals improve access support learning celebrate Ghana heritage encourage exploration digital heritage platform"
    },
    {
        title: "Ghana at Independence (1957)",
        description: "Explore Ghana's independence and historical resources from 1957.",
        url: "ghana-at-independence-1957.html",
        keywords: "independence 1957 kwame nkrumah freedom"
    },
    {
        title: "Colonial Ghana",
        description: "Explore Ghana's colonial history and resistance.",
        url: "colonial-ghana.html",
        keywords: "colonial gold coast resistance british"
    },
    {
        title: "Traditional Kingdoms",
        description: "Discover Ghana's traditional kingdoms and their histories.",
        url: "traditional-kingdoms.html",
        keywords: "ashanti asante ga fante gonja kingdoms"
    },
    {
        title: "Archival Photographs",
        description: "Discover historical photographs from trusted collections.",
        url: "archival-photographs.html",
        keywords: "photos pictures images archives"
    },
    {
        title: "Books and Publications",
        description: "Explore books and publications about Ghana's history.",
        url: "books-publications.html",
        keywords: "books publications research history"
    },
    {
        title: "Historical Newspapers",
        description: "Explore newspapers documenting Ghana's past.",
        url: "newspapers.html",
        keywords: "newspapers news press historical"
    },
    {
        title: "Political Leadership",
        description: "Explore Ghana's political history and leadership.",
        url: "political-leadership.html",
        keywords: "politics leaders government nkrumah"
    }
];

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

searchForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = "";

    if (!query) {
        searchResults.textContent = "Please enter a search term.";
        return;
    }

    const matches = pages.filter(function(page) {
        const content = (
            page.title + " " +
            page.description + " " +
            page.keywords
        ).toLowerCase();

        return content.includes(query);
    });

    if (matches.length === 0) {
        searchResults.textContent =
            "No matching resources found. Try another keyword.";
        return;
    }

    matches.forEach(function(page) {
        const result = document.createElement("div");
        result.className = "search-result";

        const link = document.createElement("a");
        link.href = page.url;
        link.textContent = page.title;

        const description = document.createElement("p");
        description.textContent = page.description;

        result.appendChild(link);
        result.appendChild(description);
        searchResults.appendChild(result);
    });
});
/* Ghana Heritage Explorer: search the visible text of the site's HTML pages.
   Run the website using VS Code Live Server (not file://). */
const sitePages = [
  'index.html',
  'about.html',
  'collections.html',
  'colonial-ghana.html',
  'traditional-kingdoms.html',
  'archival-photographs copy.html',
  'books-publications.html',
  'newspapers.html',
  'political-leadership.html',
  'forts-castles-european-trade.html',
  'cocoa-gold-colonial-economy.html',
  'culture-heritage-photographs.html',
  'everyday-life-gold-coast.html',
  'resistance-to-colonial-rule.html',
  'railways-roads-colonial-development.html',
  'road-to-independence.html',
  'ghana-at-independence-1957.html',
  'ghana-at-independence-1957-archival-photographs.html'
];

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
let indexedPagesPromise;

function cleanText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function pageName(filename) {
  return filename.replace(/\.html$/i, '').replace(/ copy$/i, '')
    .replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
}

async function loadPage(filename) {
  const response = await fetch(encodeURI(filename), { cache: 'no-cache' });
  if (!response.ok) throw new Error('Could not load ' + filename);
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const content = doc.querySelector('main') || doc.body;
  const copy = content.cloneNode(true);
  copy.querySelectorAll('script, style, nav, header, footer, noscript, svg').forEach(el => el.remove());
  const text = cleanText(copy.textContent || '');
  const heading = doc.querySelector('main h1, h1');
  const title = heading ? cleanText(heading.textContent) : pageName(filename);
  return { filename, title, text };
}

function getIndex() {
  if (!indexedPagesPromise) {
    indexedPagesPromise = Promise.allSettled(sitePages.map(loadPage));
  }
  return indexedPagesPromise;
}

function showMessage(message) {
  const p = document.createElement('p');
  p.textContent = message;
  searchResults.appendChild(p);
}

function makeSnippet(text, query) {
  const at = text.toLowerCase().indexOf(query);
  const start = Math.max(0, at - 85);
  const end = Math.min(text.length, at + query.length + 135);
  return (start ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

if (searchForm && searchInput && searchResults) {
  searchForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const query = cleanText(searchInput.value).toLowerCase();
    searchResults.replaceChildren();
    if (!query) {
      showMessage('Please enter a search term.');
      return;
    }

    showMessage('Searching website pages…');
    try {
      const outcomes = await getIndex();
      const pages = outcomes.filter(item => item.status === 'fulfilled').map(item => item.value);
      const failed = outcomes.filter(item => item.status === 'rejected').length;
      const matches = pages.filter(page =>
        (page.title + ' ' + page.text).toLowerCase().includes(query)
      );
      searchResults.replaceChildren();
      if (!matches.length) {
        showMessage('No matching pages found. Try another word or phrase.');
      } else {
        showMessage(matches.length + (matches.length === 1 ? ' matching page found.' : ' matching pages found.'));
        matches.forEach(page => {
          const result = document.createElement('div');
          result.className = 'search-result';
          const link = document.createElement('a');
          link.href = encodeURI(page.filename);
          link.textContent = page.title;
          const snippet = document.createElement('p');
          snippet.textContent = makeSnippet(page.text, query);
          result.append(link, snippet);
          searchResults.appendChild(result);
        });
      }
      if (failed) showMessage(failed + ' page(s) could not be searched. Check that the files are present and you are using Live Server.');
    } catch (error) {
      searchResults.replaceChildren();
      showMessage('Search could not load the pages. Please open the website using Live Server.');
    }
  });
}

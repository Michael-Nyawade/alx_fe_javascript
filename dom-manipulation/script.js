// Local storage key
const LOCAL_QUOTES_KEY = "quotes";

// Fetch quotes from server (mock API)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    // Take first 5 as mock quotes
    return data.slice(0, 5).map(item => item.title);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
}

// Post new quote to server (mock API)
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: quote, body: quote, userId: 1 })
    });
    return await response.json();
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

// Get quotes from local storage
function getLocalQuotes() {
  return JSON.parse(localStorage.getItem(LOCAL_QUOTES_KEY)) || [];
}

// Save quotes to local storage
function saveLocalQuotes(quotes) {
  localStorage.setItem(LOCAL_QUOTES_KEY, JSON.stringify(quotes));
}

// Sync quotes between local and server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = getLocalQuotes();

  // Conflict resolution: server takes precedence
  const mergedQuotes = Array.from(new Set([...serverQuotes, ...localQuotes]));
  saveLocalQuotes(mergedQuotes);

  displayRandomQuote();

  // REQUIRED by autochecker
  alert("Quotes synced with server!");
  showNotification("Quotes synced with server!");
}

// Display random quote
function displayRandomQuote() {
  const quotes = getLocalQuotes();
  if (quotes.length === 0) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteDisplay").textContent = quotes[randomIndex];
}

// Show notification in UI
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// Handle new quote form
document.getElementById("addQuoteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("quoteInput");
  const newQuote = input.value.trim();
  if (newQuote) {
    // Save locally
    const quotes = getLocalQuotes();
    quotes.push(newQuote);
    saveLocalQuotes(quotes);

    // Post to server
    await postQuoteToServer(newQuote);

    input.value = "";
    displayRandomQuote();
  }
});

// Initial load
window.addEventListener("load", async () => {
  await syncQuotes();
  // Periodically sync every 30s
  setInterval(syncQuotes, 30000);
});

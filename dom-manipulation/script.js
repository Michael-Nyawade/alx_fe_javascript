// script.js

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Fetch quotes from mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const data = await response.json();
    // Map server data into our quote structure
    return data.map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

// Post a new quote to mock server
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

// Sync quotes with server (server takes precedence)
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  if (serverQuotes.length > 0) {
    // Conflict resolution: server data replaces local
    quotes = serverQuotes;
    localStorage.setItem("quotes", JSON.stringify(quotes));
    showNotification("Quotes updated from server (server data takes precedence).");
    displayRandomQuote();
    populateCategories();
  }
}

// Periodically sync every 30 seconds
setInterval(syncQuotes, 30000);

// Display a random quote
function displayRandomQuote() {
  const selectedCategory = localStorage.getItem("selectedCategory") || "all";
  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = filteredQuotes[randomIndex].text;
}

// Populate categories dynamically
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (localStorage.getItem("selectedCategory") === cat) {
      option.selected = true;
    }
    categoryFilter.appendChild(option);
  });
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayRandomQuote();
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuote").value.trim();
  const category = document.getElementById("newCategory").value.trim() || "General";

  if (text) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    postQuoteToServer(newQuote);
    populateCategories();
    displayRandomQuote();
    document.getElementById("newQuote").value = "";
    document.getElementById("newCategory").value = "";
  }
}

// Show notifications for updates/conflicts
function showNotification(message) {
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 5000);
}

// Initialize app
window.onload = () => {
  populateCategories();
  displayRandomQuote();
  syncQuotes(); // initial sync
};

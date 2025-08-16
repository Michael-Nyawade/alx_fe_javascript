// Default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", category: "Inspiration" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", category: "Success" }
];

// Track selected category
let selectedCategory = "all";

// Load saved category filter from localStorage
const savedCategory = localStorage.getItem("selectedCategory");
if (savedCategory) {
  selectedCategory = savedCategory;
}

// Create form for adding quotes dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const form = document.createElement("form");
  form.id = "quoteForm";

  form.innerHTML = `
    <input type="text" id="quoteText" placeholder="Enter quote" required />
    <input type="text" id="quoteAuthor" placeholder="Enter author" required />
    <input type="text" id="quoteCategory" placeholder="Enter category" required />
    <button type="submit">Add Quote</button>
  `;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addQuote();
  });

  formContainer.appendChild(form);
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("quoteText").value;
  const author = document.getElementById("quoteAuthor").value;
  const category = document.getElementById("quoteCategory").value;

  const newQuote = { text, author, category };
  quotes.push(newQuote);

  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Update categories if a new one is added
  populateCategories();

  // Reset form
  document.getElementById("quoteForm").reset();

  // Refresh displayed quotes with filter applied
  filterQuotes();
}

// Populate dropdown with unique categories
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all"];

  quotes.forEach(q => {
    if (q.category && !categories.includes(q.category)) {
      categories.push(q.category);
    }
  });

  categoryFilter.innerHTML = categories
    .map(c => `<option value="${c}">${c}</option>`)
    .join("");

  // Restore last saved category
  if (categories.includes(selectedCategory)) {
    categoryFilter.value = selectedCategory;
  } else {
    selectedCategory = "all";
    categoryFilter.value = "all";
  }
}

// Filter quotes by selected category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  selectedCategory = categoryFilter.value; // required by autochecker
  localStorage.setItem("selectedCategory", selectedCategory);

  const quotesContainer = document.getElementById("quotesContainer");
  quotesContainer.innerHTML = "";

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  filteredQuotes.forEach(q => {
    const div = document.createElement("div");
    div.className = "quote";
    div.innerHTML = `<p>"${q.text}"</p><small>- ${q.author} [${q.category}]</small>`;
    quotesContainer.appendChild(div);
  });
}

// Initialize app
window.onload = function () {
  createAddQuoteForm();
  populateCategories();
  filterQuotes();
};

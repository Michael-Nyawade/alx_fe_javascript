// Default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" }
];

// Selected category (stored in localStorage)
let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// Create Add Quote Form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const form = document.createElement("form");
  form.id = "addQuoteForm";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Enter quote";
  textInput.id = "quoteText";
  textInput.required = true;

  const authorInput = document.createElement("input");
  authorInput.type = "text";
  authorInput.placeholder = "Enter author";
  authorInput.id = "quoteAuthor";
  authorInput.required = true;

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter category";
  categoryInput.id = "quoteCategory";
  categoryInput.required = true;

  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Add Quote";

  form.appendChild(textInput);
  form.appendChild(authorInput);
  form.appendChild(categoryInput);
  form.appendChild(button);

  formContainer.appendChild(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addQuote(textInput.value, authorInput.value, categoryInput.value);
    form.reset();
  });
}

// Add a new quote
function addQuote(text, author, category) {
  quotes.push({ text, author, category });
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  displayQuotes();
}

// Populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "All Categories";
  categoryFilter.appendChild(defaultOption);

  const categories = [...new Set(quotes.map((q) => q.category))];
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat; // ✅ use textContent
    if (cat === selectedCategory) {
      option.selected = true;
    }
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = selectedCategory;
}

// Display quotes
function displayQuotes() {
  const container = document.getElementById("quotesContainer");
  container.innerHTML = "";

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  filteredQuotes.forEach((q) => {
    const quoteDiv = document.createElement("div");
    quoteDiv.className = "quote";

    const quoteText = document.createElement("p");
    quoteText.textContent = `"${q.text}"`; // ✅ use textContent

    const quoteAuthor = document.createElement("small");
    quoteAuthor.textContent = `- ${q.author} (${q.category})`; // ✅ use textContent

    quoteDiv.appendChild(quoteText);
    quoteDiv.appendChild(quoteAuthor);
    container.appendChild(quoteDiv);
  });
}

// Filter quotes
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayQuotes();
}

// Initialize
createAddQuoteForm();
populateCategories();
displayQuotes();

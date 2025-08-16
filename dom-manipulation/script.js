// --- Storage keys ---
const STORAGE_KEY = "dqg_quotes_v1";
const LAST_QUOTE_SESSION_KEY = "dqg_last_quote_v1";
const LAST_FILTER_KEY = "dqg_last_filter_v1";

// --- Initial data ---
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Simplicity is the ultimate sophistication.", category: "Philosophy" }
];

// --- DOM refs ---
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportJson");
const categoryFilter = document.getElementById("categoryFilter");

// --- Helpers: save/load ---
function saveQuotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error("Failed to save quotes:", e);
  }
}

function loadQuotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) quotes = parsed;
  } catch {}
}

// --- Display a quote ---
function displayQuote(quote) {
  quoteDisplay.innerHTML = "";
  if (!quote) {
    quoteDisplay.textContent = "No quotes available!";
    return;
  }
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;
  const quoteCategory = document.createElement("span");
  quoteCategory.textContent = `— ${quote.category}`;
  quoteCategory.style.fontStyle = "italic";
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// --- Show random quote (respects filter) ---
function showRandomQuote() {
  let filteredQuotes = quotes;
  const selected = categoryFilter?.value || "all";
  if (selected !== "all") {
    filteredQuotes = quotes.filter((q) => q.category === selected);
  }

  if (filteredQuotes.length === 0) {
    displayQuote(null);
    return;
  }

  const idx = Math.floor(Math.random() * filteredQuotes.length);
  const q = filteredQuotes[idx];
  displayQuote(q);

  try {
    sessionStorage.setItem(LAST_QUOTE_SESSION_KEY, JSON.stringify(q));
  } catch {}
}

// --- Build Add-Quote form dynamically ---
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.style.marginTop = "16px";
  formContainer.style.display = "flex";
  formContainer.style.gap = "10px";
  formContainer.style.flexWrap = "wrap";
  formContainer.style.justifyContent = "center";

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";

  addButton.addEventListener("click", function () {
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
      alert("Please enter both a quote and a category!");
      return;
    }

    quotes.push({ text, category });
    saveQuotes();
    populateCategories(); // update dropdown with new category

    textInput.value = "";
    categoryInput.value = "";
    alert("Quote added successfully!");
  });

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
  document.body.appendChild(formContainer);
}

// --- Populate categories dynamically ---
function populateCategories() {
  if (!categoryFilter) return;
  const selectedBefore = categoryFilter.value;

  // clear all options first
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map((q) => q.category))];
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // restore selection if possible
  const savedFilter = localStorage.getItem(LAST_FILTER_KEY);
  if (savedFilter && (savedFilter === "all" || categories.includes(savedFilter))) {
    categoryFilter.value = savedFilter;
  } else {
    categoryFilter.value = selectedBefore || "all";
  }
}

// --- Filter quotes ---
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem(LAST_FILTER_KEY, selected);
  showRandomQuote();
}

// --- JSON Export ---
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// --- JSON Import ---
function importFromJsonFile(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed)) {
        const validToAdd = parsed.filter(
          (q) => q && typeof q.text === "string" && typeof q.category === "string"
        );
        quotes.push(...validToAdd);
        saveQuotes();
        populateCategories(); // refresh categories
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Could not parse JSON file.");
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}

// --- Init ---
loadQuotes();
populateCategories();

// restore last viewed quote or random
const lastViewedRaw = sessionStorage.getItem(LAST_QUOTE_SESSION_KEY);
if (lastViewedRaw) {
  try {
    displayQuote(JSON.parse(lastViewedRaw));
  } catch {
    showRandomQuote();
  }
} else {
  showRandomQuote();
}

newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportToJsonFile);

createAddQuoteForm();

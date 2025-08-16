// script.js

// Step 1: Initial quotes data
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Simplicity is the ultimate sophistication.", category: "Philosophy" }
];

// Reference DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Step 2: Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  // Clear previous content
  quoteDisplay.innerHTML = "";

  // Create elements dynamically
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement("span");
  quoteCategory.textContent = `— ${quote.category}`;
  quoteCategory.style.fontStyle = "italic";

  // Append them
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Step 3: Add new quotes dynamically
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category!");
    return;
  }

  // Add new quote to the array
  quotes.push({ text, category });

  // Clear form fields
  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// Step 4: Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// Show one quote initially
showRandomQuote();

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

// Step 3: Create Add Quote Form dynamically
function createAddQuoteForm() {
  // Create container div
  const formContainer = document.createElement("div");

  // Create input for quote text
  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  // Create input for category
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  // Create add button
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";

  // Add event listener
  addButton.addEventListener("click", function () {
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
  });

  // Append inputs and button to container
  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Append form to body
  document.body.appendChild(formContainer);
}

// Step 4: Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize app
showRandomQuote();
createAddQuoteForm(); // Call this so the form is created dynamically

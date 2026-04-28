const filters = document.querySelectorAll(".filter-chip");
const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".product-card");
const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartCount = document.getElementById("cartCount");
const savedList = document.getElementById("savedList");
const emptyState = document.getElementById("emptyState");
const listingForm = document.getElementById("listingForm");
const formNote = document.getElementById("formNote");

let activeFilter = "all";
const savedItems = [];

function renderCards() {
  const query = searchInput.value.trim().toLowerCase();

  cards.forEach((card) => {
    const category = card.dataset.category;
    const name = card.dataset.name.toLowerCase();
    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const matchesQuery = !query || name.includes(query);
    card.classList.toggle("hidden", !(matchesFilter && matchesQuery));
  });
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((chip) => chip.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderCards();
  });
});

searchInput.addEventListener("input", renderCards);

function syncSavedItems() {
  cartCount.textContent = String(savedItems.length);
  savedList.innerHTML = "";

  if (!savedItems.length) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  savedItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    savedList.appendChild(li);
  });
}

document.querySelectorAll(".save-button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.dataset.product;
    if (!savedItems.includes(item)) {
      savedItems.push(item);
      syncSavedItems();
    }

    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
  });
});

function closeDrawer() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
}

cartButton.addEventListener("click", () => {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
});

closeCart.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

listingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(listingForm);
  const name = data.get("name");
  const category = data.get("category");
  const price = data.get("price");
  const pickup = data.get("pickup");

  formNote.textContent = `Preview ready: ${name} in ${category} for ${price}, set to meet at ${pickup}.`;
  listingForm.reset();
});

syncSavedItems();
renderCards();

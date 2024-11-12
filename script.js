const API_KEY = "a54b8cb0cab345aa818587018ac6d9d8";
const API_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}`;

document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  if (searchButton) {
    searchButton.addEventListener("click", searchRecipes);
  } else {
    console.error("Search button not found");
  }
  loadFavorites();
});

async function searchRecipes() {
  const query = document.getElementById("query-input").value.trim();
  if (!query) {
    alert("Please enter a dish name.");
    return;
  }

  const url = `${API_URL}&query=${encodeURIComponent(query)}&number=12`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    displayRecipes(data.results);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    alert("Unable to fetch recipes. Please try again later.");
  }
}

function displayRecipes(recipes) {
  const recipeContainer = document.getElementById("recipes-container");
  if (!recipeContainer) {
    console.error("Recipes container not found");
    return;
  }

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("col-md-4", "mb-4");
    recipeCard.innerHTML = `
          <div class="card h-100">
              <img src="${recipe.image}" class="card-img-top" alt="${
      recipe.title
    }">
              <div class="card-body">
                  <h5 class="card-title">${recipe.title}</h5>
                  <div class="d-flex justify-content-center align-items-center mt-auto">
                      <button class="btn btn-primary" id="fav-btn-${
                        recipe.id
                      }" onclick="toggleFavorite(${recipe.id}, '${
      recipe.title
    }', '${recipe.image}', this)">
                          <i class="far fa-heart"></i>
                      </button>
                      <a href="https://spoonacular.com/recipes/${recipe.title
                        .replace(/ /g, "-")
                        .toLowerCase()}-${
      recipe.id
    }" target="_blank" class="btn btn-secondary ml-2">
                          <i class="fas fa-eye"></i>
                      </a>
                  </div>
              </div>
          </div>
      `;
    recipeContainer.appendChild(recipeCard);
  });
}

function toggleFavorite(id, title, image, button) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const exists = favorites.some((recipe) => recipe.id === id);

  if (!exists) {
    favorites.push({ id, title, image });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    button.innerHTML = '<i class="fas fa-heart"></i>';
    alert("Recipe added to favorites!");
  } else {
    favorites = favorites.filter((recipe) => recipe.id !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    button.innerHTML = '<i class="far fa-heart"></i>';
    alert("Recipe removed from favorites.");
  }
  loadFavorites();
}

function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoritesContainer = document.getElementById("favorites-container");
  const favoritesHeader = document.getElementById("favorites-header");
  const noFavoritesMessage = document.getElementById("no-favorites-message");

  if (!favoritesContainer) {
    console.error("Favorites container not found");
    return;
  }

  favoritesContainer.innerHTML = "";
  if (favorites.length > 0) {
    favoritesHeader.style.display = "block";
    favoritesContainer.style.display = "flex";
    noFavoritesMessage.style.display = "none";
    favorites.forEach((recipe) => {
      const favCard = document.createElement("div");
      favCard.classList.add("col-md-4", "mb-4");
      favCard.innerHTML = `
        <div class="card h-100">
          <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
          <div class="card-body">
            <h5 class="card-title">${recipe.title}</h5>
            <div class="d-flex justify-content-center align-items-center mt-auto">
              <a href="https://spoonacular.com/recipes/${recipe.title
                .replace(/ /g, "-")
                .toLowerCase()}-${
        recipe.id
      }" target="_blank" class="btn btn-secondary mr-2">
                <i class="fas fa-eye"></i>
              </a>
              <button class="btn btn-danger" onclick="removeFavorite(${
                recipe.id
              })">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      favoritesContainer.appendChild(favCard);
    });
  } else {
    favoritesHeader.style.display = "none";
    favoritesContainer.style.display = "none";
    noFavoritesMessage.style.display = "block";
  }
}

function removeFavorite(id) {
  const confirmation = confirm(
    "Are you sure you want to delete this favorite recipe?"
  );
  if (!confirmation) {
    return;
  }

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter((recipe) => recipe.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites();
}

import { postRequest, getRequest, deleteRequest } from "./api/tasks";

// Cache DOM elements
const searchBtn = document.querySelector("#search-button");
const searchTab = document.querySelector("#search-tab");
const queryBtn = document.querySelector("#query-button");
const searchedResultsDisplayArea = document.querySelector("#search-results");
const favoritesDisplayArea = document.querySelector("#favorites");
const favoritesBtn = document.querySelector("#favorites-button");
const favoritesTab = document.querySelector("#favorites-tab");

// Declare global variables
let albumStore = null;
let searchedResults = null;
let favoriteAlbumStore = [];

// Fetch data and initialize the app
async function appInit() {
  albumStore = await getRequest(
    "https://660ded9e6ddfa2943b3573dc.mockapi.io/api/v1/albums"
  );
  favoriteAlbumStore = await getRequest(
    "https://660ded9e6ddfa2943b3573dc.mockapi.io/api/v1/favorites"
  );
}
appInit();

// Event listeners
searchBtn.addEventListener("click", onTabClick);
queryBtn.addEventListener("click", onSearchAlbums);
searchedResultsDisplayArea.addEventListener("click", onAddFavoriteAlbums);
favoritesBtn.addEventListener("click", onTabClick);
favoritesDisplayArea.addEventListener("click", onDeleteFavorites);

// Functions
function onTabClick(event) {
  const tab = event.currentTarget.dataset.tab;
  searchBtn.classList.toggle("active", tab === "search");
  searchTab.classList.toggle("d-none", tab !== "search");
  favoritesBtn.classList.toggle("active", tab === "favorites");
  favoritesTab.classList.toggle("d-none", tab !== "favorites");

  onDisplayTabContent(tab);
}

async function onDisplayTabContent(tab) {
  if (tab === "favorites") {
    favoriteAlbumStore = await getRequest(
      "https://660ded9e6ddfa2943b3573dc.mockapi.io/api/v1/favorites"
    );

    if (favoriteAlbumStore.length > 0) {
      renderData(
        favoriteAlbumStore,
        "#favorites-tab h5",
        "Remove from Favorites",
        favoritesDisplayArea
      );
    } else {
      alert("You haven't added any albums yet.");
    }
  }
}

function onSearchAlbums(event) {
  event.preventDefault();
  const queryString = document
    .querySelector("#query")
    .value.toLowerCase()
    .trim();

  if (queryString !== "") {
    searchedResults = filterAlbums(queryString);
  }

  updateUI();
}

function filterAlbums(queryString) {
  return albumStore.filter(
    (album) =>
      album.albumName.toLowerCase().includes(queryString) ||
      album.artistName.toLowerCase().includes(queryString)
  );
}

function updateUI() {
  const notFoundFeedback = document.querySelector("#no-data-feedback");
  const tabelHead = document.querySelector("#search-tab h2");

  if (searchedResults.length === 0) {
    notFoundFeedback.classList.remove("d-none");
    searchedResultsDisplayArea.classList.add("d-none");
    tabelHead.classList.add("d-none");
    document.querySelector("#query").value = "";
  } else {
    notFoundFeedback.classList.add("d-none");
    searchedResultsDisplayArea.classList.remove("d-none");
    document.querySelector("#query").value = "";
    renderData(
      searchedResults,
      "#search-tab h2",
      "Add to Favorites",
      searchedResultsDisplayArea
    );
  }
}

function renderData(arr, tableHead, btnText, renderArea) {
  document.querySelector(tableHead).classList.remove("d-none");
  let html = "";

  arr.forEach((album) => {
    html += `<li class="list-group-item d-flex justify-content-between align-items-center">
        <div class="ms-2 me-auto">
            <div class="fw-bold">
                ${album.albumName}
                <span class="badge bg-primary rounded-pill">${album.averageRating}</span>
            </div>
            <span>${album.artistName}</span>
        </div>
        <button type="button" class="btn btn-success" data-uid="${album.uid}">${btnText}</button>
    </li>`;
  });

  renderArea.innerHTML = html;
}

async function onAddFavoriteAlbums(event) {
  const uid = event.target.dataset.uid;
  favoriteAlbumStore = await getRequest(
    "https://660ded9e6ddfa2943b3573dc.mockapi.io/api/v1/favorites"
  );

  if (event.target.hasAttribute("data-uid") && !isAlbumOnServer(uid)) {
    const favoriteAlbum = findAlbumByUid(searchedResults, uid);
    await postRequest(favoriteAlbum);
  }
}

function findAlbumByUid(arr, uid) {
  return arr.find((element) => element.uid === uid);
}

function isAlbumOnServer(uid) {
  const isAlbumOnServer = favoriteAlbumStore.some((album) => album.uid === uid);

  if (isAlbumOnServer) {
    alert("This album is already in your favorites. Addition aborted.");
    return true;
  }
}

async function onDeleteFavorites(event) {
  const uid = event.target.dataset.uid;
  const favoriteAlbumToDelete = findAlbumByUid(favoriteAlbumStore, uid);

  if (event.target.hasAttribute("data-uid")) {
    favoriteAlbumStore = favoriteAlbumStore.filter(
      (album) => album.uid !== uid
    );
  }

  await deleteRequest(favoriteAlbumToDelete.id);
  renderData(
    favoriteAlbumStore,
    "#favorites-tab h5",
    "Remove from Favorites",
    favoritesDisplayArea
  );
}

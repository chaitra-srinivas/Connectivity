var apiMoviesKey = "kxGjghc3HTcDjcm1Tq3Cp4Uj0TpCC4Dd";
var apiBooksKey = "C1TDrksFmBX6rwRPyWGH6t6yIkYDeYxq";
var baseMoviesURL = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";
var baseBooksURL = "https://api.nytimes.com/svc/books/v3/reviews.json";

function showSearchPanel() {
  $("#search-panel").show();
  $("#top-books-tab-content").hide();
  $("#movie-critics-tab-content").hide();
  $("#favourites-tab-content").hide();
}

//checks radiobutton for searching movies (by title)
function isMoviesSelected() {
  return $("#movies-by-title").prop("checked");
}
//checks radiobutton for searching books by author
function isBooksByAuthorSelected() {
  return $("#books-by-author").prop("checked");
}
//checks radiobutton for searching books by title
function isBooksByTitleSelected() {
  return $("#books-by-title").prop("checked");
}

//handles the search
function initiateSearch() {
  $("#book-results-container").addClass("is-hidden");
  $("#movie-results-container").addClass("is-hidden");
  $("#movie-results").html("");
  $("#book-results").html("");

  var param = getSearchParam();
  if (!isParameterValid(param)) {
    return;
  }

  if (isMoviesSelected()) {
    $("#movie-results-container").removeClass("is-hidden");
    getMoviesByTitle(param);
  } else if (isBooksByAuthorSelected()) {
    $("#book-results-container").removeClass("is-hidden");
    getBooksByAuthor(param);
  } else if (isBooksByTitleSelected()) {
    $("#book-results-container").removeClass("is-hidden");
    getBooksByTitle(param);
  } else {
    $("#movie-results-container").removeClass("is-hidden");
    $("#book-results-container").removeClass("is-hidden");
    getMoviesByTitle(param);
    getBooksByTitle(param);
  }
}

//checks if some text is passed as a parameter
function isParameterValid(param) {
  var infoStatus = $("#infoStatus");
  if (!param || param.trim().length === 0) {
    infoStatus.text("Please enter a title/author name");
    return false;
  } else {
    infoStatus.text(" ");
    return true;
  }
}
//get search parameters
function getSearchParam() {
  return $("#search").val();
}

//calls the NYT Movies API and get the critics picks
function getMoviesPicks() {

    var apiPicksUrl = new URL(baseMoviesURL);
    apiPicksUrl.searchParams.set("critics-pick", "Y");
    apiPicksUrl.searchParams.set("api-key",apiMoviesKey);
   
  getMovieDetails(apiPicksUrl, "#movie-critics-tab-content");
  
}

//calls the NYT Movies API search movies by param
function getMoviesByTitle(param) {

    var apiQueryUrl = new URL(baseMoviesURL);
    apiQueryUrl.searchParams.set("query",param);
    apiQueryUrl.searchParams.set("api-key", apiMoviesKey);

  getMovieDetails(apiQueryUrl, "#movie-results");
}

// Function to get book details by user's choice of title
function getBooksByTitle(param) {

  var searchByTitleUrl = new URL(baseBooksURL);
  searchByTitleUrl.searchParams.set("title", param);
  searchByTitleUrl.searchParams.set("api-key", apiBooksKey);

  getBookDetails(searchByTitleUrl);
}

// Function to get user choice  by author's name
function getBooksByAuthor(param) {

  var searchByAuthorUrl = new URL(baseBooksURL);
  searchByAuthorUrl.searchParams.set("author",param);
  searchByAuthorUrl.searchParams.set("api-key",apiBooksKey);
 
  getBookDetails(searchByAuthorUrl);
}

// Function to get Books data
function getTopSellers() {
  var topSellerBooksUrl = new URL(
    "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json"
  );

  topSellerBooksUrl.searchParams.set("api-key", apiBooksKey);

  fetch(topSellerBooksUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (queryRes) {
      renderTopSellers(queryRes.results.books);
    })
    .catch(function (error) {
      console.error(error);
    });
}

// Function to retrieve data for search by title/author
function getBookDetails(searchURL) {
  fetch(searchURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (queryRes) {
      renderBookResult(queryRes);
    })
    .catch(function (error) {
      console.error(error);
    });
}
//gets data for movie search (by title)
function getMovieDetails(searchURL, contentElementSelector) {
  fetch(searchURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (queryRes) {
      renderMovieResult(queryRes, contentElementSelector);
    })
    .catch(function (error) {
      console.error(error);
    });
}

//appends movie results into html
function renderMovieResult(queryRes, contentElementSelector) {
  var innerHTML = "";
  if (queryRes.num_results > 0) {
    queryRes.results.slice(0, 5).forEach((result) => {
      var image = result.multimedia;
      if (!image) {
        image = "./assets/images/no-image.jpg";
      }
      innerHTML += renderMovieResultTemplate(result, image);
    });
  } else {
    innerHTML += "<h3>No Results Found!</h3>";
  }
  $(contentElementSelector).html(innerHTML);
}

//displays movie results
function renderMovieResultTemplate(result, image) {
  return `
<div class="container column px-3 py-3">
  <div class="card-image">
    <figure class="image is-4by3">
    <img onerror="this.src='./assets/images/no-image.jpg';this.onerror='';" src="${image.src}" alt="${result.display_title}">
    </figure>
  </div>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
      <p class="title is-4">${result.display_title} </p> <span title="${result.display_title}" class="addFavourite"  id="addFavourite" ><i class="far fa-heart"></i></span>
      <p class="subtitle is-6">Rating: ${result.mpaa_rating}</p>
      <p class="subtitle is-12">Rating: ${result.summary_short}</p>
      <time datetime>Release Date: ${result.opening_date}</time>
      </div>
    </div>
  </div>
 </div>
`;
}

// Display results for the user's choice of book by title
function renderBookResult(queryRes) {
  var innerHTML = "";
  if (queryRes.results.length > 0) {
    queryRes.results.forEach((result) => {
      innerHTML += renderBookResultTemplate(result);
    });
  } else {
    innerHTML += "<h3>No Results Found!</h3>";
  }
  $("#book-results").html(innerHTML);
}

// Function to display books by an author or title
function renderBookResultTemplate(result) {
  return `
    <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img onerror="this.src='./assets/images/no-image.jpg';this.onerror='';" src="https:\/\/storage.googleapis.com\/du-prd\/books\/images\/${result.isbn13[0]}.jpg" alt="${result.book_title}">
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">${result.book_title}</p> <span title="${result.book_title}" class="addFavourite"  id="addFavourite" ><i class="far fa-heart"></i></span>
          <p class="subtitle is-6">${result.byline}</p>
        </div>        
      </div>
      <div class="content">
      ${result.summary}
        <br>
        <time datetime>${result.publication_dt}</time>
      </div>
    </div>
  </div>`;
}

// Function to display top five books
function renderTopSellers(queryRes) {
  $("#top-books-tab-content").html("");
  var innerHTML = "";
  innerHTML = "<h2>The New York Times Best Sellers</h2>";
  queryRes.slice(0, 5).forEach((result) => {
    innerHTML += renderTopFiveBookResultTemplate(result);
  });
  $("#top-books-tab-content").html(innerHTML);
}

function renderTopFiveBookResultTemplate(result) {
  return `
  <div class="card">
    <div class="card-content">
    <div class="media">
      <div class="media-left">
        <figure class="image is-128x128">
          <img onerror="this.src='./assets/images/no-image.jpg';this.onerror='';" src="https://storage.googleapis.com/du-prd/books/images/${result.isbns[0].isbn13}.jpg" alt="${result.book_title}">
        </figure>
      </div>
      <div class="media-content" id="book_id">
        <p id="title" class="title is-4">${result.title}</p> <span title="${result.title}" class="addFavourite"  id="addFavourite" ><i class="far fa-heart"></i></span>
        <p class="subtitle is-6">${result.author}</p>
        <p class="subtitle is-6">Rank: ${result.rank}</p>
        <p class="subtitle is-6">${result.description}</p>
        </div>
       </div>
  </div>
</div>`;
}

//on-ready init funcs
$(function () {
  showSearchPanel();

  $("#search-btn").click(initiateSearch);

  // Books tab takes the user to the best sellers section
  $("#topBooksTab").click(function () {
    /*  event.preventDefault(); */
    getTopSellers();
    $("#search-panel").hide();
    $("#top-books-tab-content").show();
    $("#movie-critics-tab-content").hide();
    $("#favourites-tab-content").hide();
  });

  // Home tab takes the user to the home page
  $("#homePageTab").click(function () {
    showSearchPanel();
  });

  $("#movieCriticsTab").click(function () {
    getMoviesPicks();
    $("#search-panel").hide();
    $("#top-books-tab-content").hide();
    $("#movie-critics-tab-content").show();
    $("#favourites-tab-content").hide();
  });

  $("#favouritesTab").click(function () {
    $("#search-panel").hide();
    $("#top-books-tab-content").hide();
    $("#movie-critics-tab-content").hide();
    $("#favourites-tab-content").show();
  });
});

// Saving Search Items to Favourites

var favList = [];
$(document).on("click", "#addFavourite", function () {
  var title = $(this).attr("title");
  if (!favList.includes(title)) {
    favList.push(title);
  }
  localStorage.setItem("favouriteList", JSON.stringify(favList));
  $(this).addClass("favourite");
});

function getFavourites() {
  var listFavorite = localStorage.getItem("favouriteList");
  if (listFavorite) {
    favList = JSON.parse(listFavorite);
  } else {
    favList = [];
  }
  var favListHtml = "";
  for (var i = 0; i < favList.length; i++) {
    favListHtml += "<li>" + favList[i] + "</li>";
  }
  $("#favourites").html("<ul>" + favListHtml + "</ul>");
}



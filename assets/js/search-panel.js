var apiMoviesKey = "kxGjghc3HTcDjcm1Tq3Cp4Uj0TpCC4Dd";
var baseMoviesURL = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";

function showSearchPanel() {
  $("#search-panel").show();
  $("#search-results-panel").hide();
  $("#favourites-panel").hide();
}

//function to get checkbox value Movies
function getCheckBoxMovies() {
  $("#Movies").change(function () {
    return $(this).prop("checked");
  });
}

//function to get checkbox value Books
function getCheckBoxBooks() {
  $("#Books").change(function () {
    return $(this).prop("checked");
  });
}

$(function () {
  $("#search-btn").on("click", showSearchResultsPanel, function (event) {
    event.preventDefault();
    $("#movieResults").html("");
    $("#bookResults").html("");
    //search only by movie
    if ($("#Movies").is(":checked") && !$("#Books").is(":checked")) {
      getMoviesByParam();
    } //search only by book
    else if ($("#Books").is(":checked") && !$("#Movies").is(":checked")) {
      var authorName = getSearchParam();
      var userChoicebyTitle = authorName;
      getUserChoicebyAuthor(authorName);
      getUserChoiceByTitle(userChoicebyTitle);
    }
    //search all
    else {
      getMoviesByParam();
      var authorName = getSearchParam();
      var userChoicebyTitle = authorName;
      getUserChoicebyAuthor(authorName);
      getUserChoiceByTitle(userChoicebyTitle);
    }
  });

  // process form
});

$(function () {
  $("#critics-btn").on("click", showSearchResultsPanel, function (event) {
    event.preventDefault();
    getMoviesPicks();
  });

  // tests critics call - ok
});

//get search parameters
function getSearchParam() {
  var param = $("#search").val();
  var infoStatus = $("#infoStatus");
  if (param == 0) {
    infoStatus.text = "Please inform something to search for.";
  } else {
    return param;
  }
}

//calls the NYT Movies API and get the critics picks
function getMoviesPicks() {
  var criticsBtn = $("#critics-btn");
  var apiUrl = baseMoviesURL + "?critics-pick=Y" + "&api-key=" + apiMoviesKey;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          renderMoviesCriticsResult(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to server");
    });
}

//calls the NYT Movies API search movies by param
function getMoviesByParam() {
  var param = getSearchParam();
  var apiUrl = baseMoviesURL + "?query=" + param + "&api-key=" + apiMoviesKey;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          renderMoviesResult(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to server");
    });
}

function renderMoviesResult(queryRes) {
  $("#movieResults").html("");
  var innerHTML = '<p class="title is-3">Search Results: Movies</p>';
  queryRes.results.forEach((result) => {
    innerHTML += renderMovieResultTemplate(result);
  });
  $("#movieResults").html(innerHTML);
}
function renderMoviesCriticsResult(queryRes) {
  $("#movieResults").html("");
  $("#bookResults").html("");
  var innerHTML = '<p class="title is-3">Search Results: Movies (Critics)</p>';
  queryRes.results.forEach((result) => {
    innerHTML += renderMovieResultTemplate(result);
  });
  $("#movieResults").html(innerHTML);
}

// Function to display books by an author or title

function renderMovieResultTemplate(result) {
  console.log(result.multimedia);
  return `
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img src="" alt="">
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">${result.display_title}
          <small style="font-size: 12px"><br>Review By: ${result.byline}</small></p>
          <p class="subtitle is-6">${result.headline}</p>
        </div>
      </div>
      <div class="content">
      ${result.summary_short}
        <br>
        <time datetime>Publication Date: ${result.publication_date}</time>
      </div>
    </div>
  </div>`;
}

// Function to get Books data

function getTopSellers() {
  $("#movieResults").html("");
  $("#bookResults").html("");
  var topSellerBooksUrl = new URL(
    "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=C1TDrksFmBX6rwRPyWGH6t6yIkYDeYxq"
  );

  console.log(topSellerBooksUrl);

  fetch(topSellerBooksUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (queryRes) {
      console.log(queryRes.results.books);
      renderTopSellers(queryRes.results.books);
    })
    .catch(function (error) {
      console.error(error);
    });
}

// Function to get book details by user's choice of title

function getUserChoiceByTitle(userChoicebyTitle) {
  console.log(userChoicebyTitle + " step1");
  var searchByTitleUrl = new URL(
    "https://api.nytimes.com/svc/books/v3/reviews.json?title=" +
      userChoicebyTitle +
      "&api-key=C1TDrksFmBX6rwRPyWGH6t6yIkYDeYxq"
  );

  getBookDetails(searchByTitleUrl);
}

// Function to get user choice  by author's name

function getUserChoicebyAuthor(authorName) {
  var searchByAuthorUrl = new URL(
    "https://api.nytimes.com/svc/books/v3/reviews.json?author=" +
      authorName +
      "&api-key=C1TDrksFmBX6rwRPyWGH6t6yIkYDeYxq"
  );

  getBookDetails(searchByAuthorUrl);
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
      console.log(queryRes.results);

      renderBookResult(queryRes);
    })
    .catch(function (error) {
      console.error(error);
    });
}

// Functionto display the top 5 bestsellers - books

// Display results for the user's choice of book by title

function renderBookResult(queryRes) {
  $("#bookResults").html("");
  var innerHTML = '<p class="title is-3">Search Results: Books</p>';
  queryRes.results.forEach((result) => {
    innerHTML += renderBookResultTemplate(result);
  });
  $("#bookResults").html(innerHTML);
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
          <p class="title is-4">${result.book_title}</p>
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

/*  getTopSellers();  */

// Function to display top five books

function renderTopSellers(queryRes) {
  $("#topBookResults").html("");
  var innerHTML = "";
  queryRes.slice(0, 5).forEach((result) => {
    innerHTML += renderTopFiveBookResultTemplate(result);
  });
  $("#topBookResults").html(innerHTML);
}

function renderTopFiveBookResultTemplate(result) {
  return `<article class="media">
  <figure class="media-left">
    <p class="image is-64x64">
    <img onerror="this.src='./assets/images/no-image.jpg';this.onerror='';" src="https://storage.googleapis.com/du-prd/books/images/${result.isbns[0].isbn13}.jpg" alt="${result.book_title}">
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <p>
        <strong>${result.title}</strong><small><br>
        By: ${result.author}</small>
        <br>
       ${result.description}
      </p>
    </div>
    
  <div class="media-right">
    <button class="is-danger">&#x2764;</button>
  </div>
</article>`;
}

//Monitors the checkboxes values
$(document).ready(getCheckBoxMovies);
$(document).ready(getCheckBoxBooks);

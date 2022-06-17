// element selectors
var saveSettingsBtnEl = document.querySelector("#save-settings")
var searchBtn = document.querySelector("#search-Btn")
var cagedEl = document.querySelector("#caged")
var posterEl = document.querySelector("#movie-poster")
var movieInfoEl = document.querySelector("#movie-info")
var movieCardEl = document.querySelector("#movie-card-div")
var movieCardTitleEl = document.querySelector("#movie-title")
var movieCardPlotEl = document.querySelector("#movie-plot")
var streamingLinksEl = document.querySelector("#streaming-links")
var searchTerm = document.querySelector("#search-query")

var apiKey = "9bad881e"
var apiKeyWm = "dezhiaeTxsUtpXsaOovSaiqfdtPCqBGaEazypOmf"

// Initialize empty array to store streaming service settings
var streamingSettings = []

var saveSettingsHandler = function(event) {
    event.preventDefault()

    // reinitialize the value of the array back to zero at each save since they're resetting their values
    streamingSettings = []

    // grab the labels for all of the materialize checkboxes
    var streamingServiceLabels = document.querySelectorAll(".streaming-sources")

    // loop through the values of the labels since we can't directly searched for checked attribute with materialize checkboxes
    for(var i = 0; i < streamingServiceLabels.length; i++) {
        // get the name of the service associated with the checkbox
        var getServiceName = streamingServiceLabels[i].getAttribute("for")

        // set a variable to capture whether the service provider is selected
        var isChecked = document.getElementById(getServiceName).checked

        // if the streaming service is selected, add it to the streaming settings list
        if (isChecked) {

            streamingSettings.push(getServiceName)
        }

    }

    //save the settings to local storage
    saveSettings(streamingSettings)
}

// save the settings to local storage
var saveSettings = function(array) {
    localStorage.setItem("user-settings", JSON.stringify(array));

    // handle the search button status if they've saved items
    checkSettings(array)
}

// load user settings from local storage
var loadSettings = function() {
    streamingSettings = JSON.parse(localStorage.getItem("user-settings"))

    // if nothing in localStorage, set the user settings back to an empty array
    if (!streamingSettings) {
        streamingSettings = []
    }
    // find the checkbox with the correct ID and set the checked element to checked on load
    for (var i = 0; i < streamingSettings.length; i++) {
        var streamingCheckBox = document.getElementById(streamingSettings[i])
        streamingCheckBox.setAttribute("checked","checked")
    }
}

// disables the search button if there are no settings saved and enables it if there are
var checkSettings = function(array) {
    if (array.length == 0) {
        searchBtn.classList.add("disabled")
    } else {
        searchBtn.classList.remove("disabled")
    }
}

// Make an OMDb API call to get information about the movie searched for
var queryMovie = function() {
    var apiUrl = "http://www.omdbapi.com/?t=" + searchTerm.value + "&type=movie&apiKey=" + apiKey

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {

        console.log(response)
        // request was successful
        if (response.ok) {
           response.json().then(function(data) {
               console.log(data.Response)

               // OMDb API appears returns an OK status, but Response: False (as a string) if the movie can't be found. Process that with a toast to a user.
               if (data.Response === "False") {
                // specify what we want in the toast alert
                var errorMsg1 = "<span>Movie not be found! Please try your search again.</span><button class='btn-flat toast-action' onclick='M.Toast.dismissAll()'>OK</button>"
                M.toast({html: errorMsg1})
                return
               }

               // otherwise, we're okay to process the data that gets passed in
                getMovieInfo(data)
           })
        } else {
            // Display a toast instead of an alert
            var errorMsg2= "<span>Movie not be found! Please try your search again.</span><button class='btn-flat toast-action' onclick='M.Toast.dismissAll()'>OK</button>"
            M.toast({html: errorMsg2})
        }
    })
        .catch(function(error) {
            // Catch for any errors from the server
            var errorMsg3="<span>Unable to connect to the Open Movie Database. Please try again later.</span><button class='btn-flat toast-action' onclick='M.Toast.dismissAll()'>OK</button>"
            M.toast({html: errorMsg3})
        })
}

// Make an watchmode API call to get information about the selected streaming services
var queryServices = function(titleId) {

    var apiUrl = "https://api.watchmode.com/v1/title/" + titleId + "/sources/?apiKey=" + apiKeyWm 

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
        // request was successful
        if (response.ok) {
           response.json().then(function(data) {
                console.log(data)
           })
        } else {
            // TODO: Update this to write the error to the page instead of using an error
            alert("Services can't be found")
        }
    })
        .catch(function(error) {
            // Catch for any errors from the server
            // TODO: Write error to the page instead of using an alert
            alert("Unable to find streaming services");
        })
}



var getMovieInfo = function(array) {

    // reset the content to blank before each search so things don't get weird
    posterEl.textContent = ""

    // unhide the movide card since we're ready to displaty info!
    movieCardEl.classList.remove("movie-card")

    // store these values in separate variables so we can easily push to an object and save
    var movieTitle = array.Title
    var moviePlot = array.Plot

    // get the movie ID
    var movieID = array.imdbID

    queryServices(movieID)

    // get the genres associated with the movie and add to an array
    
    var movieGenre = array.Genre
    var movieGenreArray = movieGenre.split(',')
    for (var i = 0; i < movieGenreArray.length; i++) {
        movieGenreArray[i] = movieGenreArray[i].trim()
    }

    // get the movie year
    var movieYear = array.Year 

    var posterLinkSrc = array.Poster    
    var posterImg = document.createElement("img")
    posterImg.setAttribute("src",posterLinkSrc)

    // append the poster image to the poster img div
    posterEl.append(posterImg)

    // Assign the values to the correct spot in the card
    movieCardTitleEl.textContent = movieTitle
    // TODO: We may want to consider append this and adding additional information for display (like a link to IMDB,
    // the director, year released, etc)
    movieCardPlotEl.textContent = moviePlot
}

// Function calls on page load
loadSettings()
checkSettings(streamingSettings)


// save the settings when a user clicks the Save Settings button
saveSettingsBtnEl.addEventListener("click" , saveSettingsHandler)

// submit a query when we click the search button
searchBtn.addEventListener("click", queryMovie)
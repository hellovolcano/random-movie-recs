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
    var apiUrl = "http://www.omdbapi.com/?t=" + searchTerm.value + "&apiKey=" + apiKey

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
        // request was successful
        if (response.ok) {
           response.json().then(function(data) {
                getMovieInfo(data)
           })
        } else {
            alert("Movie can't be found")
        }
    })
}

var getMovieInfo = function(array) {

    // reset the content to blank before each search so things don't get weird
    posterEl.textContent = ""

    // unhide the movide card since we're ready to displaty info!
    movieCardEl.classList.remove("movie-card")

    // store these values in separate variables so we can easily push to an object and save
    var movieTitle = array.Title
    console.log(movieTitle)
    var moviePlot = array.Plot
    console.log(moviePlot)

    var movieID = array.imdbID
    console.log(movieID)

    var posterLinkSrc = array.Poster    
    var posterImg = document.createElement("img")
    posterImg.setAttribute("src",posterLinkSrc)

    // append the poster image to the poster img div
    posterEl.append(posterImg)

    // Assign the values to the correct spot in the card
    movieCardTitleEl.textContent = movieTitle
    movieCardPlotEl.textContent = moviePlot
}

// Function calls on page load
loadSettings()
checkSettings(streamingSettings)


// save the settings when a user clicks the Save Settings button
saveSettingsBtnEl.addEventListener("click" , saveSettingsHandler)

// submit a query when we click the search button
searchBtn.addEventListener("click", queryMovie)
var saveSettingsBtnEl = document.querySelector("#save-settings")

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

loadSettings()
// save the settings when a user clicks the Save Settings button
saveSettingsBtnEl.addEventListener("click" , saveSettingsHandler)
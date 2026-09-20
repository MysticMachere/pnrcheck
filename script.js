// ======================================================
// RAILLIVE INDIA
// Location handling + train search
// ======================================================

(() => {

    // ==================================================
    // PRIVATE LOCATION VARIABLE
    // ==================================================
    // This variable is NOT attached to window.
    // It is not displayed on the webpage.
    //
    // Example value:
    // {
    //     latitude: 10.12345,
    //     longitude: 76.12345,
    //     accuracy: 25
    // }
    // ==================================================

    let privateUserLocation = null;


    // ==================================================
    // DEMO TRAIN DATA
    // ==================================================

    const trains = [
        {
            number: "12625",
            name: "Kerala Express",
            from: "Thiruvananthapuram",
            to: "New Delhi",
            departure: "11:15",
            arrival: "14:30"
        },

        {
            number: "16345",
            name: "Netravati Express",
            from: "Thiruvananthapuram",
            to: "Mumbai",
            departure: "09:30",
            arrival: "16:10"
        },

        {
            number: "12624",
            name: "Chennai Mail",
            from: "Thiruvananthapuram",
            to: "Chennai",
            departure: "18:00",
            arrival: "07:30"
        },

        {
            number: "12082",
            name: "Jan Shatabdi Express",
            from: "Thiruvananthapuram",
            to: "Kozhikode",
            departure: "06:00",
            arrival: "12:45"
        },

        {
            number: "16302",
            name: "Venad Express",
            from: "Thiruvananthapuram",
            to: "Shoranur",
            departure: "05:25",
            arrival: "09:15"
        }
    ];


    // ==================================================
    // LOCATION FUNCTION
    // ==================================================

    function requestUserLocation() {

        if (!navigator.geolocation) {

            showLocationStatus(
                "Geolocation is not supported by this browser."
            );

            return;
        }


        showLocationStatus(
            "Requesting your location..."
        );


        navigator.geolocation.getCurrentPosition(

            // ==========================================
            // SUCCESS
            // ==========================================

            function(position) {

                privateUserLocation = {

                    latitude: position.coords.latitude,

                    longitude: position.coords.longitude,

                    accuracy: position.coords.accuracy,

                    timestamp: new Date().toISOString()
                };


                // ======================================
                // LOCATION SUCCESS
                // ======================================

                showLocationStatus(
                    "Location permission granted."
                );


                // DO NOT DISPLAY COORDINATES


                // ======================================
                // OPTIONAL DEBUGGING
                // ======================================
                // Remove this console.log when publishing.
                //
                // console.log(
                //     "Private location:",
                //     privateUserLocation
                // );


                // ======================================
                // SAVE FOR THIS BROWSER SESSION
                // ======================================

                try {

                    sessionStorage.setItem(
                        "railLiveLocation",
                        JSON.stringify(privateUserLocation)
                    );

                } catch (error) {

                    console.log(
                        "Could not save location to session storage."
                    );
                }


                // ======================================
                // LOCATION IS NOW AVAILABLE INTERNALLY
                // ======================================

                findNearbyStations();

            },


            // ==========================================
            // ERROR
            // ==========================================

            function(error) {

                console.log(
                    "Geolocation error:",
                    error.code,
                    error.message
                );


                let message;


                switch (error.code) {

                    case error.PERMISSION_DENIED:

                        message =
                            "Location permission was denied.";

                        break;


                    case error.POSITION_UNAVAILABLE:

                        message =
                            "Your device could not determine your location.";

                        break;


                    case error.TIMEOUT:

                        message =
                            "The location request timed out. Please try again.";

                        break;


                    default:

                        message =
                            "Unable to determine your location.";
                }


                showLocationStatus(message);
            },


            // ==========================================
            // GEOLOCATION OPTIONS
            // ==========================================

            {
                enableHighAccuracy: false,

                timeout: 20000,

                maximumAge: 60000
            }
        );
    }


    // ==================================================
    // LOCATION STATUS
    // ==================================================

    function showLocationStatus(message) {

        const locationText =
            document.getElementById("locationText");


        if (locationText) {

            locationText.textContent = message;
        }
    }


    // ==================================================
    // FIND NEARBY STATIONS
    // ==================================================

    function findNearbyStations() {

        if (!privateUserLocation) {

            showLocationStatus(
                "Location is not available."
            );

            return;
        }


        /*
         * The coordinates are available here.
         *
         * Example:
         *
         * privateUserLocation.latitude
         * privateUserLocation.longitude
         *
         * They are NOT displayed on the website.
         */


        showLocationStatus(
            "Your location has been detected."
        );


        // ------------------------------------------------
        // Future feature:
        // Send privateUserLocation to your backend
        // to find actual nearby railway stations.
        // ------------------------------------------------

        console.log(
            "Nearby station search initiated."
        );
    }


    // ==================================================
    // RESTORE LOCATION FROM SESSION
    // ==================================================

    function restoreLocation() {

        try {

            const savedLocation =
                sessionStorage.getItem(
                    "railLiveLocation"
                );


            if (savedLocation) {

                privateUserLocation =
                    JSON.parse(savedLocation);


                showLocationStatus(
                    "Location is already available."
                );
            }

        } catch (error) {

            console.log(
                "Could not restore saved location."
            );
        }
    }


    // ==================================================
    // TRAIN SEARCH
    // ==================================================

    function searchTrains() {

        const fromInput =
            document.getElementById("fromStation");

        const toInput =
            document.getElementById("toStation");


        if (!fromInput || !toInput) {

            return;
        }


        const from =
            fromInput.value.trim().toLowerCase();

        const to =
            toInput.value.trim().toLowerCase();


        const results =
            document.getElementById("trainResults");


        if (!results) {

            return;
        }


        if (!from && !to) {

            results.innerHTML =
                "<p>Please enter a source or destination station.</p>";

            return;
        }


        const filteredTrains =
            trains.filter(train => {

                const matchesFrom =
                    !from ||
                    train.from.toLowerCase().includes(from);

                const matchesTo =
                    !to ||
                    train.to.toLowerCase().includes(to);

                return matchesFrom && matchesTo;
            });


        if (filteredTrains.length === 0) {

            results.innerHTML =
                "<p>No demo trains found.</p>";

            return;
        }


        results.innerHTML =
            filteredTrains.map(train => `

                <div class="train-card">

                    <div class="train-number">
                        ${train.number}
                    </div>

                    <div class="train-name">
                        ${train.name}
                    </div>

                    <div class="train-route">
                        ${train.from}
                        →
                        ${train.to}
                    </div>

                    <div class="train-time">
                        Departure:
                        ${train.departure}
                        |
                        Arrival:
                        ${train.arrival}
                    </div>

                </div>

            `).join("");
    }


    // ==================================================
    // SWAP STATIONS
    // ==================================================

    function swapStations() {

        const fromInput =
            document.getElementById("fromStation");

        const toInput =
            document.getElementById("toStation");


        if (!fromInput || !toInput) {

            return;
        }


        const temporary =
            fromInput.value;


        fromInput.value =
            toInput.value;

        toInput.value =
            temporary;
    }


    // ==================================================
    // MAKE FUNCTIONS AVAILABLE TO HTML
    // ==================================================

    window.requestUserLocation =
        requestUserLocation;

    window.searchTrains =
        searchTrains;

    window.swapStations =
        swapStations;


    // ==================================================
    // STARTUP
    // ==================================================

    document.addEventListener(
        "DOMContentLoaded",
        function() {

            restoreLocation();

        }
    );

})();

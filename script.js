/* =========================================
   USER LOCATION
========================================= */

let userLocation = {
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null
};


/*
    This variable can later be sent
    to your backend/API.
*/

let locationVariable = userLocation;


/* =========================================
   REQUEST USER LOCATION
========================================= */

function requestLocation() {

    /*
        Check browser support.
    */

    if (!navigator.geolocation) {

        document.getElementById(
            "locationText"
        ).textContent =
            "Geolocation is not supported by this browser.";

        return;
    }


    /*
        Tell user that permission is
        being requested.
    */

    document.getElementById(
        "locationText"
    ).textContent =
        "Requesting your location permission...";


    /*
        Request current location.
    */

    navigator.geolocation.getCurrentPosition(

        function (position) {

            /*
                Latitude
            */

            userLocation.latitude =
                position.coords.latitude;


            /*
                Longitude
            */

            userLocation.longitude =
                position.coords.longitude;


            /*
                Accuracy
            */

            userLocation.accuracy =
                position.coords.accuracy;


            /*
                Time
            */

            userLocation.timestamp =
                new Date().toISOString();


            /*
                Update variable.
            */

            locationVariable =
                userLocation;


            /*
                Save location in browser.
            */

            localStorage.setItem(
                "railLiveUserLocation",
                JSON.stringify(userLocation)
            );


            /*
                Update status.
            */

            document.getElementById(
                "locationText"
            ).textContent =
                "Location received successfully.";


            /*
                Show location information.
            */

            const locationData =
                document.getElementById(
                    "locationData"
                );


            locationData.style.display =
                "block";


            locationData.innerHTML =

                "Latitude: " +
                userLocation.latitude.toFixed(6) +

                "<br>" +

                "Longitude: " +
                userLocation.longitude.toFixed(6) +

                "<br>" +

                "Accuracy: ±" +
                Math.round(
                    userLocation.accuracy
                ) +
                " metres" +

                "<br>" +

                "Timestamp: " +
                userLocation.timestamp;


            /*
                Print to VS Code browser console.
            */

            console.log(
                "userLocation:",
                userLocation
            );


            console.log(
                "locationVariable:",
                locationVariable
            );

        },


        function (error) {

            let message;


            switch (error.code) {

                case 1:

                    message =
                        "Location permission was denied.";

                    break;


                case 2:

                    message =
                        "Your location could not be determined.";

                    break;


                case 3:

                    message =
                        "Location request timed out.";

                    break;


                default:

                    message =
                        "Unable to obtain your location.";

            }


            document.getElementById(
                "locationText"
            ).textContent =
                message;

        },


        {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 60000
        }

    );
}


/* =========================================
   DEMO TRAIN DATA
========================================= */

const demoTrains = [

    {
        number: "12623",

        name: "Thiruvananthapuram Mail",

        fromCode: "TVC",

        fromName: "Thiruvananthapuram",

        departure: "19:25",

        toCode: "ERS",

        toName: "Ernakulam",

        arrival: "23:35",

        status: "On Time"
    },


    {
        number: "16302",

        name: "Venad Express",

        fromCode: "TVC",

        fromName: "Thiruvananthapuram",

        departure: "05:15",

        toCode: "ERS",

        toName: "Ernakulam",

        arrival: "09:05",

        status: "On Time"
    },


    {
        number: "12075",

        name: "Jan Shatabdi Express",

        fromCode: "TVC",

        fromName: "Thiruvananthapuram",

        departure: "14:50",

        toCode: "ERS",

        toName: "Ernakulam",

        arrival: "18:20",

        status: "Running"
    }

];


/* =========================================
   SEARCH TRAINS
========================================= */

function searchTrains() {

    /*
        Get input values.
    */

    const from =
        document
            .getElementById("from")
            .value
            .trim()
            .toLowerCase();


    const to =
        document
            .getElementById("to")
            .value
            .trim()
            .toLowerCase();


    const results =
        document.getElementById("results");


    const resultCount =
        document.getElementById("resultCount");


    /*
        Validate input.
    */

    if (!from || !to) {

        results.innerHTML = `
            <div class="empty">

                Please enter both departure
                and destination stations.

            </div>
        `;


        resultCount.textContent =
            "Invalid search";

        return;
    }


    /*
        Find matching trains.
    */

    const matches =
        demoTrains.filter(function (train) {

            const fromMatch =

                train.fromCode
                    .toLowerCase()
                    .includes(from)

                ||

                train.fromName
                    .toLowerCase()
                    .includes(from);


            const toMatch =

                train.toCode
                    .toLowerCase()
                    .includes(to)

                ||

                train.toName
                    .toLowerCase()
                    .includes(to);


            return fromMatch && toMatch;

        });


    /*
        No trains found.
    */

    if (matches.length === 0) {

        results.innerHTML = `
            <div class="empty">

                No trains found in the
                demonstration database.

                <br><br>

                A live railway API can provide
                real railway results here.

            </div>
        `;


        resultCount.textContent =
            "0 trains";

        return;
    }


    /*
        Update number of results.
    */

    resultCount.textContent =
        matches.length +
        " train" +
        (matches.length === 1 ? "" : "s") +
        " found";


    /*
        Create result cards.
    */

    results.innerHTML =

        matches.map(function (train) {

            let statusClass =
                "on-time";


            if (
                train.status
                    .toLowerCase()
                    .includes("running")
            ) {

                statusClass =
                    "running";
            }


            if (
                train.status
                    .toLowerCase()
                    .includes("delay")
            ) {

                statusClass =
                    "delayed";
            }


            return `

                <article class="train">

                    <div>

                        <div class="train-name">

                            ${train.name}

                        </div>

                        <div class="train-number">

                            Train No.
                            ${train.number}

                        </div>

                    </div>


                    <div>

                        <div class="time">

                            ${train.departure}

                        </div>

                        <div class="station">

                            ${train.fromCode}
                            •
                            ${train.fromName}

                        </div>

                    </div>


                    <div>

                        <div class="time">

                            ${train.arrival}

                        </div>

                        <div class="station">

                            ${train.toCode}
                            •
                            ${train.toName}

                        </div>

                    </div>


                    <div>

                        <span
                            class="badge ${statusClass}"
                        >

                            ${train.status}

                        </span>

                        <div class="small">

                            Demo schedule

                        </div>

                    </div>

                </article>

            `;

        }).join("");
}


/* =========================================
   SWAP STATIONS
========================================= */

function swapStations() {

    const from =
        document.getElementById("from");


    const to =
        document.getElementById("to");


    const temporary =
        from.value;


    from.value =
        to.value;


    to.value =
        temporary;
}


/* =========================================
   LOAD SAVED LOCATION
========================================= */

const savedLocation =
    localStorage.getItem(
        "railLiveUserLocation"
    );


if (savedLocation) {

    try {

        /*
            Convert saved JSON back
            into a JavaScript object.
        */

        userLocation =
            JSON.parse(savedLocation);


        locationVariable =
            userLocation;


        /*
            Show saved location status.
        */

        document.getElementById(
            "locationText"
        ).textContent =
            "A previously saved location is available.";


        /*
            Show saved coordinates.
        */

        const locationData =
            document.getElementById(
                "locationData"
            );


        locationData.style.display =
            "block";


        locationData.innerHTML =

            "Latitude: " +

            Number(
                userLocation.latitude
            ).toFixed(6) +

            "<br>" +

            "Longitude: " +

            Number(
                userLocation.longitude
            ).toFixed(6) +

            "<br>" +

            "Accuracy: ±" +

            Math.round(
                userLocation.accuracy
            ) +

            " metres" +

            "<br>" +

            "Timestamp: " +

            userLocation.timestamp;

    }

    catch (error) {

        /*
            Remove corrupted saved data.
        */

        localStorage.removeItem(
            "railLiveUserLocation"
        );

    }
}
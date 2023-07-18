var addWayPointEl = $("#add-waypoint");
var submitButtonEl = $("#submit-button");
var clearButtonEl = $("#clear-button");

var waypointCounter = 0;
var waypointDivEl = $("#waypoint-div")
var waypoints = [];



addWayPointEl.on("click", function() {
    var cityEl = "input";
    var stateEl = "input";

    if(waypointCounter < 4){
        var inputElC = document.createElement(cityEl);
        var inputElS = document.createElement(stateEl);
        var waypointHeader = document.createElement('label');
        

        waypointHeader.setAttribute("id", "waypoint" + waypointCounter);
        waypointHeader.setAttribute("class", "form-label w-100 mt-2");
        
        waypointHeader.textContent = "Waypoint " + (waypointCounter + 1);
        waypointDivEl.append(waypointHeader);

        inputElC.setAttribute("id", "cityWay" + waypointCounter);
        inputElC.setAttribute("class", "city-input form-control w-100 m-2 p-3 s-3");
        inputElC.setAttribute("type", "text");
        inputElC.setAttribute("placeholder", "Enter City");
        waypointDivEl.append(inputElC);

        inputElS.setAttribute("id", "stateWay" + waypointCounter);
        inputElS.setAttribute("class", "state-input form-control w-100 m-2 p-3 s-3");
        inputElS.setAttribute("type", "text");
        inputElS.setAttribute("placeholder", "Enter State");
        waypointDivEl.append(inputElS);

        waypointCounter++;
    }
    
})
// Fucntion for clearing Data
// When user data is saved locally and in arrays in Javascript,this function will also clear those as well
// Add modal for user to confirm they actually want to clear their data
clearButtonEl.on("click", function(){
    waypointDivEl.empty();
    wayPoints = [];
    waypointCounter = 0;

})


$(function () {
    var stateNames = [
        'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN',"TX",'UT','VT','VA','WA','WV','WI','WY'
    ];
    $(".form-control").autocomplete({
      source: stateNames,
    });
});

var points = [] // will need to append the lat and long arrays - this may needs to exist outside of the geocode function - one points for routes and the other palces
var points2 = [] // will need to append the lat and long arrays - this may needs to exist outside of the geocode function - one points for routes and the other palces

submitButtonEl.on("click", function() {
    var userStartCityEl = $('#start-city-input').val()
    var userStartStateEl = $('#start-state-input').val()
    var userEndCityEl = $('#end-city-input').val()
    var userEndStateEl = $('#end-state-input').val()

    if(waypointCounter > 0){
        for(var i = 0; i < waypointCounter; i++){
            var waypointCity = $('#cityWay' + (i)).val();
            console.log(waypointCity);
            var waypointState = $('#stateWay' + (i)).val();
            console.log(waypointState);
        }
    }
    // geocode API 
    // will need to create an array of point i think - so we can run through all the points in a loop and add them to a string
    // will need to create a for loop that run runs through each locations and then creates a LAT & LONG Array inside an array - with start point being array 0 and end point being the last value in the array
    var startPoint = userStartCityEl + "," + userStartStateEl; // equals the input of the "Starting point" html element - **IDEA** turn this into an array and then we can pass it into the functions as well
    var endPoint = userEndCityEl + "," + userEndStateEl;
    console.log(startPoint);
    console.log(endPoint); // equals the input of the "Destination Point" html element - **IDEA** turn this into an array and then we can pass it into the functions as well
    // Made the array variable "waypoints" a global variable
    var q = "canby,mn"; //
    var geoKey = "ae5c8056-a632-44f7-86b9-adfb12b8775b";
    //we might need to make 3 seperate APIs - one for start, one for end and one for the waypoint array so we can collect the LAT/long variable 
    var geocodeApi = "https://graphhopper.com/api/1/geocode?q="+q+"&key="+geoKey+"&limit=1";
    //functionName(geocodeApi) - this will pass the URL into the fetch function
    //make this into a function itself 
    //function
    //for each  then run fetch and push to array
    fetch(geocodeApi)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })
    //push the lat longs into the points array for the routes and places APIs - may need to make 2 arrays - graphhopper route api is LONG/LAT
    points.push("Lat,Long")
    points2.push("Long,Lat")
    //route API function
    //function
    var query = new URLSearchParams({
        key: 'ae5c8056-a632-44f7-86b9-adfb12b8775b'
    }).toString();

    const resp =  fetch(
        `https://graphhopper.com/api/1/route?${query}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                points: [
                    [-96.2633777,44.7277413],
                    [-95.8528615,43.1802172]
                ],
            })
        }
    )
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    })
    //distance is returned in meters - multiply the distance by 0.000621371 to get miles

    //places API function
    //function
    // for loop for each item in the array
    var plaKey = "AIzaSyD4Xi4w8rZxYlWSoH9Ncby2mpwf0rX9q0g";
    var location = "43.58273465,-96.74120311335915"; //will need to make this = to array index in a for loop
    var radius = 10000;
    //had to use some weird cross origin access workaround - we need to ask the TAs about this!
    var placeApi = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+location+"&radius="+radius+"&key="+plaKey;
    fetch(placeApi)
        .then(function (response){
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
});

// Gas Prices API with API headers
// APICollect seems limited to at around 10 requests a day from what I've been testing so far
// Might have to look into alternative options
var gasPricesApi = "https://api.collectapi.com/gasPrice/allUsaPrice?"
fetch(gasPricesApi, {
    headers: {
        "content-type" : "application/json",
        "authorization" : "apikey 6LnFl7ojBM5Db77UUp29BB:2uy16XtHFDoco0x3R2zYZ8"
    }
})
    .then(function(response){
        console.log(response);
        return response.json();
    })
    .then(function(data){
        var totalGasPrice = 0.00;
        // Iterates through the array of different gas prices per state
        // Adds them all together in totalGasPrice
        for(var i = 0; i < data.result.length; i++){
            var stateGasPrice = data.result[i].midGrade;
            // Problem adding the stateGasPrice to totalGasPrice, it adds up weird
            // If we fix that, everything else should fall in place correctly
            totalGasPrice = totalGasPrice + stateGasPrice;
            console.log(data.result[i].midGrade);
            console.log(totalGasPrice);
        }
        // Calculates average gas price
        var averageGasPrice = totalGasPrice/data.length;
        console.log(averageGasPrice);
        console.log(data.result);
    })
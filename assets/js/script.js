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
// Function for clearing Data
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

var points = []; // Route API [[lat,long],[lat,long]]
var points2 = []; // Places API
var startCoords = ""; //displayMap
var destCoords = ""; //displayMap
var waypointCoords = ""; //displayMap

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

var q = "canby,mn";
var geoKey = "ae5c8056-a632-44f7-86b9-adfb12b8775b";
//we might need to make 3 seperate APIs - one for start, one for end and one for the waypoint array so we can collect the LAT/long variable 


var geocodeApiS = "https://graphhopper.com/api/1/geocode?q="+startPoint+"&key="+geoKey+"&limit=1";


var geocodeApiE = "https://graphhopper.com/api/1/geocode?q="+endPoint+"&key="+geoKey+"&limit=1";

//for loop
var geocodeApiW = "https://graphhopper.com/api/1/geocode?q="+waypoints+"&key="+geoKey+"&limit=1";

var pointW = "parse.lat" + "," + "parse.long";
var waypointsW = []
waypointsW.push(pointW)
// waypointCoords = array.toString(waypointsW).replace(",","|")

//functionName(geocodeApiS) - this will pass the URL into the fetch function
//functionName(geocodeApiE) - this will pass the URL into the fetch function
//functionName(geocodeApiW) - this will pass the URL into the fetch function


//function
//for each  then run fetch and push to array
fetch(geocodeApiS)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  })
  var latLong = "parse.lat" + "," + "parse.long";
  var pointR = [];
  pointR.push(latLong);
  points.push(pointR);
  var pointP = "parse.lat" + "," + "parse.long";
  points2.push(pointP);


  

    //push the lat longs into the points array for the routes and places APIs - may need to make 2 arrays - graphhopper route api is LONG/LAT
    points.push("Lat,Long")
    points2.push("lat,long")
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
var plaKey = "6ZmvylZaxk7KwhT7yxiK5EB3NQJ42tSb";
var location = "-96.74120311335915,43.58273465"; //will need to make this = to array index in a for loop
//had to use some weird cross origin access workaround - we need to ask the TAs about this!
var placeApi = "https://www.mapquestapi.com/search/v4/place?location="+location+",&q=hotels&sort=relevance&feedback=false&key="+plaKey;
// var placeApi = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+location+"&radius="+radius+"&key="+plaKey;
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
var gasPricesApi = "https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=4VbUpGHqE0lNDb8xC6yw40vLaJrX4ABEbH2DvqRl&frequency=weekly&data[0]=value&facets[series][]=EMM_EPMRU_PTE_NUS_DPG&start=2023-07-3&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000"
fetch(gasPricesApi)
    .then(function(response){
        console.log(response);
        return response.json();
    })
    .then(function(data){
        console.log(data)
        var rdata = data.response;
        console.log(rdata);
        var averageGasPrice = rdata.data[0].value;
        console.log(averageGasPrice);
    })
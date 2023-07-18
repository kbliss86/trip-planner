//button element variables
var addWayPointEl = $("#add-waypoint");
var submitButtonEl = $("#submit-button");
var clearButtonEl = $("#clear-button");

//counter for waypoint city,state loop
var waypointCounter = 0;
var waypointDivEl = $("#waypoint-div")

// Autocompelte function for the state - 1 for the automatically adds the autocomplete on page load
$(function () {
    var stateNames = [
        'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN',"TX",'UT','VT','VA','WA','WV','WI','WY'
    ];
    $(".state-input").autocomplete({
      source: stateNames,
    });
});


//Add Waypoint button
    // state autocomplete values to apply to added waypoin 
    var stateNames = [
        'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN',"TX",'UT','VT','VA','WA','WV','WI','WY'
    ];
addWayPointEl.on("click", function() {
    var cityEl = "input";
    var stateEl = "input";
    //only allow for 3 waypoints
    if(waypointCounter < 4){
        var inputElC = document.createElement(cityEl);
        var inputElS = document.createElement(stateEl);
        var waypointHeader = document.createElement('label');
        
        waypointHeader.setAttribute("id", "waypoint" + waypointCounter);
        waypointHeader.setAttribute("class", "form-label w-100 mt-2");
        
        waypointHeader.textContent = "Waypoint " + (waypointCounter + 1);
        waypointDivEl.append(waypointHeader);

        inputElC.setAttribute("id", "cityWay" + waypointCounter);
        inputElC.setAttribute("class", "city-input input-field col");
        inputElC.setAttribute("type", "text");
        inputElC.setAttribute("placeholder", "Enter City");
        waypointDivEl.append(inputElC);

        inputElS.setAttribute("id", "stateWay" + waypointCounter);
        inputElS.setAttribute("class", "state-input input-field col");
        inputElS.setAttribute("type", "text");
        inputElS.setAttribute("placeholder", "Enter State");
        waypointDivEl.append(inputElS);
       
        // add autocomplete to state inputs created in the add waypoint function
        $(".state-input").autocomplete({
            source: stateNames,
          });
      
        waypointCounter++;
    }
    
})
// variable for the API calls
var points = []; // Route API [[lat,long],[lat,long]]
var points2 = []; // Places API
var startCoords = ""; //displayMap
var destCoords = ""; //displayMap
var waypointCoords = ""; //displayMap
var waypoints = []; //waypoint sting (city,state)


//we might need to make 3 seperate APIs - one for start, one for end and one for the waypoint array so we can collect the LAT/long variable 
//function to gather the start coordinates and start building the arrays for Route/Places/Display Map
function runStartCoord(startPoint,geoKey) {
var geocodeApiS = "https://graphhopper.com/api/1/geocode?q="+startPoint+"&key="+geoKey+"&limit=1";
fetch(geocodeApiS)
.then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  }) 
  // we still need to parse this response and get the Lat/long
  var latLong = "parse.lat" + "," + "parse.long";
  var pointR = [];
  pointR.push(latLong);
  console.log(pointR);
  points.push(pointR);
  console.log(points);
  var pointP = "parse.lat" + "," + "parse.long"; // not needed for places API - we dont need places for start poin
  console.log(pointP);
  points2.push(pointP); // not needed for places API - we dont need places for start point
  console.log(points2);
  startCoords = pointP;
  console.log(startCoords);
};

//function to gather the end coordinates and continue building the arrays for Route/Places/Display Map
function runEndCoord(endPoint,geoKey) {
    var geocodeApiS = "https://graphhopper.com/api/1/geocode?q="+endPoint+"&key="+geoKey+"&limit=1";
    fetch(geocodeApiS)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      })
      // we still need to parse this response and get the Lat/long
      var latLong = "parse.latEE" + "," + "parse.longEE";
      var pointR = [];
      pointR.push(latLong);
      console.log(pointR);
      points.push(pointR);
      console.log(points);
      var pointP = "parse.latEE" + "," + "parse.longEE";
      console.log(pointP);
      points2.push(pointP);
      console.log(points2);
      destCoords = pointP;
      console.log(destCoords);
    };
//--------CODE NOTES FOR THE FOR LOOP NEEDED TO RUN AND COLLECT THE GEOCODE COORDS ---BEGIN
//for loop
// var geocodeApiW = "https://graphhopper.com/api/1/geocode?q="+waypoints+"&key="+geoKey+"&limit=1";

// var pointW = "parse.lat" + "," + "parse.long";
// var waypointsW = []
// waypointsW.push(pointW)
// waypointCoords = array.toString(waypointsW).replace(",","|")

//create 3 function to fire off in an order that allows the arrays to be build to support the route/places API calls
//functionName(geocodeApiS) - this will pass the URL into the fetch function
//functionName(geocodeApiE) - this will pass the URL into the fetch function
//functionName(geocodeApiW) - this will pass the URL into the fetch function
//--------CODE NOTES FOR THE FOR LOOP NEEDED TO RUN AND COLLECT THE GEOCODE COORDS ---END

//------ CODE NOTES FOR THE ROUTES FETCH FUNCTION ---- BEGIN
//     var query = new URLSearchParams({
//         key: 'ae5c8056-a632-44f7-86b9-adfb12b8775b'
//     }).toString();

//     const resp =  fetch(
//     `https://graphhopper.com/api/1/route?${query}`,
//     {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             points: [
//                 [-96.2633777,44.7277413], 
//                 [-95.8528615,43.1802172]
//             ],
//         })
//     }
// )
// .then(function(response) {
//     return response.json();
// })
// .then(function(data) {
//     console.log(data);
// })
//distance is returned in meters - multiply the distance by 0.000621371 to get miles
//------ CODE NOTES FOR THE ROUTES FETCH FUNCTION ---- END

//------ CODE NOTES FOR THE PLACES FETCH FUNCTION ---- BEGIN
// this function will hold the fetch for the places API but also the code for inserting the HTML elements with the places data 
//places API function
//function
// for loop for each item in the array
// var plaKey = "6ZmvylZaxk7KwhT7yxiK5EB3NQJ42tSb";
// var locationX = "-96.74120311335915,43.58273465"; //will need to make this = to array index in a for loop
// //had to use some weird cross origin access workaround - we need to ask the TAs about this!
// var placeApi = "https://www.mapquestapi.com/search/v4/place?location="+locationX+",&q=hotels&sort=relevance&feedback=false&key="+plaKey;
// // var placeApi = "https://cors-anywhere.herokwaypointsuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+location+"&radius="+radius+"&key="+plaKey;
// fetch(placeApi)
//     .then(function (response){
//         return response.json();
//     })
//     .then(function (data) {
//         console.log(data);
//     })
//------ CODE NOTES FOR THE PLACES FETCH FUNCTION ---- END

// Gas Prices API
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
//executes data collection for what the user has input on the page
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
                var cityState = waypointCity+","+waypointState;
                waypoints.push(cityState);
                console.log(waypoints)
            }
        }
    
        var startPoint = userStartCityEl + "," + userStartStateEl; // equals the input of the "Starting point" html element
        var endPoint = userEndCityEl + "," + userEndStateEl; // equals the input of the "End point" html element
        console.log(startPoint);
        console.log(endPoint); // equals the input of the "Destination Point" html element - **IDEA** turn this into an array and then we can pass it into the functions as well
        var geoKey = "ae5c8056-a632-44f7-86b9-adfb12b8775b";
        
        // we will need a conditional IF statement to determine if waypoints are used - these need to be ran in a certain order to make the Route/Place/Display Map API's Work
        runStartCoord(startPoint, geoKey);
        runEndCoord(endPoint, geoKey);

        //we will need to add a conditional IF statment to build the URL for the display map to determine if waypoints are needed - this should fire off last in the button push function
        // <iframe src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyD4Xi4w8rZxYlWSoH9Ncby2mpwf0rX9q0g&origin=44.7277413,-96.2633777&destination=43.1802172,-95.8528615&waypoints=43.58273465,-96.74120311335915|43.4246842,-95.1019392" width="800" height="800"></iframe>
    });

    // Function for clearing Data
// When user data is saved locally and in arrays in Javascript,this function will also clear those as well
// Add modal for user to confirm they actually want to clear their data
clearButtonEl.on("click", function(){
    waypointDivEl.empty();
    wayPoints = [];
    waypointCounter = 0;

});
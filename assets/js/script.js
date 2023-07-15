var addWayPointEl = $("#add-waypoint");
var submitButtonEl = $("#submit-button");
var waypointCounter = 0;

addWayPointEl.on("click", function() {
    var cityEl = "input";
    var stateEl = "input";
    var searchCardEl = $("#search-card")

    if(waypointCounter < 3){
        var inputElC = document.createElement(cityEl);
        var inputElS = document.createElement(stateEl);

        inputElC.setAttribute("class", "form-control w-100 m-2 p-3 s-3");
        inputElC.setAttribute("type", "text");
        inputElC.setAttribute("placeholder", "Enter City");
        searchCardEl.append(inputElC);

        inputElS.setAttribute("class", "form-control w-100 m-2 p-3 s-3");
        inputElS.setAttribute("type", "text");
        inputElS.setAttribute("placeholder", "Enter State");
        searchCardEl.append(inputElS);

        waypointCounter++;  
    }
    
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
// geocode API 
// will need to create an array of point i think - so we can run through all the points in a loop and add them to a string
// will need to create a for loop that run runs through each locations and then creates a LAT & LONG Array inside an array - with start point being array 0 and end point being the last value in the array
var startPoint = ""; // equals the input of the "Starting point" html element - **IDEA** turn this into an array and then we can pass it into the functions as well
var endPoitnt = ""; // equals the input of the "Destination Point" html element - **IDEA** turn this into an array and then we can pass it into the functions as well
var waypoints = []; // for loop that will loop through all the waypoints and gathers them into an array - **IDEA** turn this into an array and then we can pass it into the functions as well
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


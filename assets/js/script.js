//button element letiables
let addWayPointEl = $("#add-waypoint");
let submitButtonEl = $("#submit-button");
let clearButtonEl = $("#clear-button");
let mapEl = $('#mapEl');

//counter for waypoint city,state loop
let waypointCounter = 0;
let waypointDivEl = $("#waypoint-div");

// Autocompelte function for the state - 1 for the automatically adds the autocomplete on page load
$(function () {
  let stateNames = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];
  $(".state-input").autocomplete({
    source: stateNames,
  });
});

//Add Waypoint button
// state autocomplete values to apply to added waypoin
let stateNames = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];
addWayPointEl.on("click", function () {
  let cityEl = "input";
  let stateEl = "input";
  //only allow for 3 waypoints
  if (waypointCounter < 3) {
    let inputElC = document.createElement(cityEl);
    let inputElS = document.createElement(stateEl);
    let waypointHeader = document.createElement("label");

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
});
// letiable for the API calls
let points = []; // Route API [[lat,long],[lat,long]]
let points2 = []; // Places API
let startCoords = ""; //displayMap
let destCoords = ""; //displayMap
let waypointCoords = ""; //displayMap
let waypoints = []; //waypoint sting (city,state)
let averageGasPrice = "";
let gasCost = "";
let distance = "";

//we might need to make 3 seperate APIs - one for start, one for end and one for the waypoint array so we can collect the LAT/long letiable
//function to gather the start coordinates and start building the arrays for Route/Places/Display Map
function runStartCoord(startPoint, geoKey) {
  let geocodeApiS =
    "https://graphhopper.com/api/1/geocode?q=" +
    startPoint +
    "&key=" +
    geoKey +
    "&limit=1";
  fetch(geocodeApiS)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // we still need to parse this response and get the Lat/long
      let long = parseFloat(data.hits[0].point.lng); // for Routes API - Long,Lat
      let lat = parseFloat(data.hits[0].point.lat);
      let pointR = [];
      pointR.push(long);
      pointR.push(lat);
      console.log(pointR);
      points.push(pointR);
      console.log(points);
      let pointP = data.hits[0].point.lng + "," + data.hits[0].point.lat; // for Places API - long,lat
      console.log(pointP);
      points2.push(pointP); // not needed for places API - we dont need places for start point
      console.log(points2);
      let pointM = data.hits[0].point.lat + "," + data.hits[0].point.lng; // for displayMAP API - lat,Long
      startCoords = pointM;
      console.log(startCoords);
      runWayPointCoords(waypoints, geoKey);
    });
}

//function to gather the end coordinates and continue building the arrays for Route/Places/Display Map
function runWayPointCoords(wayPoints, geokey) {
  let wayPointsW = [];
  let promises = [];
  for (let i = 0; i < wayPoints.length; i++) {
    let geocodeApiS =
      "https://graphhopper.com/api/1/geocode?q=" +
      wayPoints[i] +
      "&key=" +
      geokey +
      "&limit=1";
    promises.push(
      new Promise(function (resolve, reject) {
        fetch(geocodeApiS)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(i);
            console.log(wayPointsW);
            let long = parseFloat(data.hits[0].point.lng); // for Routes API - Long,Lat
            let lat = parseFloat(data.hits[0].point.lat);
            let pointR = [];
            pointR.push(long);
            pointR.push(lat);
            console.log(pointR);
            points.push(pointR);
            console.log(points);
            let pointP = data.hits[0].point.lng + "," + data.hits[0].point.lat; // for Places API - long,lat
            console.log(pointP);
            points2.push(pointP);
            console.log(points2);
            let pointM = data.hits[0].point.lat + "," + data.hits[0].point.lng; // for displayMAP API - lat,Long
            wayPointsW.push(pointM);
            console.log("waypointsW", wayPointsW);

            // waypointCoords = wayPointsW.toString().replaceAll(",", "|");
            // waypointCoords = wayPointsW.toString().replace(/,/g, function(match, index) {
            //   return index % 2 === 0 ? "|" : ",";
            waypointCoords = wayPointsW.toString().replace(/,(?=(?:[^,]*,){1}[^,]*$)/g, '|');
            console.log("waypointCoords", waypointCoords);
            resolve();
          });
      })
    );
    }
    Promise.all(promises)
        .then(function(){
            runEndCoord(endPoint, geoKey);
        })
}

//function to gather the end coordinates and continue building the arrays for Route/Places/Display Map
function runEndCoord(endPoint, geoKey) {
  let geocodeApiS =
    "https://graphhopper.com/api/1/geocode?q=" +
    endPoint +
    "&key=" +
    geoKey +
    "&limit=1";
  fetch(geocodeApiS)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);  
  // we still need to parse this response and get the Lat/long
  let long = parseFloat(data.hits[0].point.lng); // for Routes API - Long,Lat
  let lat = parseFloat(data.hits[0].point.lat);
  let pointR = [];
  pointR.push(long);
  pointR.push(lat);
  console.log(pointR);
  points.push(pointR);
  console.log(points);
  let pointP = data.hits[0].point.lng + "," + data.hits[0].point.lat; // for Places API - long,lat
  console.log(pointP);
  points2.push(pointP);
  console.log(points2);
  let pointM = data.hits[0].point.lat + "," + data.hits[0].point.lng; // for displayMAP API - lat,Long
  destCoords = pointM; 
  console.log(destCoords);
  runRouteAPI();
});
}

//------ CODE NOTES FOR THE ROUTES FETCH FUNCTION ---- BEGIN
function runRouteAPI() {
    let query = new URLSearchParams({
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
              points: points,
              optimize: 'true',
              details: ['road_class', 'surface'],
              vehicle: 'car',
        })
    }
)
.then(function(response) {
    return response.json();
})
.then(function(data) {
    console.log("route", data);
    distance = data.paths[0].distance * 0.000621371;
    console.log("distanceMiles", distance);
    let gallonsUsed = distance / userMpgEl;
    console.log("gallonsTest", gallonsUsed)
    gasCost = gallonsUsed * averageGasPrice;
    console.log("gasCost", gasCost)
    let newURL = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyD4Xi4w8rZxYlWSoH9Ncby2mpwf0rX9q0g&origin=" + startCoords + "&destination=" + destCoords + "&waypoints=" + waypointCoords;
    mapEl.attr("src",newURL);
    console.log(newURL);
    appendWaypointList();
})
}

function appendWaypointList(){
  for(var i = 0; i < waypoints.length; i++){
    let waypointName = $("<li>"+ waypoints[i] + "</li>");
    returnedWaypoints.append(waypointName);
  }
  let endPointName = $("<li>"+ endPoint + "</li>");
  returnedWaypoints.append(endPointName);

  returnedGasCost.text(gasCost);
  returnedTotalMiles.text(distance);
}

//distance is returned in meters - multiply the distance by 0.000621371 to get miles
//------ CODE NOTES FOR THE ROUTES FETCH FUNCTION ---- END

//------ CODE NOTES FOR THE PLACES FETCH FUNCTION ---- BEGIN
// this function will hold the fetch for the places API but also the code for inserting the HTML elements with the places data
//places API function
//function
// for loop for each item in the array
// let plaKey = "6ZmvylZaxk7KwhT7yxiK5EB3NQJ42tSb";
// let locationX = "-96.74120311335915,43.58273465"; //will need to make this = to array index in a for loop
// //had to use some weird cross origin access workaround - we need to ask the TAs about this!
// let placeApi = "https://www.mapquestapi.com/search/v4/place?location="+locationX+",&q=hotels&sort=relevance&feedback=false&key="+plaKey;
// // let placeApi = "https://cors-anywhere.herokwaypointsuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+location+"&radius="+radius+"&key="+plaKey;
// fetch(placeApi)
//     .then(function (response){
//         return response.json();
//     })
//     .then(function (data) {
//         console.log(data);
//     })
//------ CODE NOTES FOR THE PLACES FETCH FUNCTION ---- END

// Gas Prices API
let gasPricesApi =
  "https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=4VbUpGHqE0lNDb8xC6yw40vLaJrX4ABEbH2DvqRl&frequency=weekly&data[0]=value&facets[series][]=EMM_EPMRU_PTE_NUS_DPG&start=2023-07-3&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000";
fetch(gasPricesApi)
  .then(function (response) {
    console.log(response);
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    let rdata = data.response;
    console.log(rdata);
    averageGasPrice = rdata.data[0].value;
    console.log(averageGasPrice);
  });
//executes data collection for what the user has input on the page
let userStartCityEl = "";
let userStartStateEl="";
let userEndCityEl="";
let userEndStateEl="";
let userMpgEl="";

let returnedWaypoints = $("#waypoint-list")
let returnedGasCost = $("#gas-cost")
let returnedTotalMiles = $("#total-miles")

let startPoint = userStartCityEl + "," + userStartStateEl; // equals the input of the "Starting point" html element
let endPoint = userEndCityEl + "," + userEndStateEl; // equals the input of the "End point" html element

let geoKey = "ae5c8056-a632-44f7-86b9-adfb12b8775b";

submitButtonEl.on("click", async function () {
  userStartCityEl = $("#start-city-input").val();
  userStartStateEl = $("#start-state-input").val();
  userEndCityEl = $("#end-city-input").val();
  userEndStateEl = $("#end-state-input").val();
  userMpgEl = $("#mpg-input").val();

  if (waypointCounter > 0) {
    for (let i = 0; i < waypointCounter; i++) {
      let waypointCity = $("#cityWay" + i).val();
      console.log(waypointCity);
      let waypointState = $("#stateWay" + i).val();
      console.log(waypointState);
      let cityState = waypointCity + "," + waypointState;
      waypoints.push(cityState);
      console.log(waypoints);
    }
  }

  startPoint = userStartCityEl + "," + userStartStateEl; // equals the input of the "Starting point" html element
  endPoint = userEndCityEl + "," + userEndStateEl; // equals the input of the "End point" html element
  console.log(startPoint);
  console.log(endPoint); // equals the input of the "Destination Point" html element - **IDEA** turn this into an array and then we can pass it into the functions as well

  // we will need a conditional IF statement to determine if waypoints are used - these need to be ran in a certain order to make the Route/Place/Display Map API's Work

  runStartCoord(startPoint, geoKey);
//   runWayPointCoords(waypoints, geoKey);
//   runEndCoord(endPoint, geoKey);

  //we will need to add a conditional IF statment to build the URL for the display map to determine if waypoints are needed - this should fire off last in the button push function

  // <iframe src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyD4Xi4w8rZxYlWSoH9Ncby2mpwf0rX9q0g&origin=44.7277413,-96.2633777&destination=43.1802172,-95.8528615&waypoints=43.58273465,-96.74120311335915|43.4246842,-95.1019392" width="800" height="800"></iframe>
});

// Function for clearing Data
// When user data is saved locally and in arrays in Javascript,this function will also clear those as well
// Add modal for user to confirm they actually want to clear their data
clearButtonEl.on("click", function () {
  waypointDivEl.empty();
  wayPoints = [];
  waypointCounter = 0;
})

//button element letiables
let addWayPointEl = $("#add-waypoint");
let submitButtonEl = $("#submit-button");
let clearButtonEl = $("#clear-button");
let mapEl = $('#mapEl');

//counter for waypoint city,state loop
let waypointCounter = 0;
let waypointDivEl = $("#waypoint-div");
let waypointsPlacesEl = $('#waypoint-places')

// Autocompelte function for the state - 1 for the automatically adds the autocomplete on page load
$(function () {
  let stateNames = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN',"TX",'UT','VT','VA','WA','WV','WI','WY'
  ];
  $(".state-input").autocomplete({
    source: stateNames,
  });
});

//Add Waypoint button
// state autocomplete values to apply to added waypoin
let stateNames = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN',"TX",'UT','VT','VA','WA','WV','WI','WY'
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
let waypoints = []; //waypoint sting (city,state) - for coordinate API
let waypoints2 = ["Blank"]; //waypoints2 string (city,State) - For Places API
let averageGasPrice = "";
let gasCost = "";
let distance = "";

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
      points.push(pointR);

      let pointP = data.hits[0].point.lng + "," + data.hits[0].point.lat; // for Places API - long,lat
      points2.push(pointP); // not needed for places API - we dont need places for start point

      let pointM = data.hits[0].point.lat + "," + data.hits[0].point.lng; // for displayMAP API - lat,Long
      startCoords = pointM;

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
            let long = parseFloat(data.hits[0].point.lng); // for Routes API - Long,Lat
            let lat = parseFloat(data.hits[0].point.lat);
            let pointR = [];
            pointR.push(long);
            pointR.push(lat);
            points.push(pointR);

            let pointP = data.hits[0].point.lng + "," + data.hits[0].point.lat; // for Places API - long,lat
            points2.push(pointP);

            let pointM = data.hits[0].point.lat + "," + data.hits[0].point.lng; // for displayMAP API - lat,Long
            wayPointsW.push(pointM);

            waypointCoords = wayPointsW.toString().replace(/,(?=(?:[^,]*,){1}[^,]*$)/g, '|');
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
  let long = parseFloat(data.hits[0].point.lng); // for Routes API - Long,Lat
  let lat = parseFloat(data.hits[0].point.lat);
  let pointR = [];
  pointR.push(long);
  pointR.push(lat);;
  points.push(pointR);

  let pointP = data.hits[0].point.lng + "," + data.hits[0].point.lat; // for Places API - long,lat
  points2.push(pointP);

  let pointM = data.hits[0].point.lat + "," + data.hits[0].point.lng; // for displayMAP API - lat,Long
  destCoords = pointM; 

  runRouteAPI();
  runPlacesApi();
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
    let gallonsUsed = distance / userMpgEl;
    gasCost = gallonsUsed * averageGasPrice;
    let newURL = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyD4Xi4w8rZxYlWSoH9Ncby2mpwf0rX9q0g&origin=" + startCoords + "&destination=" + destCoords + "&waypoints=" + waypointCoords;
    mapEl.attr("src",newURL);
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
//------ CODE NOTES FOR THE ROUTES FETCH FUNCTION ---- END

//------ CODE NOTES FOR THE PLACES FETCH FUNCTION ---- BEGIN
// this function will hold the fetch for the places API but also the code for inserting the HTML elements with the places data
function runPlacesApi() {
let plaKey = "6ZmvylZaxk7KwhT7yxiK5EB3NQJ42tSb";
console.log(points2)
let cardEl = "section";
let divEl = "div";
let ulEl = "ul";
let h2El = "h2"
let liEl = "li";
let h3El = "h3";
let waypointEls = [];
let waypointHeaderEls = [];
let placeListHEls = [];
let placeListBEls = [];
let placeListREls = [];

for (let i = 1; i < points2.length; i++) {
  let waypointEl = document.createElement(cardEl);
  let waypointHeaderEl = document.createElement(h2El);
  let placeListHEl = document.createElement(divEl);
  let placeListBEl = document.createElement(divEl);
  let placeListREl = document.createElement(divEl);
 
//need to set Grid Attributes for materialize to the crated elements
waypointEl.setAttribute("id", "waypointEl" + i)
waypointEls[i] = waypointEl;
waypointsPlacesEl.append(waypointEls[i]);

//make the section a column container so the sections stack
waypointHeaderEl.textContent = waypoints2[i];
waypointHeaderEl.setAttribute("id", "waypoint-header" + i );
waypointHeaderEls[i] = waypointHeaderEl;

// make these dive elements row containers so they appear side by side 
placeListHEl.setAttribute("id", "place-listH" + i );
placeListHEls[i] =placeListHEl;
placeListBEl.setAttribute("id", "place-listB" + i );
placeListBEls[i] =placeListBEl;
placeListREl.setAttribute("id", "place-listR" + i );
placeListREls[i] =placeListREl;

let waypointSectionelementId = "#waypointEl" + i;

$(waypointSectionelementId).append(waypointHeaderEls[i]);
$(waypointSectionelementId).append(placeListHEls[i]);
$(waypointSectionelementId).append(placeListBEls[i]);
$(waypointSectionelementId).append(placeListREls[i]);

//need to replicate what is done for "hotels" in the other fetch APIs to populate the places cards

let placeApiH = "https://www.mapquestapi.com/search/v4/place?location="+points2[i]+",&q=hotels&sort=relevance&feedback=false&key="+plaKey;

let listHElementID = "#place-listH" + i;

let hotelHeader = document.createElement(h3El)
hotelHeader.textContent = "Hotels in the Area";
$(listHElementID).append(hotelHeader);
let hotelUlEl = document.createElement(ulEl)
hotelUlEl.setAttribute("id", "place-Ul" + i);
$(listHElementID).append(hotelUlEl)
let hotelUlElId = "#place-Ul" + i;
fetch(placeApiH)
    .then(function (response){
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        let resultsH = data.results;
        console.log("testResults", resultsH)
        for (let h = 0; h < resultsH.length; h++) {
          let placelistitemEl = document.createElement(liEl);
          let hotel = resultsH[h].name;
          let hotelAddress = resultsH[h].place.properties.street;
          let hotelCity = resultsH[h].place.properties.city;
          let hotelState = resultsH[h].place.properties.stateCode;
          let hotelDisplay = hotel + ", " + hotelAddress + ", " + hotelCity+ ", " + hotelState;
          placelistitemEl.textContent = hotelDisplay;
          $(hotelUlElId).append(placelistitemEl);
        }
    })
let placeApiB = "https://www.mapquestapi.com/search/v4/place?location="+points2[i]+",&q=bars&sort=relevance&feedback=false&key="+plaKey;

let listBElementID = "#place-listB" + i;

fetch(placeApiB)
    .then(function (response){
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })
let placeApiR = "https://www.mapquestapi.com/search/v4/place?location="+points2[i]+",&q=restaurants&sort=relevance&feedback=false&key="+plaKey;

let listRElementID = "#place-listR" + i;

fetch(placeApiR)
    .then(function (response){
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })
  }
  }
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
    averageGasPrice = rdata.data[0].value;
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
      let waypointState = $("#stateWay" + i).val();
      let cityState = waypointCity + "," + waypointState;
      waypoints.push(cityState);
      waypoints2.push(cityState);
    }
  }

  startPoint = userStartCityEl + "," + userStartStateEl; // equals the input of the "Starting point" html element
  endPoint = userEndCityEl + "," + userEndStateEl; // equals the input of the "End point" html element
waypoints2.push(endPoint);
console.log (waypoints2)
  // we will need a conditional IF statement to determine if waypoints are used - these need to be ran in a certain order to make the Route/Place/Display Map API's Work

  runStartCoord(startPoint, geoKey);
});

// Function for clearing Data
// When user data is saved locally and in arrays in Javascript,this function will also clear those as well
// Add modal for user to confirm they actually want to clear their data
clearButtonEl.on("click", function () {
  waypointDivEl.empty();
  wayPoints = [];
  waypointCounter = 0;
})

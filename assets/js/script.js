// Variables linking to the button elements in index.html
let addWayPointEl = $("#add-waypoint");
let submitButtonEl = $("#submit-button");
let clearButtonEl = $("#clear-button");

let mapEl = $('#mapEl');

//counter for the amount of waypoints
let waypointCounter = 0;
//Link to div element in html where user can add waypoints
let waypointDivEl = $("#waypoint-div");
let waypointsPlacesEl = $('#waypoint-places')


// Autocomplete function for the state - 1 for the automatically adds the autocomplete on page load
$(function () {
  let stateNames = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', "TX", 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];
  $(".state-input").autocomplete({
    source: stateNames,
  });
});

// Variable for the API calls
let points = []; // Route API [[lat,long],[lat,long]]
let points2 = []; // Places API
let startCoords = ""; //displayMap API
let destCoords = ""; //displayMap API
let waypointCoords = ""; //displayMap API
let waypoints = []; //waypoint sting (city,state) - for coordinate API
let waypoints2 = ["Blank"]; //waypoints2 string (city,State) - For Places API - to append to bottom of pa
let averageGasPrice = ""; //MPG Variable global so it can be used by other functions
let gasCost = ""; //gas cost variable, global so it can be used by other function
let distance = ""; //distance variable variable, global so it can be used by other function

// Variables for what the user has to input on the page
let userStartCityEl = "";
let userStartStateEl = "";
let userEndCityEl = "";
let userEndStateEl = "";
let userMpgEl = "";

// Variables linked to the area in the DOM where the list of waypoints, the total gas cost, and total distance traveled will be appended
let returnedWaypoints = $("#waypoint-list")
let returnedGasCost = $("#gas-cost")
let returnedTotalMiles = $("#total-miles")

// equals the input of the "Starting point" html element in the format (city),(state)
let startPoint = userStartCityEl + "," + userStartStateEl;
// equals the input of the "End point" html element in the format (city),(state)
let endPoint = userEndCityEl + "," + userEndStateEl;

// Api key for grasshopper geocode Api call
let geoKey = "ae5c8056-a632-44f7-86b9-adfb12b8775b";

// state autocomplete values to apply to added waypoin
let stateNames = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', "TX", 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

// Function to add waypoint state and city input in html 
addWayPointEl.on("click", function () {
  let cityEl = "input";
  let stateEl = "input";
  // Can set a limit to how many waypoints user can add
  // If allowed more time,can let user decide the limit themselves
  if (waypointCounter < 3) {
    let inputElC = document.createElement(cityEl);
    let inputElS = document.createElement(stateEl);
    let waypointHeader = document.createElement("label");

    waypointHeader.setAttribute("id", "waypoint" + waypointCounter);
    waypointHeader.setAttribute("class", "form-label w-100");

    waypointHeader.textContent = "Waypoint " + (waypointCounter + 1);
    waypointDivEl.append(waypointHeader);

    inputElC.setAttribute("id", "cityWay" + waypointCounter);
    inputElC.setAttribute("class", "city-input input-field col");
    inputElC.setAttribute("type", "text");
    inputElC.setAttribute("placeholder", "Enter City");
    waypointDivEl.append(inputElC);

    inputElS.setAttribute("id", "stateWay" + waypointCounter);
    inputElS.setAttribute("class", "state-input input-field");
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

// Function to gather the start coordinates and start building the arrays for Route/Places/Display Map
// Converts the starting (city),(state) the user inputted into coordinates(long,lat)
function runStartCoord(startPoint, geoKey) {
  let geocodeApiS =
    "https://graphhopper.com/api/1/geocode?q=" +
    startPoint +
    "&key=" +
    geoKey +
    "&limit=1";
  fetch(geocodeApiS)
    .then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        openErrorMsg();
        return;
      }
    })
    .then(function (data) {
      // for Routes API - Long,Lat
      let long = parseFloat(data.hits[0].point.lng);
      let lat = parseFloat(data.hits[0].point.lat);
      // Long and lat of starting point is pushed into pointR array
      // pointR is then pushed into points array as an array
      let pointR = [];
      pointR.push(long);
      pointR.push(lat);
      points.push(pointR);

      let pointP = data.hits[0].point.lng + "," + data.hits[0].point.lat; // for Places API - long,lat
      points2.push(pointP); // not needed for places API - we dont need places for start point

      // displayMAP API needs the coordinates in lat,long as opposed to long,lat
      let pointM = data.hits[0].point.lat + "," + data.hits[0].point.lng; // for displayMAP API - lat,Long
      startCoords = pointM;

      // Checks if user added any waypoints and runs runWayPointCoords if there are any or runEndCoord if there are not any waypoints
      if (waypointCounter > 0) {
        runWayPointCoords(waypoints, geoKey);
      } else {
        runEndCoord(endPoint, geoKey);
      }
    });
}

// Function to gather the waypoint coordinates and continue building the arrays for Route/Places/Display Map
// Routes,Places and Display Map require different array formatting hence the different array structures are needed
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
    // Puts promises in an array so they all are completed in that set order
    // Can make sure runEndCoord is run when all the promises are fulfilled
    promises.push(
      new Promise(function (resolve, reject) {
        fetch(geocodeApiS)
          .then(function (response) {

            if (response.status === 200) {
              return response.json();
            } else {
              openErrorMsg();
              return;
            }
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
  // When all the promises in the array are fulfilled, then the runEndCoord is called
  // Needed runEndCoord to run when all the fetch request beforehand are done for the arrays to be build properly
  Promise.all(promises)
    .then(function () {
      runEndCoord(endPoint, geoKey);
    })
}

// Function to gather the end coordinates and continue building the arrays for Route/Places/Display Map
function runEndCoord(endPoint, geoKey) {
  let geocodeApiS =
    "https://graphhopper.com/api/1/geocode?q=" +
    endPoint +
    "&key=" +
    geoKey +
    "&limit=1";
  fetch(geocodeApiS)
    .then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        openErrorMsg();
        return;
      }
    })
    .then(function (data) {
      if (!data) {
        return;
      }
      let long = parseFloat(data.hits[0].point.lng); // for Routes API - Long,Lat
      let lat = parseFloat(data.hits[0].point.lat);
      let pointR = [];
      pointR.push(long);
      pointR.push(lat);
      points.push(pointR);

      let pointP = data.hits[0].point.lng + "," + data.hits[0].point.lat; // for Places API - long,lat
      points2.push(pointP);

      let pointM = data.hits[0].point.lat + "," + data.hits[0].point.lng; // for displayMAP API - lat,Long
      destCoords = pointM;

      runRouteAPI();
    });
}

//------ CODE NOTES FOR THE ROUTES FETCH FUNCTION ---- BEGIN

function runRouteAPI() {
  let query = new URLSearchParams({
    key: 'ae5c8056-a632-44f7-86b9-adfb12b8775b'
  }).toString();

  const resp = fetch(
    `https://graphhopper.com/api/1/route?${query}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Gets the route by using the points array we built in the functions beforehand
        points: points,
        optimize: 'true',
        details: ['road_class', 'surface'],
        vehicle: 'car',
      })
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let message = data.message;
      if (message !== undefined) {
        openErrorMsg();
      }
      // Gets the total distance in miles from the start to endpoint as well as the waypoint stops along the way 
      distance = Math.round(data.paths[0].distance * 0.000621371);
      // Calculates the gallons required using the users vehicle mpg and the total distance of the trip
      let gallonsUsed = distance / userMpgEl;
      gasCost = Math.round(gallonsUsed * averageGasPrice);
      // Declares the variable of the URL that is going to be used by the embedded google map in html in the "src" attribute
      let newURL = '';
      // Google map URL is formatted different when there are waypoints
      // The coordinates from the geocode are used in the 
      if (waypointCounter > 0) {
        newURL = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyD4Xi4w8rZxYlWSoH9Ncby2mpwf0rX9q0g&origin=" + startCoords + "&destination=" + destCoords + "&waypoints=" + waypointCoords; // IF statement here
      } else {
        newURL = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyD4Xi4w8rZxYlWSoH9Ncby2mpwf0rX9q0g&origin=" + startCoords + "&destination=" + destCoords;
      }
      // Sets the srclattribute of the iframe element to the newURL variable
      mapEl.attr("src", newURL);

      appendWaypointList();
      runPlacesApi();
    })
}

//------ CODE NOTES FOR THE ROUTES FETCH FUNCTION ---- END

// Appends a list of waypoints under the map including the end point
function appendWaypointList() {
  if (waypointCounter > 0) {
    for (var i = 0; i < waypoints.length; i++) {
      let waypointName = $("<li>" + waypoints[i] + "</li>");
      returnedWaypoints.append(waypointName);
    }
  }
  let endPointName = $("<li>" + endPoint + "</li>");
  returnedWaypoints.append(endPointName);

  returnedGasCost.text(gasCost);
  returnedTotalMiles.text(distance);

}

//------ CODE NOTES FOR THE PLACES FETCH FUNCTION ---- BEGIN
// this function will hold the fetch for the places API but also the code for inserting the HTML elements with the places data
function runPlacesApi() {
  let plaKey = process.env.mapquestKey;
  let cardEl = "section";
  let divEl = "div";
  let ulEl = "ul";
  let h2El = "h2"
  let liEl = "li";
  let h3El = "h3";
  let waypointEls = [];
  let waypointHeaderEls = [];
  let placeListHEls = [];
  let placeListREls = [];
  let placeListPEls = [];

  // Loops through the points array containing waypoints
  // Appends a list of hotels, restaurants, and bars for each waypoint including the end point
  for (let i = 1; i < points2.length; i++) {
    // Creates all elements for each waypoint section
    let waypointEl = document.createElement(cardEl);
    let waypointHeaderEl = document.createElement(h2El);
    let placeListHEl = document.createElement(divEl);
    let placeListREl = document.createElement(divEl);
    let placeListPEl = document.createElement(divEl);
    let dividerEl = document.createElement(divEl);
    // Div element that acts as a top margin for each separate waypoint section
    dividerEl.setAttribute("class", "divider")

    waypointEl.setAttribute("id", "waypointEl" + i)
    waypointEls[i] = waypointEl;
    waypointEl.setAttribute("class", "row");
    waypointsPlacesEl.append(waypointEls[i]);

    waypointHeaderEl.textContent = waypoints2[i];
    waypointHeaderEl.setAttribute("id", "waypoint-header" + i);
    waypointHeaderEls[i] = waypointHeaderEl;

    // Attributes set to each div that materialize uses for formatting
    // About to have the hotels, restaurants, and parks section sitting side-by-side in a row
    placeListHEl.setAttribute("id", "place-listH" + i);
    placeListHEl.setAttribute("class", "waypoint-poi col s12 m4 l4")
    placeListHEls[i] = placeListHEl;
    placeListREl.setAttribute("id", "place-listR" + i);
    placeListREl.setAttribute("class", "waypoint-poi col s12 m4 l4")
    placeListREls[i] = placeListREl;
    placeListPEl.setAttribute("id", "place-listP" + i);
    placeListPEl.setAttribute("class", "waypoint-poi col s12 m4 l4")
    placeListPEls[i] = placeListPEl;

    let waypointSectionelementId = "#waypointEl" + i;

    // Appends the different div elements
    $(waypointSectionelementId).append(dividerEl)
    $(waypointSectionelementId).append(waypointHeaderEls[i]);
    $(waypointSectionelementId).append(placeListHEls[i]);
    $(waypointSectionelementId).append(placeListREls[i]);
    $(waypointSectionelementId).append(placeListPEls[i]);

    // Gets the different hotels in the area of the waypoint that the for loop 
    let placeApiH = "https://www.mapquestapi.com/search/v4/place?location=" + points2[i] + ",&q=hotels&sort=relevance&feedback=false&key=" + plaKey;

    let listHElementID = "#place-listH" + i;

    let hotelHeader = document.createElement(h3El)
    hotelHeader.textContent = "Hotels in the Area";
    $(listHElementID).append(hotelHeader);
    let hotelUlEl = document.createElement(ulEl)
    hotelUlEl.setAttribute("id", "hotel-place-Ul" + i);
    $(listHElementID).append(hotelUlEl)
    let hotelUlElId = "#hotel-place-Ul" + i;
    // Fetch request for the list of hotels near the waypoint
    fetch(placeApiH)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        let resultsH = data.results;
        // Loops through each result for hotels and gets the address and appends it to the list
        for (let h = 0; h < resultsH.length; h++) {
          let placelistitemEl = document.createElement(liEl);
          let hotel = resultsH[h].name;
          let hotelAddress = resultsH[h].place.properties.street;
          let hotelCity = resultsH[h].place.properties.city;
          let hotelState = resultsH[h].place.properties.stateCode;
          let hotelDisplay = hotel + ", " + hotelAddress + ", " + hotelCity + ", " + hotelState;
          placelistitemEl.textContent = hotelDisplay;
          $(hotelUlElId).append(placelistitemEl);
        }
      })
    let placeApiB = "https://www.mapquestapi.com/search/v4/place?location=" + points2[i] + ",&q=restaurants&sort=relevance&feedback=false&key=" + plaKey;

    let listRElementID = "#place-listR" + i;

    let restaurantHeader = document.createElement(h3El)
    restaurantHeader.textContent = "Restaurants in the Area";
    $(listRElementID).append(restaurantHeader);
    let restaurantUlEl = document.createElement(ulEl)
    restaurantUlEl.setAttribute("id", "restaurant-place-Ul" + i);
    $(listRElementID).append(restaurantUlEl)
    let restaurantUlElId = "#restaurant-place-Ul" + i;
    // Fetch request for the list of restaurants near the waypoint
    fetch(placeApiB)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let resultsR = data.results;
        // Loops through each result for restaurants, gets the address, and appends it to the list
        for (let r = 0; r < resultsR.length; r++) {
          let placelistitemEl = document.createElement(liEl);
          let restaurant = resultsR[r].name;
          let restaurantAddress = resultsR[r].place.properties.street;
          let restaurantCity = resultsR[r].place.properties.city;
          let restaurantState = resultsR[r].place.properties.stateCode;
          let restaurantDisplay = restaurant + ", " + restaurantAddress + ", " + restaurantCity + ", " + restaurantState;
          placelistitemEl.textContent = restaurantDisplay;
          $(restaurantUlElId).append(placelistitemEl);
        }
      })
    let placeApiR = "https://www.mapquestapi.com/search/v4/place?location=" + points2[i] + ",&q=parks&sort=relevance&feedback=false&key=" + plaKey;

    let listPElementID = "#place-listP" + i;

    let parkHeader = document.createElement(h3El)
    parkHeader.textContent = "Parks in the Area";
    $(listPElementID).append(parkHeader);
    let parkUlEl = document.createElement(ulEl)
    parkUlEl.setAttribute("id", "park-place-Ul" + i);
    $(listPElementID).append(parkUlEl)
    let parkUlElId = "#park-place-Ul" + i;
    // Fetch request for the list of parks near the waypoint
    fetch(placeApiR)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let resultsP = data.results;
        // Loops through each result for parks and gets the address and appends it to the list
        for (let p = 0; p < resultsP.length; p++) {
          let placelistitemEl = document.createElement(liEl);
          let park = resultsP[p].name;
          let parkAddress = resultsP[p].place.properties.street;
          let parkCity = resultsP[p].place.properties.city;
          let parkState = resultsP[p].place.properties.stateCode;
          let parkDisplay = park + ", " + parkAddress + ", " + parkCity + ", " + parkState;
          placelistitemEl.textContent = parkDisplay;
          $(parkUlElId).append(placelistitemEl);
        }
      })
  }
}
//------ CODE NOTES FOR THE PLACES FETCH FUNCTION ---- END

// Declares the variable that stores the local data
let savedUserInputs = {};

// Gas Prices API that gets the average gas price in the US when the page loads
let gasPricesApi =
  "https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=4VbUpGHqE0lNDb8xC6yw40vLaJrX4ABEbH2DvqRl&frequency=weekly&data[0]=value&facets[series][]=EMM_EPMRU_PTE_NUS_DPG&start=2023-07-3&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000";
fetch(gasPricesApi)
  .then(function (response) {
    console.log(response);
    return response.json();
  })
  .then(function (data) {
    let rdata = data.response;
    averageGasPrice = rdata.data[0].value;
    init();
  });

// Fucntion that sets all the variables to their default state
// Clears any local data that is saved on the user machine
function clearData() {
  userStartCityEl = "";
  userStartStateEl = "";
  userEndCityEl = "";
  userEndStateEl = "";
  userMpgEl = "";
  startPoint = "";
  endPoint = "";
  points = [];
  points2 = [];
  startCoords = "";
  destCoords = "";
  waypointCoords = "";
  waypoints = [];
  waypoints2 = ["Blank"];
  gasCost = "";
  distance = "";
  userMpgEl = "";
  // Clears array that will go into user's local storage
  savedUserInputs = {};
  localStorage.setItem("savedUserInputs", JSON.stringify(savedUserInputs));
}

submitButtonEl.on("click", async function () {
  clearData();

  // Clears any saved local data on the user machine
  savedUserInputs = {
    startCity: '',
    startState: '',
    endCity: '',
    endState: '',
    mpg: '',
  }

  // Empties the elements in the html where the information is appended
  returnedWaypoints.empty();

  //Stores the value of the user inputs into variables
  userStartCityEl = $("#start-city-input").val();
  userStartStateEl = $("#start-state-input").val();
  userEndCityEl = $("#end-city-input").val();
  userEndStateEl = $("#end-state-input").val();
  userMpgEl = $("#mpg-input").val();
  // Resets the embedded google map
  mapEl.attr("https://www.google.com/maps/embed/v1/view?key=AIzaSyD4Xi4w8rZxYlWSoH9Ncby2mpwf0rX9q0g&center=41.925391, -102.455213");
  // Checks if the user inputted numbers or has a blank input where they should be inputting the city and state and ends the function if they did
  if (!checkUserLocation(userStartCityEl) || !checkUserLocation(userStartStateEl) || !checkUserLocation(userEndCityEl) || !checkUserLocation(userEndStateEl)) {
    locationErrorMsg();
    return;
  }

  // Makes sure the user inputs a number and that the field is not empty
  if (isNaN(userMpgEl) || userMpgEl.trim() === "") {
    gasErrorMsg();
    return;
  }

  // Properly formats the city and state values
  userStartCityEl = userStartCityEl.toLowerCase().replace(/(^|\s)\S/g, function (letter) {
    return letter.toUpperCase();
  })
  userEndCityEl = userEndCityEl.toLowerCase().replace(/(^|\s)\S/g, function (letter) {
    return letter.toUpperCase();
  })

  userStartStateEl = userStartStateEl.toUpperCase();
  userEndStateEl = userEndStateEl.toUpperCase();
  // if (myArray.length === 0)

  // If the user has added any waypoints, loops through the inputs in the waypoint area and sets the values in an array.
  if (waypointCounter > 0) {
    for (let i = 0; i < waypointCounter; i++) {
      let waypointCity = $("#cityWay" + i).val();
      let waypointState = $("#stateWay" + i).val();

      // Properly formats the city and state values
      waypointCity = waypointCity.toLowerCase().replace(/(^|\s)\S/g, function (letter) {
        return letter.toUpperCase();
      })

      waypointState = waypointState.toUpperCase();


      let cityState = waypointCity + "," + waypointState;

      // Value is pushed into the two waypoint arrays
      waypoints.push(cityState);
      waypoints2.push(cityState);
    }
  }

  // Stores the user inputs into an object that is used for when the page reloads
  savedUserInputs.startCity = userStartCityEl;
  savedUserInputs.startState = userStartStateEl;
  savedUserInputs.endCity = userEndCityEl;
  savedUserInputs.endState = userEndStateEl;
  savedUserInputs.mpg = userMpgEl;

  // Saves the object into local storage
  localStorage.setItem('savedUserInputs', JSON.stringify(savedUserInputs));

  // equals the input of the "Starting point" html element
  startPoint = userStartCityEl + "," + userStartStateEl;
  // equals the input of the "End point" html element
  endPoint = userEndCityEl + "," + userEndStateEl;
  waypoints2.push(endPoint);
  // we will need a conditional IF statement to determine if waypoints are used - these need to be ran in a certain order to make the Route/Place/Display Map API's Work

  runStartCoord(startPoint, geoKey);
});

// Function for clearing Data
// When user data is saved locally and in arrays in Javascript,this function will also clear those as well

// Resets the input values,local stored data, and the embedded map to its default values
clearButtonEl.on("click", function () {
  // Clears the input fields
  $("#start-city-input").val('');
  $("#start-state-input").val('');
  $("#end-city-input").val('');
  $("#end-state-input").val('');
  $("#mpg-input").val('');
  //Empties the user added waypoint fields as well as the waypoint places of interest
  waypointDivEl.empty();
  waypointsPlacesEl.empty();

  waypointCounter = 0;
  // Resets the map to its default value
  mapEl.attr("src", "https://www.google.com/maps/embed/v1/view?key=AIzaSyD4Xi4w8rZxYlWSoH9Ncby2mpwf0rX9q0g&center=41.925391, -102.455213");

  // Runs the clear data function to clear all the data not specified above
  clearData();
});

// Function runs when the page loads up
function init() {
  // Saves the local storage into the array to hold it
  savedUserInputs = JSON.parse(localStorage.getItem('savedUserInputs'));
  // Checks if there is any local storage]
  // If there is, sets the input fields to the saved data and runs the whole program with the saved data, updating the map
  if (savedUserInputs.startCity !== undefined) {
    $("#start-city-input").val(savedUserInputs.startCity);
    $("#start-state-input").val(savedUserInputs.startState);
    $("#end-city-input").val(savedUserInputs.endCity);
    $("#end-state-input").val(savedUserInputs.endState);
    $("#mpg-input").val(savedUserInputs.mpg);

    userMpgEl = Number(savedUserInputs.mpg);
    startPoint = savedUserInputs.startCity + "," + savedUserInputs.startState; // equals the input of the "Starting point" html element
    endPoint = savedUserInputs.endCity + "," + savedUserInputs.endState; // equals the input of the "End point" html element

    runStartCoord(startPoint, geoKey);
  }
}

// Function to check if the user has a valid city or state name in the input fields
function checkUserLocation(userLocation) {
  if (!isNaN(userLocation) || userLocation.trim() === "") {
    return false;
  } else {
    return true;
  }
}

// Function the pops an error modal if the user inputs an invalid city or state
function locationErrorMsg() {
  const modalElem = document.querySelector('#invalid-location');

  const closeModalBtn = document.querySelector('.modal-close');

  const modalInstance = M.Modal.init(modalElem);

  modalInstance.open();

  // Attach the closeModal function to the close button click event
  closeModalBtn.addEventListener('click', closeModal);

  function closeModal() {
    modalInstance.close();
  }
}

// Function the pops an error modal if the user inputs an invalid value for their vehicles miles per gallon
function gasErrorMsg() {
  const modalElem = document.querySelector('#invalid-mpg');

  const closeModalBtn = document.querySelector('.modal-close');

  const modalInstance = M.Modal.init(modalElem);

  modalInstance.open();

  closeModalBtn.addEventListener('click', closeModal);

  function closeModal() {
    modalInstance.close();
  }
};
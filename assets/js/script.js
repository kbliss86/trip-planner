var addWayPointEl = $("#add-waypoint");

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
        'AL',
        'AK',
        'AZ',
        'AR',
        'CA',
        'CO',
        'CT',
        'DE',
        'FL',
        'GA',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'OH',
        'OK',
        'OR',
        'PA',
        'RI',
        'SC',
        'SD',
        'TN',
        "TX",
        'UT',
        'VT',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY'
    ];
    $(".form-control").autocomplete({
      source: stateNames,
    });
  });
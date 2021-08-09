/**
 * @author AliceThunderWind
 * @file scripts.js
 * @brief Configurations of functionalities of the OpenStreetMap map
 */

//----------------------------------------------------------------------------------------
//--                                   Initialization                                   --
//----------------------------------------------------------------------------------------

// Initializing the map with zooming and centering
var map = L.map( 'map', {
    center: [46.50, 7.15],
    zoom: 9,
    tap : false
});

// Loading tiles & mentioning attributions
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxNativeZoom: 19,
    maxZoom: 20,
    minZoom: 2,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWxpY2V0aHVuZGVyd2luZCIsImEiOiJja20xMGpiOWYxZ3d2MnBseTJkdmxoMDZmIn0.ExBMlIL8nyZJ9VoNToP42Q'
}).addTo(map);

//----------------------------------------------------------------------------------------
//--                                   Addons / Nodes                                   --
//----------------------------------------------------------------------------------------

//--------------------------------------- Fullscreen -------------------------------------
map.addControl(new L.Control.Fullscreen({
    position:'topright',		
}));

//--------------------------------------- Markers' clusters ------------------------------
var markers = L.markerClusterGroup( {
    disableClusteringAtZoom:16
});

function changeClustering() {
    if (map.getZoom() >= disableClusteringAtZoom) {
        markers.disableClustering(); // New method from sub-plugin.
    } else {
        markers.enableClustering(); // New method from sub-plugin.
    }
};

// Setting icons parameters
var MyOwnIcon = L.Icon.extend({
    options: {
        iconSize: [30, 30],
        iconAnchor: [15, 25],
        popupAnchor: [0, -30] //0,-14 // 4 -29
    }
});

var pokestopIcon = new MyOwnIcon({
        iconUrl: 'images/map_marker_stop.png'}),
    gymIcon = new MyOwnIcon( {
        iconUrl: 'images/map_marker_default_01.png'}),
    gymExIcon = new MyOwnIcon({
        iconUrl: 'images/map_marker_default_ex_03.png'});

var nbPOIinCells = new Map();

// Common function for popup info
function onEachFeature(feature, layer) {
    var lat = feature.geometry.coordinates[1];
    var lng = feature.geometry.coordinates[0];

    layer.bindPopup('<b>' + feature.properties.typePOI+ '</b><br> '+'<a href="http://www.openstreetmap.org/?mlat=' + lat + '&mlon=' + lng +'&zoom=16&#map=16/'
    + lat + '/' + lng + '" target="_blank">' + feature.properties.title + '</a>' );

    var it = S2.latLngToKey(lat,lng, 14);

    
    if(nbPOIinCells.has(it)) {
        nbPOIinCells.set(it, nbPOIinCells.get(it) + 1);
    } else {
        nbPOIinCells.set(it, 1);
    }
}

// Fetching every pokestops from the geoJSON file and adding properties
var pokestopGeoJson = L.geoJson(pokestopsList, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {icon: pokestopIcon, tags : ["Pokéstop"]});
    }
})

// Fetching every gym from the geoJSON file and adding properties
var gymGeoJson = L.geoJson(gymsList, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {icon: gymIcon, tags : ["Arène"]});
    }
})

// Fetching every EX gym from the geoJSON file and adding properties
var gymExJson = L.geoJson(gymsEXList, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {icon: gymExIcon, tags : ["Arène EX"]});
    }
})

// Adding all layers to the map
markers.addLayer(pokestopGeoJson);
markers.addLayer(gymGeoJson);
markers.addLayer(gymExJson);
map.addLayer(markers)

// Filter option
L.control.tagFilterButton({
        data: ['Pokéstop', 'Arène','Arène EX','none'],
        filterOnEveryClick: true
    }).addTo(map);

    //--------------------------------------- S2 Cells ---------------------------------------

/**
 * Function 'drawCells' that calculates then draw
 * @param {*} level a level of cells to create (14 or 17)
 * @param {*} colour a color (red or green) 
 * @param {*} boundUp number of cells to create vertically
 * @param {*} boundRight number of cells to create horizontally
 * @returns an array containing the cells of a specific layer
 */
function getCells(level, colour, boundUp, boundRight) {
    // Getting the top left corner coordinates of the map
    var topLeftCornerCoordinate = map.getBounds().getNorthWest();

    // Getting the initial key from coordinates (and adding 0.005 to lat coordinate to adjust with the height of the window)
    var keyToDown = initialKey = S2.latLngToKey((topLeftCornerCoordinate.lat + 0.007), topLeftCornerCoordinate.lng, level);

    var polyLayers = [];

    // Creating columns of cells
    for(let i = 0; i < boundUp; ++i) {
        // Creating lines of cells
        for(let j = 0; j < boundRight; ++j) {
            var polygon = new L.Polygon(S2.S2Cell.FromHilbertQuadKey(keyToDown).getCornerLatLngs(), {
                color: colour,
                weight: 1,
                opacity: 1,
                smoothFactor: 0,
                fillOpacity: 0
            })

            if(level == 14) {
                var number = nbPOIinCells.get(keyToDown);

                
                if(number != undefined){
                    if (number < 2) {
                        number = 2 - number;
                    } else if (number < 6) {
                        number = 6 - number;
                    } else if (number <= 20) {
                        number = 20 - number;
                    } else if (number > 20) {
                        number = 0
                    }
                    polygon.bindTooltip('<b>'+ number.toString() + '</b>', {
                        permanent: true, 
                        direction: "center",
                        //className: 'myCSSClass'
                    });
                }
            }

            // Adding to the array a new polygon (quadrangle) with coordinates and styles
            polyLayers.push(polygon);

            // Fetching the neighbor to the right
            keyToDown = S2.latLngToNeighborKeys(S2.keyToLatLng(keyToDown).lat, S2.keyToLatLng(keyToDown).lng, level)[1];
        }
        // Fetching the neighbor to the bottom for the next line
        
        // Setting new line of cells to create
        keyToDown = initialKey = S2.latLngToNeighborKeys(S2.keyToLatLng(initialKey).lat, S2.keyToLatLng(initialKey).lng, level)[0];
    }
    return polyLayers;
}

// Initializing for the first iteration
var cellslvl14 = new L.FeatureGroup();
var cellslvl17 = new L.FeatureGroup();

function checkLayer(layer, cellZoom, color, heightCells, widthCells) {
    
    if(map.getZoom() >= cellZoom) {
        if(layer == 14) {
            map.removeLayer(cellslvl14);
            cellslvl14 = new L.FeatureGroup();
            var layerCell = getCells(layer, color, heightCells, widthCells);
            for(let cell of layerCell) {
                cellslvl14.addLayer(cell);
            }
            map.addLayer(cellslvl14);
        } else if (layer == 17) {
            map.removeLayer(cellslvl17);
            cellslvl17 = new L.FeatureGroup();
            var layerCell = getCells(layer, color, heightCells, widthCells);
            for(let cell of layerCell) {
                cellslvl17.addLayer(cell);
            }
            map.addLayer(cellslvl17);
            cellslvl17.bringToBack();
        }
    } else {
        if(map.getZoom() < 14 && map.hasLayer(cellslvl14) ) {
            map.removeLayer(cellslvl14);
        }
        
        if(map.getZoom() < 17 && map.hasLayer(cellslvl17)) {
            map.removeLayer(cellslvl17);
        }
    }
}

// Initializing for the first iteration
var previousCoords = {
    lat : 0,
    lng : 0
};

/**
 * Function that checks if the map can set the layer of cells S2
 */
function checkMoved() {
    // checking first if the map was moved
    if(previousCoords.lat != map.getBounds().getNorthWest().lat || previousCoords.lng != map.getBounds().getNorthWest().lng) {
        checkLayer(14, 14, 'red', 18, 28);
        checkLayer(17, 16, 'green', 35, 55);
        previousCoords = map.getBounds().getNorthWest();
    }
}

var refreshIntervalId;

var animatedToggle = L.easyButton({
    id: 'animated-marker-toggle',
    //type: 'animate',
    states: [{
        stateName: 'add-markers',
        icon: '<img src="./images/grid.png" style="width:18px">',
        title: 'add some markers',
        onClick: function(control) {
            checkLayer(14, 14, 'red', 18, 28);
            checkLayer(17, 16, 'green', 35, 55);
            refreshIntervalId = setInterval(checkMoved, 1000);
            control.state('remove-markers');
        }
    }, {
        stateName: 'remove-markers',
        title: 'remove markers',
        icon: '<b>OFF</b>',
        onClick: function(control) {
            clearInterval(refreshIntervalId);
            map.removeLayer(cellslvl14);
            map.removeLayer(cellslvl17);
            control.state('add-markers');
        }
    }]
  });

  animatedToggle.addTo(map);


// Search option
var searchControl = new L.Control.Search( {
    position:'topright',
    layer: markers,
    initial: false,
    zoom: 17,
    marker: false,
    moveToLocation: function(latlng, title, map) {
        console.log(latlng);
          map.setView(latlng, 16);
    },
});

searchControl.on('search:locationfound', function(e) {
    e.layer.openPopup();

});

map.addControl( searchControl );

// Calling the function every second for the cells' mechanism
//setInterval(checkMoved, 1000);

// Prevent bug of on mobile
map.tap.disable();
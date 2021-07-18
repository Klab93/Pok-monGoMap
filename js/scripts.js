/**
 * @author AliceThunderWind
 * @file scripts.js
 * @brief Configuration of functionalities of the OpenStreetMap map
 */

 // --------------------------------------- Initializing ---------------------------------------

// Initializing the map
var map = L.map( 'map', {
    center: [46.655, 6.60],
    zoom: 9});

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



// --------------------------------------- Addons ---------------------------------------

// Cells mechanisms

function getCells(level, colour, boundUp, boundLeft) {
    var getCorner = map.getBounds().getNorthWest();

    var key = S2.latLngToKey(getCorner.lat, getCorner.lng, level);
    var key2 = S2.latLngToKey(getCorner.lat, getCorner.lng, level);

    var polyLayers = [];

    for(let i = 0; i < boundUp; ++i) {
        var neighbors;
        key2 = key;
        for(let j = 0; j < boundLeft; ++j) {
            var temp = S2.S2Cell.FromHilbertQuadKey(key2).getCornerLatLngs();

            polyLayers.push(new L.Polygon(temp, {
                color: colour,
                weight: 1,
                opacity: 1,
                smoothFactor: 0,
                fillOpacity: 0
            }));

            var test = S2.keyToLatLng(key2)

            neighbors = S2.latLngToNeighborKeys(test.lat, test.lng, level);
            
            key2 = neighbors[1];
        }
        var test2 = S2.keyToLatLng(key)
        neighbors = S2.latLngToNeighborKeys(test2.lat, test2.lng, level);
        key = neighbors[0];

    }

    return polyLayers;
}


var isLayered14 = false;
var isLayered17 = false;
var isCoordDifferent = false;
var previousCoords = {
    lat : 0,
    lng : 0
};
var cellslvl14 = new L.FeatureGroup();
var cellslvl17 = new L.FeatureGroup();


function checkZoom(layer, cellZoom, color, heightCells, widthCells, isCoordDifferent) {
    var tempBool = (cellZoom == 14) ? isLayered14 : isLayered17;

    if(map.getZoom() >= cellZoom) {
        if(layer == 14) {
            isLayered14 = true;
            map.removeLayer(cellslvl14);
            cellslvl14 = new L.FeatureGroup();
            var layerCell = getCells(layer, color, heightCells, widthCells);
            for(let cell of layerCell) {
                cellslvl14.addLayer(cell);
            }
            map.addLayer(cellslvl14);
        } else if (layer == 17) {
            isLayered17 = true;
            map.removeLayer(cellslvl17);
            cellslvl17 = new L.FeatureGroup();
            var layerCell = getCells(layer, color, heightCells, widthCells);
            for(let cell of layerCell) {
                cellslvl17.addLayer(cell);
            }
            map.addLayer(cellslvl17);
            cellslvl17.bringToBack()
        }

    } else if(map.getZoom() < cellZoom && tempBool ) {
        if(layer == 14) {
            isLayered14 = false;
            map.removeLayer(cellslvl14);
        } else if (layer == 17) {
            isLayered17 = false;
            map.removeLayer(cellslvl17);
        }
        
    }
}

function setLayer() {
    
    if(previousCoords.lat != map.getBounds().getNorthWest().lat || previousCoords.lng != map.getBounds().getNorthWest().lng) {

        checkZoom(14, 14, 'red', 15, 25);
        checkZoom(17, 16, 'green', 25, 50);

        previousCoords = map.getBounds().getNorthWest();
    }
}

// Fullscreen functionality
map.addControl(new L.Control.Fullscreen({
    position:'topright',		

}));

// Fonctionnalité des Clusters
var clusterGroup = L.markerClusterGroup( {
    disableClusteringAtZoom:16
});

function changeClustering() {
    if (map.getZoom() >= disableClusteringAtZoom) {
        clusterGroup.disableClustering(); // New method from sub-plugin.
    } else {
        clusterGroup.enableClustering(); // New method from sub-plugin.
    }
};

//On preset nos icônes
var MyOwnIcon = L.Icon.extend({
    options: {
        iconSize: [29, 29],
        iconAnchor: [9, 21],
        popupAnchor: [0, -14]
    }
});

var iconStop = new MyOwnIcon( {
iconUrl: 'images/map_marker_stop.png'}),
    iconGym = new MyOwnIcon( {
iconUrl: 'images/map_marker_default_01.png'}),
    iconEX = new MyOwnIcon({
iconUrl: 'images/map_marker_default_ex_03.png'});

//On crée le marqueur et lui attribue une popup
for ( i in markers ) {
    var marker, icon, tag;

    if(markers[i].type === "pokestop") {
        tag = ['pokestop'];
        icon = iconStop;
    } else if (markers[i].type === "gym") {
        tag = ['arene'];
        icon = iconGym;
    } else if (markers[i].type === "gymEX") {
        tag = ['areneEx'];
        icon = iconEX;
    }
    marker = new L.marker( [markers[i].lat, markers[i].lng], {name : markers[i].name, icon: icon, tags: tag} )

    marker.bindPopup( '<a href="http://www.openstreetmap.org/?mlat=' + markers[i].lat + '&mlon=' + markers[i].lng +'&zoom=16&#map=16/'
    + markers[i].lat + '/' + markers[i].lng + '" target="_blank">' + markers[i].name + '</a>' );
    clusterGroup.addLayer(marker);

}
map.addLayer(clusterGroup);

// Filter option
L.control.tagFilterButton({
        data: ['pokestop', 'arene','areneEx','none'],
        filterOnEveryClick: true
    }).addTo(map);



// search option
var controlSearch = new L.Control.Search({
    position:'topright',		
    layer: clusterGroup,
    initial: false,
    zoom: 12,
    marker: false
});

map.addControl( controlSearch );

setInterval(setLayer, 2000);
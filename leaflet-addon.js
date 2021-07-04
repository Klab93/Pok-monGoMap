
// On initialise la carte
var map = L.map( 'map', {
    center: [46.655, 6.60],
    maxZoom: 18,
    minZoom: 2,
    zoom: 9});

//On charge les "tuiles"
L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c']
}).addTo(map);


//Fonctionnalité du mode 'Plein écran'
map.addControl(new L.Control.Fullscreen());

map.on('fullscreenchange', function () {
    if (map.isFullscreen()) {
        console.log('entered fullscreen');
    } else {
        console.log('exited fullscreen');
    }
});

var group = L.markerClusterGroup({
    disableClusteringAtZoom:16
});

function changeClustering() {
    if (map.getZoom() >= disableClusteringAtZoom) {
        group.disableClustering(); // New method from sub-plugin.
    } else {
        group.enableClustering(); // New method from sub-plugin.
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

var myIcon = new MyOwnIcon( {
iconUrl: 'images/map_marker_stop.png'}),
    myIcon2 = new MyOwnIcon( {
iconUrl: 'images/map_marker_default_01.png'}),
    myIcon3 = new MyOwnIcon({
iconUrl: 'images/map_marker_default_ex_03.png'});

//On crée le marqueur et lui attribue une popup
for ( var i=0; i < markers.length; ++i ) {
    var test;
    if(markers[i].type === "pokestop") {
        test = L.marker( [markers[i].lat, markers[i].lng], {icon: myIcon, tags: ['pokestop']} )

    } else if (markers[i].type === "gym") {
        test = L.marker( [markers[i].lat, markers[i].lng], {icon: myIcon2, tags: ['arene']} )

    } else if (markers[i].type === "gymEX") {
        test = L.marker( [markers[i].lat, markers[i].lng], {icon: myIcon3, tags: ['areneEx']} )
    }
    test.bindPopup( '<a href="http://www.openstreetmap.org/?mlat=' + markers[i].lat + '&mlon=' + markers[i].lng +'&zoom=16&#map=16/'
    + markers[i].lat + '/' + markers[i].lng + '" target="_blank">' + markers[i].name + '</a>' );
    group.addLayer(test)
}
map.addLayer(group);

L.control.tagFilterButton({
        data: ['pokestop', 'arene','areneEx','none'],
        filterOnEveryClick: true
    }).addTo(map);
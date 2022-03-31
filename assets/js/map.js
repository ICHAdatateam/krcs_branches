
var OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom:5,
},);

var HumanitarianOSM =  L.tileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",{
    attribution: "&copy; OpenStreetMap contributors, <a href='http://hot.openstreetmap.org/'>Humanitarian OpenStreetMap Team</a>, <a href='redcross.org'>Red Cross</a>",
    minZoom:5,
},);



var map = L.map('map', {
    center: [0,39],
    zoom: 6,
    layers: [HumanitarianOSM, OpenStreetMap,]
});



var lc = L.control.locate().addTo(map);

// create an operational layer that is empty for now
let myLayer = L.layerGroup().addTo(map);

function addMyData (feature, layer) {
    myLayer.addLayer(layer)
};



// create an options object that specifies which function to call on each feature
let myLayerOptions = {
    onEachFeature: addMyData
};

function onEachRegion(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    })
    if (feature.properties) {
        var popupContent = '<table class="popup-table-1">\
        <tr class="popup-table-row-1">\
          <th class="popup-table-header-1">Region</th>\
          <td id="value-arc" class="popup-table-data-1">' + feature.properties.Region + '</td>\
        </tr>\
        <tr class="popup-table-row-1">\
          <th class="popup-table-header-1">Num of branches</th>\
          <td id="value-speed" class="popup-table-data-1">'+ feature.properties.NUM_BRANCHES +'</td>\
        </tr>\
        </table>';
        var customOptions = {
            'maxWidth': '180',
            'width': '180',}

        layer.bindPopup(popupContent,customOptions);
    };

}

let myStyle = {
    "fillColor": '#759e90',
    "fillOpacity": 0,
    "color": '#5902EC',
    "weight": 0.8,
};




let regionsLayer = L.geoJSON(krcs_regions,{style:myStyle, onEachFeature : onEachRegion}, myLayerOptions).addTo(map);

function onEachBranch(feature, layer) {
    // does this feature have a property named popupContent?

    if (feature.properties) {
        var popupContent = '<table class="popup-table">\
          <tr class="popup-table-row">\
            <th class="popup-table-header">Branch</th>\
            <td id="value-arc" class="popup-table-data">' + feature.properties.Location + '</td>\
          </tr>\
          <tr class="popup-table-row">\
            <th class="popup-table-header">Town</th>\
            <td id="value-speed" class="popup-table-data">'+ feature.properties.TOWN +'</td>\
          </tr>\
          <tr class="popup-table-row">\
            <th class="popup-table-header">County</th>\
            <td id="value-speed" class="popup-table-data">'+ feature.properties.COUNTY +'</td>\
          </tr>\
          <tr class="popup-table-row">\
            <th class="popup-table-header">Regional HQ</th>\
            <td id="value-speed" class="popup-table-data">'+ feature.properties.Regional_HQ +'</td>\
          </tr>\
          <tr class="popup-table-row">\
            <th class="popup-table-header">Region</th>\
            <td id="value-speed" class="popup-table-data">'+ feature.properties.REGION +'</td>\
          </tr>\
          <tr class="popup-table-row">\
            <th class="popup-table-header">Coordinator:</th>\
            <td id="value-speed" class="popup-table-data">' + feature.properties.COUNTY_COORDINATOR +'</td>\
          </tr>\
          <tr class="popup-table-row">\
            <th class="popup-table-header">Contact</th>\
            <td id="value-speed" class="popup-table-data">'+ feature.properties.PHONE +'</td>\
          </tr>\
          <tr class="popup-table-row">\
            <th class="popup-table-header">Email</th>\
            <td id="value-speed" class="popup-table-data">'+ feature.properties.EMAIL +'</td>\
          </tr>\
          <tr class="popup-table-row">\
            <th class="popup-table-header">Coords</th>\
            <td id="value-speed" class="popup-table-data">'+ feature.properties.lat +', '+ feature.properties.lng +'</td>\
          </tr>\
          <tr class="popup-table-row">\
            <th class="popup-table-header">Location</th>\
            <td id="value-speed" class="popup-table-data">'+ feature.properties.LOCATION_1 +'</td>\
          </tr>\
        </table>';
        var customOptions = {
            'maxWidth': '120px',
            'width': '120px',}

        layer.bindPopup(popupContent,customOptions);
    }
}

var Options = {
    radius: 6,
    fillColor: "#FF0000",
    color: "#FFF",
    weight: 3,
    opacity: 0.1,
    fillOpacity: 0.1
    };

var arcIcon = L.icon({
    iconUrl: 'assets/imgs/redCross.png',
    iconSize: [16],
});



let branchesLayer = L.geoJSON(krcs_branches, {
    pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {icon: arcIcon});},
    onEachFeature: onEachBranch
}).addTo(map);





map.addControl( new L.Control.Search({
    layer: branchesLayer,
    propertyName: 'Location',
    autoCollapse: true,
    zoom: 10,
    hideMarkerOnCollapse: true,}));


let info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // creates a div with a class "info"
    this.update();
    return this._div;
};
    
info.update = function (props) {
    this._div.innerHTML = '<b><p>Click on each icon to view details about each branch</p></b>'};

info.addTo(map)



function highlightFeature(e) {
    
    let layer = e.target;
    layer.setStyle({
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: 0
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
};

function resetHighlight (e) {
    regionsLayer.resetStyle(e.target);
    info.update();
};
let basemapControl = {
    "Humanitarian OSM": HumanitarianOSM,
    "OSM basemap": OpenStreetMap,
};


let overlayLayers = {
    'Regions': regionsLayer,
    'Branches': branchesLayer,
};

L.control.layers(basemapControl, overlayLayers).addTo(map)

let legend = L.control( {position: 'bottomright'});

legend.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'legend'); // creates a div with a class "legend"
    this.update();
    return this._div;
};
    
legend.update = function (props) {
    this._div.innerHTML = '<h6><b>Legend:</b></h6><p><img  src="assets/imgs/redCross.png"/>Branches</p>'+ '<p> <i style="border:' +'2px solid '+ '#5902EC' + '"></i> Regions </p'
};
    
legend.addTo(map)
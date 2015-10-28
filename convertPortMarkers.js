/* 
Retrieves ports XML file, spits out GeoJSON file.
Not a server.
*/

var http = require('http');
var xml2json = require('xml2json');
var entities = require('entities');

function portMarkersToGeoJSON(markers) {
    var g = {
        type: "FeatureCollection",
        features: []
    };
    markers.forEach(function(m) {
        //console.log(JSON.stringify(m));
        g.features.push({
            type: "Feature",
            properties: {
                name: m.label,
                description: entities.decodeHTML(m.$t),
                'marker-color': '#393',
                'marker-size': 'medium',
                'marker-symbol': 'harbor'

            },
            geometry: {
                type: "Point",
                coordinates: [ Number(m.lng), Number(m.lat)]
            }
        });
    });
    return g;
}

function getPorts() {
   var req = http.request({
            hostname: 'www.portsaustralia.com.au',
            path: '/locations',
            port:80,
            method:'GET'

        }, 
    function(res) {
        var data='';
        res.setEncoding('utf8');
        res.on('data', function (chunk) { 
            data += chunk;
        });
        res.on('end', function() {
            var j = xml2json.toJson(data, { object: true });
            //console.log(JSON.stringify(j));
            //portMarkersToGeoJSON(j.markers.marker);
            console.log(JSON.stringify(portMarkersToGeoJSON(j.markers.marker)));
        });
    });
    req.end();

}

getPorts();
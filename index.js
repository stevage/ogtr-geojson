var http = require('http');
var xml2json = require('xml2json');

function markersToGeoJSON(markers) {
    var g = {
        type: "FeatureCollection",
        features: []
    };
    markers.forEach(function(m) {
        g.features.push({
            type: "Feature",
            properties: {
                name: '#' + m.site + ' ' + m.licence + ' (' + m.organism + ')',
                description: m.holder + '. <br/><br/>' + 
                             'Trait: ' + m.trait + '<br/>' +
                             'Status: ' + m.status,
                'marker-color': (m.status === 'PHM' ? 'hsl(10,80%,60%)' : 'hsl(60,80%,60%)'),
                'marker-size': 'medium',
                'marker-symbol': 'garden'

            },
            geometry: {
                type: "Point",
                coordinates: [ Number(m.lng), Number(m.lat)]
            }
        });
    });
    return g;
}

var server = http.createServer(function(request, response) {

    var req = http.request({
            hostname: 'www.ogtr.gov.au',
            path: '/internet/ogtr/publishing.nsf/XML/mapdata.xml',
            port:80,
            method:'GET'

        }, function(res) {
        var data='';
        res.setEncoding('utf8');
        res.on('data', function (chunk) { 
            data += chunk;
        });
        res.on('end', function() {
            var j = xml2json.toJson(data, { object: true });
            console.log(j.markers.marker.length + " markers");
            response.writeHead(200, {
                "Content-Type": "text-json",
                "Access-Control-Allow-Origin": "*"
            });
    
            response.write(JSON.stringify(markersToGeoJSON(j.markers.marker)));
            response.end();
        });
    });
    req.end();

});

server.listen(6001);
console.log("OGTR site conversion service listening on port 6001!");
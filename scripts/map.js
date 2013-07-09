$(function(){
    var map = L.map('map').setView([51.053515,3.731266], 16);
    
    L.tileLayer('http://{s}.tile.cloudmade.com/afc69fb2d6c141be80f34cb6e00099d7/101830/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(map);
    
    var marker = L.marker([51.053515,3.731266]).addTo(map);
    marker.bindPopup("<b>AC Portus</b><br>Needs some green.").openPopup();
    marker.on('click', function(e) {
        map.setView(e.latlng, 16);
    });
});


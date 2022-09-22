export default{

    display_map(locations){
        var locations = locations;
        var map;
        var markers = []; // Create a marker array to hold your markers

        function setMarkers(locations) {
            for (let i = 0; i < locations.length; i++) {
              const placeID  = locations[i].id;
              const str = locations[i].longlat;
              const arr = str.split(',');
             let iconPhoto = '/upload/' + locations[i].marker_icon
              if(iconPhoto == null || iconPhoto == '/upload/image.png'){
                iconPhoto = '/upload/marker.png';
              }
              
    
              const icon = {
                url: iconPhoto, // url
                scaledSize: new google.maps.Size(50, 50), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
            };
    
    
              const marker = new google.maps.Marker({
                position: new google.maps.LatLng(arr[0], arr[1]),
                map: map,
                title: locations[i].title,
                address: locations[i].address,
                icon: icon,
                placeID:  locations[i].id
              });
      
              markers.push(marker);
            }
        }

        function reloadMarkers() {

          // Loop through markers and set map to null for each
          for (var i=0; i<markers.length; i++) {
      
              markers[i].setMap(null);
          }
      
          // Reset the markers array
          markers = [];
      
          // Call set markers to re-add markers
          setMarkers(locations);
      }

      function initialize(lat, long, $refs ) {
      
        map = new google.maps.Map($refs, {
            zoom: 15,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

          setMarkers(locations);

    // Bind event listener on button to reload markers
   
      }
         
        initialize();
    }
}
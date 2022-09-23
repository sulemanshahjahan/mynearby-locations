import store from '../store/index.js';

export default{


    initialize(lat, long, $refs, dealers){
      alert(dealers);
      const maps = new google.maps.Map($refs, {
        zoom: 15,
        center: new google.maps.LatLng(lat, long),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      

      if(dealers == 'new'){
        var marker = new google.maps.Marker(
          {
            position: new google.maps.LatLng(lat, long),
            tite:'hello',
            map: maps,
            draggable: true
          });

          google.maps.event.addListener(marker, 'dragend', function(marker) {
            var latLng = marker.latLng;
            
       

            const longlatput = $("input[name='longlat']");

        // Set value
        longlatput.val(latLng.lat() + ', ' + latLng.lng());

        // Create native event
        const longlatevent = new Event('input', { bubbles: true });

        // Dispatch the event on "native" element
        longlatput.get(0).dispatchEvent(longlatevent);
          
                 
          });
      } else{
        this.setMarkers(dealers, maps);
      }
      
// Bind event listener on button to reload markers
    },

    setMarkers(locations, maps) {
              
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
          map: maps,
          title: locations[i].title,
          address: locations[i].address,
          draggable:true,
          icon: icon,
          animation: google.maps.Animation.DROP,
          placeID:  locations[i].id
        });
        const place = locations[i];
        google.maps.event.addListener(marker, 'click', (function(marker, placeID) {
          return function() {
              infowindow.setContent(`<div class="ui header">${place.title}</div>
              <p style="color:black;">${place.address}</p> <br>
              <a href="${place.website}" target="_blank">${place.website}</a>`);
              infowindow.open(maps, marker);

              jQuery('div[data-id=dealer-'+placeID+']').trigger('click');
          }
      })(marker, placeID));

      // Push the marker to the 'markers' array
      gmarkers[placeID] = marker
      store.dispatch('createMarker', marker)
      //this.markers.push(marker); 
     
     


      }

}
}
import store from '../store/index.js';
  var origLat;
  var origLng;
  var $ref;
  var $dealers;
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var maps;
export default{

    initialize(lat, long, $refs, dealers){
      this.origLat = lat;
      this.origLng = long;
      this.$ref = $refs;
      this.$dealers = dealers;
      maps = new google.maps.Map($refs, {
        zoom: 13,
        animation: google.maps.Animation.DROP,
        styles: [
          {
              "featureType": "all",
              "elementType": "geometry",
              "stylers": [
                  {
                      "color": "#202c3e"
                  }
              ]
          },
          {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [
                  {
                      "gamma": 0.01
                  },
                  {
                      "lightness": 20
                  },
                  {
                      "weight": "1.39"
                  },
                  {
                      "color": "#ffffff"
                  }
              ]
          },
          {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": [
                  {
                      "weight": "0.96"
                  },
                  {
                      "saturation": "9"
                  },
                  {
                      "visibility": "on"
                  },
                  {
                      "color": "#000000"
                  }
              ]
          },
          {
              "featureType": "all",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "landscape",
              "elementType": "geometry",
              "stylers": [
                  {
                      "lightness": 30
                  },
                  {
                      "saturation": "9"
                  },
                  {
                      "color": "#29446b"
                  }
              ]
          },
          {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                  {
                      "saturation": 20
                  }
              ]
          },
          {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                  {
                      "lightness": 20
                  },
                  {
                      "saturation": -20
                  }
              ]
          },
          {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                  {
                      "lightness": 10
                  },
                  {
                      "saturation": -30
                  }
              ]
          },
          {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [
                  {
                      "color": "#193a55"
                  }
              ]
          },
          {
              "featureType": "road",
              "elementType": "geometry.stroke",
              "stylers": [
                  {
                      "saturation": 25
                  },
                  {
                      "lightness": 25
                  },
                  {
                      "weight": "0.01"
                  }
              ]
          },
          {
              "featureType": "water",
              "elementType": "all",
              "stylers": [
                  {
                      "lightness": -20
                  }
              ]
          }
      ],
          
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
          anchor: new google.maps.Point(14, 36) // anchor
      };


        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(arr[0], arr[1]),
          map: maps,
          title: locations[i].title,
          address: locations[i].address,
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

              if(directionsDisplay.map != null && directionsDisplay.directions.status == 'OK'){

                directionsDisplay.setMap(null);
              }
              

              jQuery('div[data-id=dealer-'+placeID+'] .view-on-map').trigger('click');
             
          }

          
      })(marker, placeID));

      // Push the marker to the 'markers' array
      gmarkers[placeID] = marker
      store.dispatch('createMarker', marker)
      //this.markers.push(marker); 
     
     


      }

},
showDistance(dealer){
  const str = dealer.longlat;
        const arr = str.split(',');
  directionsService.route({
    origin: { lat: parseFloat(this.origLat), lng:  parseFloat(this.origLng) },
    destination: { lat: parseFloat(arr[0]), lng:parseFloat(arr[1]) },
    travelMode: 'DRIVING'
  }, function (response, status) {
    if (status === 'OK') {
 
      jQuery('#distance-text').html(response.routes[0].legs[0].distance.text);
     
      jQuery('#duration-text').html(response.routes[0].legs[0].duration.text);
      directionsDisplay.setDirections(response);
      directionsDisplay.setMap(maps);
      jQuery('.route_details').fadeIn('slow');
      infowindow.close();
      $('.error_route').hide();
      $('.success_route').fadeIn();
     
    } else {
      directionsDisplay.setDirections(null);
              directionsDisplay.setMap(null);
      jQuery('.route_details').fadeIn('slow');
      $('.success_route').hide();
      $('.error_route').fadeIn();
    }
  });
  
}
}
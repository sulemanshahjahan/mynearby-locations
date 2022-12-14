var XmlFeedGrabber = {
	
  options: {
    feedUrl: "http://localhost:8000/api/get_all_locations?api_token=DrBpXs0VkSPKD6tQCEyMtMGMOwomdYfXgxpWWQlovkAaJuZWaNNpgSpuoG7C&company_id=1",
    itemsCount: 5,
    targetId: "xml-grabber",
    openInNewWindow: true,
    showMedia: true,
    showDescription: false,
    currentTheme: "",
            loaderUrl: "http://localhost/widgets/loading.gif",
	lat: '',
	lng: '',
	locations: [],
	categories: [],
	markers: [], 
	gmarkers: [],
},
targetHtmlEle: "",
messages: {
    missingTargetId: "please specify element target id",
    missingTargetHtml: "not found html element with the specified id",
    missingFeedUrl: "please specify your xml feed url",
    errorFetchingData: "Error reading data from the remote url"
},
    themes: {
    },
    setOptions: function(options) {
    if(options.feedUrl) {
        this.options.feedUrl = options.feedUrl;
    }
    if(options.itemsCount) {
        this.options.itemsCount = options.itemsCount;
    }
    if(options.targetId) {
        this.options.targetId = options.targetId;
    }
    if(options.openInNewWindow) {
        this.options.openInNewWindow = options.openInNewWindow;
    }
    if(options.showMedia) {
        this.options.showMedia = options.showMedia;
    }
    if(options.showDescription) {
        this.options.showDescription = options.showDescription;
    }
    if(options.currentTheme && this.themes[options.currentTheme] != undefined) {
        this.options.currentTheme = this.themes[options.currentTheme];
    }

            if(options.loaderUrl) {
        this.options.loaderUrl = options.loaderUrl;
    }
},
  setOptions: function(options) {
  },
  validate: function () {
    
    if(!this.options.targetId) {
      console.log(this.messages.missingTargetId);
      return false;
  }
  if(!this.options.feedUrl) {
      console.log(this.messages.missingFeedUrl);
      return false;
  }
  this.targetHtmlEle = document.getElementById(this.options.targetId);
  if(!this.targetHtmlEle) {
      console.log(this.messages.missingTargetHtml);
      return false;
  }
  return true;
  },
  render: function() {
    var self = this;
        if(!this.validate()) {
            return;
        }
                
                // show loader
        self.targetHtmlEle.innerHTML = '<img class="xml-grabber-loader" src="'+ this.options.loaderUrl +'" />';
        // apply styling
        self.applyCss();
        // fetch data
        this.fetch(function(response) {
		var dataFromCurl = JSON.parse(response);
		
		

               self.targetHtmlEle.innerHTML = self.template(dataFromCurl);
				
			self.creatMap();
			
        });

       
    },
    fetch: function(callback) {
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else {
            var xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.addEventListener("readystatechange", function () {
              if (this.readyState === 4 && this.status === 200) {
                callback(this.responseText);
              }
        });
        var params = "check="+ encodeURIComponent(this.options.gluglu);
        xhr.open("POST", "http://localhost/widgets/fetch.php");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("dataType", "application/json");
        xhr.send(params);
  },
  creatMap(){
	  var autcompleted = document.getElementById('autocomplete');
	  const autocomplete = new google.maps.places.Autocomplete(
                autcompleted,
                {
                    bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(45.4215296, -75.6971931)
                )
                }
            );
        
            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                this.address = place.formatted_address;
                this.lat = place.geometry.location.lat();
                this.lng = place.geometry.location.lng();
				alert(this.lat);
            });
			this.locatorButtonPressed();
			
  },
  template: function(response) {
	  var locations = JSON.parse(response[0]);
	  var categories = JSON.parse(response[1]);
    var self = this;
	self.locations = locations['locations'];
	self.categories = categories['categories'];
		var html = `      <div class="ui segment">
        <div class="field">
          <div class="ui right icon input large padding0" :class="{loading:spinner}">
            <input
              type="text"
              placeholder="Enter your address"
              
              id="autocomplete"
            />
            <i class="dot circle link icon" @click="locatorButtonPressed"></i>
          </div>
        </div>

        <div class="field">
          <div class="two fields">
            <div class="field">
              <select v-model="category_type">
                <option disabled value="0">Select Type</option>`;
				
				self.categories.forEach(function(category) {
            html += `<option>${category.name}</option>`;
        });
                
              html += `</select>
              </div>
              <div class="field">
              <select v-model="radius">
                <option disabled value="900">Select Distance</option>
                <option value="1000">1 KM</option>
                <option value="2000">2 KM</option>
                <option value="3000">3 KM</option>
                <option value="4000">4 KM</option>
                <option value="5000">5 KM</option>
                <option value="7000">7 KM</option>
                <option value="10000">10 KM</option>
              </select>
            </div>

           
          </div>
        </div>

        <button class="ui button full-width" onclick="XmlFeedGrabber.find_closest_markers();">Find Nearby</button>
      </div>`;

         html += '<div class="locations">';
        locations['locations'].forEach(function(dealer) {
            html += `<div class="content item">
            
            <div class="custom-location-text">
            <div class="header"><h2>${dealer.title}</h2></div>
            <p class="meta"><i class="fa fa-location" aria-hidden="true"></i> ${dealer.address}</p>
           
            <p class="meta"><i class="fa fa-envelope" aria-hidden="true"></i> ${dealer.email}</p>
          </div>
          <div class="dealer-buttons">
            <button class="ui button view-on-map"  on-click="showInfoWindow(dealer.id)">View On Map</button>
            <button class="ui button"  on-click="getDirection(dealer, dealer.id, dealer.address)">Get Directions</button>
            <button class="ui button" >Contact </button>
          </div>
        
          </div>  `;
        });
        html += '</div>';
		
		html += '<div class="map_holder">';
		html += '<div id="map"></div>';
		html += '</div>';
		
        return html;
		
    },
    applyCss: function() {
        if(this.options.currentTheme == "") {
            this.options.currentTheme = this.themes["default"];
        }
        var rules = "ul.xml-grabber-items { list-style-type: none; }";
        rules += "#xml-grabber { border: 1px solid #908787; border-radius: 7px; background: " + this.options.currentTheme.background + "; }"
        rules += "li.xml-grabber-item { margin-bottom: 48px; border-bottom: 1px solid #ccc; }";
        rules += "li.xml-grabber-item a { text-decoration: none; }";
        rules += "li.xml-grabber-item img { border: 3px solid " + this.options.currentTheme.imgBorderColor + "; }";
        rules += ".xml-grabber-title { vertical-align: top; margin-left: 8px; color: " + this.options.currentTheme.titleColor + "; font-family: sans-serif; font-weight: bold; }";
        rules += ".xml-grabber-description { font-size: 15px; font-family: sans-serif; color: " + this.options.currentTheme.descriptionColor + " }";
        rules += ".xml-grapper-date { color: " + this.options.currentTheme.dateColor + "; font-size: 11px; display: block; }";
        var styleTag = document.createElement('style');
          
          styleTag.type = 'text/css';
          
          styleTag.appendChild(document.createTextNode(rules));
          
          document.head.appendChild(styleTag);
  },
  applyCss: function() {
  },
  locatorButtonPressed() {
                this.spinner = true;

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                    position => {
                        this.lat = position.coords.latitude;
                        this.lng = position.coords.longitude;

                        this.getAddressFrom(
                        position.coords.latitude,
                        position.coords.longitude
                        );
						
						  this.initialize( position.coords.latitude, 
                        position.coords.longitude, map, this.locations);	
                       
                    },
                    error => {
                        this.error =
                        "Locator is unable to find your address. Please type your address manually.";
                        this.spinner = false;
                        // console.log(error.message);
                    }
                    );
                } else {
                    this.error = error.message;
                    this.spinner = false;
                    console.log("Your browser does not support geolocation API ");
                }
            },
            getAddressFrom(lat, long) {
				
				
				
					fetch(`http://localhost/widgets/googleAPI.php`, {
						mode: 'cors',
					  method: 'GET', // or 'PUT'
					  headers: {
						'Content-Type': 'application/json',
					  }
					})
					  .then((response) => response.json())
					  .then((data) => {
						  data = JSON.parse(data[0]);
						  data = data['results'][0].formatted_address;
						  document.getElementById('autocomplete').value = data;
					  })
					  .catch((error) => {
						console.error('Error:', error);
					  });
				
               
            },
            find_closest_markers(){
				
     
                if(!this.locations){
                    this.locations = 0;
                }
				
                var state_markers = this.options.markers;
                var markers_distances = [];
                var newLocations = [];
      for (let i = 0; i < state_markers.length; i++) {
        
          var d = google.maps.geometry.spherical.computeDistanceBetween(state_markers[i].position, new google.maps.LatLng(this.lat, this.lng));
          markers_distances[i] = {
              distance: d, 
              marker: state_markers[i]
          }
         // console.log( markers_distances[i]);
      }
       // console.log(markers_distances.sort((a, b) => {return a.distance-b.distance}));
      var closest_markers = markers_distances.sort((a, b) => {return a.distance-b.distance})
    
      
            closest_markers.map((item, index) => {
               
              if(item.distance < 5000){
                  
                    newLocations.push(item.marker.placeID);
                    
                    console.log(item.marker);
              }else{
                //$(".header:contains('"+ item.marker.title +"')").parents('.item').remove();
                //item.marker.setMap(null);
              }
              
            })

            const $idArray = newLocations.join('-');    
			
      const URL = `http://localhost/widgets/nearbyLoc.php?arrr=${$idArray}`;
   
      
        fetch(URL, {
						mode: 'cors',
					  method: 'GET', // or 'PUT'
					  headers: {
						'Content-Type': 'application/json',
					  }
					})
					  .then((response) => response.json())
					  .then((data) => {
						  console.log(JSON.parse(data[0]));
					  })
					  .catch((error) => {
						console.error('Error:', error);
					  });
		},
		initialize(lat, long, $refs, dealers){
      this.origLat = lat;
      this.origLng = long;
      this.$ref = $refs;
      this.$dealers = dealers;
      maps = new google.maps.Map( document.getElementById('map'), {
        zoom: 13,
        animation: google.maps.Animation.DROP,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.BOTTOM_CENTER,
        },
      fullscreenControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM,
      },
          
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
  //     let iconPhoto = '/upload/' + locations[i].marker_icon
    //    if(iconPhoto == null || iconPhoto == '/upload/image.png'){
          //iconPhoto = '/upload/marker.png';
      //  }
        

        const icon = {
          //url: iconPhoto, // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(14, 36) // anchor
      };


        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(arr[0], arr[1]),
          map: maps,
          title: locations[i].title,
          address: locations[i].address,

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
      //this.gmarkers[placeID] = marker
      this.options.markers.push(marker);
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
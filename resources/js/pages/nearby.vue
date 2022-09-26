<template>
    <div class="ui grid">
      <div class="six wide column locater">
        <form class="ui segment large form" @submit.prevent="findCloseBuyButtonPressed">
          <div class="ui message red" v-show="error">{{error}}</div>
          <div class="ui segment">
            <div class="field">
              <div class="ui right icon input large" :class="{loading:spinner}">
                <input
                  type="text"
                  placeholder="Enter your address"
                  v-model="address"
                  ref="autocomplete"
                />
                <i class="dot circle link icon" @click="locatorButtonPressed"></i>
              </div>
            </div>
  
            <div class="field">
              <div class="two fields">
                <div class="field">
                  <select v-model="type" @change="resetMarkers">
                    <option value="Marines">Marines</option>
                    <option value="posts">Restaurants</option>
                  </select>
                </div>
  
               
              </div>
            </div>
  
            <button class="ui button" >Find CloseBuy Places</button>
          </div>
        </form>
  
        <div class="ui segment list-holder">
          <div class="ui divided items">
            <div
              class="item"
              v-for="(place, index) in places"
              :key="place.id"
              @click="showInfoWindow(index)"
              :class="{'active' : activeIndex === index}"
              style="padding:10px;"
            >
              <div class="content">
                <div class="header">{{place.name}}</div>
                <div class="meta">{{place.vicinity}}</div>
                <div class="placeID hidden">{{place.place_id}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ten wide column map-holder" ref="map"></div>
    </div>
  </template>
  
  
  <script>
  import axios from "axios";

  
  export default {
    name: "FindNearBy",
    data() {
      return {
        address: "",
        error: "",
        spinner: false,
        apiKey: "AIzaSyC7n8dM5sU7EeMwfITFTaM1pRb3lUD1_gM",
        lat: 0,
        lng: 0,
        type: "",
        radius: "",
        places: [],
        markers: [],
        activeIndex: -1
      };
    },
  
    mounted() {
      const autocomplete = new google.maps.places.Autocomplete(
        this.$refs["autocomplete"],
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
      });
    },
  
    methods: {
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
        const url = `/api/nearby/?lat=${lat}&long=${long}`;
        axios
          .get(url)
          .then(response => {
            if (response.data.error_message) {
              this.error = response.data.error_message;
              console.log(response.data.error_message);
            } else {
              this.address = response.data.results[0].formatted_address;
              // console.log(response.data.results[0].formatted_address);
            }
            this.spinner = false;
          })
          .catch(error => {
            this.error = error.message;
            this.spinner = false;
            console.log(error.message);
          });
      },
      findCloseBuyButtonPressed() {
        this.resetMarkers();
  
        const URL = `https://shah-birds.herokuapp.com/${this.type}`;
  
        return axios
          .get(URL)
          .then(response => {
            this.places = response.data;
            this.showPlacesOnMap( this.places);
            
          })
          .catch(error => {
            this.error = error.message;
          });
      },
      showPlacesOnMap(index) {
      
        const map = new google.maps.Map(this.$refs["map"], {
          zoom: 15,
          center: new google.maps.LatLng(this.lat, this.lng),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        const infoWindow = new google.maps.InfoWindow();
  
        for (let i = 0; i < index.length; i++) {
          const lat = this.places[i].geometry.location.lat;
          const lng = this.places[i].geometry.location.lng;
          const placeID  = this.places[i].place_id;
         
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
            title: this.places[i].name,
            placeID:  this.places[i].place_id
          });
  
          this.markers.push(marker);
         
          google.maps.event.addListener(marker, "click", async () => {
          
         
            const URL = `https://shah-birds.herokuapp.com/${this.type}?place_id=${placeID}`;
          
            try {
  const response = await axios
  .get(URL);
  if (response.data.error_message) {
  this.error = response.data.error_message;
  
  } else {
  const place = response.data[0];
  
  infoWindow.setContent(
  `<div class="ui header">${place.name}</div>
                    ${place.vicinity} <br>
                    
                    <a href="${place.website}" target="_blank">${place.website}</a>
                    
                    
                    `
  );
  infoWindow.open(map, marker);
  }
  } catch (error) {
  this.error = error.message;
  }
          });
        }
        google.maps.event.addListener(map, 'click', this.find_closest_markers(map, this.markers));
      },
  
      showInfoWindow(index) {
        this.activeIndex = index;
        console.log(this.markers[index]);
        new google.maps.event.trigger(this.markers[index], "click");
      },
      resetMarkers(){
        
       this.markers= [];
       
      },
      find_closest_markers(event, markers , n = 12) {
    
      var markers_distances = [];
      var newLocations = [];
      for (let i = 0; i < markers.length; i++) {
        
          var d = google.maps.geometry.spherical.computeDistanceBetween(markers[i].position, new google.maps.LatLng(this.lat, this.lng));
          markers_distances[i] = {
              distance: d, 
              marker: markers[i]
          }
         // console.log( markers_distances[i]);
      }
        console.log(markers_distances.sort((a, b) => {return a.distance-b.distance}));
      var closest_markers = markers_distances.sort((a, b) => {return a.distance-b.distance}).slice(0,n)
     
          this.resetMarkers();
            closest_markers.map((item, index) => {
              console.log(item.distance);
              if(item.distance < 5000){
                  if(index > 0){
                    newLocations.push('place_id='+item.marker.placeID);
                  }else{
                    newLocations.push(item.marker.placeID);
                  }
                  
                
               
              }else{
                //$(".header:contains('"+ item.marker.title +"')").parents('.item').remove();
                //item.marker.setMap(null);
              }
            })
            var newArr = newLocations.join(',').replace(/,/g, '&').split();
  
            console.log('New Locations ID: ' + newArr);
  
            const URL = `https://shah-birds.herokuapp.com/${this.type}?place_id=${newArr}`;
           
         axios
          .get(URL)
          .then(response => {
          //console.log(response.data);
            this.places = response.data;
  
            const map = new google.maps.Map(this.$refs["map"], {
          zoom: 15,
          center: new google.maps.LatLng(this.lat, this.lng),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
  
        const infoWindow = new google.maps.InfoWindow();
  
        for (let i = 0; i < this.places.length; i++) {
          const lat = this.places[i].geometry.location.lat;
          const lng = this.places[i].geometry.location.lng;
          const placeID  = this.places[i].place_id;
         
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
            title: this.places[i].name,
            placeID:  this.places[i].place_id
          });
  
          this.markers.push(marker);
         
          google.maps.event.addListener(marker, "click", async () => {
  
            const URL = `https://shah-birds.herokuapp.com/${this.type}?place_id=${placeID}`;
          
            try {
  const response = await axios
  .get(URL);
  if (response.data.error_message) {
  this.error = response.data.error_message;
  
  } else {
  const place = response.data[0];
  
  infoWindow.setContent(
  `<div class="ui header">${place.name}</div>
                    ${place.vicinity} <br>
                    
                    <a href="${place.website}" target="_blank">${place.website}</a>
                    
                    
                    `
  );
  infoWindow.open(map, marker);
  }
  } catch (error) {
  this.error = error.message;
  }
          });
        }
            
          })
          .catch(error => {
            this.error = error.message;
          });
       
     
  }
    }
  };
  </script>
  
  
  <style>
  .ui.button,
  .dot.circle.icon {
    background-color: #ff5a5f;
    color: white;
  }
  
  .pac-icon {
    display: none;
  }
  
  .pac-item {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .pac-item:hover {
    background-color: #ececec;
  }
  
  .pac-item-query {
    font-size: 16px;
  }
 
  .list-holder{
    max-height:500px;overflow:auto; 
  }
  @media(max-width:767px){
    .ui.grid>.column.locater{
      width:100%  !important;
    }
    .list-holder{
      height:250px;
    }
    .align-right{
      margin-top:0;
    }
    .ui.grid>.column.map-holder{
      width:100% !important;
      height:250px;
    }
    li.nav-item{
      display:inline-block;
    }
    
  }
  </style>
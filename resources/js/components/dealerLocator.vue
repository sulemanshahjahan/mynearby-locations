<template>
        <div class="row">
            <div class="col">
              <form class="ui segment large form" @submit.prevent="findCloseBuyButtonPressed(markers)">
          <div class="ui segment">
            <div class="field">
              <div class="ui right icon input large padding0" :class="{loading:spinner}">
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
                  <select >
                    <option value="Marines">Marines</option>
                    <option value="posts">Restaurants</option>
                  </select>
                </div>
  
               
              </div>
            </div>
  
            <button class="ui button" >Find CloseBuy Places</button>
          </div>
        </form>

            <div class="locations" v-if="locations && locations.length > 0">
             <dealerCards  class="item"
              v-for="(dealer, index) in locations"
              :key="dealer.id"
              @click="showInfoWindow(index)"
              :class="{'active' : activeIndex === index}"
              style="padding:10px;" :dealer="dealer"></dealerCards>
              </div>
            <div class="noLocMessage" v-else>
                <h4>No dealers available at this location.</h4>
            </div>
            </div>
            <div class="col-9">
                <div class="ten wide column map-holder" ref="map"></div>
            </div>
        </div>
</template>
<style scoped>
  .noLocMessage{
    background-color: white;
    color:#111;
    padding:20px;
    text-align:center;
  }
    .padding0{
        padding:0;
    }
</style>

<script>
import axios from 'axios';
import { onUpdated } from 'vue';
import dealerCards from './locations/dealerCard.vue';

    export default{
        components:{
            dealerCards
        },
        data(){
          return {
            spinner: false,
            title: '',
            address: '',
            email: '',
            photo: '',
            website: '',
            phone: '',
            apiKey: "AIzaSyC7n8dM5sU7EeMwfITFTaM1pRb3lUD1_gM",
            locations: [],
            totalLocations: 0,
            lat:0,
            lng: 0,
            markers: [],
        activeIndex: -1

          }  
        },
        beforeRouteEnter(routeTo, routeFrom, next) {
            axios.get('/api/get_all_locations')
    .then(response => {
      next(comp => {
        comp.locations = response.data.locations
        comp.totalLocations = response.headers['x-total-count'];
      })
    })
    .catch(error => {
        if (error.response && error.response.status == 404) {
          next({ name: '404Resource', params: { resource: 'pair' } })
        } else {
         next({ name: 'NetworkError' })
        }
      })
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
      this.getLocationNoPermission();
      

    },
        methods:{
            getLocationNoPermission(){
                 axios.get('/api/no_permission_location')
                .then((response) => {
                    const curaddress = response.data.city + ' ' + response.data.state + ' ' + response.data.country_name;
                    this.address = curaddress; 
                    this.lat = response.data.latitude;
                    this.lng = response.data.longitude;
                    this.getAddressFrom(
                        parseFloat(response.data.latitude),
                        parseFloat(response.data.longitude),
              );
              this.showPlacesOnMap(
                parseFloat(response.data.latitude),
                        parseFloat(response.data.longitude),
                );
                })
                .catch((error)=>{
                    console.log(error)
                })
                
                
            },  
            locatorButtonPressed(){
             
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
              this.showPlacesOnMap(
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
            findCloseBuyButtonPressed(markers, n = 12) {
              
              this.getAllLocations();
            
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
     
          
            closest_markers.map((item, index) => {
              if(item.distance < 5000){
                  
                    newLocations.push(item.marker.placeID);
              }else{
                //$(".header:contains('"+ item.marker.title +"')").parents('.item').remove();
                //item.marker.setMap(null);
              }
              
            })

       const $idArray = newLocations.join('-');    
      
        const URL = `/api/get_close_locations/${$idArray}`;
        return axios
          .get(URL)
          .then(response => {

            this.locations = response.data.location;
            this.showPlacesOnMap(this.lat, this.lng, this.location);
            
          })
          .catch(error => {
            this.error = error.message;
          });
      },
      resetMarkers(){
        
        this.markers= [];
        
       },
       getAllLocations (){
        this.locations = [];
        
         axios.get('/api/get_all_locations')
    .then(response => {
      console.log(response.data.locations);
      this.locations = response.data.locations;
    })
    .catch(error => {
        if (error.response && error.response.status == 404) {
          return({ name: '404Resource', params: { resource: 'pair' } })
        } else {
         return ({ name: 'NetworkError' })
        }
      })
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
        showPlacesOnMap(lat, long, index){

          this.markers = [];

            const map = new google.maps.Map(this.$refs["map"], {
          zoom: 11,
          center: new google.maps.LatLng(lat, long),
          disableDefaultUI: true,
          mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.BOTTOM_CENTER,
    },
	fullscreenControlOptions: {
		  position: google.maps.ControlPosition.LEFT_BOTTOM,
	},
      
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        const infoWindow = new google.maps.InfoWindow();
  
        for (let i = 0; i < this.locations.length; i++) {
          const placeID  = this.locations[i].id;
          const str = this.locations[i].longlat;
          const arr = str.split(',');
         let iconPhoto = '/upload/' + this.locations[i].marker_icon
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
            title: this.locations[i].title,
            icon: icon,
            placeID:  this.locations[i].id
          });
  
          this.markers.push(marker);
          
          google.maps.event.addListener(marker, "click", async () => {
          
         
            const URL = `/api/get_single_location/${placeID}`;
           
            try {
  const response = await axios
  .get(URL);
  if (response.data.error_message) {
  this.error = response.data.error_message;
  
  } else {

console.log(response.data);
  const place = response.data.location;
  infoWindow.setContent(
                  `<div class="ui header">${place.title}</div>
                    ${place.address} <br>
                    <a href="${place.website}" target="_blank">${place.website}</a>`
          );
          infoWindow.open(map, marker);
          }
          } catch (error) {
          this.error = error.message;
          }
          });
        }

        },
        showInfoWindow(index) {
        this.activeIndex = index;
        console.log( this.markers[index].title);
        new google.maps.event.trigger(this.markers[index], "click");
      }
        }
    }
</script>
<style scoped>
    .map-holder{
        min-height: 700px;
    }
</style>
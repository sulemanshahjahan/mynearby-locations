<template>
    <div class="row">
        <div class="col">
          <form class="ui segment large form" @submit.prevent="find_closest_markers">
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

<script>
import ApiCall from '../services/APICalls.js';
import Maps from '../services/Maps.js';

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
            ApiCall.get_all_locations()
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
        methods: {
            getLocationNoPermission(){
                ApiCall.get_raw_location()
                .then((response) => {
                    const curaddress = response.data.city + ' ' + response.data.state + ' ' + response.data.country_name;
                    this.address = curaddress; 
                    this.lat = response.data.latitude;
                    this.lng = response.data.longitude;
                    this.getAddressFrom(
                        parseFloat(response.data.latitude),
                        parseFloat(response.data.longitude),
              );
                Maps.display_map(
                        response.data.latitude, 
                        response.data.longitude, 
                        this.$refs["map"], 
                        this.locations, this.markers);
                })
                .catch((error)=>{
                    console.log(error)
                })
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
                ApiCall.get_address(lat, long)
                    .then(response => {
                    if (response.data.error_message) {
                        this.error = response.data.error_message;
                        console.log(response.data.error_message);
                    } else {
                        this.address = response.data.results[0].formatted_address;
                    }
                    this.spinner = false;
                    })
                    .catch(error => {
                    this.error = error.message;
                    this.spinner = false;
                    console.log(error.message);
                    });
            },
            find_closest_markers(){
                
     
                if(!this.locations){
                    this.locations = 0;
                }
               
              
                var markers_distances = [];
                var newLocations = [];
      for (let i = 0; i < this.markers.length; i++) {
        
          var d = google.maps.geometry.spherical.computeDistanceBetween(this.markers[i].position, new google.maps.LatLng(this.lat, this.lng));
          markers_distances[i] = {
              distance: d, 
              marker: this.markers[i]
          }
         // console.log( markers_distances[i]);
      }
       // console.log(markers_distances.sort((a, b) => {return a.distance-b.distance}));
      var closest_markers = markers_distances.sort((a, b) => {return a.distance-b.distance})
    
      console.log(closest_markers);
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
      
      const URL = `/api/get_close_locations/${$idArray}`;
    
      return axios
        .get(URL)
        .then(response => {
          
          this.locations = response.data.location;
          const place = response.data.location;

          const map = new google.maps.Map(this.$refs["map"], {
            zoom: 15,
            center: new google.maps.LatLng(this.lat, this.lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

         

          const infoWindow = new google.maps.InfoWindow();

          for (let i = 0; i <  this.locations.length; i++) {
            const placeID  = place[i].id;
            const str = place[i].longlat;
            const arr = str.split(',');
           let iconPhoto = '/upload/' + place[i].marker_icon
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
              title: place[i].title,
              address: place[i].address,
              icon: icon,
              placeID:  place[i].id
            });
           
            this.markers.push(marker);

            google.maps.event.addListener(this.markers[i], 'click', function() { 
                console.log(this.markers[i]);
                var InfoContent = `<div style="color:black;" class="inforWindow"><h3>${this.title}</h3><p><strong>Address</strong> ${this.address}</p></div>`;
                infoWindow.setContent(InfoContent);
                infoWindow.open(map,this); 
            }); 

        }

        //  Maps.display_map(this.lat,  this.lng,   this.$refs["map"], response.data.location, this.markers);
        })
        .catch(error => {
          this.error = error.message;
        });

            },
            showInfoWindow(index) {
                Maps.display_infoWindow(index);
            }
        }
    }
</script>
<style>
    .map-holder{
        height:800px;
    }
</style>
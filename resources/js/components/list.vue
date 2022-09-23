<template>
    <div class="row">
        <div class="col side">
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
              <select v-model="category_type">
                <option disabled value="0">Select Type</option>
                <option v-for="(category, index) in this.categories" :key="index" :value="category.id"> {{category.name }}</option>
              </select>
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

        <button class="ui button full-width" >Find Nearby</button>
      </div>
    </form>

        <div class="locations" v-if="locations && locations.length > 0">
         <dealerCards  class="item"
          v-for="(dealer, index) in locations"
          :key="dealer.id"
          @click="showInfoWindow(dealer.id)"
          :class="{'active' : activeIndex === dealer.id}"
          style="padding:10px;" :dealer="dealer" :data-id="'dealer-'+dealer.id"></dealerCards>
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
import APICalls from '../services/APICalls.js';
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
            category_type: 0,
            markers: [],
            categories: [],
            activeIndex: -1,
            radius:900,
            map: null,
            infoWindow: new google.maps.InfoWindow()

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
            APICalls.getCategories()
            .then(response => {
              this.categories = response.data.categories;
            })
            .catch(error => {
              console.log(error);
            })
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
              this.initialize(response.data.latitude, 
                        response.data.longitude);
                        
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
               
                var state_markers = this.$store.getters.getMarkers;
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
               
              if(item.distance < this.radius){
                  
                    newLocations.push(item.marker.placeID);
                    
                    console.log(item.marker);
              }else{
                //$(".header:contains('"+ item.marker.title +"')").parents('.item').remove();
                //item.marker.setMap(null);
              }
              
            })

            const $idArray = newLocations.join('-');    
      
      const URL = `/api/get_close_locations/`;
    
      return axios
        .get(`/api/get_close_locations/${$idArray}?category_type=` + this.category_type)
        .then(response => {
        //alert(URL + '?category_type=' + this.category_type)
         this.locations = response.data.location;
 
          this.initialize(this.lat, 
                        this.lng);
         
        })
        .catch(error => {
          this.error = error.message;
        });

            },
            showInfoWindow(index) {

              this.activeIndex = index ;
        google.maps.event.trigger(gmarkers[index], 'click');
            },
            
 initialize(lat, long  ) {
    Maps.initialize(lat, long, this.$refs["map"], this.locations)
 
    }
        }
    }
</script>
<style>
    .map-holder{
        height:calc(100vh - 43px);
    }
    .locations{
      height: 673px;
    overflow-x: hidden;
    overflow-y: scroll;
    margin-right: -10px;
    border: 1px solid rgba(0,0,0,.4); 
    }
</style>
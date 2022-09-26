<template>


    <div class="row flex_remove">
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
          <div class="content item" :id="dealer.id"  v-for="(dealer, index) in locations"
          :key="dealer.id" :dealer="dealer" :data-id="'dealer-'+dealer.id" 
          >
            
            <div class="custom-img-box"> <img v-if="dealer.photo" :src="ourImage(dealer.photo)" width="100" height="100"></div>
            <div class="custom-location-text">
            <div class="header"><h2>{{dealer.title}} </h2></div>
            <p class="meta"><i class="fa fa-location" aria-hidden="true"></i> {{dealer.address}}</p>
           
            <p class="meta"><i class="fa fa-envelope" aria-hidden="true"></i> {{dealer.email}}</p>
          </div>
          <div class="dealer-buttons">
            <button class="ui button view-on-map"  @click="showInfoWindow(dealer.id)">View On Map</button>
            <button class="ui button"  @click="getDirection(dealer, dealer.id, dealer.address)">Get Directions</button>
            <button class="ui button" >Contact </button>
          </div>
        
          </div>  
        
        </div>
        <div class="noLocMessage" v-else>
            <h4>No dealers available at this location.</h4>
        </div>
        </div>
        <div class="col">
            <div class="map-parent">
              <div class="route_details">
                <p class="origin-add"><strong>From: </strong>{{this.address}}</p>
                <p class="destination-add"><strong>To: </strong>{{this.destination}}</p>
                <hr />
                <div class="distance">
                  <span id="distance-text">0</span> <span id="duration-text">0</span> <span><i class="fa fa-car" aria-hidden="true"></i></span>
                </div>
              </div>
              <div class="ten wide column map-holder" ref="map"> </div>
            </div>
            
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
            destination: '',
            apiKey: "AIzaSyC7n8dM5sU7EeMwfITFTaM1pRb3lUD1_gM",
            locations: [],
            totalLocations: 0,
            lat:0,
            lng: 0,
            category_type: 0,
            markers: [],
            categories: [],
            activeIndex: -1,
            directionVuew: 0,
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
                   // next({ name: '404Resource', params: { resource: 'pair' } })
                } else {
                   // next({ name: 'NetworkError' })
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
            this.locatorButtonPressed();
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

                        this.initialize( position.coords.latitude, 
                        position.coords.longitude);
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
            
            
 initialize(lat, long  ) {
    Maps.initialize(lat, long, this.$refs["map"], this.locations)
 
    },
    ourImage(img) {
        return "/upload/" + img
    },
    showInfoWindow(index) {
        jQuery('.route_details').fadeOut('slow');
        google.maps.event.trigger(gmarkers[index], 'click');
        this.activeIndex = index ;
        jQuery('.content.item').removeClass('active');
        jQuery('div[data-id=dealer-'+ index+']').addClass('active');
        jQuery('.locations').animate({
          scrollTop: jQuery('.locations>div.active').offset().top - 50
        },250)
},
getDirection(dealer, index, address){
        this.directionVuew = 1;
        this.destination = dealer.address;
        jQuery('.content.item').removeClass('active');
        jQuery('div[data-id=dealer-'+ index+']').addClass('active');
        Maps.showDistance(dealer);
}
        }
    }
</script>
<style>
    .map-holder{
        height:calc(100vh - 43px);
    }
    .locations{
      height: calc(100vh - 288px);
    overflow-x: hidden;
    overflow-y: scroll;
    margin-right: -10px;
    border: 1px solid rgba(0,0,0,.4); 
    }
    .col.side {
    padding-left: 25px;
    max-width: 504px;
    padding-right: 0;
}
    .locations img{
      border-top-left-radius: 10px;
      overflow: hidden;
      border-bottom-right-radius: 10px;
    }
    .custom-img-box{
      float:left;
    }
    .custom-location-text{
      display: inline-block;
      width: 65%;
      padding-left: 10px;
    }
    .dealer-buttons{
      display: inline-block;
     width:100%;
     margin:10px 0 0 0; 
    }
    .dealer-buttons .ui.button{
     margin-right:10px;
    }
    .map-parent {
    position: relative;
}
    .route_details {
    position: absolute;
    z-index: 9;
    width: 350px;
    padding: 10px;
    background: #00181ceb;
    right: 10px;
    top: 65px;
    display: none;
}
.distance{
  width:100%;
  text-align:center;
}
.route_details p{
  font-size: 14px;
}
.route_details p strong{
  color: #00dfdf;  
}
.distance>span {
  width: auto;
    background: #008f8f;
    color: white;
    text-align: center;
    margin-right: 10px;
    display: inline-block;
    padding: 2px 10px;
    font-size: 15px;
    margin-top: 5px;
}
.route_details hr{
  background:rgba(255,255,255,.3)
}
a[href^="http://maps.google.com/maps"]{display:none !important}
a[href^="https://maps.google.com/maps"]{display:none !important}

.gmnoprint a, .gmnoprint span, .gm-style-cc {
    display:none;
}
.gmnoprint div {
    background:none !important;
}
@media(max-width:767px){
  .flex_remove{
    display: block !important;
  }
  .col.side {
    width:100%;
    padding:0 20px;
  }
  .locations {
    height: 245px;
    overflow-x: hidden;
    overflow-y: scroll;
    margin-right: 0;
    border: 1px solid rgba(0,0,0,.4);
    margin-bottom: 16px;
}
.map-holder {
    height: 280px;
}
.route_details {
    position: absolute;
    z-index: 9;
    width: 95%;
    padding: 10px;
    background: #00181ceb;
    right: 2.5%;
    top: auto;

    bottom: 0;
}
.dealer-buttons .ui.button {
    margin-right: 2px;
    font-size: 12px;
}
}
</style>
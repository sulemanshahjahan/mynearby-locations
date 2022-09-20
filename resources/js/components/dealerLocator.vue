<template>
        <div class="row">
            <div class="col">
                <form class="ui segment large form" >
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

            <dealerCards  class="item"
              v-for="(dealer, index) in locations"
              :key="dealer.id"
              @click="showInfoWindow(index)"
              :class="{'active' : activeIndex === index}"
              style="padding:10px;" :dealer="dealer"></dealerCards>

            </div>
            <div class="col-9">
                <div class="ten wide column map-holder" ref="map"></div>
            </div>
        </div>
</template>
<style scoped>
    .padding0{
        padding:0;
    }
</style>

<script>
import axios from 'axios';
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
        console.log(response.data.locations);
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

            const map = new google.maps.Map(this.$refs["map"], {
          zoom: 15,
          center: new google.maps.LatLng(lat, long),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        const infoWindow = new google.maps.InfoWindow();
  
        for (let i = 0; i < this.locations.length; i++) {
          const placeID  = this.locations[i].id;
          const str = this.locations[i].longlat;
          const arr = str.split(',');
          
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(arr[0], arr[1]),
            map: map,
            title: this.locations[i].title,
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
        console.log(this.markers);
        },
        showInfoWindow(index) {
        this.activeIndex = index;
        console.log(this.markers[index]);
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
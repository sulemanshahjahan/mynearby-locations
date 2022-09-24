<template>

              <div class="content" :id="dealer.id">
            
                <div class="custom-img-box"> <img v-if="dealer.photo" :src="ourImage(dealer.photo)" width="100" height="100"></div>
                <div class="custom-location-text">
                <div class="header"><h2>{{dealer.title}} </h2></div>
                <div class="meta"><i class="fa fa-globe" aria-hidden="true"></i> {{dealer.address}}</div>
              </div>
              <div class="dealer-buttons">
                <button class="ui button"  @click="showInfoWindow(dealer.id)">View On Map</button>
                <button class="ui button"  @click="getDirection">Get Directions</button>
              </div>
            
              </div>
            
</template>

<script>

import Maps from '../../services/Maps'; 
export default { 
  
  name: "dealerCard",
  props:{
    dealer: {
      type:Object,
      require: true
    }
  },
  data(){
    return {
        total:0,
        activeIndex: -1,
        directionVuew: 0
    }
  },   
  methods: {
    ourImage(img) {
        return "/upload/" + img
    },
    showInfoWindow(index) {
      
      alert(this.directionVuew)
      if(this.directionVuew == 1){
        
        jQuery('.ui.button.full-width').trigger('click');
        this.directionVuew = 0;
        setTimeout(function(){
          this.directionVuew = 0;
google.maps.event.trigger(gmarkers[index], 'click');

},1500)
this.directionVuew = 0;
      }else{
        google.maps.event.trigger(gmarkers[index], 'click');
      }
      
this.activeIndex = index ;


  


jQuery('.content.item').removeClass('active');
jQuery('div[data-id=dealer-'+ this.dealer.id+']').addClass('active');
},
getDirection(){
  this.directionVuew = 1;
  Maps.showDistance(this.dealer);
}
  }
}
</script>
<style scoped>

    img{
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
</style>
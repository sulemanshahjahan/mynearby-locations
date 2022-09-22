<template>

              <div class="content" :id="dealer.id">
                <div class="row">
                <div class="col"> <img v-if="dealer.photo" :src="ourImage(dealer.photo)" width="100" height="100"></div>
                <div class="col-8">
                <div class="header"><h2>{{dealer.title}}</h2></div>
                <div class="meta"><i class="fa fa-globe" aria-hidden="true"></i> {{dealer.address}}</div>
              </div>
            </div>
              </div>
            
</template>

<script>


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
    }
  },   
  methods: {
    ourImage(img) {
        return "/upload/" + img
    }
  }
}
</script>
<style scoped>
    .content{
        background:#111;
        margin-bottom: 10px;

    }
    img{
      border-top-left-radius: 10px;
    overflow: hidden;
    border-bottom-right-radius: 10px;
    }
</style>
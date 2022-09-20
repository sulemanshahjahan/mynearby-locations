<template>

              <div class="content">
                <div class="header">{{dealer.title}}</div>
                <div class="meta">{{dealer.address}}</div>
                <img v-if="dealer.photo" :src="ourImage(dealer.photo)" width="100" height="100">
  
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
    }
</style>
<script setup>
    import axios from 'axios';
import { onMounted, ref } from 'vue';
import router from '../../router';
import { useStore } from 'vuex'

    const store = useStore();



    let locations = ref([]);

    onMounted(async () =>{
        getLocations();
    })

    const newLocation = () => {
        router.push('/location/new');
    }
    
    const getLocations = async () => {
        try{
            let response = await axios.get('/api/get_all_locations/?api_token='+ store.state.apiToken +'&company_id=' + store.getters.getCompanyID );
            locations.value  = response.data.locations;  
        }catch (error) {
            console.error(error.response.data);     // NOTE - use "error.response.data` (not "error")
         }
        
    }

    const ourImage = (img) => {
        return "/upload/" + img
    }

    const onEdit = (id) => {
        router.push({ name: 'locationEdit', params: { id: id } })
    }

    const deleteLocation = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You can't go back.",
            icon: "warning",
            showCancelButton: true, 
            confirmButtonColor: "#ed143d",
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes delete it!"
        })
        .then((result) => {
            if(result.value){
                axios.get('/api/delete_location/'+id)
                .then(()=>{
                    Swal.fire(
                        'Delete',
                        'Location deleted successfully',
                        'success'
                    )

                    getLocations();
                })
                .catch((error) => {
                   Swal.fire('Failed!', "Something went wrong.", "Warning");     
                })
            }
        })
    }

</script>

<template>
    <div class="">
        <div class="products__list table  my-3">
              
              <div class="customers__titlebar dflex justify-content-between align-items-center">
                  <div class="customers__titlebar--item">
                      <h1 class="my-1">Dealers</h1>
                  </div>
                  <div class="customers__titlebar--item">
                      <button class="btn btn-secondary my-1" @click="newLocation" >
                          Add Dealer
                      </button>
                  </div>
              </div>
      
              <div class="table--heading mt-2 products__list__heading " style="padding-top: 20px;background:#FFF">
                  <!-- <p class="table--heading--col1">&#32;</p> -->
                  <p class="table--heading--col1">Image</p>
                  <p class="table--heading--col2">Name</p>
                  <p class="table--heading--col4">Address</p>
                  <p class="table--heading--col3">Email</p>
                  <!-- <p class="table--heading--col5">&#32;</p> -->
                  <p class="table--heading--col5">actions</p>
              </div>
      
              <!-- product 1 -->
              <div class="table--items products__list__item" v-for="item in locations " :key="item.id" v-if="locations.length > 0">
                  <div class="products__list__item--imgWrapper">
                      <img class="products__list__item--img" :src="ourImage(item.photo)"  style="height: 40px;" v-if="item.photo">
                  </div>
                  <a href="# " class="table--items--col2" @click="onEdit(item.id)">{{item.title}}</a>
                  <p class="table--items--col2 four">{{item.address}}</p>
                  <p class="table--items--col3">{{item.email}}</p>     
                  <div>     
                      <button class="btn-icon btn-icon-success" @click="onEdit(item.id)">
                          <i class="fas fa-pencil-alt"></i>
                      </button>
                      <button class="btn-icon btn-icon-danger" @click="deleteLocation(item.id)">
                          <i class="far fa-trash-alt"></i>
                      </button>
                  </div>
              </div>
              <div class="table--items products__list__item" v-else>
                    <h2>
                        No locations found
                    </h2>
              </div>
          </div>
      
    </div>
</template>

<style scoped>
h1.my-1{
    color:#fff;
}
@media(max-width:768px){
    .col.side {
    padding-left: 25px;
    max-width: 100%;
    padding-right: 0;
    width: 100%;
    padding: 0px 20px;
}
.table--heading--col3, .table--items--col3, .table--heading--col4, .table--items--col2.four{
    display: none;
}
.products__list__item, .products__list__heading {
    grid-template-columns: 50px 150px 120px;
}
}
</style>
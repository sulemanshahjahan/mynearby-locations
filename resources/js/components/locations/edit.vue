<script setup>
    import { onMounted, ref } from 'vue';
    import router from '../../router';
    import ApiCall from '../../services/APICalls'; 
    import Maps from '../../services/Maps'; 
    import { useStore } from 'vuex'

    const store = useStore();
    let form = ref({
        id: '',
        title: '',
        address: '',
        photo: '',
        marker_icon: '',
        longlat: '',
        email: '',
        phone: '',
        website: '',
        categories: '',
        category_id: 0,
    });

    onMounted(async () => {
        getSingleLocation()
    })

    const props = defineProps({
        id:{
            type: String,
            default: ""
        }
    })

    const getPhoto = () => {
        let photo = '/upload/image.png';
        if(form.value.photo){
            if(form.value.photo.indexOf('base64') != -1){
                photo = form.value.photo;
            }else{
                photo = '/upload/' + form.value.photo
            }
        }
        return photo;
    }   

    const updatePhoto = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        let limit = 1024 * 1024 * 2;
        if(file['size' > limit]){
            return false
        }
        reader.onloadend = (file) => {
            form.value.photo = reader.result;
        }
        reader.readAsDataURL(file);
    }

    const getSingleLocation = async () => {
        try{
        let response = await axios.get(`/api/get_edit_location/${props.id}?api_token=` + store.getters.getAPIToken);
        form.value = response.data.location;
    }catch (error) {
           alert(error);    // NOTE - use "error.response.data` (not "error")
         }
    
    }


    const getMarkerIcon = () => {
        let marker_icon = '/upload/image.png';
        if(form.value.marker_icon){
            if(form.value.marker_icon.indexOf('base64') != -1){
                marker_icon = form.value.marker_icon;
            }else{
                marker_icon = '/upload/' + form.value.marker_icon
            }
        }
        return marker_icon;
    }

    const updateMarkerIcon = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        let limit = 1024 * 1024 * 2;
        if(file['size' > limit]){
            return false
        }
        reader.onloadend = (file) => {
            form.value.marker_icon = reader.result;
        }

        reader.readAsDataURL(file);
    }

    const updateLocation = () =>{
        $('.products__edit input').each(function(){
            
            if($(this).val() == ''){
                $(this).addClass('error-border');
                $(this).parents('.field_box').find('.errorMessage').html("This field can't be empty.");
                $(this).addClass('error');
            }else{

                $(this).removeClass('error');
        }
        })

        if($('error').length < 1){
        const formData = new FormData();
        formData.append('title', form.value.title);
        formData.append('address', form.value.address);
        formData.append('longlat', form.value.longlat);
        formData.append('email', form.value.email);
        formData.append('photo', form.value.photo);
        formData.append('marker_icon', form.value.marker_icon);
        formData.append('phone', form.value.phone);
        formData.append('website', form.value.website);
        formData.append('category_id', form.value.category_id);
    
        axios.post(`/api/update_location/${form.value.id}`, formData)
            .then((response)=>{
                form.value.title = '',
                form.value.address = '',
                form.value.longlat = '',
                form.value.photo = '',
                form.value.marker_icon = '',
                form.value.email = '',
                form.value.website = '',
                form.value.phone = '',
                form.value.category_id = '',

                router.push({name: 'Dashboard'})

                toast.fire({
                    icon:"success",
                    title: "Location updated successfully."
                })

            })
            .catch((error)=>{
                console.error(error.data);
            })
        }
    }

    const el = ref({
        locAddress: '',
    })

    const map = ref({
        locAddress: '',
    })
 
    let lat;
    let long;

    onMounted(() => {
  
  ApiCall.getCategories()
  .then(response => {
      form.value.categories  = response.data.categories;
      
  })

const autocomplete = new google.maps.places.Autocomplete(
  el.value,
      {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(45.4215296, -75.6971931)
        )
      }
    );
 
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
     // form.address = place.formatted_address;
        // Find inputs
      const input = $("input[name='address']");

      // Set value
      input.val(jQuery('#specific').val());

      // Create native event
      const event = new Event('input', { bubbles: true });

      // Dispatch the event on "native" element
      input.get(0).dispatchEvent(event);

        // Find inputs
      const longlatput = $("input[name='longlat']");

      // Set value
      longlatput.val(place.geometry.location.lat() + ', ' + place.geometry.location.lng());

      lat = place.geometry.location.lat();
      long = place.geometry.location.lng();
      // Create native event
      const longlatevent = new Event('input', { bubbles: true });

      // Dispatch the event on "native" element
      longlatput.get(0).dispatchEvent(longlatevent);

      
      //Maps.initialize(place.geometry.location.lat(), place.geometry.location.lng(), map.value,  dealer = 'new')
    });

    setTimeout(function(){
        let dealer;
        
        jQuery('#specific').val(jQuery('.addresss').val());
        jQuery('#specific').change();
       
            const str = form.value.longlat;
            const arr = str.split(',');
            Maps.initialize(parseFloat(arr[0]), parseFloat(arr[1]), map.value,  dealer = 'new')
       
       
    }, 1500)
    
})
</script>
<template>
    <div class="container">
        <div class="products__edit ">
       
       <div class="products__create__titlebar dflex justify-content-between align-items-center">
           <div class="products__create__titlebar--item">
               
               <h1 class="my-1">Edit Location </h1>
           </div>
           <div class="products__create__titlebar--item">
               
               <button class="btn btn-secondary ml-1" @click="updateLocation()">
                   Save
               </button>
           </div>
       </div>
   
       <div class="products__create__cardWrapper mt-2">
           <div class="products__create__main">
               <div class="products__create__main--addInfo card py-2 px-2 bg-white">
                   <div class="field_box">
                    <p class="mb-1">Name</p>
                   <input type="text" class="input" v-model="form.title">
                   <span class="errorMessage"></span>
                </div>

                <div class="field_box">
                   <p class="my-1">Address (optional)</p>
                <input   class="input" id="specific" ref="el">
                <input  v-model="form.address" name="address" type="hidden" class="input addresss"  >
                <span class="errorMessage"></span>
            </div>
            
            <div class="field_box">
                <p class="my-1">Category</p>
                <select class="input" v-model="form.category_id" >
                    <option disabled value="0">Select option</option>
                    <option v-for="(category, index) in form.categories" :value="category.id" :key="index">{{ category.name }}</option>
                </select>
                </div>

                   <div class="products__create__main--media--images mt-2">
                    <ul class="products__create__main--media--images--list list-unstyled">
                       <li class="products__create__main--media--images--item">
                        <h4>Featured</h4>
                           <div class="products__create__main--media--images--item--imgWrapper">
                               <img class="products__create__main--media--images--item--img" :src="getPhoto()" alt="" />  
                           </div>
                       </li>
                       <!-- upload image small -->
                       <li class="products__create__main--media--images--item">
                           <form class="products__create__main--media--images--item--form">
                               <label class="products__create__main--media--images--item--form--label" for="myfile">Add Image</label>
                               <input class="products__create__main--media--images--item--form--input" type="file" @change="updatePhoto" id="myfile" >
                           </form>
                       </li>
                       <li class="products__create__main--media--images--item">
                        <h4>Marker</h4>
                           <div class="products__create__main--media--images--item--imgWrapper">
                               <img class="products__create__main--media--images--item--img" :src="getMarkerIcon()" alt="" />  
                           </div>
                       </li>
                       <!-- upload image small -->
                       <li class="products__create__main--media--images--item">
                           <form class="products__create__main--media--images--item--form">
                               <label class="products__create__main--media--images--item--form--label" for="myfile">Add Image</label>
                               <input class="products__create__main--media--images--item--form--input" type="file" @change="updateMarkerIcon" id="myfile" >
                           </form>
                       </li>
                   </ul>
                   </div>
                   
               </div>
   
           </div>
           <div class="products__create__sidebar">
               <!-- Product Organization -->
               <div class="card py-2 px-2 bg-white">
                   <!-- Product unit -->
                   <div class="my-3">
                    <div class="field_box">
                       <p>Longitude and Latitude</p>
                       <input type="text" class="input" name='longlat' v-model="form.longlat">
                       <span class="errorMessage"></span>
                       </div>
                   </div>
                  
   
                   <!-- Product invrntory -->
                   <div class="my-3">
                    <div class="field_box">
                       <p>Website</p>
                       <input type="text" class="input" v-model="form.website">
                       <span class="errorMessage"></span>
                       </div>
                   </div>
                  
   
                   <!-- Product Price -->
                   <div class="my-3">
                    <div class="field_box">
                       <p>Email</p>
                       <input type="text" class="input" v-model="form.email">
                       <span class="errorMessage"></span>
                       </div>
                   </div>
                  
   
                   <!-- Product Price -->
                   <div class="my-3">
                    <div class="field_box">
                       <p>Phone</p>
                       <input type="text" class="input" v-model="form.phone">
                       <span class="errorMessage"></span>
                    </div>
                   </div>
               </div>
   
           </div>
       </div>
       <!-- Footer Bar -->
       <div class="dflex justify-content-between align-items-center my-3">
           <p ></p>
           <button class="btn btn-secondary" @click="updateLocation()">Save</button>
       </div>
   
   </div>
   <div class="ten wide column map-holder" ref="map"></div>
    </div>
</template>
<style scoped>
    .map-holder{
        height:360px;
        margin-top:20px;
    }
</style>
<script setup>
    import {ref} from 'vue';
    import router from '../../router';
    let form = ref({
        title: '',
        address: '',
        photo: '',
        longlat: '',
        email: '',
        phone: '',
        website: ''
    });

    const getPhoto = () => {
        let photo = '/upload/image.jpg';
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

    const saveLocation = () => {
        const formData = new FormData();
        formData.append('title', form.value.title);
        formData.append('address', form.value.address);
        formData.append('longlat', form.value.longlat);
        formData.append('email', form.value.email);
        formData.append('photo', form.value.photo);
        formData.append('phone', form.value.phone);
        formData.append('website', form.value.website);
    
        axios.post("/api/add_location", formData)
            .then((response)=>{
                form.value.title = '',
                form.value.address = '',
                form.value.longlat = '',
                form.value.photo = '',
                form.value.email = '',
                form.value.website = '',
                form.value.phone = '',

                router.push({name: 'locationIndex'})

                toast.fire({
                    icon:"success",
                    title: "Location added successfully."
                })

            })
            .catch((error)=>{
                console.error(error);
            })
    }
</script>

<template>
    <div class="container">
        <div class="products__create ">
    
    <div class="products__create__titlebar dflex justify-content-between align-items-center">
        <div class="products__create__titlebar--item">
            
            <h1 class="my-1">Add Location</h1>
        </div>
        <div class="products__create__titlebar--item">
            
            <button class="btn btn-secondary ml-1" @click="saveLocation">
                Save
            </button>
        </div>
    </div>

    <div class="products__create__cardWrapper mt-2">
        <div class="products__create__main">
            <div class="products__create__main--addInfo card py-2 px-2 bg-white">
                <p class="mb-1">Name</p>
                <input type="text" class="input" v-model="form.title">

                <p class="my-1">Address (optional)</p>
                <textarea cols="10" rows="5" class="textarea" v-model="form.address"></textarea>
                
                <div class="products__create__main--media--images mt-2">
                   <ul class="products__create__main--media--images--list list-unstyled">
                       <li class="products__create__main--media--images--item">
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
                   </ul>
               </div>
           
            </div>

        </div>
        <div class="products__create__sidebar">
            <!-- Product Organization -->
            <div class="card py-2 px-2 bg-white">
                
                <!-- Product unit -->
                <div class="my-3">
                    <p>Longitude and Latitude</p>
                    <input type="text" class="input" v-model="form.longlat">
                </div>
                <hr>

                <!-- Product invrntory -->
                <div class="my-3">
                    <p>Website</p>
                    <input type="text" class="input" v-model="form.website">
                </div>
                <hr>

                <!-- Product Price -->
                <div class="my-3">
                    <p>Email</p>
                    <input type="text" class="input" v-model="form.email">
                </div>

                <div class="my-3">
                    <p>Phone</p>
                    <input type="text" class="input" v-model="form.phone">
                </div>
            </div>

        </div>
    </div>
    <!-- Footer Bar -->
    <div class="dflex justify-content-between align-items-center my-3">
        <p ></p>
        <button class="btn btn-secondary" @click="saveLocation">Save</button>
    </div>

</div>
    </div>
</template>
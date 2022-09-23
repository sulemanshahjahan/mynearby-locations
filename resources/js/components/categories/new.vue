<script setup>
    import { onMounted, onUpdated, ref} from 'vue';
    import router from '../../router';

    

    let form = ref({
        name: '',
        slug: ''
    });

    const saveCategory = () => {
        const formData = new FormData();
        formData.append('name', form.value.name);
        formData.append('slug', form.value.slug);

        axios.post("/api/add_category", formData)
            .then((response)=>{
                form.value.name = '',
                form.value.slug = ''

                router.push({name: 'Dashboard'})

                toast.fire({
                    icon:"success",
                    title: "Category added successfully."
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
            
            <h1 class="my-1">Add Category</h1>
        </div>
        <div class="products__create__titlebar--item">
            
            <button class="btn btn-secondary ml-1" @click="saveCategory">
                Save
            </button>
        </div>
    </div>
    
        
    
    <div class="products__create__cardWrapper mt-2">
        
        <div class="products__create__sidebar">
            <!-- Product Organization -->
            <div class="card py-2 px-2 bg-white">
                
                <!-- Product unit -->
                <div class="my-3">
                    <p>Name</p>
                    <input type="text" class="input title" name="title" v-model="form.name" >
                </div>
                <hr>

                <!-- Product invrntory -->
                <div class="my-3">
                    <p>Slug</p>
                    <input type="text" class="input" v-model="form.slug">
                </div>
                <hr>

                
            </div>

        </div>
    </div>
    <!-- Footer Bar -->
    <div class="dflex justify-content-between align-items-center my-3">
        <p ></p>
        <button class="btn btn-secondary" @click="saveCategory">Save</button>
    </div>

</div>
    </div>
</template>
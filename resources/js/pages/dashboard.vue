<template>
    <div class="container">

        <Locations></Locations>
        <button type="button" class="btn btn-dark mt-2" @click="logout">Logout</button>
    </div>
</template>
<script>
    import { useRouter } from "vue-router"
    import { useStore } from 'vuex'

    import Locations from '../components/locations/index.vue'

    export default{
        components:{
            Locations
        },
        setup(){
            const router = useRouter();
            const store = useStore();
            function logout(){
                store.dispatch('removeToken');
                router.push({name:'List'})
            }
            return {
                logout
            }
        }
    }
</script>
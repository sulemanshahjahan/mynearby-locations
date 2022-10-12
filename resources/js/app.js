import './bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css';
import { createApp, VueElement } from 'vue';
import router from './router.js'
import store from './store';
import LaravelVuePagination from 'laravel-vue-pagination';

window.Swal = Swal;
const toast = Swal.mixin({
    toast:true,
    position:'top-end',
    showConfirmButton: false,
    timer: 3000,
    timeProgerssBar: true,
})

window.toast = toast;

const infoWindows = new google.maps.InfoWindow();
window.infowindow = infoWindows;



var gmarkers = [];
window.gmarkers = gmarkers;
import App from './layouts/App.vue'





createApp(App)
.component("LaravelVuePagination", LaravelVuePagination)
    .use(router)
    .use(store)
    .mount("#app")
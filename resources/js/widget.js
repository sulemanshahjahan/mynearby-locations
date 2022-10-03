import './bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css';
import { createApp } from 'vue';
import router from './router.js'
import store from './store';

createApp(App)
    .use(router)
    .use(store)
    .mount("#app")
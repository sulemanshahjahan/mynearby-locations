import './bootstrap';

import { createApp } from 'vue';
import router from './router.js'
import store from './store';


import cors from 'cors' ;  



import App from './layouts/App.vue'

createApp(App)
    .use(router)
    .use(store)
    .mount("#app")
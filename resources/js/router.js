import { createWebHistory, createRouter } from "vue-router";

import home from './pages/home.vue';
import register from './pages/register.vue';
import login from './pages/login.vue';
import dashboard from './pages/dashboard.vue';
import nearby from './pages/nearby.vue';
import locationIndex from './components/locations/index.vue';
import locationNew from './components/locations/new.vue';
import locationEdit from './components/locations/edit.vue';
import dealerLocator from './components/dealerLocator.vue';
import store from './store';
import NotFound from './components/NotFound.vue';

const routes = [
    {
        path : '/',
        name : 'Home',
        component : home
    },
    {
        path : '/login',
        name : 'Login',
        component : login,
        meta:{
            requiresAuth:false
        }
    },
    {
        path : '/register',
        name : 'Register',
        component : register,
        meta:{
            requiresAuth:false
        }
    },
    {
        path : '/nearby',
        name : 'Nearby',
        component : nearby
    },
    {
        path : '/dashboard',
        name : 'Dashboard',
        component : dashboard,
        meta:{
            requiresAuth:true
        }
    },
    {
        path : '/locations',
        name : 'locationIndex',
        props: true,
        component : locationIndex
    },
    {
        path : '/location/new',
        name : 'locationNew',
        props: true,
        component : locationNew
    },
    {
        path : '/location/edit/:id',
        name : 'locationEdit',
        props: true,
        component : locationEdit
    },
    {
        path: '/dealers',
        name: 'dealerLocator',
        component: dealerLocator
    },
    {
        path: '/:CatchAll(.*)',
        name: 'NotFound',
        component: NotFound,
        props: true
      },
      {
        path: '/404/:resource',
        name: '404Resource',
        component: NotFound,
        props: true
      },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to,from) =>{
    if(to.meta.requiresAuth && store.getters.getToken == 0){
        return { name : 'Login'}
    }
    if(to.meta.requiresAuth == false && store.getters.getToken != 0){
        return { name : 'Dashboard'}
    }
})


export default router;
import axios from 'axios'
import { useStore } from 'vuex'

   

const apiClient = axios.create({
    baseURL: '/',
    withCredentials: false, 
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})


export default{
    get_all_locations(){
        const store = useStore();
        return apiClient.get('/api/get_all_locations/?api_token=3F5pqknNyeWXNFJwgf1fVT4gHc8C652EmhEU3zBTQ4kdJSg8NMsto4i6zgcm&company_id=' + store.getters.getCompanyID);
    },
    get_address(lat, long){
        return apiClient.get(`/api/nearby/?lat=${lat}&long=${long}`);
    },
    get_raw_location(){
        return apiClient.get('/api/no_permission_location')
    },
    getCategories(){
        return apiClient.get('/api/get_all_categories')
    }
}
import axios from 'axios'

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
        return apiClient.get('api/get_all_locations');
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
import { createStore } from 'vuex'

const store = createStore({


    state: {
        name: localStorage.getItem('name') || 0,
        companyID: localStorage.getItem('companyID') || 0,
        token : localStorage.getItem('token') || 0,
        apiToken: localStorage.getItem('api_token') || 0,
        markers: []
    },

    mutations:{
        // update variable value
        UPDATE_TOKEN(state,payload){
            state.token = payload
        },
         // update variable value
         UPDATE_NAME(state,payload){
            state.name = payload
        },
        UPDATE_COMPANYID(state,payload){
            state.companyID = payload
        },
        UPDATE_APITOKEN(state,payload){
            state.apiToken = payload
        },
        ADD_MARKER(state, marker){
            state.markers.push(marker)
        }
    },

    actions:{
        // action to be performed
        setToken(context,payload){
            localStorage.setItem('token',payload)
            context.commit('UPDATE_TOKEN',payload)
        },
        removeToken(context){
            localStorage.removeItem('token');
            context.commit('UPDATE_TOKEN', 0);
        },
        setAPIToken(context,payload){
            localStorage.setItem('api_token',payload)
            context.commit('UPDATE_APITOKEN',payload)
        },
        removeAPIToken(context,payload){
            localStorage.removeItem('api_token')
            context.commit('UPDATE_APITOKEN', 0)
        },
        // action to be performed
        setName(context,payload){
            localStorage.setItem('name',payload)
            context.commit('UPDATE_NAME',payload)
        },
        removeName(context){
            localStorage.removeItem('name');
            context.commit('UPDATE_NAME', 0);
        },

        // action to be performed
        setCompanyID(context,payload){
            localStorage.setItem('companyID',payload)
            context.commit('UPDATE_COMPANYID',payload)
        },
        removeCompanyID(context){
            localStorage.removeItem('company_id');
            context.commit('UPDATE_COMPANYID', 0);
        },
        createMarker({commit}, marker){
            commit('ADD_MARKER', marker)
        }
    },

    getters:{
        // get state variable value
        getToken: function(state){
            return state.token
        },
        getName: function(state){
            return state.name
        },
        getCompanyID: function(state){
            return state.companyID
        },
        getMarkers: function(state){
            return state.markers
        },
        getAPIToken: function(state){
            return state.apiToken
        }
    }

})

export default store;
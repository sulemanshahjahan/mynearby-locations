import { createStore } from 'vuex'

const store = createStore({


    state: {
        name: localStorage.getItem('name') || 0,
        token : localStorage.getItem('token') || 0
    },

    mutations:{
        // update variable value
        UPDATE_TOKEN(state,payload){
            state.token = payload
        },
         // update variable value
         UPDATE_NAME(state,payload){
            state.name = payload
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
        // action to be performed
        setName(context,payload){
            localStorage.setItem('name',payload)
            context.commit('UPDATE_NAME',payload)
        },
        removeName(context){
            localStorage.removeItem('name');
            context.commit('UPDATE_NAME', 0);
        }
    },

    getters:{
        // get state variable value
        getToken: function(state){
            return state.token
        },
        getName: function(state){
            return state.name
        }
    }

})

export default store;
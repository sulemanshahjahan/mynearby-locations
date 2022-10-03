<template>
    <div class="container">
        <h3>Manage Your Subscription {{status}}</h3>

        <label>Card Holder Name</label>
        <input id="card-holder-name" type="text" v-model="name" class="form-control mb-2">

        <label>Card</label>
        <div id="card-element"></div>

        <button class="btn btn-primary mt-3" id="add-card-button" v-on:click="submitPaymentMethod()">
            Save Payment Method
        </button>

        <div class="mt-3 mb-3">
    OR
</div>

<div v-show="paymentMethodsLoadStatus == 2 
    && paymentMethods.length == 0"
    class="">
        No payment method on file, please add a payment method.
</div>

<div v-show="paymentMethodsLoadStatus == 2 
        && paymentMethods.length > 0">
    <div v-for="(method, key) in paymentMethods" 
            v-bind:key="'method-'+key" 
            v-on:click="paymentMethodSelected = method.id"
            class="border rounded row p-1"
            v-bind:class="{
            'bg-success text-light': paymentMethodSelected == method.id    
        }">
            <div class="col-2">
                {{ method.brand.charAt(0).toUpperCase() }}{{ method.brand.slice(1) }}
            </div>
            <div class="col-7">
                Ending In: {{ method.last_four }} Exp: {{ method.exp_month }} / {{ method.exp_year }}
            </div>
            <div class="col-3">
                <span v-on:click.stop="removePaymentMethod( method.id )">Remove</span>
            </div>
    </div>
</div>

<div class="mt-3 row rounded border" 
        v-bind:class="{'bg-success text-light': selectedPlan == 'price_1LnoT2FPgAyQJIbWSXOWBwmS'}" 
        v-on:click="selectedPlan = 'price_1LnoT2FPgAyQJIbWSXOWBwmS'">
    <div class="col-6">
        Basic
    </div>
    <div class="col-6">
        $10/mo.
    </div>
</div>

<div class="mt-3 row rounded border" 
        v-bind:class="{'bg-success text-light': selectedPlan == 'price_1LnoT2FPgAyQJIbW2wm1863l'}" 
        v-on:click="selectedPlan = 'price_1LnoT2FPgAyQJIbW2wm1863l'">
    <div class="col-6">
        Professional
    </div>
    <div class="col-6">
        $15/mo.
    </div>

    
</div>
<button class="btn btn-primary mt-3" id="add-card-button" v-on:click="updateSubscription()">
            Subscribe
        </button>

        <button class="btn btn-primary mt-3" id="cancel-button" v-on:click="cancelSubscription()">
           Cancel Subscription
        </button>

    </div>
</template>
<script>

import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
    export default {
    data(){
        return {
            stripeAPIToken: 'pk_test_YhPXZIa5p7e7kdEHsDfj6bq300M9C3cxI0',
            stripe: '',
            elements: '',
            card: '',
            intentToken: {},
            name: '',
            addPaymentStatus: 0,
            addPaymentStatusError: '',
            paymentMethods: [],
            paymentMethodsLoadStatus: 0,
            paymentMethodSelected: {},
            selectedPlan: '',
            currentSubscription: '',
            status: ''
        }
    },
    methods: {
    /*
        Includes Stripe.js dynamically
    */
    includeStripe( URL, callback ){
        let documentTag = document, tag = 'script',
            object = documentTag.createElement(tag),
            scriptTag = documentTag.getElementsByTagName(tag)[0];
        object.src = '//' + URL;
        if (callback) { object.addEventListener('load', function (e) { callback(null, e); }, false); }
        scriptTag.parentNode.insertBefore(object, scriptTag);
    },
    configureStripe(){
        this.stripe = Stripe( this.stripeAPIToken );

        this.elements = this.stripe.elements();
        this.card = this.elements.create('card');

        this.card.mount('#card-element');
    },
    loadIntent(){
        axios.get('/api/user/setup-intent')
            .then( function( response ){
                this.intentToken = response.data;
                
            }.bind(this));
    },
    submitPaymentMethod(){
        this.addPaymentStatus = 1;
      
        this.stripe.confirmCardSetup(
            this.intentToken.client_secret, {
                payment_method: {
                    card: this.card,
                    billing_details: {
                        name: this.name
                    }
                }
            }
        ).then(function(result) {
            if (result.error) {
                this.addPaymentStatus = 3;
                this.addPaymentStatusError = result.error.message;
            } else {
                this.savePaymentMethod( result.setupIntent.payment_method );
                this.addPaymentStatus = 2;
                this.card.clear();
                this.name = '';
            }
        }.bind(this));
    },
    savePaymentMethod( method ){
        axios.post('/api/user/payments', {
            payment_method: method
        }).then( function(){
            this.loadPaymentMethods();
        }.bind(this));
    },
    loadPaymentMethods(){
        this.paymentMethodsLoadStatus = 1;

        axios.get('/api/user/payment-methods')
            .then( function( response ){
                this.paymentMethods = response.data;

                this.paymentMethodsLoadStatus = 2;
            }.bind(this));
    },
    removePaymentMethod( paymentID ){
        axios.post('/api/user/remove-payment', {
            id: paymentID
        }).then( function( response ){
            this.loadPaymentMethods();
        }.bind(this));
    },
    updateSubscription(){
       
            axios.put('/api/user/subscription', {
                plan: this.selectedPlan,
                payment: this.paymentMethodSelected,
                status: this.status
            }).then( function( response ){
                console.log(response)
                if(response.status == 200 ){
                    alert('subscribed successfully.');
                }
            }.bind(this));
        },
        cancelSubscription(){
           
            axios.post('/api/user/cancel_subscription', {
                plan: this.selectedPlan,
                payment: this.paymentMethodSelected,
                status: this.status
            }).then( function( response ){
                if(response.status == 200 ){
                    alert('subscribed successfully.');
                }
            }.bind(this));
        },
        current_Subscription(){
            axios.get('/api/user/currentSubscription', {
        }).then( function( response ){
            this.status = response.data[0].stripe_status;
            console.log(response.data[0]);
            if(response.data[0].stripe_status == 'active' || response.data[0].stripe_status == 'trialing'){
                
                this.selectedPlan = response.data[0].stripe_price;
            }else{
                
            }

        }.bind(this));
        }
    },
    mounted(){
        const store = useStore();
        const route = useRoute();
        if(!store.state.apiToken == 0){
            this.includeStripe('js.stripe.com/v3/', function(){
            this.configureStripe();
        }.bind(this) );
        this.loadIntent();
        this.loadPaymentMethods();
        this.current_Subscription();
        }else{
            this.$router.push({name: 'Login'})

        }
        
    },
}
</script>
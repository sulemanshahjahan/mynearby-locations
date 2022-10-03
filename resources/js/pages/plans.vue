<template>
    <div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="">
                
                <div class="card-body">
                    <h1>Hello</h1>
                    <ul>
                        <li v-for="plan in plans" :key="plan"><router-link :to="plan.identifier">{{plan.title}}</router-link></li>
                    </ul>
                  
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
  import ApiCall from '../services/APICalls.js';
     export default{
        data(){
          return {
            plans: []
          }
        },
        mounted(){
            ApiCall.getPlans()
            .then(response => {
                this.plans = response.data.plans;
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
        }
     }
</script>
import Vue from 'vue'
import App from './App.vue'
import vuetify from "@/plugins/vuetify";
import router from "./router";
import axios from 'axios';
// import VueRouterUserRoles from "vue-router-user-roles";

Vue.config.productionTip = false

Vue.prototype.$http = axios;
Vue.prototype.$api = 'http://127.0.0.1:8000/api';
Vue.prototype.$baseUrl = 'http://127.0.0.1:8000';

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app")

Vue.config.productionTip = false
// Vue.use(VueRouterUserRoles, { router });

// let authenticate;

// if(localStorage.getItem('isLogedin')==null ||localStorage.getItem('isLogedin')==0){
//     authenticate = Promise.resolve({role:"unauthenticated", isLogedin:false});
// }else{
//     authenticate = Promise.resolve({role:localStorage.getItem('roleId'), isLogedin:true});
// }

// authenticate.then(user=>{
//   Vue.prototype.$user.set(user);
//   new Vue({
    
//     router,
//     render: h => h(App)
//   }).$mount('#app')
// })

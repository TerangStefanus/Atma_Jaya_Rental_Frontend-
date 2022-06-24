import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
    return () => import(`../components/${path}.vue`)
}

const router = new VueRouter(
  {mode: 'history',
  routes: [
    // Tampilan Admin
    {
      path: '/Navbar',
      component: () => import('../components/Navbar/DashboardLayout'),
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          meta: { title: 'Dashboard' },
          component: importComponent('Navbar/Dashboard')
        },
        {
          path: '/driver',
          name: 'Driver',
          meta: { title: 'Driver' },
          component: importComponent('DataMaster/Driver')
        },
        {
          path: '/mobil',
          name: 'Mobil',
          meta: { title: 'Mobil' },
          component: importComponent('DataMaster/Mobil')
        },
        {
          path: '/pegawai',
          name: 'Pegawai',
          meta: { title: 'Pegawai' },
          component: importComponent('DataMaster/Pegawai')
        },
        {
          path: '/promo',
          name: 'Promo',
          meta: { title: 'Promo' },
          component: importComponent('DataMaster/Promo')
        },
        {
          path: '/pemilik',
          name: 'Pemilik',
          meta: { title: 'Pemilik' },
          component: importComponent('DataMaster/Pemilik')
        },
        {
          path: '/jadwal',
          name: 'Jadwal',
          meta: { title: 'Jadwal' },
          component: importComponent('DataMaster/Jadwal')
        },
        {
          path: '/transaksi',
          name: 'Transaksi',
          meta: { title: 'Transaksi' },
          component: importComponent('DataMaster/Transaksi')
        },
        {
          path: '/customer',
          name: 'Customer',
          meta: { title: 'Customer' },
          component: importComponent('DataMaster/Customer')
        },
      ]
    },
    // Tampilan Customer
    // {
    //   path: '/',
    //   name: 'Home',
    //   // redirect:{name: 'Home Options'},
    //   meta: {title: 'Atma Jaya Rental'},
    //   component: importComponent('home'),
    //   children:[
    //     {
    //       path: '/home',
    //       name: 'Home',
    //       meta:{
    //         title: 'Atma Jaya Rental',
    //         permissions:[
    //           {
    //             role: 'unauthenticated',
    //             accces: false ,
    //             redirect: "Login"
    //           }
    //         ]
    //       },
    //       component:importComponent('home_options')
    //     },
    //     {
    //       path: '/login',
    //       name: 'Login',
    //       meta: {title: 'Login'},
    //       component: importComponent('login')
    //     },
    //   ]


    // }


  ]
})

// router.beforeEach((to, from, next)=>{
//   if(to.name!="Login" && localStorage.getItem("isLogedin")!=1){
//       next('Login')
//   }else if(to.name=="Login" && localStorage.getItem("isLogedin")==1 ){
//       next('Home')
//   }
  
//   document.title = to.meta.title;
//   next();
// });

export default router

<template>
<div>
    <b-navbar fixed="top" toggleable="lg"  class="nav-item" style="background-color:white;box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15) " >

            <b-navbar-brand to="/home">
                <img src="../assets/logo.png" style="margin-right:10px;margin-left:20%" width="40px" class="d-inline-block align-top" alt="Logo AKB" >
                <b-nav-text>
                      Atma Jaya Rental
                </b-nav-text>
            </b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto" >
                <b-nav-item v-if="isLogedin==authentication" to="/login" style="margin-right:20%">Login</b-nav-item>
                <b-nav-item v-if="isLogedin==authentication" to="/login" style="margin-right:20%">Login</b-nav-item>
                <b-nav-item-dropdown v-else :text="`Hi,`+ username " right>
                  <!-- <b-dropdown-item to="/profile">Profile</b-dropdown-item> -->
                  <b-dropdown-item v-if="role.nama_role=='Manager'" to="/role">Dashboard</b-dropdown-item>
                  <b-dropdown-item v-else-if="role.nama_role=='Customer Service'" to="/Mobil">Dashboard</b-dropdown-item>

                  <b-dropdown-item v-else disabled to="/role">Dashboard</b-dropdown-item>
                  <b-dropdown-item @click="logout">Logout<b-icon icon="arrow-bar-right" style="margin-left:10px"></b-icon></b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        
       
        <router-view></router-view>
</div>
</template>

<script>
export default {
    data(){
        return{
            isLogedin:false,
            role:''
        }
    },
    beforeMount(){
      this.readRole()
    },
    methods:{  
      readRole(){
        var url = this.$api + '/role/'+ localStorage.getItem('roleId')
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.role = response.data.data
           })
      },
      logout(){
          let user;
           this.item = new FormData;
        var url = this.$api + '/logout'
              this.load = true
              this.$http.post(url, this.item, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
              }).then(response => {
                this.error_message = response.data.message;
                localStorage.setItem('token',null);
                localStorage.setItem('access_token',null);
                localStorage.setItem('isLogedin',0);
                localStorage.setItem('email',null);
                localStorage.setItem('roleId',null);
                user={
                  role:"unauthenticated",
                  id:null,
                  isLogedin:false
                }
                this.isLogedin=false
                this.$user.set(user);
                 this.$router.push({
                  name:"Login"
                });

              }).catch(error => {
                this.error_message = error.response.data.message;
              })          
              
             
        },
    },
    // computed:{
    //   username()
    //   {
    //      if(this.$user.get().isLogedin==true){
    //        return localStorage.getItem('name')
    //      }else
    //         return ''
    //   },
    //   authentication()
    //   {
    //         if(this.$user.get().isLogedin===true)
    //             {
    //                 return true
    //             }
    //           else
    //             {
    //                 return false
    //             }      
    //   },
    // }
}
</script>
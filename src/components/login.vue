<template>
    <b-container>
      <b-card no-body class="overflow-hidden" style="margin-top:10%;background-color:white;box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15)">
          <b-row no-gutters>
            <b-col md="6">
              <img src="../assets/login.png" width="80%" style="margin-top:15%;margin-bottom:15%" alt="Image" class="rounded-0">
            </b-col>
            <b-col md="6">
        <b-card-body >
                <b-row
            class="justify-content-md-center"
            style="padding-top: 18%"
            align-v="center"
          >
            <h1 class="text-center" style="color:#A53A1D"><b>SIGN IN</b></h1>
          </b-row>

          <!--SIGN IN FORM -->
          <b-form class="px-5 pt-5" ref="form">
            <b-form-row class="mb-3">
              <b-input-group>
                <b-input-group-prepend is-text class="text" >
                  <b-icon icon="envelope-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                  type="email"
                  v-model="email_model"
                  placeholder="Email" 
                  :state="email_error"
                ></b-form-input>
            
              </b-input-group>
               <b-form-row class="mb-3" v-if="!email_error" style="color:red; margin-left:2px">
                    {{error_txt}}
                </b-form-row>
            </b-form-row>
           
            <b-form-row class="mb-3">
              <b-input-group>
                <b-input-group-prepend is-text class="text">
                  <b-icon icon="lock-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                      type="password"
                      placeholder="Password"
                      v-model="password_model"
                      :state="password_error"
                    ></b-form-input>
                  </b-input-group>
                  <b-form-row class="mb-3" v-if="!password_error" style="color:red; margin-left:2px">
                        {{password_error_txt}}
                    </b-form-row>
                </b-form-row>

                <b-form-row class="pt-5">
                  <b-button
                    class="py-2 font-weight-bold border-0"
                    block
                    @click="submit"
                    style="background-color: #A53A1D; border-radius: 0.5rem"
                    >Sign In</b-button
                  >
                </b-form-row>
              </b-form>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>

        <b-toast v-model="toast" :title="title" :variant="toastVar" toaster="b-toaster-bottom-center">
          {{error_message}}
        </b-toast >
    </b-container>

</template>


<script>
import {emailRegex} from '@/validation/regex'
export default {
    data(){
        return{
            email_model: "",
            password_model: "",
            error_txt:"",
            email_error:null,
            password_error:null,
            password_error_txt:"",
            source:"../assets/Atma Jaya Rental.png",
            toast:false,
            title:'',
            toastVar:'default',
            error_message:''
        }
    },
    methods:{
        validate(){
            var error=0
            if(!RegExp(emailRegex).test(this.email_model)){
                this.email_error = false
                this.error_txt = "Email tidak valid"
                error += 1
            }else
                this.email_error=true
            if(this.password_model.length<1){
                this.password_error = false
                this.password_error_txt = "Password tidak boleh kosong"
                error += 1
            }
            else
                this.password_error=true

            return error

        },
        submit(){
            this.validate();
          this.$http
          .post(this.$api + "/login", {
            email: this.email_model,
            password: this.password_model,
          })
          .then((response) => {
            localStorage.setItem("access_token",response.data.access_token);
            localStorage.setItem("email",this.email_model);
            localStorage.setItem("isLogedin",1)
            this.getDataPegawai(response);
            this.error_message = response.data.message;
            this.title='Success'
            this.toastVar='success'
            this.toast=true
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.error_txt = ""
            this.password_error_txt = ""
            this.email_error=false
            this.password_error=false
            this.title='Warning!!!'
            this.toastVar='danger'
            this.toast=true
          });

        },
        getDataPegawai(item){
          let user;
           var url = this.$api + '/pegawai/'+item.data.user.email 
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + item.data.access_token
            }
        }).then(response => {
            localStorage.setItem('roleId',response.data.data.id)
            localStorage.setItem('nama', response.data.data.nama)
            user={
              role:response.data.data.id,//id jabatan
              id:response.data.data.id,//id karyawan
              isLogedin:true,
            }
            this.$user.set(user);
            this.$router.push({name:'Home Options'}).catch(() => {});
           })

        }
    }
}

</script>

<style scoped>
#sign-in {
  padding-top: 10%;
  padding-bottom: 7%;
}
.bg-info {
  background-color: #f2f5f7 !important;
}
.rounded {
  border-radius: 1rem !important;
}
.card-img-left {
  border-top-right-radius: 0 !important;
  border-top-left-radius: 1rem !important;
  border-bottom-right-radius: 0 !important;
  border-bottom-left-radius: 1rem !important;
}
</style>
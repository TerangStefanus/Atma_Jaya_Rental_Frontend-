<template>
    <body>
        <div>
          <b-card style="margin:0; margin-top:5%; box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.13)">
              <b-card-title style="font-weight:bold;color:#A53A1D ">
                  Data Jabatan
              </b-card-title>
            <div class="d-flex justify-content-between align-items-center">
                    <input v-model="filter" type="text" class="form-control" style="width:40%"
                        placeholder="Search..." >
                      
                 <b-button @click="adding()" size="md" variant="no-outline" style="margin-bottom:5px;background-color:#EC7309;font-weight:bold;color:white"><b-icon icon="plus"></b-icon>Tambah Jabatan</b-button>
            </div>
                
           <b-table 
            id="my-table"
            :per-page="page"
            :current-page="currentPage"
            triped hover 
            :items="filteredRows" 
            :fields="fields"
            :busy="isBusy" class="mt-3" outlined

            >
            <template #table-busy>
                <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
                </div>
            </template>
            <template #cell(action)="filteredRows" >
                <b-button variant="no-outline" style="background-color:#EC7309;" class="iconEdit" @click="editForm(filteredRows.item)" v-b-modal.modal-center>
                <b-icon style="color:white" icon="pencil-fill"></b-icon>
                </b-button>
                
                <b-button style="margin-left:5px" variant="outline-danger" class="iconDelete" @click="deleteItem(filteredRows.item)" v-b-modal.modal-delete>
                <b-icon icon="X"></b-icon>
                </b-button>  
            </template>

            </b-table> 

          </b-card>
          <b-modal v-model="addModal"
            id="modal-prevent-closing"
            ref="modal"
            :title="desc_modal"
            @hidden="resetModal"
            @ok="handleOk">
              
                <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                    label="Nama Role"
                    label-for="nama_role-input"
                    invalid-feedback="Nama role tidak boleh kosong"
                    :state="nameState"
                    >
                    <b-form-input
                        id="nama_role-input"
                        v-model="nama_role"
                        :state="nameState"
                        required
                    ></b-form-input>
                    </b-form-group>
                </form>
              <template #modal-footer="{ cancel, ok}">
                <b-button variant="no-otline" style="background-color:#3D322F; color:white" @click="cancel()">
                    Cancel
                </b-button>
                <b-button variant="no-outline" style="background-color:#A53A1D;color:white" @click="ok()">
                    {{desc_modal}}
                </b-button>
            </template>
          </b-modal>
                
          <b-modal
           v-model="deleteModal"
           title="Delete Item"
           centered
           @ok="delete_confirmation">
            <h4 style="text-align:center">Anda yakin untuk menghapus?</h4>
                <template #modal-footer="{ cancel, ok}">
                <b-button variant="no-otline" style="background-color:#3D322F; color:white" @click="cancel()">
                    Cancel
                </b-button>
                <b-button variant="no-outline" style="background-color:#A53A1D;color:white" @click="ok()">
                    Yes
                </b-button>
                </template>
          </b-modal>
        </div>
         <div class="overflow-auto" style="margin-top:20px">
            <b-pagination
            v-model="currentPage"
            :total-rows="count()"
            :per-page="page"
            :current-page="currentPage"
            aria-controls="my-table"
            ></b-pagination>
         </div>

         <b-toast v-model="toast" :title="title" :variant="toastVar" toaster="b-toaster-bottom-center">
          {{error_message}}
        </b-toast >
    </body>
</template>
<script>
export default {
    data(){
        return{
            page:5,
            currentPage: 1,
            isBusy: false,
            filter:"",
            addModal:false,
            desc_modal:'',
            nama_role:'',
            nameState:null,
            deleteModal:false,
            delete_temp:null,
            id_item:null,
            rows:[
             ],
            fields:[
                 {key:'id',
                 sortable:true},
                 {key: 'nama_role',
                 sortable:true},
                 {key: 'action'},
            ],
            toast:false,
            title:'',
            toastVar:'',
            error_message:''
            
        }
    },

    methods:{
        count(){
            return this.filteredRows.length
        },
        toggleBusy() {
        this.isBusy = !this.isBusy
      },
      adding(){
          this.desc_modal='Tambah Jabatan'
          this.addModal=true;
        
         
          
      },checkFormValidity() {
        const valid = this.$refs.form.checkValidity()
        this.nameState = valid
        return valid
      },
      resetModal() {
        this.nama_role = ''
        this.nameState = null
      },
      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()

        if(this.desc_modal=='Tambah Jabatan'){
            console.log(this.desc_modal)
        }
      },
      handleSubmit() {
        if (!this.checkFormValidity()) {
          return
        }
        if(this.desc_modal=="Tambah Jabatan"){
          this.addData()
        }else
          {
            this.editData()
          }
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
      },
      editForm(item){
          this.desc_modal='Edit Jabatan'
          this.nama_role=item.nama_role
          this.id=item.id
          this.addModal=true     
      },
      delete_confirmation(){
          console.log(this.delete_temp)
          var url = this.$api + '/delete-role/'+this.delete_temp.id
         this.$http.delete(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.error_message= response.data.message
            this.toastVar='success'
            this.title= 'Success'
            this.toast=true
            this.readData()
           }).catch(error => {
            this.error_message = error.response.data.message;
            this.toastVar='danger'
            this.title= 'Warning!!'
            this.toast=true
            })   
      },
      deleteItem(item){
          this.deleteModal=true
          this.delete_temp=item
      },
      readData(){
        var url = this.$api + '/role'
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.rows = response.data.data
           })
      },
      addData(){
        this.item = new FormData;
            this.item.append('nama_role',this.nama_role);
        var url = this.$api + '/role'
              this.load = true
              this.$http.post(url, this.item, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
              }).then(response => {
                this.error_message = response.data.message;
                this.toastVar='success'
                this.title= 'Success'
                this.toast=true

              }).catch(error => {
                this.error_message = error.response.data.message;
                this.toastVar='danger'
                this.title= 'Warning!!'
                this.toast=true
              })          
              
              this.readData()
      },editData(){
        let newData = {
        nama_role: this.nama_role,
        };
        var url = this.$api + "/update-role/" + this.id_item;
        this.load = true;
        this.$http
          .put(url, newData, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          })
          .then((response) => {
            this.error_message = response.data.message;
            this.toastVar='success'
            this.title= 'Success'
            this.toast=true
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.toastVar='danger'
            this.title= 'Warning!!'
            this.toast=true

          });
          this.readData()
        },
   
    },
    beforeMount(){
      if(this.rows==[]){
        this.toogleBusy()
      }
      this.readData()
    },
    computed:{
    filteredRows() {
        return this.rows.filter(row => {
        const id = row.id.toString().toLowerCase();
        const nama_role = row.nama_role.toLowerCase();
        const searchTerm = this.filter.toLowerCase();

        return nama_role.includes(searchTerm) ||
            id.includes(searchTerm);
    });
    
  },

    }
}
</script>
<style scoped>
body{

  padding-left: 10%;
  padding-right: 3%;
}
</style>

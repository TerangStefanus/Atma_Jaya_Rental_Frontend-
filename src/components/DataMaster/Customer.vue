<template>
    <v-main class="list">

        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details>
                </v-text-field>

                <v-spacer></v-spacer>

                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>

            </v-card-title>
            <v-data-table :headers="headers" :items="customers" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler (item)">edit</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">Delete</v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <v-span class="headline">{{ formTitle }} customer</v-span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama" label="Nama customer" required></v-text-field>
                        <v-text-field v-model="form.email" label="Email" required></v-text-field>
                        <v-text-field type="date" v-model="form.tanggal" label="Tanggal Lahir" required></v-text-field>
                        <v-text-field v-model="form.alamat" label="Alamat" required></v-text-field>
                        <v-text-field v-model="form.foto" label="Foto" required></v-text-field>
                        <v-text-field v-model="form.umur" label="Umur" required></v-text-field>
                        <v-text-field v-model="form.nomor_telepon" label="Nomor Telepon" required></v-text-field>
                        <v-text-field v-model="form.jenis_kelamin" label="Jenis Kelamin" required></v-text-field>
                    </v-container>
                    <v-card-action>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="setForm">Save</v-btn>
                    </v-card-action>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning</span>
                </v-card-title>
                <v-card-text>Anda Yakin ingin menghapus kelas ini?</v-card-text>
                <v-card-action>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteData">Delete</v-btn>
                </v-card-action>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      inputType: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      search: null,
      dialog: false,
      dialogConfirm: false,
      headers: [
        { text: 'Nama customer', align: 'start', sortable: true, value: 'nama' },
        { text: 'Email', value: 'email' },
        { text: 'Tanggal', value: 'tanggal' },
        { text: 'Alamat', value: 'alamat' },
        { text: 'Nomor Telepon', value: 'nomor_telepon' },
        { text: 'Jenis kelamin', value: 'jenis_kelamin' },
        { text: 'Umur', value: 'umur' },
        { text: 'Foto', value: 'foto' },
        { text: 'Actions', value: 'actions' }
      ],
      customer: new FormData(),
      customers: [],
      form: {
        nama: null,
        email: null,
        tanggal: null,
        foto:null,
        alamat: null,
        nomor_telepon: null,
        jenis_kelamin: null,
        umur: null,
      },
      deleteId: '',
      editId: ''
    }
  },
  methods: {
    setForm () {
      if (this.inputType !== 'Tambah') {
        this.update()
      } else {
        this.save()
      }
    },
    // Read Data customers
    readData () {
      var url = this.$api + '/customer'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.customers = response.data.data
      })
    },
    // Simpan data customer
    save () {
      this.customer.append('nama', this.form.nama)
      this.customer.append('email', this.form.email)
      this.customer.append('password', this.form.password)
      this.customer.append('tanggal', this.form.tanggal)
      this.customer.append('foto', this.form.foto)
      this.customer.append('alamat', this.form.alamat)
      this.customer.append('nomor_telepon', this.form.nomor_telepon)
      this.customer.append('jenis_kelamin', this.form.jenis_kelamin)
      this.customer.append('umur', this.form.umur)
      
      var url = this.$api + '/customer/'
      this.load = true
      this.$http.post(url, this.customer, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = true
        this.close()
        this.readData() // baca data
        this.resetForm()
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    // Ubah data customer
    update () {
      const newData = {
        nama: this.form.nama,
        email: this.form.email,
        alamat: this.form.alamat,
        nomor_telepon: this.form.nomor_telepon,
        jenis_kelamin: this.form.jenis_kelamin,
        foto: this.form.foto,
        umur: this.form.umur,
        password: this.form.tanggal
      }
      var url = this.$api + '/customer/' + this.editId
      this.load = true
      this.$http.put(url, newData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.readData() // baca data
        this.resetForm()
        this.inputType = 'Tambah'
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    // Hapus data Produk
    deleteData () {
      // menghapus data
      var url = this.$api + '/customer/' + this.deleteId
      this.load = true
      this.$http.delete(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.readData() // baca data
        this.resetForm()
        this.inputType = 'Tambah'
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    editHandler (item) {
      this.inputType = 'Ubah'
      this.editId = item.id
      this.form.nama = item.nama
      this.form.email = item.email
      this.form.alamat = item.alamat
      this.form.nomor_telepon = item.nomor_telepon
      this.form.jenis_kelamin = item.jenis_kelamin
      this.form.umur = item.umur
      this.form.foto = item.foto
      this.dialog = true
    },
    deleteHandler (id) {
      this.deleteId = id
      this.dialogConfirm = true
    },
    close () {
      this.dialog = false
      this.inputType = 'Tambah'
      this.dialogConfirm = false
      this.readData()
    },
    cancel () {
      this.resetForm()
      this.readData()
      this.dialog = false
      this.dialogConfirm = false
      // this.inputType = 'Tambah'
    },
    resetForm () {
      this.form = {
        nama: null,
        email: null,
        alamat: null,
        nomor_telepon: null,
        jenis_kelamin: null,
        umur: null,
        foto: null
      }
    }
  },
  computed: {
    formTitle () {
      return this.inputType
    }
  },
  mounted () {
    this.readData()
  }
}
</script>

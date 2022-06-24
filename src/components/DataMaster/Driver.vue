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
            <v-data-table :headers="headers" :items="drivers" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler (item)">edit</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">Delete</v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <v-span class="headline">{{ formTitle }} driver</v-span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_driver" label="Nama Driver" required></v-text-field>
                        <v-text-field v-model="form.email" label="Email" required></v-text-field>
                        <v-text-field type="date" v-model="form.tanggal_lahir" label="Tanggal Lahir" required></v-text-field>
                        <v-text-field v-model="form.alamat" label="Alamat" required></v-text-field>
                        <v-text-field v-model="form.foto" label="Foto" required></v-text-field>
                        <v-text-field v-model="form.no_telepon" label="No Telepon" required></v-text-field>
                        <v-text-field v-model="form.jenis_kelamin" label="Jenis Kelamin" required></v-text-field>
                        <v-text-field v-model="form.rating" label="Rating" required></v-text-field>
                        <v-text-field v-model="form.bahasa" label="Bahasa" required></v-text-field>
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
        { text: 'Nama Driver', align: 'start', sortable: true, value: 'nama_driver' },
        { text: 'Email', value: 'email' },
        { text: 'Alamat', value: 'alamat' },
        { text: 'No Telepon', value: 'no_telepon' },
        { text: 'Jenis kelamin', value: 'jenis_kelamin' },
        { text: 'Rating', value: 'rating' },
        { text: 'Bahasa', value: 'bahasa' },
        { text: 'Actions', value: 'actions' }
      ],
      driver: new FormData(),
      drivers: [],
      form: {
        nama_driver: null,
        email: null,
        tanggal_lahir: null,
        foto:null,
        alamat: null,
        no_telepon: null,
        jenis_kelamin: null,
        rating: null,
        bahasa: null
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
    // Read Data drivers
    readData () {
      var url = this.$api + '/driver'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.drivers = response.data.data
      })
    },
    // Simpan data driver
    save () {
      this.driver.append('nama_driver', this.form.nama_driver)
      this.driver.append('email', this.form.email)
      this.driver.append('password', this.form.password)
      this.driver.append('tanggal_lahir', this.form.tanggal_lahir)
      this.driver.append('foto', this.form.foto)
      this.driver.append('alamat', this.form.alamat)
      this.driver.append('no_telepon', this.form.no_telepon)
      this.driver.append('jenis_kelamin', this.form.jenis_kelamin)
      this.driver.append('rating', this.form.rating)
      this.driver.append('bahasa', this.form.bahasa)

      var url = this.$api + '/driver/'
      this.load = true
      this.$http.post(url, this.driver, {
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
    // Ubah data driver
    update () {
      const newData = {
        nama_driver: this.form.nama_driver,
        email: this.form.email,
        alamat: this.form.alamat,
        no_telepon: this.form.no_telepon,
        jenis_kelamin: this.form.jenis_kelamin,
        rating: this.form.rating,
        bahasa: this.form.bahasa
      }
      var url = this.$api + '/driver/' + this.editId
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
      var url = this.$api + '/driver/' + this.deleteId
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
      this.form.nama_driver = item.nama_driver
      this.form.email = item.email
      this.form.alamat = item.alamat
      this.form.no_telepon = item.no_telepon
      this.form.jenis_kelamin = item.jenis_kelamin
      this.form.rating = item.rating
      this.form.bahasa = item.bahasa
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
        nama_driver: null,
        email: null,
        alamat: null,
        no_telepon: null,
        jenis_kelamin: null,
        rating: null,
        bahasa: null
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

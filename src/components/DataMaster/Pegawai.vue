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
            <v-data-table :headers="headers" :items="pegawais" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">edit</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">Delete</v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <v-span class="headline">{{ formTitle }} pegawai</v-span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-select :items="items" item-text="role_id" item-value="value" v-model="SelectRole" label="Nama Role" required ></v-select>
                        <v-text-field v-model="form.nama" label="Nama Pegawai" required></v-text-field>
                        <v-text-field v-model="form.alamat" label="Alamat" required></v-text-field>
                        <v-text-field v-model="form.email" label="Email" required></v-text-field>
                        <v-text-field type="date" v-model="form.tanggal_lahir" label="Tanggal Lahir" required></v-text-field>
                        <v-text-field v-model="form.no_telp" label="No Telepon" required></v-text-field>
                        <v-text-field v-model="form.jenis_kelamin" label="Jenis Kelamin" required></v-text-field>
                        <v-text-field v-model="form.foto_pegawai" label="Foto Pegawai" required></v-text-field>
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
      SelectRole: null,
      headers: [
        { text: 'Nama Pegawai', align: 'start', sortable: true, value: 'nama' },
        { text: 'Alamat', value: 'alamat' },
        { text: 'Email', value: 'email' },
        { text: 'Jenis Kelamin', value: 'jenis_kelamin' },
        { text: 'Tanggal Lahir', value: 'tanggal_lahir' },
        { text: 'No Telepon', value: 'no_telp' },
        { text: 'Foto Pegawai', value: 'foto_pegawai' },
        { text: 'Actions', value: 'actions' }
      ],
      items: [
        { role_id : 'MGR' , value: 1 }, 
        { role_id : 'ADM' , value: 2 }, 
        { role_id : 'CS' , value: 3 }, 
        ],
      pegawai: new FormData(),
      pegawais: [],
      form: {
        nama: null,
        alamat: null,
        email: null,
        no_telp: null,
        jenis_kelamin: null,
        tanggal_lahir: null,
        foto_pegawai: null,
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
    // Read Data pegawais
    readData () {
      var url = this.$api + '/pegawai'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.pegawais = response.data.data
      })
    },
    // Simpan data pegawai
    save () {
      this.pegawai.append('nama', this.form.nama)
      this.pegawai.append('alamat', this.form.alamat)
      this.pegawai.append('role_id', this.SelectRole)
      this.pegawai.append('password', this.form.password)
      this.pegawai.append('email', this.form.email)
      this.pegawai.append('no_telp', this.form.no_telp)
      this.pegawai.append('jenis_kelamin', this.form.jenis_kelamin)
      this.pegawai.append('tanggal_lahir', this.form.tanggal_lahir)
      this.pegawai.append('foto_pegawai', this.form.foto_pegawai)

      var url = this.$api + '/pegawai/'
      this.load = true
      this.$http.post(url, this.pegawai, {
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
    // Ubah data pegawai
    update () {
      const newData = {
        nama: this.form.nama,
        alamat: this.form.alamat,
        email: this.form.email,
        no_telp: this.form.no_telp,
        jenis_kelamin: this.form.jenis_kelamin,
        tanggal_lahir: this.form.tanggal_lahir,
        foto_pegawai: this.form.foto_pegawai
      }
      var url = this.$api + '/pegawai/' + this.editId
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
      var url = this.$api + '/pegawai/' + this.deleteId
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
      this.form.alamat = item.alamat
      this.form.email = item.email
      this.form.no_telp = item.no_telp
      this.form.jenis_kelamin = item.jenis_kelamin
      this.form.tanggal_lahir = item.tanggal_lahir
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
    },
    resetForm () {
      this.form = {
        nama: null,
        alamat: null,
        email: null,
        no_telp: null,
        jenis_kelamin: null,
        tanggal_lahir: null,
        foto_pegawai: null
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

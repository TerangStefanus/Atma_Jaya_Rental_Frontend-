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
            <v-data-table :headers="headers" :items="pemiliks" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">edit</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">Delete</v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <v-span class="headline">{{ formTitle }} pemilik</v-span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama" label="Nama" required></v-text-field>
                        <v-text-field v-model="form.alamat" label="Alamat" required></v-text-field>
                        <v-text-field v-model="form.no_telp" label="No Telp" required></v-text-field>
                        <v-text-field type="date" v-model="form.start_kontrak" label="Start Kontrak" required></v-text-field>
                        <v-text-field type="date" v-model="form.end_kontrak" label="End Kontrak" required></v-text-field>
                        <v-text-field type="date" v-model="form.tanggal_kontrak" label="Tanggal Kontrak" required></v-text-field>
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
        { text: 'Nama', align: 'start', sortable: true, value: 'nama' },
        { text: 'Alamat', value: 'alamat' },
        { text: 'No Telepon', value: 'no_telp' },
        { text: 'Start Kontrak', value: 'start_kontrak' },
        { text: 'End Kontrak', value: 'end_kontrak' },
        { text: 'Tanggal Kontrak', value: 'tanggal_kontrak' },
        { text: 'Actions', value: 'actions' }
      ],
      pemilik: new FormData(),
      pemiliks: [],
      form: {
        nama: null,
        alamat: null,
        no_telepon: null,
        start_kontrak: null,
        end_kontrak: null,
        tanggal_kontrak: null
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
    // Read Data pemiliks
    readData () {
      var url = this.$api + '/pemilik'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.pemiliks = response.data.data
      })
    },
    // Simpan data pemilik
    save () {
      this.pemilik.append('nama', this.form.nama)
      this.pemilik.append('alamat', this.form.alamat)
      this.pemilik.append('no_telp', this.form.no_telp)
      this.pemilik.append('start_kontrak', this.form.start_kontrak)
      this.pemilik.append('end_kontrak', this.form.end_kontrak)
      this.pemilik.append('tanggal_kontrak', this.form.tanggal_kontrak)

      var url = this.$api + '/pemilik/'
      this.load = true
      this.$http.post(url, this.pemilik, {
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
    // Ubah data pemilik
    update () {
      const newData = {
        nama: this.form.nama,
        alamat: this.form.alamat,
        no_telp: this.form.no_telp,
        start_kontrak: this.form.start_kontrak,
        end_kontrak: this.form.end_kontrak,
        tanggal_kontrak: this.form.tanggal_kontrak
      }
      var url = this.$api + '/pemilik/' + this.editId
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
      var url = this.$api + '/pemilik/' + this.deleteId
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
      this.form.no_telp = item.no_telp
      this.form.start_kontrak = item.start_kontrak
      this.form.end_kontrak = item.end_kontrak
      this.form.tanggal_kontrak = item.tanggal_kontrak
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
        nama_pemilik: null,
        alamat: null,
        no_telp: null,
        start_kontrak: null,
        end_kontrak: null,
        tanggal_kontrak: null
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

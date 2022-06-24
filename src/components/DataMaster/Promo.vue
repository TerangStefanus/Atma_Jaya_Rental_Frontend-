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
            <v-data-table :headers="headers" :items="promos" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">edit</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">Delete</v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <v-span class="headline">{{ formTitle }} promo</v-span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.jenis_promo" label="Jenis Promo" required></v-text-field>
                        <v-text-field v-model="form.keterangan" label="Keterangan" required></v-text-field>
                        <v-text-field v-model="form.diskon" label="Diskon" required></v-text-field>
                        <v-text-field v-model="form.status_promo" label="Status Promo" required></v-text-field>
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
        { text: 'Jenis Promo', align: 'start', sortable: true, value: 'jenis_promo' },
        { text: 'Keterangan', value: 'keterangan' },
        { text: 'Diskon', value: 'diskon' },
        { text: 'Status Promo', value: 'status_promo' },
        { text: 'Actions', value: 'actions' }
      ],
      promo: new FormData(),
      promos: [],
      form: {
        jenis_promo: null,
        keterangan: null,
        diskon: null,
        status_promo: null
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
    // Read Data promos
    readData () {
      var url = this.$api + '/promo'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.promos = response.data.data
      })
    },
    // Simpan data promo
    save () {
      this.promo.append('jenis_promo', this.form.jenis_promo)
      this.promo.append('keterangan', this.form.keterangan)
      this.promo.append('diskon', this.form.diskon)
      this.promo.append('status_promo', this.form.status_promo)

      var url = this.$api + '/promo/'
      this.load = true
      this.$http.post(url, this.promo, {
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
    // Ubah data promo
    update () {
      const newData = {
        jenis_promo: this.form.jenis_promo,
        keterangan: this.form.keterangan,
        diskon: this.form.diskon,
        status_promo: this.form.status_promo
      }
      var url = this.$api + '/promo/' + this.editId
      this.load = true
      this.$http.put(url, newData, {
        // headers: {
        //   Authorization: 'Bearer ' + localStorage.getItem('token')
        // }
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
      var url = this.$api + '/promo/' + this.deleteId
      this.load = true
      this.$http.delete(url, {
        // headers: {
        //   Authorization: 'Bearer ' + localStorage.getItem('token')
        // }
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
      this.form.jenis_promo = item.jenis_promo
      this.form.keterangan = item.keterangan
      this.form.diskon = item.diskon
      this.form.status_promo = item.status_promo
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
        jenis_promo: null,
        keterangan: null,
        diskon: null,
        status_promo: null
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

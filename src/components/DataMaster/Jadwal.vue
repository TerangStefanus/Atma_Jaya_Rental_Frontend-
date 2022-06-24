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
            <v-data-table :headers="headers" :items="jadwals" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">edit</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">Delete</v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <v-span class="headline">{{ formTitle }} jadwal</v-span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-select :items="items" item-text="pegawai_id" item-value="value" v-model="SelectRole" label="Nama Pegawai" required ></v-select>
                        <v-text-field v-model="form.hari_shift" label="Hari Shift" required></v-text-field>
                        <v-text-field v-model="form.waktu_shift" label="Waktu Shift" required></v-text-field>
                        <v-text-field v-model="form.waktu_selesai" label="Waktu Selesai" required></v-text-field>
                        <v-text-field v-model="form.jenis_shift" label="Jenis Shift" required></v-text-field>
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
        { text: 'Hari Shift', align: 'start', sortable: true, value: 'hari_shift' },
        { text: 'Waktu Shift', value: 'waktu_shift' },
        { text: 'Waktu Selesai', value: 'waktu_selesai' },
        { text: 'Jenis Shift', value: 'jenis_shift' },
        { text: 'Actions', value: 'actions' }
      ],
      items: [
        { pegawai_id : 'Rew' , value: 3 }, 
        { pegawai_id : 'TaraBat' , value: 4 }, 
        { pegawai_id : 'Penzi' , value: 5 }, 
        ],
      jadwal: new FormData(),
      jadwals: [],
      form: {
        hari_shift: null,
        waktu_shift: null,
        waktu_selesai: null,
        jenis_shift: null,
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
    // Read Data jadwals
    readData () {
      var url = this.$api + '/jadwal'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.jadwals = response.data.data
      })
    },
    // Simpan data jadwal
    save () {
      this.jadwal.append('hari_shift', this.form.hari_shift)
      this.jadwal.append('waktu_shift', this.form.waktu_shift)
      this.jadwal.append('pegawai_id', this.SelectRole)
      this.jadwal.append('waktu_selesai', this.form.waktu_selesai)
      this.jadwal.append('jenis_shift', this.form.jenis_shift)

      var url = this.$api + '/jadwal/'
      this.load = true
      this.$http.post(url, this.jadwal, {
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
    // Ubah data jadwal
    update () {
      const newData = {
        hari_shift: this.form.hari_shift,
        waktu_shift: this.form.waktu_shift,
        waktu_selesai: this.form.waktu_selesai,
        jenis_shift: this.form.jenis_shift,
      }
      var url = this.$api + '/jadwal/' + this.editId
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
      var url = this.$api + '/jadwal/' + this.deleteId
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
      this.form.hari_shift = item.hari_shift
      this.form.waktu_shift = item.waktu_shift
      this.form.waktu_selesai = item.waktu_selesai
      this.form.jenis_shift = item.jenis_shift
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
        hari_shift: null,
        waktu_shift: null,
        waktu_selesai: null,
        jenis_shift: null,
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

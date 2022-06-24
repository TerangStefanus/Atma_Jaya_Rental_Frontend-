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
            <v-data-table :headers="headers" :items="mobils" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">edit</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">Delete</v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <v-span class="headline">{{ formTitle }} mobil</v-span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-select :items="items" item-text="pemilik_id" item-value="value" v-model="SelectRole" label="Pemilik ID" required ></v-select>
                        <v-text-field v-model="form.nama_mobil" label="Nama mobil" required></v-text-field>
                        <v-text-field v-model="form.harga_sewa" label="Harga Sewa" required></v-text-field>
                        <v-text-field type="date" v-model="form.tanggal_servis" label="Tanggal Servis" required></v-text-field>
                        <v-text-field v-model="form.tipe_mobil" label="Tipe Mobil" required></v-text-field>
                        <v-text-field v-model="form.transmisi" label="Transmisi" required></v-text-field>
                        <v-text-field v-model="form.kapasitas" label="Kapasitas" required></v-text-field>
                        <v-text-field v-model="form.status_mobil" label="Status Mobil" required></v-text-field>
                        <v-text-field v-model="form.ownership" label="Ownership" required></v-text-field>
                        <v-text-field v-model="form.warna_mobil" label="Warna Mobil" required></v-text-field>
                        <v-text-field v-model="form.fasilitas" label="Faslitas" required></v-text-field>
                        <v-text-field v-model="form.bahan_bakar" label="Bahan Bakar" required></v-text-field>
                        <v-text-field v-model="form.plat" label="Plat" required></v-text-field>
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
        { text: 'Nama mobil', align: 'start', sortable: true, value: 'nama_mobil' },
        { text: 'Harga sewa', value: 'harga_sewa' },
        { text: 'Tanggal servis', value: 'tanggal_servis' },
        { text: 'Tipe Mobil', value: 'tipe_mobil' },
        { text: 'Transmisi', value: 'transmisi' },
        { text: 'Kapasitas', value: 'kapasitas' },
        { text: 'Status Mobil', value: 'status_mobil' },
        { text: 'Ownership', value: 'ownership' },
        { text: 'Warna Mobil', value: 'warna_mobil' },
        { text: 'Fasilitas', value: 'fasilitas' },
        { text: 'Bahan Bakar', value: 'bahan_bakar' },
        { text: 'Plat', value: 'plat' },
        { text: 'Actions', value: 'actions' }
      ],
      items: [
        { pemilik_id : 'Sikala' , value: '1' }, 
        { pemilik_id : 'Narnia' , value: '6' }, 
        { pemilik_id : 'Linocc' , value: '7' }, 
        ],
      mobil: new FormData(),
      mobils: [],
      form: {
        nama_mobil: null,
        harga_sewa: null,
        tanggal_servis: null,
        tipe_mobil: null,
        transmisi: null,
        kapasitas: null,
        status_mobil: null,
        ownership: null,
        warna_mobil: null,
        fasilitas: null,
        bahan_bakar: null,
        plat: null,
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
    // Read Data mobils
    readData () {
      var url = this.$api + '/mobil'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.mobils = response.data.data
      })
    },
    // Simpan data mobil
    save () {
      this.mobil.append('pemilik_id', this.form.SelectRole)
      this.mobil.append('nama_mobil', this.form.nama_mobil)
      this.mobil.append('harga_sewa', this.form.harga_sewa)
      this.mobil.append('tanggal_servis', this.tanggal_servis)
      this.mobil.append('tipe_mobil', this.form.tipe_mobil)
      this.mobil.append('transmisi', this.form.transmisi)
      this.mobil.append('kapasitas', this.form.kapasitas)
      this.mobil.append('status_mobil', this.form.status_mobil)
      this.mobil.append('ownership', this.form.ownership)
      this.mobil.append('warna_mobil', this.form.warna_mobil)
      this.mobil.append('fasilitas', this.form.fasilitas)
      this.mobil.append('bahan_bakar', this.form.bahan_bakar)
      this.mobil.append('plat', this.form.plat)

      var url = this.$api + '/mobil/'
      this.load = true
      this.$http.post(url, this.mobil, {
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
    // Ubah data mobil
    update () {
      const newData = {
        nama_mobil: this.form.nama_mobil,
        harga_sewa: this.form.harga_sewa,
        tanggal_servis: this.form.tanggal_servis,
        tipe_mobil: this.form.tipe_mobil,
        transmisi: this.form.transmisi,
        kapasitas: this.form.kapasitas,
        status_mobil: this.form.status_mobil,
        ownership: this.form.ownership,
        warna_mobil: this.form.warna_mobil,
        fasilitas: this.form.fasilitas,
        bahan_bakar: this.form.bahan_bakar,
        plat: this.form.plat
      }
      var url = this.$api + '/mobil/' + this.editId
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
      var url = this.$api + '/mobil/' + this.deleteId
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
      this.form.nama_mobil = item.nama_mobil
      this.form.harga_sewa = item.harga_sewa
      this.form.tipe_mobil = item.tipe_mobil
      this.form.transmisi = item.transmisi
      this.form.kapasitas = item.kapasitas
      this.form.status_mobil = item.status_mobil
      this.form.ownership = item.ownership
      this.form.warna_mobil = item.warna_mobil
      this.form.fasilitas = item.fasilitas
      this.form.bahan_bakar = item.bahan_bakar
      this.form.plat = item.plat
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
        nama_mobil: null,
        harga_sewa: null,
        tanggal_servis: null,
        tipe_mobil: null,
        transmisi: null,
        kapasitas: null,
        status_mobil: null,
        ownership: null,
        warna_mobil: null,
        fasilitas: null,
        bahan_bakar: null,
        plat: null
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

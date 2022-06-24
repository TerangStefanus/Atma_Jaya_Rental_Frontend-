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
            <v-data-table :headers="headers" :items="transaksis" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)">edit</v-btn>
                    <v-btn small @click="deleteHandler(item.id)">Delete</v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <v-span class="headline">{{ formTitle }} transaksi</v-span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-select :items="items" item-text="customer_id" item-value="value" v-model="SelectCustomer" label="User" required ></v-select>
                        <v-text-field v-model="form.total" label="Total" required></v-text-field>
                        <v-text-field v-model="form.denda" label="Denda" required></v-text-field>
                        <v-text-field v-model="form.metode_pembayaran" label="Metode Pembayaran" required></v-text-field>
                        <v-text-field v-model="form.status_transaksi" label="Status Transaksi" required></v-text-field>
                        <v-text-field type="date" v-model="form.start_pinjam" label="Pinjam Mulai Tanggal" required></v-text-field>
                        <v-text-field type="date" v-model="form.end_pinjam" label="Kembali Tanggal" required></v-text-field>
                        <v-select :items="items2" item-text="mobil_id" item-value="value" v-model="SelectCar" label="Pilih Mobil" required ></v-select>
                        <v-select :items="items3" item-text="driver_id" item-value="value" v-model="SelectDriver" label="Pilih Driver" required ></v-select>
                        <v-select :items="items4" item-text="promo_id" item-value="value" v-model="SelectCoupon" label="Pilih Promo" required ></v-select>
                        <v-text-field v-model="form.subtotal_bayar" label="Subtotal Bayar" required></v-text-field>
                        <v-text-field v-model="form.rate_driver" label="Rate Driver" required></v-text-field>
                        <v-text-field v-model="form.jenis_transaksi" label="Jenis Transaksi" required></v-text-field>
                        <v-select :items="items5" item-text="pegawai_id" item-value="value" v-model="SelectPegawai" label="Responsible Employee" required ></v-select>
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
      SelectCustomer: null,
      SelectCar: null,
      SelectDriver: null,
      SelectCoupon: null,
      SelectPegawai: null,
      items: [
        { customer_id : 'Stevinus' , value: 1 }, 
        { customer_id : 'Hendi' , value: 2 }, 
        { customer_id : 'Takara' , value: 3 }, 
        ],
      items2: [
        { mobil_id : 'Avanza' , value: 1 }, 
        { mobil_id : 'Jeep' , value: 2 }, 
        { mobil_id : 'Alphard' , value: 3 }, 
        ],
      items3: [
        { driver_id : 'Willi' , value: 1 }, 
        { driver_id : 'Hadi' , value: 4 }, 
        { driver_id : 'Kaito' , value: 5 }, 
        ],
      items4: [
        { promo_id : 'MDK' , value: 3 }, 
        { promo_id : 'MHS' , value: 4 }, 
        ], 
      items5: [
        { pegawai_id : 'Rew' , value: 3 }, 
        { pegawai_id : 'TaraBat' , value: 4 },
        { pegawai_id : 'Penzi' , value: 5 },  
        ],     
      headers: [
        { text: 'Total', align: 'start', sortable: true, value: 'total' },
        { text: 'Denda', value: 'denda' },
        { text: 'Metode Pembayaran', value: 'metode_pembayaran' },
        { text: 'Status Transaksi', value: 'status_transaksi' },
        { text: 'Start Pinjam', value: 'start_pinjam' },
        { text: 'End Pinjam', value: 'end_pinjam' },
        { text: 'Subtotal Bayar', value: 'subtotal_bayar' },
        { text: 'Rate Driver', value: 'rate_driver' },
        { text: 'Jenis Transaksi', value: 'jenis_transaksi' },
        { text: 'ID Transaksi', value: 'id' },
        { text: 'Actions', value: 'actions' }
      ],
      transaksi: new FormData(),
      transaksis: [],
      form: {
        total: null,
        denda: null,
        metode_pembayaran: null,
        status_transaksi: null,
        tanggal_lahir: null,
        start_pinjam: null,
        end_pinjam: null,
        subtotal_bayar: null,
        rate_driver: null,
        jenis_transaksi: null,
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
    // Read Data transaksis
    readData () {
      var url = this.$api + '/transaksi'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.transaksis = response.data.data
      })
    },
    // Simpan data transaksi
    save () {
      this.transaksi.append('customer_id', this.SelectCustomer)
      this.transaksi.append('total', this.form.total)
      this.transaksi.append('denda', this.form.denda)
      this.transaksi.append('metode_pembayaran', this.form.metode_pembayaran)
      this.transaksi.append('status_transaksi', this.form.status_transaksi)
      this.transaksi.append('start_pinjam', this.form.start_pinjam)
      this.transaksi.append('end_pinjam', this.form.end_pinjam)
      this.transaksi.append('mobile_id', this.SelectCar)
      this.transaksi.append('driver_id', this.SelectDriver)
      this.transaksi.append('promo_id', this.SelectCoupon)
      this.transaksi.append('subtotal_bayar', this.form.subtotal_bayar)
      this.transaksi.append('rate_driver', this.form.rate_driver)
      this.transaksi.append('jenis_transaksi', this.form.jenis_transaksi)
      this.transaksi.append('pegawai_id', this.form.SelectPegawai)

      var url = this.$api + '/transaksi/'
      this.load = true
      this.$http.post(url, this.transaksi, {
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
    // Ubah data transaksi
    update () {
      const newData = {
        total: this.form.total,
        denda: this.form.denda,
        metode_pembayaran: this.form.metode_pembayaran,
        status_transaksi: this.form.status_transaksi,
        start_pinjam: this.form.start_pinjam,
        end_pinjam: this.form.end_pinjam,
        subtotal_bayar: this.form.subtotal_bayar,
        rate_driver: this.form.rate_driver,
        jenis_transaksi: this.form.jenis_transaksi
      }
      var url = this.$api + '/transaksi/' + this.editId
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
      var url = this.$api + '/transaksi/' + this.deleteId
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
      this.form.total = item.total
      this.form.denda = item.denda
      this.form.metode_pembayaran = item.metode_pembayaran
      this.form.status_transaksi = item.status_transaksi
      this.form.start_pinjam = item.start_pinjam
      this.form.end_pinjam = item.end_pinjam
      this.form.subtotal_bayar = item.subtotal_bayar
      this.form.rate_driver = item.rate_driver
      this.form.jenis_transaksi = item.jenis_transaksi
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
        total: null,
        denda: null,
        metode_pembayaran: null,
        status_transaksi: null,
        start_pinjam: null,
        end_pinjam: null,
        subtotal_bayar: null,
        rate_driver: null,
        jenis_transaksi: null
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

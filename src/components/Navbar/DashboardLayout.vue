/* eslint-disable vue/multi-word-component-names */
<template>
  <div class="dashboard">
    <v-navigation-drawer v-model="drawer" class="fullheight white--text" width="256" color="blue" app text="white">
        <v-list-item class="white--text">
            <v-list-item-content>
                <v-list-item-title class="title"> Atma Jaya Rental </v-list-item-title>
                <v-list-item-subtitle class="white--text"> Admin Panel </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list dense nav>
            <v-list-item
            class="white--text"
              v-for="item in items"
              :key="item.title"
              link
              tag="router-link"
              :to="item.to">
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-app-bar app fixed height="75px" color="orange">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <VSpacer />
      <v-toolbar-items >
        <v-btn text router><v-icon>mdi-power</v-icon></v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <div class="fullheight pa-5">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Dashboard',
  data () {
    return {
      drawer: true,
      items: [
        { title: 'Driver', to: '/driver' },
        { title: 'Mobil', to: '/mobil' },
        { title: 'Pegawai', to: '/pegawai' },
        { title: 'Promo', to: '/promo' },
        { title: 'Pemilik Mobil', to: '/pemilik' },
        { title: 'Jadwal', to: '/jadwal' },
        { title: 'Customer', to: '/customer' },
        { title: 'Transaksi', to: '/transaksi' }
      ]
    }
  }
}
</script>

<style scoped>
.fullheight {
  min-height: 100vh !important;
}

.router{
  text-decoration: none;
  color: rgb(247, 239, 6);
}

.tes{
  text-decoration: none;
  color: rgb(247, 239, 6);
}

</style>

<template class="navbar">
<v-app-bar
      app
      color="primary"
      dark
    >
    <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"/>
          <h1>Recipe</h1>
        <!-- <router-link><h1>re2</h1></router-link> -->
      </div>

      <v-spacer></v-spacer>
      <router-link to="/ingredients-list/">
      <v-btn
        text
      >
        <span class="mr-2">Ingredients</span>
      </v-btn>
      </router-link>
      <router-link to="/">
      <v-btn
        text
      >
        <span class="mr-2">Home</span>
      </v-btn>
      </router-link>
      </v-app-bar>
</template>

<script>
export default {
    name: "Navbar",

    components: {

    },

    data: () => ({

    }),
}
</script>
<style scoped>
.navbar {
  margin-bottom: 20px;;
}
</style>
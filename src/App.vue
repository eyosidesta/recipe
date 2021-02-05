<template>
  <v-app>
    <Navbar />
      
    

    <v-main>

      <router-view></router-view>
      <!-- <RecipeList /> -->
      <!-- <HelloWorld /> -->
      <!-- <Home /> -->
    </v-main>
    <Footbar />
  </v-app>
  
</template>

<script>

import Navbar from './components/Navbar';
import Footbar from './components/Footer';
// import RecipeList from './components/Recipe/RecipeLists';
// import HelloWorld from './components/HelloWorld';
// import Home from './components/Home';
export default {
  name: 'App',

  components: {
    Navbar,
    Footbar,
    // RecipeList,
    // Home
    // HelloWorld
  },

  data: () => ({
    
  }),
};
</script>

import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import {ApolloClient} from'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import VueApollo from 'vue-apollo';

import VImageInput from 'vuetify-image-input';

import VueRouter from 'vue-router';
import RecipeList from './components/Recipe/RecipeLists';
import RecipeDetail from './components/Recipe/RecipeDetail';
import Ingredients from './components/Ingredients';


Vue.config.productionTip = false

// const httpLink = new HttpLink({
//   url: 'https://working-hare-38.hasura.app/v1/graphql'
// });

const routes = [
  // {
  //   path: '/',
  //   component: App,
  // },
  {
    path: '/',
    component: RecipeList
  },
  {
    path: '/recipes/:id',
    name: 'recipes',
    component: RecipeDetail,
    props: true
  },
  {
    path: '/ingredients/:id',
    name: 'ingredients',
    component: Ingredients,
    props: true
  }
]

const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

const customeFetch = (uri, options) => {
  return fetch(uri, options)
  .then(response => {
    if(response.status >= 500) {
      return Promise.reject(response.status);
    }
    return response;
  });
};

const apolloClient = new ApolloClient({
  // link: httpLink,
  link: createHttpLink({
    uri: 'https://working-hare-38.hasura.app/v1/graphql',
    fetch: customeFetch,
  }),
  cache: new InMemoryCache(),
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.use(VueRouter);
Vue.component(VImageInput.name, VImageInput);
Vue.use(VueApollo);

new Vue({
  vuetify,
  apolloProvider,
  router,
  render: h => h(App)
}).$mount('#app')

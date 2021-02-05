<template>
<v-container>
    <v-row class="text-center">

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Recipe Lists
        </h1>
        <!-- ////////////////////// dialog starts here -->
          
          <v-row justify="center">
            <v-dialog
              v-model="dialog"
              persistent
              max-width="600px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  Add Recipe
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Recipe</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="Title*"
                          v-model="title"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Description*"
                          v-model="description"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Image*"
                          v-model="image"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="dialog = false"
                  >
                    Close
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="addRecipe"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
          
         <!-- ////////////////////// dialog ends here -->
      </v-col>
    </v-row>

  <v-card
    class="mx-auto"
    max-width="500"
  >
    <v-toolbar
      color="deep-purple accent-4"
      dark
    >

      <v-toolbar-title>Recipe</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list subheader>

      <v-list-item
        v-for="recipe in recipe"
        :key="recipe.id"
      >
        <v-list-item-avatar>
          <v-img
            :alt="`${recipe.title} avatar`"
            :src="recipe.image"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="recipe.title"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <router-link :to="{name: 'recipes', params: {id: recipe.id}}"><v-icon>mdi-dots-vertical</v-icon></router-link>
        </v-list-item-icon>
      </v-list-item>
    </v-list>

  </v-card>
  </v-container>
</template>

<script>

  // import RecipeDetail from './RecipeDetail';
  import gql from 'graphql-tag';

  const ADD_RECIPES = gql`
  mutation addRecipe($title: String!
   $description: String!
    $image: String!) {
    insert_recipe(objects: [ {
      title: $title,
      description: $description,
      image: $image
    }]) {
      returning {
        id
      }
    }
  }
  `

  const GET_RECIPES = gql`
  query get_recipes{
    recipe {
      id
      title
      description
      image
    }
  }
  `;
  export default {
    name: "RecipeList",
    apollo: {
      recipe: {
        query: GET_RECIPES,
      }
    },
    methods: {
      recipes2() {
        console.log(this.recipe[0].title);
      },
      addRecipe() {
        const {title, description, image} = this.$data;
        this.$apollo.mutate({
          mutation: ADD_RECIPES,
          variables: {
            title,
            description,
            image
          },
          refetchQueries: ['get_recipes'],
        }),
        this.dialog = false;
        this.title = '';
        this.description = '';
        this.image = '';
      },
      detail(id) {
        console.log(id);
      }
    },
    data: () => ({
      recipe: [],
      dialog: false,
      title: '',
      description: '',
      image: '',
    }),
  }
</script>

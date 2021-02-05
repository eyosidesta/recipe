<template>
<div>
    <h1 class="recipe_title">{{this.recipe[0].title}}</h1>
  <v-card
    class="mx-auto "
    max-width="600"
  >
    <v-img
      class="white--text align-end"
      height="200px"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
    >
      <v-card-title>{{this.recipe[0].title}}</v-card-title>
    </v-img>

    <v-card-subtitle class="pb-0">
      Recipe {{this.recipe[0].id}}
    </v-card-subtitle>

    <v-card-text class="text--primary">
      <div>{{this.recipe[0].description}}</div>
    </v-card-text>

    <v-card-actions>
      <v-dialog
              v-model="dialog"
              persistent
              max-width="600px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="orange"
                    text
                    v-bind="attrs"
                    v-on="on"
                >
                    Update
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
                          v-model="recipe[0].title"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Description*"
                          v-model="recipe[0].description"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Image*"
                          v-model="recipe[0].image"
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
                    @click="updateRecipe"
                  >
                    Update
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

      <v-btn
        color="red"
        text
        v-on:click="deleteRecipe(`${recipe[0].id}`)">
      
        Delete
      </v-btn>
      <router-link :to="{name: 'ingredients', params: {id: recipe[0].id} }">
      <v-btn
        color="orange"
        text
        >
        Add Ingredient
      </v-btn></router-link>
    </v-card-actions>
  </v-card>
</div>
</template>

<script>
import gql from 'graphql-tag';
const GET_RECIPE_BY_ID = gql`query get_recipe_by_id($id: Int!){
    recipe(where: {id: {_eq: $id}}) {
        id,
        title,
        description,
        image
    }
}
`;

const DELETE_AMOUNT = gql`mutation delete_amount($id: Int!) {
    delete_quantities(where: {recipe_ingredient: {recipe_id: {_eq: $id}}}) {
        returning {
            id
        }
    }
}
`;
const DELETE_RECIPE_INGREDIENT = gql`
mutation delete_recipe_ingredient($id: Int!) {
    delete_recipe_ingredient(where: {recipe_id: {_eq: $id}}) {
        returning {
            id
        }
    }
}
`;
const DELETE_RECIPE = gql`
mutation delete_recipe($id: Int!) {
    delete_recipe_by_pk(id: $id){
        id
    }
}
`;

const UPDATE_RECIPE = gql`
mutation update_recipe($id: Int!, $title: String!, $description: String!, $image: String!) {
    update_recipe_by_pk(pk_columns: {id: $id},
     _set: {title: $title, description: $description, image: $image}) {
        id
    }
}
`
export default {
    name: "RecipeDetail",
    props: ["id"],
    apollo: {
        recipe: {
            query: GET_RECIPE_BY_ID,
            variables: function() {
                return {
                    id: this.$data.recipe_id,
                }
            }
        }
    },
    data: function() {
        return {
        recipe: [{
            id: '',
            title: '',
            description: '',
            image: ''
        }],
        //     title: '',
        // },
        recipe_id: this.id,
        title: '',
        description: '',
        image: '',
        dialog: false,
    }},
    methods: {
        deleteRecipe(id) {
            this.$apollo.mutate({
                mutation: DELETE_AMOUNT,
                variables: {
                    id: id
                }
            }),
            this.$apollo.mutate({
                mutation: DELETE_RECIPE_INGREDIENT,
                variables: {
                    id: id
                },
            }),
            this.$apollo.mutate({
                mutation: DELETE_RECIPE,
                variables: {
                    id: id
                }
            });
            this.$router.push('/');
            console.log("yes we do " + id);
        },
        updateRecipe() {
            const {id, title, description, image} = this.$data.recipe[0];
            this.$apollo.mutate({
                mutation: UPDATE_RECIPE,
                variables: {
                    id,
                    title,
                    description,
                    image
                },
                refetchQueries: ['get_recipe_by_id'],
            });
            this.$data.dialog = false;
        }
    }
}
</script>
<style scoped>
.detail-top {
    margin-top: 20;
}
.recipe_title {
    text-align: center;
}
</style>
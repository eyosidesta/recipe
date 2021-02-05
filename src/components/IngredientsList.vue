<template>
<div>
    <h1>Ingredients</h1>
    <v-btn @click.stop="ingredient_dialog = true" color="teal" dark>
          Add Ingredient</v-btn>

            <v-dialog
            v-model="ingredient_dialog"
            max-width="450"
            >
            <v-card>
                <v-card-title class="headline">
                Add Ingredient
                </v-card-title>

                <v-card-text>
                <v-col cols="12">
                    <v-text-field
                        label="Ingredient*"
                        v-model="ingredients.title"
                        required
                    ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                    <v-text-field
                        label="Unit*"
                        v-model="ingredients.unit"
                        required
                    ></v-text-field>
                    </v-col>
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    color="green darken-1"
                    text
                    @click="ingredient_dialog = false"
                >
                    cancel
                </v-btn>

                <v-btn
                    color="green darken-1"
                    text
                    @click="addIngredient"
                >
                    Add Ingredient
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
            <!-- ingredient add dialog end here -->
            <template>
        <v-simple-table>
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">
                    Ingredients
                </th>
                <th class="text-center">
                    Units
                </th>
                <th class="text-center">
                    Action
                </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="ingredient in ingredients"
                :key="ingredient.id"
                >
                <td>{{ ingredient.title }}</td>
                <td class="text-center">{{ ingredient.unit }}</td>
                <td class="text-center" v-if="ingredient.id !== undefined">
                    <v-btn v-on:click="editTriggered(ingredient.id)" @click.stop="ingredient_edit_dialog = true">
                        Edit
                    </v-btn> / <v-btn red v-on:click="deleteIngredient(ingredient.id)">Delete</v-btn></td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>
        </template>
<!-- ///////////////////// edit ingredient starts here-->

    <v-dialog
    v-model="ingredient_edit_dialog"
    max-width="450"
    >
    <v-card>
        <v-card-title class="headline">
        Add Ingredient
        </v-card-title>

        <v-card-text>
        <v-col cols="12">
            <v-text-field
                label="Ingredient*"
                v-model="ingredients_by_pk.title"
                required
            ></v-text-field>
            </v-col>
            <v-col cols="12">
            <v-text-field
                label="Unit*"
                v-model="ingredients_by_pk.unit"
                required
            ></v-text-field>
            </v-col>
        </v-card-text>

        <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
            color="green darken-1"
            text
            @click="ingredient_dialog = false"
        >
            cancel
        </v-btn>

        <v-btn
            color="green darken-1"
            text
            @click="updateIngredient"
        >
            Update Ingredient
        </v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>
<!-- ///////////////////// edit ingredient ends here -->
</div>
</template>

<script>
import gql from 'graphql-tag';

const GET_INGREDIENTS = gql`query get_ingredients{
    ingredients {
        id
        title
        unit
    }
}
`;

const ADD_INGREDIENT = gql`mutation add_ingredient($title: String!, $unit: String!) {
    insert_ingredients(objects: [
        {
            title: $title,
            unit: $unit
        }
    ]) {
        returning {
            title
            unit
        }
    }
}
`;
const DELETE_AMOUNT = gql`mutation delete_quantity($id: Int!) {
  delete_quantities(where: {recipe_ingredient: {ingredient_id: {_eq: $id}}}) {
    returning{
      id
      amount
    }
  }
}
`;
const DELETE_RECIPE_INGREDIENT = gql`
mutation delete_recipe_ingredient($id: Int!) {
    delete_recipe_ingredient(where: {ingredient_id: {_eq: $id}}) {
        returning {
            id
        }
    }
}
`;
const DELETE_INGREDIENT = gql`
mutation delete_ingredient($id: Int!) {
    delete_ingredients_by_pk(id: $id){
        id
    }
}
`;
const GET_INGREDIENT_BY_ID = gql`query get_ingredient_by_id($id: Int!){
    ingredients_by_pk(id:$id) {
        id,
        title,
        unit
    }
}
`;
const UPDATE_INGREDIENT = gql`
mutation update_recipe($id: Int!, $title: String!, $unit: String!) {
    update_ingredients_by_pk(pk_columns: {id: $id},
     _set: {title: $title, unit: $unit}) {
        id
    }
}
`
  export default {
      apollo: {
          ingredients: GET_INGREDIENTS,
          ingredients_by_pk: {
              query: GET_INGREDIENT_BY_ID,
              variables: function() {
                  return {
                    id: this.$data.ingredient_id,
                  }
              }
          }
      },
      methods: {
          editTriggered(id) {
              this.$data.ingredient_id = id;
          },
          updateIngredient() {
              this.$apollo.mutate({
                  mutation: UPDATE_INGREDIENT,
                  variables: {
                      id: this.$data.ingredients_by_pk.id,
                      title: this.$data.ingredients_by_pk.title,
                      unit: this.$data.ingredients_by_pk.unit,
                  },
                  refetchQueries: ["get_ingredients"],
              });
              this.$data.ingredient_edit_dialog = false;
          },
          addIngredient() {
            const {title, unit} = this.$data.ingredients;
            this.$apollo.mutate({
                mutation: ADD_INGREDIENT,
                variables: {
                    title,
                    unit
                },
                refetchQueries: ["get_ingredients"],
            });
            this.$data.ingredient_dialog = false;
        },
        deleteIngredient(id) {
            this.$apollo.mutate({
                mutation: DELETE_AMOUNT,
                variables: {
                    id: id
                }
            });
            this.$apollo.mutate({
                mutation: DELETE_RECIPE_INGREDIENT,
                variables: {
                    id: id
                }
            });
            this.$apollo.mutate({
                mutation: DELETE_INGREDIENT,
                variables: {
                    id: id
                },
                refetchQueries: ["get_ingredients"]
            })
        }
      },
    data () {
      return {
          ingredient_dialog: false,
          ingredient_edit_dialog: false,
        ingredients: [{
            id: '',
            title: '',
            unit: '',
        }],
        ingredients_by_pk: {
            id: '',
            title: '',
            unit: ''
        },
        ingredient_id: '',
      }
    },
  }
</script>
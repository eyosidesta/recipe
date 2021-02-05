<template>
<div>
    <template>
  <v-card
    class="mx-auto"
    max-width="500"
  >
    <v-toolbar
      color="teal"
      dark
    >

      <v-toolbar-title >
          <!-- ///////////////// INgredient add dialog box starts -->
          <v-btn @click.stop="ingredient_dialog = true" color="teal" dark>
          Add Ingredient</v-btn></v-toolbar-title>

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
                                v-model="ingredient.title"
                                required
                            ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                            <v-text-field
                                label="Unit*"
                                v-model="ingredient.unit"
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
          <!-- ///////////////// Ingredient add dialog box ends -->

      <v-spacer></v-spacer>

    </v-toolbar>

    <v-list>
        <v-list-group
        >
        <template v-slot:activator>
            <v-list-item-content>
                <v-list-item-title> Ingredients 
                </v-list-item-title>
            </v-list-item-content>
        </template>
        <v-list-item
            v-for="ingredient in ingredients"
            :key="ingredient.id"
        >
        <v-list-item-content @click="addIngredientForRecipe(ingredient.id)">
            <v-list-item-title><v-btn :disabled="isIngredientAdded(ingredient.id)">{{ingredient.title}}</v-btn>
            </v-list-item-title>
        </v-list-item-content>
        </v-list-item>
        </v-list-group>
    </v-list>
  </v-card>
</template>
<!-- ///////////////////////////// table starts  -->
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            Recipe
          </th>
          <th class="text-left">
            Ingredient
          </th>
          <th class="text-left">
            Unit
          </th>
          <th class="text-left">
              Amount
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ingredient in recipe_ingredient"
          :key="ingredient.id"
        >
          <td>{{ recipe_by_pk.title }}</td>
          <td>{{ ingredient.ingredient.title }}</td>
          <td>{{ ingredient.ingredient.unit }}</td>
          <td v-if="ingredient.quantities.length !== 0">{{ingredient.quantities[0].amount}} 
              <!-- <v-btn @click.stop="edit_dialog = true">edit</v-btn> -->
            <!-- //////////////////// updte dialog starts here           -->
                <v-btn @click.stop="update_amount_dialog = true">edit</v-btn>
                 </td>
              <!-- ////////////////////// update dialog ends here  -->
         
          <td v-else>
              <!-- ////////////// dialog to add amount starts here -->
            <v-icon v-on:click="addAmountTriggered(ingredient.id)" @click.stop="add_amount_dialog = true">mdi-dots-vertical</v-icon>
    
        </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
  <!-- //////////////////////////// table ends here -->

  <!-- //////////////////// dialog add amount starts here -->
<v-dialog
      v-model="add_amount_dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Use Google's location service?
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Amount*"
            v-model="amount"
            required
        ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="add_amount_dialog = false"
          >
            cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="addAmount(amount)"
          >
            Add Amount
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  <!-- //////////////////// dialog add amount ends here -->

  <!-- dialog for update amount start here -->
    <v-dialog
      v-model="update_amount_dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Use Google's location service?
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Amount*"
            v-model="amount"
            required
        ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="update_amount_dialog = false"
          >
            cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="updateAmount(amount)"
          >
            update Amount
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  <!-- dialog for update amount end here -->
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
const GET_RECIPE = gql`query get_recipe($id: Int!){
    recipe_by_pk(id: $id) {
        title
    }
}
`;
const GET_RECIPE_INGREDIENT = gql`query get_recipe_ingredient($recipe_id: Int!) {
    recipe_ingredient(where: {recipe_id: {_eq: $recipe_id}}) {
        id
        recipe {
            title,
        },
        ingredient {
            id
            title
            unit
        },
        quantities {
            amount
        },
    }
}
`;
const ADD_INGREDIENT_FOR_RECIPE = gql`mutation add_ingredient_for_recipe($recipe_id: Int!,
$ingredient_id: Int!) {
     insert_recipe_ingredient(objects: [
         {
            recipe_id: $recipe_id,
            ingredient_id: $ingredient_id
        }
     ]) {
         returning {
             recipe {
                 title
             },
             ingredient {
                 title
                 unit
             }
         }
     }
    }`;
const ADD_AMOUNT = gql`mutation add_amount($recipe_ingredient_id: Int!, $amount: Int!) {
    insert_quantities(objects: [
        {
            recipe_ingredient_id: $recipe_ingredient_id
            amount: $amount
        }
    ]), {
        returning {
            amount
        }
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
export default {
    props: ["id"],
    apollo: {
        ingredients: GET_INGREDIENTS,
        recipe_by_pk: {
            query:  GET_RECIPE,
            variables: function(){ 
                return {
                    "id": this.$props.id,
                }
                
            },
        },
        recipe_ingredient: {
            query: GET_RECIPE_INGREDIENT,
            variables: function(){
                return {
                    "recipe_id": this.$props.id,
                }
            },
        },
    },
    methods: {
        addAmountTriggered(id) {
            this.$data.recipe_ingredient_id = id;
        },
        addAmount(amount) {
            this.$apollo.mutate({
                mutation: ADD_AMOUNT,
                variables: {
                    recipe_ingredient_id: this.$data.recipe_ingredient_id,
                    amount: amount
                },
                refetchQueries: ['get_recipe_ingredient'],
            });
            this.$data.amount = 0;
            this.$data.add_amount_dialog = false;
            // this.$router.go();
        },
        updateAmount(id, amount) {
            console.log(id + " " + amount);
            this.$router.go();
        },
        addIngredientForRecipe(id) {
            this.$apollo.mutate({
                mutation: ADD_INGREDIENT_FOR_RECIPE, 
                variables: {
                    recipe_id: this.$props.id,
                    ingredient_id: id
                },
                refetchQueries: ['get_recipe_ingredient'],
            });
//            console.log("yes we do " recipe_id " + this.$props.id);
        },
        addIngredient() {
            const {title, unit} = this.$data.ingredient;
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
        isIngredientAdded(id) {
            // this.$data.recipe_ingredient.map(function(ele) {
            //     if(id === ele.ingredient.id) {
            //         return true;
            //         // console.log("id is: " + id + " ingredient: " +ele.ingredient.id);
            //     }
            // });
            if(id === 1) {
                return true;
            }
            return false;
        }
    },
    data: function() {
        return {
            ingredient_dialog: false,
            update_amount_dialog: false,
            dialog: false,
            add_amount_dialog: false,
            kd: ["1", "3", "4"],
            amount: 0,
            ingredients: [{
                id: '',
                title: '',
                unit: '',
            }],
            recipe_by_pk: [{
                title: ''
            }],
            recipe_ingredient: [{
                id: '',
                recipe: {
                    title: '',
                },
                ingredient: {
                    id: '',
                    title: '',
                    unit: '',
                },
                quantities: [{
                    amount: '',
                }],
            }],
            ingredient: {
                title: '',
                unit: ''
            },
            recipe_ingredient_id: 0,
        }
    }
}
</script>
<style scoped>
.image {
    width: 400px;
    height: 200px;
}
</style>
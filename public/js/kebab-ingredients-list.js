Vue.component(`kebab-ingredients-list`, {
    template: `
    <div>
        <hr><h2 class="subtitle">{{title}}</h2><hr>
        <table style="width: 100%">
          <tr v-for="ingredient in ingredients">
            <td class="">{{ingredient}}</td>
            <td>
                <button v-on:click="deleteIngredient(ingredient)" class="button is-delete">Remove</button>
            </td>
          </tr>
        </table>
    </div>
    
  `,
    data() {
        return {
            title: "Kebab's ingredients List",
            ingredients: []
        }
    },
    methods: {
        populateTheList: function() {
            fetch(`/kebab`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                data.forEach(ingredient => this.ingredients.push(ingredient.label));
            })
            .catch(error => {
                console.error(error);
            });
        },
        deleteIngredient: function (ingredient) {
            fetch(`/kebab/delete-ingredient`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: "label=" + ingredient
            })
            .then(response => response.json())
            .then(data => {
                this.ingredients.length = 0;
                if(data.length > 0) {
                    data.forEach(ing => this.ingredients.push(ing.label))
                }
                // alert("Ingrédient \"" + ingredient + "\" supprimé !");
            })
            .catch(error => {
                console.error(error);
            })
        }
    },
    mounted() {
        this.populateTheList();

        this.$root.$on("add-ingredient", (ingredient)=> {
            fetch(`/kebab/add-ingredient`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: "label=" + ingredient
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.ingredients.push(ingredient);
                // alert("Ingrédient \"" + ingredient + "\" enregistré !");
            })
            .catch(error => {
                console.error(error);
            })
        });

    }
})

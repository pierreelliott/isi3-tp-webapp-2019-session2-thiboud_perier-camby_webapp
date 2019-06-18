Vue.component(`kebab-add-ingredient`, {
    template: `
    <div class="field is-grouped">
      <div class="control">
        <input v-model="ingredient" class="input" type="text" placeholder="Type an ingredient's label">
        
        <button v-on:click="addIngredient" class="button is-link">Add ingredient</button>

      </div>
    </div>    
    
  `,
    data() {
        return {
            ingredient:null
        }
    },
    methods:{
        // Click button
        addIngredient(event) {
            this.$root.$emit("add-ingredient", this.ingredient);
            this.ingredient = null;
        }
    }

});
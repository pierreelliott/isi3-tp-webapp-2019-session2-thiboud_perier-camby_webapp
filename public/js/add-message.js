Vue.component(`add-message`, {
    template: `
    <div class="field is-grouped">
      <div class="control">
        <input v-model="message" class="input" type="text" placeholder="type message">
        
        <button v-on:click="addMessage" class="button is-link">add message</button>

      </div>
    </div>    
    
  `,
    data() {
        return {
            message:null
        }
    },
    methods:{
        // Click button
        addMessage(event) {
            this.$root.$emit("add-message", this.message)
            this.message = null
        }
    }

});
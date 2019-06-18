Vue.component(`add-message`, {
    template: `
    <div class="field is-grouped">
      <div class="control">
        <input v-model="message" class="input" type="text" placeholder="Type a message">
        
        <button v-on:click="addMessage" class="button is-link">Add message</button>

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
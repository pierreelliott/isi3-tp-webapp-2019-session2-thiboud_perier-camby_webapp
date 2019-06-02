Vue.component(`messages-list`, {
    template: `
    <div>
      <hr><h2 class="subtitle">{{title}}</h2><hr>
      <div v-for="message in messages">
        <h2 class="subtitle">{{message}}</h2>
      </div>
    </div>
  `,
    data() {
        return {
            title: "Messages List",
            messages: []
        }
    },
    methods: {
        populateTheList: function() {
            this.messages = [
                "one",
                "two",
                "three"
            ]
        }
    },
    mounted() {
        this.populateTheList()

        this.$root.$on("add-message", (message)=> {
            this.messages.push(message)
        })

    }
})

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
            fetch(`/messages`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                data.forEach(message => this.messages.push(message.text));
            })
            .catch(error => {
                console.error(error);
            });
        }
    },
    mounted() {
        this.populateTheList();

        this.$root.$on("add-message", (message)=> {
            fetch(`/messages`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: "text=" + message
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.messages.push(message);
                alert("Message \"" + message + "\" enregistré !");
            })
            .catch(error => {
                console.error(error);
            })
        });

    }
})

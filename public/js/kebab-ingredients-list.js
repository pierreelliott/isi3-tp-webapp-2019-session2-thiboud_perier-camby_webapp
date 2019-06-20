Vue.component(`kebab-ingredients-list`, {
    template: `
    <div>
        <input v-model="username" class="input" type="text" placeholder="Username">
        <input v-model="password" class="input" type="password" placeholder="Password">
        
        <button v-on:click="connect" class="button">Connect</button>
        <button v-on:click="disconnect" class="button">Disconnect</button>
        <p v-if="connected">Connected</p>
        <p v-else>Disconnected</p>
        
        
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
            ingredients: [],
            connected: false,
            username: null,
            password: null
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
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: "label=" + ingredient
                    + "&token=" + this.getToken()
            })
            .then(response => {
                if(!response.ok) {
                    throw new Error(response.json());
                } else {
                    return response.json()
                }
            })
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
        },
        connect: function () {
            const user = this.username;
            const pwd = this.password;
            this.login(user, pwd);
            this.username = null;
            this.password = null;
        },
        disconnect: function () {
            window.localStorage.setItem('my_credentials', null);
            this.connected = false;
        },
        login: function(name, pwd) {
            fetch(`/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "username=" + name
                        + "&password=" + pwd
            })
            .then(response => response.json())
            .then(data =>  {
                if(!data.token) {
                    window.localStorage.setItem('my_credentials', null);
                    this.connected = false;
                } else {
                    window.localStorage.setItem('my_credentials', JSON.stringify({token: data.token, username: name}));
                    this.connected = true;
                }
            })
            .catch(error => {})
        },
        getToken: function () {
            let credentials = JSON.parse(window.localStorage.getItem('my_credentials'));
            return (credentials == null || credentials === undefined) ? null : credentials.token;
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
                        + "&token=" + this.getToken()
            })
            .then(response => {
                if(!response.ok) {
                    throw new Error(response.json());
                } else {
                    return response.json()
                }
            })
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

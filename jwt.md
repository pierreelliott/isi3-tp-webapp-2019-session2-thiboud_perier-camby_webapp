
## Front side: Login & get token

```javascript
import { LitElement, html } from 'lit-element'
import {style} from '../css/main-styles.js'

export class LoginForm extends LitElement {

  static get styles() { return [style] }

  static get properties() {
    return {
      platformUrl: { attribute: 'platform-url' },
    }
  }
  onClickConnect() {

    let name = this.shadowRoot.querySelector("#nameField").value;
    let pwd = this.shadowRoot.querySelector("#pwdField").value

    return fetch(`${this.platformUrl}/admin/login`, {
        method: 'POST',
        mode: 'cors', // no-cors, cors, *same-origin
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name, pwd: pwd
        }), // body data type must match "Content-Type" header
    })
    .then(response => {
      return response.json()
    })
    .then(data =>  {
      if(!data.token) {
        window.localStorage.setItem('funky_credentials', null)
      } else {
        window.localStorage.setItem('funky_credentials', JSON.stringify({token:data.token, user:name}))
      }
    })
    .catch(error => {
      this.shadowRoot.querySelector("label").innerHTML = error.message
    })

  }

  onClickDisConnect() {
    window.localStorage.setItem('funky_credentials', null)
    this.shadowRoot.querySelector("label").innerHTML = "👋 bye!"
  }

 
  render(){
    return html`
      <div>
        <input type="text" placeholder="user name" id="nameField">
        <input type="password" placeholder="password" id="pwdField">
        <button @click="${this.onClickConnect}">Connect</button>
        <button @click="${this.onClickDisConnect}">DisConnect</button>
        <label>click on login to connect</label>
      </div>
    `
  }
}
customElements.define('login-form', LoginForm)
```

## Server side: Login & get token
```javascript
app.post('/admin/login', cors(), (req, res, next) => {
  let user = req.body

  let secret = process.env.ADMIN_SECRET
  console.log(secret)

  if(!(user.name==process.env.ADMIN_USER && user.pwd==process.env.ADMIN_PWD)) {
    res.status(401)
    res.json({message: "😡 go away!"})
  } else {
    let applicationUser = {
      name: user.name,
      authenticated: true
    }

    let token = jwt.sign(
      applicationUser, 
      secret, 
      { expiresIn: 60 * 60 }
    )
    res.send({token: token, message:"😃 welcome!"})
  }
})
```

## "authenticated" query (FRONT SIDE)

```javascript
  let credentials = JSON.parse(window.localStorage.getItem('funky_credentials'))
  
  let token = (credentials==null || credentials==undefined)
    ? null
    : credentials.token

  return fetch(`${platformUrl}/admin/check`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': token
    }
  }).then().catch()
```



## "authenticated" query (SERVER SIDE)

```javascript
app.get('/admin/check', (req, res) => {
  let secret = process.env.ADMIN_SECRET
  let decoded = jwt.decode(req.headers.token, secret)

  if(decoded) {
    res.json({message:"😃 welcome"})
  } else {
    res.status(401)
    res.json({message: "😡 go away!"})
  }

})
```
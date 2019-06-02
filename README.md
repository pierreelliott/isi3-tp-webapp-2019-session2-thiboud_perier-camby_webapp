# TP Web

## Un peu d'histoire

- 1995: Création de JavaScript
- 1996: Netscape Navigator 2 avec le support de JavaScript
- 1997: `<iframe> IE3 ou 4`
- 1998: Rhino Engine - Java
- 1999: ActiveX XMLHTTP IE5 
- 2000: XMLHttpRequest > Gecko (moteur JS de Mozilla)
- 2004-2005: XMLHttpRequest == Standard "de fait"
- 2004: GMail
- 2005: Google Map
- 2008: Google V8 engine
- 2009: Node.js
- 2010: (Avril) Steve Jobs "tue" Flash
- Apparition de nombreux frameworks JavaScript
- ...

## "Architectures"

![archi_1](archi_1.png)

![archi_2](archi_2.png)

![archi_3](archi_3.png)

## Lancer l'application du projet

Le framework utilisé est Javalin (utilisable en Java et Kotlin): [https://javalin.io/](https://javalin.io/)

> Ouvrir le projet

![appli_1](appli_1.png)

> Exécuter le projet

![appli_2](appli_2.png)

## Lancer un navigateur

> - aller sur [http://localhost:7000](http://localhost:7000) et ouvrir la console

Essayer le code suivant dans la console:

```javascript
fetch(`/hello`, {
  method: 'GET',
  headers: {
    'Content-Type': 'text/plain'
  }
})
.then(response => response.text())
.then(data => {
	console.log(data)
})
.catch(error => {
	console.log(error)
})
```

> vous avez appelé le code serveur suivant
```kotlin
app.get("/hello") { ctx -> ctx.result("Hello World") }
```

![chrome_1](chrome_1.png)


Essayer le code suivant dans la console:

```javascript
fetch(`/hello-world`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
	console.log(data)
})
.catch(error => {
	console.log(error)
})
```

> vous avez appelé le code serveur suivant
```kotlin
app.get("/hello-world") { ctx -> ctx.json(Message("Hello World")) }
```

![chrome_2](chrome_2.png)

## Web Appalication (Front)

- c'est une application Vue
- parcourir ensemble les fichiers

### Faire communiquer les composants

> envoyer un message:

```javascript
this.$root.$emit("add-message", this.message)
```

> s'abonner à un message

```javascript
this.$root.$on("add-message", (message)=> {
    this.messages.push(message)
})
```

## Exercice 1:

Modifiez l'application côté front pour utiliser la "pseudo" base de données:

```kotlin
data class Message(val text: String)
val messages: MutableList<Message> = mutableListOf(
    Message("Morgen"),
    Message("Good Morning"),
    Message("Bonjour")
)
```

## Exercice 2:

Transformez/Cassez l'application pour créer un Kebab

## Exercice 3:

Donnez la possibilité de supprimer les ingrédients du Kebab

## Exercice 4:


package polytech

import io.javalin.Javalin
import io.javalin.staticfiles.Location

fun main(args: Array<String>) {

    // simulation d'une base de données
    data class Message(val text: String)
    val messages: MutableList<Message> = mutableListOf(
        Message("Morgen"),
        Message("Good Morning"),
        Message("Bonjour")
    )

    data class Ingredient(val label: String)
    val kebabIngredients: MutableList<Ingredient> = mutableListOf(
        Ingredient("Bread"),
        Ingredient("Meat"),
        Ingredient("Salad")
    )

    val adminUsername: String = "admin"
    val adminPassword: String = "secret"
    data class JWT(val token: String, val message: String)
    data class Credential(val username: String, val password: String)
    val ERROR = object { val error = "Not authorized!"}

    val app = Javalin.create()

    app.enableStaticFiles("./public", Location.EXTERNAL).start(7000)

    // ============= Messages =================
    app.get("/hello") { ctx -> ctx.result("Hello World") }

    app.get("/hello-world") { ctx -> ctx.json(Message("Hello World")) }

    app.get("/messages") { ctx -> ctx.json(messages) }

    app.post("/messages") { ctx ->
        val newMessage = Message(ctx.formParam("text").toString())
        messages.add(newMessage)
        ctx.json(newMessage).status(201)
    }

    // =============== Kebab ==================

    fun createToken(username: String, password: String): String {
        return Credential(username, password).hashCode().toString() + "KBB"
    }

    fun checkToken(token: String): Boolean {
        return token == createToken(adminUsername, adminPassword)
    }

    app.get("/kebab") { ctx -> ctx.json(kebabIngredients) }

    app.post("/kebab/add-ingredient") { ctx ->
        val token = ctx.formParam("token").toString()
        if (checkToken(token)) {
            val newIngredient = Ingredient(ctx.formParam("label").toString())
            kebabIngredients.add(newIngredient)
            ctx.json(newIngredient).status(201)
        } else {
            ctx.json(ERROR).status(403)
        }
    }

    app.delete("/kebab/delete-ingredient") { ctx ->
        val token = ctx.formParam("token").toString()
        if (checkToken(token)) {
            val ingredientToDelete = Ingredient(ctx.formParam("label").toString())
            kebabIngredients.remove(ingredientToDelete)
            ctx.json(kebabIngredients).status(201)
        } else {
            ctx.json(ERROR).status(403)
        }
    }

    app.post("/admin/login") { ctx ->
        val username = ctx.formParam("username").toString()
        val password = ctx.formParam("password").toString()

        var token: JWT? = null
        if(adminUsername == username && adminPassword == password) {
            token = JWT(createToken(username, password), "😃 welcome!")
            ctx.json(token).status(201)
        } else {
            token = JWT("", "😡 go away!")
            ctx.json(token).status(403)
        }
    }

}

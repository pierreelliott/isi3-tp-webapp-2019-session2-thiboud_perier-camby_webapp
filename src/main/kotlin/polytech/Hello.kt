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
    app.get("/kebab") { ctx -> ctx.json(kebabIngredients) }

    app.post("/kebab/add-ingredient") { ctx ->
        val newIngredient = Ingredient(ctx.formParam("label").toString())
        kebabIngredients.add(newIngredient)
        ctx.json(newIngredient).status(201)
    }

}

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

    val app = Javalin.create()

    app.enableStaticFiles("./public", Location.EXTERNAL).start(7000)

    app.get("/hello") { ctx -> ctx.result("Hello World") }

    app.get("/hello-world") { ctx -> ctx.json(Message("Hello World")) }

    app.get("/messages") { ctx -> ctx.json(messages) }

    app.post("/messages") { ctx ->

        val newMessage = Message(ctx.formParam("text").toString())
        messages.add(newMessage)
        ctx.json(newMessage).status(201)
    }

}

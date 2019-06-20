package polytech

import com.auth0.jwt.algorithms.Algorithm
import io.javalin.Javalin
import io.javalin.staticfiles.Location
import org.eclipse.jetty.websocket.common.OpCode.name
import com.auth0.jwt.JWT
import com.auth0.jwt.JWTCreator
import io.javalin.security.Role
import io.javalin.security.SecurityUtil.roles
import javalinjwt.JWTAccessManager
import javalinjwt.JWTGenerator
import javalinjwt.JWTProvider
import javalinjwt.JavalinJWT
import javalinjwt.examples.JWTResponse


enum class Roles : Role {
    ANYONE,
    USER,
    ADMIN
}

// simulation d'une base de données
data class Message(val text: String)
val messages: MutableList<Message> = mutableListOf(
    Message("Morgen"),
    Message("Good Morning"),
    Message("Bonjour")
)

// "BD" des ingrédients du kebab
data class Ingredient(val label: String)
val kebabIngredients: MutableList<Ingredient> = mutableListOf(
    Ingredient("Bread"),
    Ingredient("Meat"),
    Ingredient("Salad")
)

data class User(var name: String, var level: String)

fun main(args: Array<String>) {

    val adminUsername: String = "admin"
    val adminPassword: String = "secret"
    val rolesMapping = HashMap<String, Role>()
    rolesMapping.put(Roles.ADMIN.name, Roles.ADMIN)
    rolesMapping.put(Roles.USER.name, Roles.USER)

    val algorithm = Algorithm.HMAC256("app_secret")
    val generator = JWTGenerator<User> { user, alg ->
        val token = JWT.create()
            .withClaim("name", user.name)
            .withClaim("level", user.level)
        token.sign(alg)
    }

    val verifier = JWT.require(algorithm).build()
    val provider = JWTProvider(algorithm, generator, verifier)
    val accessManager = JWTAccessManager("level", rolesMapping, Roles.ANYONE)

    val app = Javalin.create()

    app.enableStaticFiles("./public", Location.EXTERNAL)
    app.before(JavalinJWT.createHeaderDecodeHandler(provider))
    app.accessManager(accessManager)

    app.start(7000)

    // ============= Messages =================
    app.get("/hello", { ctx -> ctx.result("Hello World") }, roles(Roles.ANYONE))

    app.get("/hello-world", { ctx -> ctx.json(Message("Hello World")) }, roles(Roles.ANYONE))

    app.get("/messages", { ctx -> ctx.json(messages) }, roles(Roles.ANYONE))

    app.post("/messages", { ctx ->
        val newMessage = Message(ctx.formParam("text").toString())
        messages.add(newMessage)
        ctx.json(newMessage).status(201)
    }, roles(Roles.ANYONE))

    // =============== Kebab ==================

    app.get("/kebab", { ctx ->
        ctx.json(kebabIngredients)
    }, roles(Roles.ANYONE))

    app.post("/kebab/add-ingredient", { ctx ->
        val newIngredient = Ingredient(ctx.formParam("label").toString())
        kebabIngredients.add(newIngredient)
        ctx.json(newIngredient).status(201)
    }, roles(Roles.USER, Roles.ADMIN))

    app.delete("/kebab/delete-ingredient", { ctx ->
        val ingredientToDelete = Ingredient(ctx.formParam("label").toString())
        kebabIngredients.remove(ingredientToDelete)
        ctx.json(kebabIngredients).status(201)
    }, roles(Roles.USER, Roles.ADMIN))

    app.post("/admin/login", { ctx ->
        val username = ctx.formParam("username").toString()
        val password = ctx.formParam("password").toString()

        if(adminUsername == username && adminPassword == password) {
            val token = provider.generateToken(User(adminUsername, Roles.ADMIN.name))
            ctx.json(JWTResponse(token))
        } else {
            val token = ""
            ctx.json(token).status(403)
        }
    }, roles(Roles.ANYONE))

}

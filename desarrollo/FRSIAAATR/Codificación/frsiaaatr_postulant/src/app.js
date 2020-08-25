/**
 * Modules
 */
const morgan = require("morgan"),
    chalk = require("chalk"),
    path = require("path"),
    cors = require("cors"),
    session = require("express-session"),
    expbhs = require("express-handlebars"),
    cookieParser = require('cookie-parser'),
    express = require("express"),
    app = express();

/**
 * Settings
 */
if (process.env.NODE_ENV != "production") {
    require("dotenv").config(); // variables de entorno
}
const HOST = process.env.APP_HOST ? process.env.APP_HOST : "0.0.0.0",
    routes = require("./routes/index"),
    io = require("./services/socket")(app),
    hour = 3600000;


app.set("port", process.env.APP_PORT ? process.env.APP_PORT : 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
    ".hbs",
    expbhs({
        defaultLayout: "main",
        layoutsDir: path.join(app.get("views"), "layouts"),
        partialsDir: path.join(app.get("views"), "partials"),
        extname: ".hbs",
    })
);

/**
 * Middlewares
 */
app.use(morgan("dev")); // permite que las peticiones se vean en la consola
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.APP_SESSION,
        resave: false,
        saveUninitialized: false,
        cookie:{
            maxAge: 24 * hour,
        }
    })
);
app.use(cors());

/**
 * Global variables
 */
app.use((req, res, next) => {
    next();
});

/**
 * routes
 */
routes.getRoutes(app);

/**
 * Public files
 */
app.use(express.static(path.join(__dirname + "/public")));

/**
 * Error pagues
 */
app.use(function (req, res) {
    res.status(404).render("errors/404", {layout: null});
});

app.use(function (req, res) {
    res.status(500).render("errors/500", {layout: null});
});

/**
 * Start server
 */
io.listen(app.get("port"), HOST, () => {
    process.env.NODE_ENV !== "production"
        ? console.log(
        chalk.bgGreen.black(`Server start on:`) +
        " " +
        `http://${HOST}:${app.get("port")}`
        )
        : console.log(chalk.bgGreen.black(`Server start`));
});

module.exports = app;

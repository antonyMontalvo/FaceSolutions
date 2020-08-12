/**
 * Modules
 */
const morgan = require("morgan"),
    chalk = require("chalk"),
    path = require("path"),
    cors = require("cors"),
    session = require("express-session"),
    expbhs = require("express-handlebars"),
    express = require("express"),
    app = express();

var fileupload = require("express-fileupload");
app.use(fileupload());

var bodyParser = require("body-parser");
/**
 * Settings
 */
if (process.env.NODE_ENV != "production") {
    require("dotenv").config(); // variables de entorno
}
const HOST = process.env.APP_HOST ? process.env.APP_HOST : "0.0.0.0",
<<<<<<< HEAD
  routes = require("./routes/index");
=======
    routes = require("./routes/index");

>>>>>>> 8e29c51194a8209341e1129bea6fa0951c6c2147
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
app.use(
    session({
        secret: process.env.JWT_KEY,
        resave: false,
        saveUninitialized: false
    })
);

/**
 * Middlewares
 */
app.use(morgan("dev")); // permite que las peticiones se vean en la consola
<<<<<<< HEAD
// app.use(express.json()); // reemplaza a body-parser
// app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);
=======
app.use(express.json()); // reemplaza a body-parser
app.use(express.urlencoded({extended: false}));
>>>>>>> 8e29c51194a8209341e1129bea6fa0951c6c2147
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
 * Start server
 */
app.listen(app.get("port"), HOST, () => {
    process.env.NODE_ENV !== "production"
        ? console.log(
        chalk.bgGreen.black(`Server start on:`) +
        " " +
        `http://${HOST}:${app.get("port")}`
        )
        : console.log(chalk.bgGreen.black(`Server start`));
});

module.exports = app;

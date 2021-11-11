const express = require("express");
const routes = require("./controllers/");
const sequelize = require("./config/connection"); // this is our connection to the db
const path = require("path"); //used for file path
const session = require("express-session"); // session is a middleware that is used to store data on the server side
const helpers = require("./utils/helpers"); //will be used to encrypt and decrypt the session data
require("dotenv").config(); // this is used to read the .env file

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const exphbs = require("express-handlebars"); // will be used to render handlebars templates in the browser
const hbs = exphbs.create({ helpers }); //  will be used to render handlebars templates in the browser

app.engine("handlebars", hbs.engine); // register the handlebars engine
app.set("view engine", "handlebars"); //  set the view engine to handlebars

const SequelizeStore = require("connect-session-sequelize")(session.Store); // will be used to store session data in the db

const sess = {
  // session configuration options
  secret: process.env.DB_SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess)); //  initialize the session middleware

app.use(routes); // use the routes middleware to handle the routes for the app

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});

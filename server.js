const sequelize = require("./config/connection"); // import connection from connection.js file
const express = require("express"); // import express
const routes = require("./controllers"); // import routes from controllers.js file
const path = require("path"); // import path for static files (css, js, etc.)

const app = express(); // create an instance of express
const PORT = process.env.PORT || 3001; // set the port to 3306

app.use(express.json()); // use express json
app.use(express.urlencoded({ extended: true })); // use express urlencoded
app.use(express.static(path.join(__dirname, "public"))); // use express static

app.use(routes); // use routes from controllers.js file (routes.js) file
const exphbs = require("express-handlebars"); // import express-handlebars for handlebars
//create instance of express-handlebars and pass it the options object
const hbs = exphbs.create({
  // create handlebars instance with options object (defaultLayout: "main")
  defaultLayout: "main",
  extname: "hbs",
  helpers: {
    //create a helper called ifEqual
    ifEqual: function (a, b, options) {
      if (a === b) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
  },
});

app.engine("handlebars", hbs.engine); // set handlebars as the engine
app.set("view engine", "handlebars"); // set the view engine to handlebars

// import connect-session-sequelize for session storage and pass it the sequelize instance and options object (cookie: {maxAge: 60000})
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
  // this will be the session object that will be passed to the session middleware (session: sess) in the server.js file
  secret: "HUGE secret", // set the secret to a huge string
  cookie: {}, // set the cookie object to an empty object
  resave: false, // set resave to false
  saveUninitialized: false, // set saveUninitialized to false
  store: new SequelizeStore({
    // create a new instance of SequelizeStore passing in the sequelize instance and options object (cookie: {maxAge: 60000})
    db: sequelize, // set db to sequelize
  }),
};
app.use(session(sess)); // use session with the sess object

// require routes  and pass in the app instance and sequelize instance to use the routes in the routes folder
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });
});

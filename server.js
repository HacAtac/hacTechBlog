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

// require routes  and pass in the app instance and sequelize instance to use the routes in the routes folder
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });
});

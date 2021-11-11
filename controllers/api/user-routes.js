// this is the router object from express module that we are using to create the routes
const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// this is the route that will be used to get all the users
router.get("/", (req, res) => {
  // Access our User model and findAll method
  User.findAll({
    attributes: { exclude: ["password"] }, // this is to exclude the password from the response
  })
    .then((dbUserData) => res.json(dbUserData)) // will return the data from the database
    .catch((err) => {
      // if there is an error in the database then it will return the error
      console.log(err);
      res.status(500).json(err); // will return the error in the response
    });
});

// Get a single user by id number
router.get("/:id", (req, res) => {
  User.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "post_text", "created_at"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "created_at"],
      },
    ],
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No User found with this id" });
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//create a new user
router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })
    .then((dbUserData) => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//login route
router.post("/login", (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((dbUserData) => {
    //verify user
    if (!dbUserData) {
      res.status(400).json({ message: "Username not Found" });
      return;
    }
    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect Password" });
      return;
    }
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      res.json({ user: dbUserData, message: "You are now logged in!" });
    });
  });
});

//post route for logging out
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// route to update username data by id
// PUT /api/users/1
router.put("/:id", (req, res) => {
  // put route to update username data by id using hooks in the database
  User.update(req.body, {
    individualHooks: true, // true will allow us to use the hooks in db
    where: {
      // this will find the user with the id that is passed in the url
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      // will return the data from the database
      if (!dbUserData[0]) {
        res.status(404).json({ message: "No user found with this id" }); // will return the error if there is no user with the id that is passed in the request
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// route will be used to delete a user by id
router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//export the router
module.exports = router;

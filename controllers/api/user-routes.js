// this is the router object from express module that we are using to create the routes
const router = require("express").Router();
const { resolveSoa } = require("dns");
const { User, Post, Vote, Comment } = require("../../models");

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

//GET /api/users/:id
router.get("/:id", (req, res) => {
  User.findOne({
    // ^ SELECT * FROM users WHERE id = x;
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "post_url", "created_at"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "created_at"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
      {
        model: Post,
        attributes: ["title"],
        through: Vote,
        as: "voted_posts",
      },
    ],

    where: {
      // this is to find the user with the id that is passed in the url
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      // will return the data from the database if there is no error
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

// this will be used to create a new user in the database and will return the new user data
router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  }).then((dbUserData) => {
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json(dbUserData);
    });
  });
});

// this will be a login post route that will be used to login the user
router.post("/login", (req, res) => {
  User.findOne({
    where: {
      // this will find the user with the email that is passed in the body
      email: req.body.email,
    },
  }).then((dbUserData) => {
    // this will return the data from the database
    if (!dbUserData) {
      res.status(400).json({ message: "NO CAN DO COMPADRE!" });
      return; // this will return the error if there is no user with the email that is passed in the request
    }

    const validPass = dbUserData.checkPassword(req.body.password); // this will check the password that is passed in the request with the password that is in the database
    if (!validPass) {
      res.status(400).json({ message: "Wrong Pass!" });
      return;
    }

    req.session.save(() => {
      // this will save the session to the database and will return the session id to the user in the response
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      res.json({ user: dbUserData, message: "Success!" });
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
      if (!dbUserData[1]) {
        res.status(404).json({ message: "No user found with this id" }); // will return the error if there is no user with the id that is passed in the request
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
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

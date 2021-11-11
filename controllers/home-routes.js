//require files and routers
const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
// this is the home page route functionality 'front-end'
router.get("/", (req, res) => {
  // this will be the home page route for the site
  Post.findAll({
    // find all posts from the database and return them to the home page
    attributes: ["id", "post_text", "title", "created_at"],
    order: [["created_at", "DESC"]], //  order the posts by the date they were created in descending order

    include: [
      // will include the user who created the post
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment, // will include the comments for each post
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        }, // this is the name of the column that will be returned
      },
    ],
  })
    //will render the home page with the posts
    .then((dbPostData) => {
      // this will return the posts in an array format that can be used in the home page to display the posts
      const posts = dbPostData.map((post) => post.get({ plain: true })); // this will return the posts in an array format that can be used in the home page to display the posts
      res.render("homepage", {
        // this will render the home page with the posts array
        posts, // this will render the home page with the posts array
        loggedIn: req.session.loggedIn, // this will render the home page with the loggedIn boolean value
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//GET route for login page
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

// this is the login route functionality 'front-end' for the site
//url route is
router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "post_text", "title", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      const post = dbPostData.get({ plain: true }); // this will return the posts in an array format that can be used in the home page to display the posts
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//render signup page if user is logged in redirect to home page
router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("signup");
});

module.exports = router;

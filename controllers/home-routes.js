//require files and routers
const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
// this is the home page route functionality 'front-end'
router.get("/", (req, res) => {
  // this will be the home page route for the site
  Post.findAll({
    // find all posts from the database and return them to the home page
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          // this is a sequelize function that will return the username of the user who created the post
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count", // this is the name of the column that will be returned
      ],
    ],
    include: [
      // will include the user who created the post
      {
        model: Comment, // will include the comments associated with the post
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"], // will include the user who created the comment
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User, // this is the user who created the post
        attributes: ["username"], // this is the name of the column that will be returned
      },
    ],
  })
    .then((dbPostData) => {
      // this will return the posts in an array format that can be used in the home page to display the posts
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("homepage", { posts });
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

// GET route to get one post by id
router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "post_url",
      "title",
      "post_content",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
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
      const post = dbPostData.get({ plain: true });
      res.render("single-post", {
        post: post,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;

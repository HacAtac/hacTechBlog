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
  res.render("login");
});

//This is a get route for the register page to render the register page to the user when they click on the register button
router.get("/post/:id", (req, res) => {
  const post = {
    id: 1,
    post_url: "https://handlebarsjs.com/guide",
    title: "Handlebars Docs",
    created_at: new Date(),
    vote_count: 15,
    comments: [{}, {}],
    user: {
      username: "TESTIE123",
    },
  };
  res.render("post", { post });
});

module.exports = router;

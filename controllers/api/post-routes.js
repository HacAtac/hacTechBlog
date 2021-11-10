//require files that is needed for this controller
const router = require("express").Router();
const sequelize = require("../../config/connection");
const { isContext } = require("vm"); //this is a built in node module that is used to check if the object is empty
const { Post, User, Vote, Comment } = require("../../models"); // import the models

//async route handler to get all users
router.get("/", (req, res) => {
  // this is a sequelize method that is used to find all the posts
  Post.findAll({
    attributes: [
      // this is an array of attributes that we want to get from the database and send back to the client
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          // this is a sequelize method that is used to get the sum of all the votes for a post and send back to the client
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count", // this is the name of the attribute that we want to send back to the client
      ],
    ],
    order: [["created_at", "DESC"]], // this is a sequelize method that is used to order the posts by the date they were created
    include: [
      {
        model: Comment, // this is a sequelize method that is used to include the comments for each post
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        // link tables
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "post_url",
      "title",
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
        res.json(404).json({ message: "No posto found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create post route with title req.body.title post_content req.body.post_content post_url req.body.post_url user_id req.body.user_id
router.post("/", (req, res) => {
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    post_content: req.body.post_content,
    user_id: req.body.user_id,
  })
    .then((dbPostData) => {
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// put route to update post /api/posts/upvote
router.put("/upvote", (req, res) => {
  if (req.session) {
    // this is a sequelize method that is used to update the vote count for a post
    Post.upvote(
      { ...req.body, user_id: req.session.user_id },
      { Vote, Comment, User }
    )
      .then((updatedVoteData) => res.json(updatedVoteData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  } else {
    res.status(401).json({ message: "You must be logged in to upvote" });
  }
});

//may need to change this route
//put route to change title and body of a Post model
router.put("/:id", (req, res) => {
  // this is a sequelize method that is used to update the post with the new title and body that was sent in the request body from the client side
  Post.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((dbPostData) => {
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//route to delete a post by id
router.delete("/:id", (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbPostData) => {
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//export the router
module.exports = router;

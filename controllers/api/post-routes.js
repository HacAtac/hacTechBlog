//require files that is needed for this controller
const router = require("express").Router();
const { Post, User, Comment } = require("../../models"); // import the models
const withAuth = require("../../utils/auth"); // import the auth middleware

// GET api/posts/ -- get all posts
router.get("/", (req, res) => {
  Post.findAll({
    // Query configuration
    // From the Post table, include the post ID, URL, title, and the timestamp from post creation
    attributes: ["id", "post_text", "title", "created_at"],
    // Order the posts from most recent to least
    order: [["created_at", "DESC"]],
    // From the User table, include the post creator's user name
    // From the Comment table, include all comments
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET api/posts/:id -- get a single post by id
router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      // specify the post id parameter in the query
      id: req.params.id,
    },
    // Query configuration, as with the get all posts route
    attributes: ["id", "post_text", "title", "created_at"],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((dbPostData) => {
      // if no post by that id exists, return an error
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      // if a server error occured, return an error
      console.log(err);
      res.status(500).json(err);
    });
});

// POST api/posts -- create a new post
router.post("/", withAuth, (req, res) => {
  Post.create({
    title: req.body.title,
    post_text: req.body.post_text,
    user_id: req.session.user_id,
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// put route to update post title or text
router.put("/:id", withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title,
      post_text: req.body.post_text,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//route to delete a post by id
router.delete("/:id", withAuth, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.json(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//create a new POST route to add a comment to post
router.post("/:id/comments", withAuth, (req, res) => {
  Comment.create({
    comment_text: req.body.comment_text,
    post_id: req.params.id,
    user_id: req.session.user_id,
  })

    .then((dbCommentData) => {
      res.json(dbCommentData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/dashboard", withAuth, (req, res) => {
  // this function will be used to get the user's posts and comments from the database and return them to the front end

  Post.create({
    // create a new post in the database with the user's input from the front end
    title: req.body.title,
    post_text: req.body.post_text,
    user_id: req.session.user_id,
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

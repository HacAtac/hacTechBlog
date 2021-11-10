const router = require("express").Router(); //import express router to use routes in this file
const userRoutes = require("./user-routes"); // import user routes to use routes in this file
const postRoutes = require("./post-routes"); // import post routes to use routes in this file
const commentRoutes = require("./comment-routes"); // import comment routes to use routes in this file

router.use("/user", userRoutes); // use user routes in this file to use routes in this file
router.use("/posts", postRoutes); // use post routes in this file to use routes in this file
router.use("/comments", commentRoutes); // use comment routes in this file to use routes in this file

module.exports = router; // export this file to use in other files

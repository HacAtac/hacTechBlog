// this will be used to create a new router object that will be used to handle all the routes
const router = require("express").Router();
// this will be the api routes file that we will create later on
const apiRoutes = require("./api");
// this is the api route for the api routes in the api folder
router.use("/api", apiRoutes);
// this is the catch all route for the front end to render the index.html file in the public folder
router.use((req, res) => {
  res.status(404).end();
});
// this is the export of the router object
module.exports = router;

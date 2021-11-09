const User = require("./User"); //this is the path to the user model
const Post = require("./Post");
const Vote = require("./Vote");
const Comment = require("./Comment");

// create associations between models here (i.e. User.hasMany(Post))
User.hasMany(Post, {
  foreignKey: "user_id", // this is the foreign key in the post table
});
Post.belongsTo(User, {
  // this is the foreign key in the user table
  foreignKey: "user_id",
});

User.belongsToMany(Post, {
  // this is the foreign key in the post table (many to many)
  through: Vote, // this is the table that connects the two tables (many to many)
  as: "voted_posts", // this is the alias for the table that connects the two tables (many to many)
  foreignKey: "user_id", // this is the foreign key in the post table (many to many)
});
Post.belongsToMany(User, {
  through: Vote,
  as: "voted_posts",
  foreignKey: "post_id",
});

Vote.belongsTo(User, {
  foreignKey: "user_id",
});
Vote.belongsTo(Post, {
  foreignKey: "post_id",
});

User.hasMany(Vote, {
  foreignKey: "user_id",
});

Post.hasMany(Vote, {
  foreignKey: "post_id",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
});
Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
});

module.exports = { User, Post, Vote, Comment }; // export models

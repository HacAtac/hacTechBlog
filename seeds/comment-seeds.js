const { Comment } = require("../models");

const commentdata = [
  {
    
    comment_text = "This is a comment",
    user_id = 1,
    post_id = 1
  },
  {
    
    comment_text = "This is a comment",
    user_id = 1,
    post_id = 2
  },
  {
  
    comment_text = "This is a comment",
    user_id = 1,
    post_id = 3
  },
  
];

const seedComments = () => Comment.bulkCreate(commentdata);

module.exports = seedComments;

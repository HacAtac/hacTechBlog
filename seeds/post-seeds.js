const { Post } = require("../models");

const postdata = [
  {
    id: 1,
    title: "Post 1",
    post_text: "This is post 1",
    user_id: 1,
  },
  {
    id: 2,
    title: "Post 2",
    post_text: "This is post 2",
    user_id: 2,
  },
  {
    id: 3,
    title: "Post 3",
    post_text: "This is post 3",
    user_id: 3,
  },
  {
    id: 4,
    title: "Post 4",
    post_text: "This is post 4",
    user_id: 4,
  },
  {
    id: 5,
    title: "Post 5",
    post_text: "This is post 5",
    user_id: 5,
  },
  {
    id: 6,
    title: "Post 6",
    post_text: "This is post 6",
    user_id: 6,
  },
];

const seedPosts = () => Post.bulkCreate(postdata);

module.exports = seedPosts;

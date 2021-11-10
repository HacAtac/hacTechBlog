const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Post extends Model {
  // this is a class that extends the Model class from sequelize library
  static upvote(body, models) {
    // this is a static method that will be called on the Post class
    return models.Vote.create({
      // this will create a new vote in the database with the user_id and post_id
      user_id: body.user_id, // this will be the user_id of the user who is voting and the post_id of the post that is being voted on
      post_id: body.post_id, // this will be the post_id of the post that is being voted on
    }).then(() => {
      // then we will return the post that was voted on so that we can update the post with the new vote count
      return Post.findOne({
        where: {
          id: body.post_id, //
        },
        attributes: [
          // this will return the post with the updated vote count
          "id", // this will be the post_id
          "post_url",
          "title",
          "created_at",
          [
            sequelize.literal(
              // this will return the sum of all the votes for the post with the post_id
              "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
            ),
            "vote_count", // this will be the vote_count of the post with the post_id
          ],
        ],
      });
    });
  }
}
// this is the Post class that extends the Model class from sequelize library and it will be used to create a new post in the database
Post.init(
  {
    id: {
      // this is the id of the post that will be created in the database
      // this is the id of the post that will be created in the database and will be auto incremented by sequelize
      type: DataTypes.INTEGER, //
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // this is the title of the post that will be created in the database and will be a string
    title: {
      // this is the title of the post that will be created in the database and will be a string
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_content: {
      // this is the content of the post that will be created in the database and will be a string
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10],
      },
    },
    // this is the url of the post that will be created in the database and will be a string that is unique to the post
    post_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isURL: true,
      },
    },
    // we will be using the created_at and updated_at columns from the sequelize library
    user_id: {
      type: DataTypes.INTEGER,
      // this is the user_id of the user who created the post
      references: {
        model: "user", // this is the name of the table that the user_id will be referencing to  in the database
        key: "id", // this is the column that the user_id will be referencing to in the table that the user_id is referencing
      },
    },
  },
  {
    sequelize, // this is the connection to the database
    freezeTableName: true, // this is to prevent sequelize from pluralizing the table name
    underscored: true, // this is to prevent sequelize from converting the table name to camel case
    modelName: "post", // this is the name of the table that will be created in the database
  }
);

module.exports = Post; // this is exporting the Post class so that it can be used in other files

const { Model, DataTypes } = require("sequelize"); // this is how we import sequelize
const sequelize = require("../config/connection"); // this is how we import the connection

class Comment extends Model {} // This is a class, not an object (not a function) so we don't need to call new on it

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER, // integer data type for id column
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    comment_text: {
      // comment text field (varchar 255) - required field
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
      },
    },
    user_id: {
      type: DataTypes.INTEGER, // foreign key to user table (user_id) in the database
      references: {
        model: "user",
        key: "id",
      },
    },
    post_id: {
      // this is the foreign key for the post table that this comment belongs to
      type: DataTypes.INTEGER,
      references: {
        model: "post",
        key: "id",
      },
    },
  },
  {
    sequelize, // passing the connection instance
    freezeTableName: true, // Model tableName will be the same as the model name
    underscored: true, // don't use camelcase for automatically added attributes but underscore style
    modelName: "comment", // override the default model name
  }
);

module.exports = Comment; // export the model

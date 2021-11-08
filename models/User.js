const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4],
      },
    },
  },

  {
    hooks: {
      // Hooks are methods that can run before or after a specific event is executed
      // this is used to hash the password before it is saved to the database
      async beforeCreate(newUserData) {
        // console.log(newUserData);
        // this is where we hash the password before it is saved to the database using bcrypt
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        // this is where we return the newUserData object with the hashed password attached to it so that it can be saved to the database
        return newUserData;
      },
      // this is a method that runs after the user is created
      async beforeUpdate(updatedUserData) {
        // this is where we hash the password before it is saved to the database using bcrypt
        updatedUserData.password = await bcrypt.hash(
          // this is where we hash the password before it is saved to the database using bcrypt
          updatedUserData.password,
          // this is where we set the number of rounds to hash the password
          10
        );
        // this is where we return the updatedUserData object with the hashed password attached to it so that it can be saved to the database
        return updatedUserData;
      },
    },
    // this is where we set the table name to users
    sequelize, // passing the connection instance
    // this is where we set the model name to User
    timestamps: false, // disable timestamps
    freezeTableName: true, // Model tableName will be the same as the model name
    underscored: true, // use snake_case instead of camelCase for generated SQL
    modelName: "user", // override the default model name
  }
);

module.exports = User; // export the User model for use in other files

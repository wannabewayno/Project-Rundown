// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
// we have covered bcryptjs in the README, if you want more info check there
// basically this will securely hash user's passwords so that we're not storing them as 'plain text'
var bcrypt = require("bcryptjs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING, // data will be a string
      allowNull: false, // won't be stored if this is left blank
      unique: true, // must be unique, our model won't store a duplicate entry
      validate: {
        isEmail: true //checks to make sure it's an email
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING, //data will be a string 
      allowNull: false // won't be stored if this is left blank
    }
  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    // this works by actually hashing an input password to check and then checking the two hashed together
    // a hash is not backwards compatible, all we can do is check the hashes against each other for verification
    // although each hash is unique, so go ask bcrypt about that.
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  // we hash the password so as not to store the user's password as plain text.
  User.addHook("beforeCreate", function(user) {
    // bcrypt joins the input password and a salt (large randomly generated number)
    // then hashes the result of the password/salt combo
    // this ensures each hash is unique even if users may have the same password.
    // you wouln't know from looking at the hashed information
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  // returns the model to the sequelize instance
  return User;
};

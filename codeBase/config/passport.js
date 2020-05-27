// requires the passport package
var passport = require("passport");

// requires the passport-local package. 
// this is a strategy designed to authenticate username and passwords
// we are requiring a class constructor here that we can invoke to sey up a strategy
var LocalStrategy = require("passport-local").Strategy;

/* 
this loads our database instance through sequelize
we can access our models through the db object
and our models define how to access and store data to our database
*/ 
var db = require("../models");

/* 
Telling passport we want to use the LocalStrategy
we then define our authentication strategy by creating a new instance of this strategy
the strategy constructor takes an options object and a verification function that defines how to verify
these strategy options
 */
passport.use(new LocalStrategy(
  /*
  Our user will sign in using an email, rather than a "username"
  so we tell passport that the usernameField will be referenced as "email" in our data structure
  */
  {
    usernameField: "email"
  },
 
  
  /*
   a verification function 
   Queries the database for an email and password that the user has entered
  */ 
  function(email, password, done) {
    // When a user tries to sign in this code runs
    /*
    using sequelize with the model 'User'
    queries database to find a user whose email is the email passed into the function
    */ 
    db.User.findOne({
      where: {
        email: email
      }
    }).then(function(dbUser) {
      // If there's no user with the given email
      /* 
      then dbUser will be undefined
      hence if undefined run this code
      */ 
      if (!dbUser) {
        /*
         returns the done function that will pass the message back to passport,
         passport will then pass this to the server as passport is registered middleware
         The done function is an internal method to passport
        */ 
        return done(null, false, {
          message: "Incorrect email."
        });
      }
      
      /* If there is a user with the given email, but the password the user gives us is incorrect
       validPassword is a method used by passport
       If we have reached this far in the code; dbUser is defined
       we now have access to the dbUser object server side 
       This will contain an email:string and a password:string(as a hash)
       validPassword is a method defined in the 'user' model that:
       uses bcrypt to generate a hash of the supplied password, and use this generated hash to
       cross check against the hash stored in the  dbUser object.
       If validPassword returns false, then run this code
       returns the done function that passes an 'incorrect password' message back to the server
      */ 
      else if (!dbUser.validPassword(password)) {
        /* 
        returns the done method that will pass the message back to passport,
        passport will then pass this to the server, as passport is registered middleware
        */ 
        return done(null, false, {
          message: "Incorrect password."
        });
      }

      /* If none of the above, return the user
       i.e if the validPassword function returns true, we will reach this point in the code
       in that case, we have a user account dbUser and the password supplied to this function matches 
       the password found the dbUser account. 
       So by process of elimination, we return this object to the server

       By returing this to the server, we are actually adding this to the request object as
       req.user
      */
      return done(null, dbUser);
    });
  }
));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work

/* Serializing is the process formatting or translating an object strucutre to store it.
  passport serializes the user object and stores the id in the express-session for authentication purposes
  this enables the user to access restricted pages as the app cross references this with the session

  deserializing is re-instates the user object class 'User' to have all attacthed methods and structure back with it
  then we can use the User model as intended

  these are methods we configure for passport so it knows how to handle our data structure when it 
  stores and retreives data.
*/
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;

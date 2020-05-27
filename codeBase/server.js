// Requiring necessary npm packages
// express is a web server framework that makes it easy to work with the inbuilt node http package
var express = require("express");
// session is an add-on for express that set's up a session that determines the state of the server
// a a session can be set up and configured with a set of options to control how we define the state of our server.login
var session = require("express-session");
// Requiring passport as we've configured it
// This will determine the state of our express-session by using passport to verify users login credentials 
var passport = require("./config/passport");

// Setting up port and requiring models for syncing
// choose a PORT to communicate on
// this PORT can be defined using an environment variable. 
// If no port is defined in the environment variable, use PORT 8080.
var PORT = process.env.PORT || 8080;
// this requires our database instance defined in models and set up by sequelize
var db = require("./models");

// Middleware
//=========================================================================
// Creating express app and configuring middleware needed for authentication
var app = express();
// configures the express app for data parsing.
// enables json responses and incoming encoded http requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serves client side static files such as css, templates and custom javascript
// The 'public' directory houses anything visible client-side
// 'public' now serves as the root directory for all static files.
// inferring /stylesheets/style.css will translate to codeBase/public/stylesheets/style.css
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
// this tells the express app to use express-sessions
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));

//this tells the express app to use our configured passport package
//first we intialize it
app.use(passport.initialize());
//Then we tell the express app to use the passpoart as a session
app.use(passport.session());

//Routes
//=========================================================================
// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Starting our server
//=========================================================================
// Syncing our database and logging a message to the user upon success
// Creates all tables defined in our models if they haven't been created yet.
// once the database has successfully synced, we then start our server with app.listen
db.sequelize.sync().then(function() {
  // this starts our server by allowing server.js to listen for incoming requests from the com PORT
  // We respond to the requests appropriately by defining routes and logic and control these requests
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});

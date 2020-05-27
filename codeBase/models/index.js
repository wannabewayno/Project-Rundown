'use strict'; // puts this file into strict mode, not allowing you use undeclared variables. 
// require all necessary packages
var fs        = require('fs');
var path      = require('path');
// this is where we require our sequelize ORM package
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);

var env       = process.env.NODE_ENV || 'development'; // grabs the NODE_ENV variable from the env variables
/*
uses the NODE_ENV variable to select the correct configuration, either "production, developement, test"
no NODE_ENV variables have been set during testing hence it will default to "development"
we have only congifured the development file and this is currently running the app, hence it must be working 
 */
var config    = require(__dirname + '/../config/config.json')[env]; 
// a placeholder to store our db models
var db        = {};

// tells sequelize to use env variables if the confif file has been set up with env variables
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  // we don't have use_env_variable key in our config.json
  // hence, the config object will be our development information
  // so use this information to set up a new instance of sequelize 
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

//using the node file system, sequelize reads the file names in the models folder (this folder)
fs
  .readdirSync(__dirname)
  /*
  we filter the results of these filenames
  only returning results that:
  1.) don't start with a period
  2.) aren't the index file (this file)
  3.) actually is a '.js' file (i.e a javascript file)
  */
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  /* 
  effectively this will return all the names of our models
  so that we don't have to require them individually, or specify them anywhere, this file takes care of that
  */

  /*
  Now, we have a list of all our model names
  for each name, require the model instance by importing it as a variable
  then set this model instance in the db placeholder object under it's own name 
  */
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

  /*
  Now we have db object that contains all our models!
  Go through out database object and if our models have any associations,
  Run those association functions to initialize them 
  */
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// then add the sequelize instance to our db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//export our db object to use elsewhere
module.exports = db;

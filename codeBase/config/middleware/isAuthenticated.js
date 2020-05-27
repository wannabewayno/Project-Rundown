// This is middleware for restricting routes a user is not allowed to visit if not logged in

/* 
this is a really simple and handy peice of middleware
Effectively, when passport authenticates a user, it passes the user to the reqest object as req.user
if we want to check for authentocation, we can require this function before routes we would like authentication on

This is pretty much a shield before a route we want authentication on
If this passes, the route directly after this will becalled upon.

PASS:
this function takes in the request object and response object
It looks for the user in the request object (req.user)
if a user is found (not undefined) then we simply call next(), 
which is an express method that calls upon the next route middleware.

FAIL:
if a req.user is not found (undefined) then we return the res.redirect("/") function
This will stop evaluating middleware routes and go straight to the get("/") route.
Putting the user back at the root route instead of evaluating routes they're not meant to have access to.

*/
module.exports = function(req, res, next) {
  // If the user is logged in, continue with the request to the restricted route
  if (req.user) {
    return next();
  }

  // If the user isn't logged in, redirect them to the login page
  return res.redirect("/");
};

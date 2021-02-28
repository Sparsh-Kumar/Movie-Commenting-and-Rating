

// making the RouteHandler

const RouteHandler = require ('express').Router ();
const path = require ('path');
const { signup } = require (path.resolve (__dirname, '..', 'controllers', 'signup'));
const { signin } = require (path.resolve (__dirname, '..', 'controllers', 'signin'));
const { register } = require (path.resolve (__dirname, '..', 'controllers', 'register'));
const { refreshtoken } = require (path.resolve (__dirname, '..', 'controllers', 'refreshtoken'));
const { forgotpassword } = require (path.resolve (__dirname, '..', 'controllers', 'forgotpassword'));
const { reset } = require (path.resolve (__dirname, '..', 'controllers', 'reset'));
const { createAccountLimiter, forgotPasswordLimiter } = require (path.resolve (__dirname, '..', 'ratelimiters', 'ratelimiter'));
const { getallmovies } = require (path.resolve (__dirname, '..', 'controllers', 'getallmovies'));
const { comment } = require (path.resolve (__dirname, '..', 'controllers', 'comment'));
const { rate } = require (path.resolve (__dirname, '..', 'controllers', 'rate'));


// importing checklogin middleware

const { checklogin } = require (path.resolve (__dirname, '..', 'authmiddleware', 'checklogin'));

// authentication routes

RouteHandler.post ('/signup', createAccountLimiter, signup); // apply rate limiting on account creation
RouteHandler.post ('/signin', signin);
RouteHandler.get ('/register/:token', register);
RouteHandler.get ('/refreshtoken/:refreshtoken', refreshtoken);
RouteHandler.patch ('/forgotpassword', forgotPasswordLimiter, forgotpassword); // apply rate limiting on forgot password attempts
RouteHandler.patch ('/reset/:id/:token', reset);


// dashboard routes

RouteHandler.get ('/dashboard/movies/:page/:limit', checklogin, getallmovies);

// comment route
RouteHandler.post ('/dashboard/comment', checklogin, comment);

// rate route
RouteHandler.post ('/dashboard/rate', checklogin, rate);

// exporting the RouteHandler

module.exports = {
    RouteHandler
}
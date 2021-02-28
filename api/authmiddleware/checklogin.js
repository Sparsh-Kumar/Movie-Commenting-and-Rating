

// importing all the dependencies

const _ = require ('lodash');
const path = require ('path');
const { config } = require (path.resolve (__dirname, '..', 'config', 'config'));
const jwt = require ('jsonwebtoken');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));

// defining the checklogin middleware

const checklogin = (req, res, next) => {
    try {

        // throw error if no x-auth header is present
        if (!req.header ('x-auth')) {
            throw new Error ('x-auth header token is not present');
        }

        // retrieve the token from the header and decode the token
        const token = req.header ('x-auth');
        const decodedtoken = jwt.verify (token, config.ACCESS_TOKEN_SECRET);

        // find the user with the decoded token id
        User.findOne ({
            _id: decodedtoken._id
        }).then ((user) => {
            if (!user) {
                throw new Error ('no user exists with these credentials any more');
            }

            req.user = user;
            next (); // calling the next () in the middleware to proceed

        }).catch ((error) => {
            return res.status (401).send ({
                status: 'failure',
                message: error.message
            })
        })

    } catch (error) {

        // return error message to the user
        return res.status (401).send ({
            status: 'failure',
            message: error.message
        })

    }
}

// exporting the checklogin middleware

module.exports = {
    checklogin
}
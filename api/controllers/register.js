

// importing all the dependencies

const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const _ = require ('lodash');
const { validateUsername, validateEmail, validatePassword } = require (path.resolve (__dirname, '..', 'validators', 'validator'));
const jwt = require ('jsonwebtoken');
const { config } = require (path.resolve (__dirname, '..', 'config', 'config'));

// defining the register controller

const register = (req, res) => {
    try {
        if (!req.params.token) {
            throw new Error ('token not present');
        }

        // getting the token from the request
        // and decode it !
        const token = req.params.token;
        const decodedtoken = jwt.verify (token, config.REGISTER_TOKEN);

        const { username, email, password } = _.pick (decodedtoken, ['username', 'email', 'password']);
        if (!validateUsername (username) || !validateEmail (email) || !validatePassword (password)) {
            throw new Error ('please send data in correct format');
        }

        User.findOne ({
            $or: [
                {username},
                {email}
            ]
        }).then ((user) => {
            if (user) {
                throw new Error ('username or email already exists');
            }

            // if no user then create the user and return the promise for that
            return User.create ({
                username,
                email,
                password
            })
        }).then ((createdUser) => {

            // return the created user
            // we can use projection in it to get only certain fields

            return res.status (200).send ({
                status: 'success',
                createdUser
            })

        }).catch ((error) => {
            return res.status (401).send ({
                status: 'failure',
                message: error.message
            })
        })

    } catch (error) {
        return res.status (401).send ({
            status: 'failure',
            message: error.message
        })
    }
}

// exporting the register Controller

module.exports = {
    register
}
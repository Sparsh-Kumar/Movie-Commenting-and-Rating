

// importing all the dependencies

const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const jwt = require ('jsonwebtoken');
const _ = require ('lodash');
const { validateUsername, validateEmail, validatePassword } = require (path.resolve (__dirname, '..', 'validators', 'validator'));


// defining the signin controller

const signin = (req, res) => {
    try {
        let is_username = false;
        let is_email = false;
        let findObj = {}
        let foundUser = undefined;
        const { usernameoremail, password } = _.pick (req.body, ['usernameoremail', 'password']);
        if (!validatePassword (password)) {
            throw new Error ('password entered is not a valid password format');
        }
        if (validateUsername (usernameoremail)) {
            is_username = true;
            findObj.username = usernameoremail;
        } else if (validateEmail (usernameoremail)) {
            is_email = true;
            findObj.email = usernameoremail;
        }

        if (!is_username && !is_email) {
            throw new Error ('Entered field is neither a username nor an email');
        }
        User.findOne (findObj).then ((user) => {
            if (!user) {
                throw new Error ('No user found with this username or email');
            }

            // if the user is found with these credentials
            // then check for password validation

            foundUser = user;
            return User.comparePassword (password, user.password);

        }).then ((result) => {
            
            if (result === false) {
                throw new Error ('Invalid Username / Email or password');
            }

            // if password validation is true then
            // generate access token and refresh token

            const accesstoken = jwt.sign ({
                _id: foundUser._id
            }, config.ACCESS_TOKEN_SECRET, { expiresIn: 60 });

            const refreshtoken = jwt.sign ({
                _id: foundUser._id
            }, config.REFRESH_TOKEN_SECRET);

            // returning the access token and refresh token to the user
            return res.status (200).send ({
                status: 'success',
                accesstoken,
                refreshtoken
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

// exporting the signin controller

module.exports = {
    signin
}
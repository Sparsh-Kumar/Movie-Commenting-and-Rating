

// importing all the dependencies

const path = require ('path');
const jwt = require ('jsonwebtoken');
const { mailer } = require (path.resolve (__dirname, '..', 'mailer', 'mailer'));
const _ = require ('lodash');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { validateUsername, validateEmail, validatePassword } = require (path.resolve (__dirname, '..', 'validators', 'validator'));


// defining the signup controller

const signup = (req, res) => {
    try {
        const { username, email, password } = _.pick (req.body, ['username', 'email', 'password']);

        if (!validateUsername (username) || !validateEmail (email) || !validatePassword (password)) {
            throw new Error ('Please enter the data in correct format');
        }
        User.findOne ({
            $or: [
                {username},
                {email}
            ]
        }).then ((user) => {
            if (user) {
                throw new Error ('Username or email already exists');
            }
            
            // generating the token
            const token = jwt.sign ({
                username,
                email,
                password
            }, config.REGISTER_TOKEN, { expiresIn: 60 });

            // return the mailer promise
            return mailer (config.SENDER_USER, email, 'please! complete your sign up', 'please complete your registration by clicking on the link below', `<p>please complete your registration by clicking here <a href='${config.PROJECT_URL}/api/register/${token}'>Complete Your Registration</a></p>`)

        }).then ((data) => {

            // returning the success
            return res.status (200).send ({
                status: 'success',
                data
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

// exporting the signup controller

module.exports = {
    signup
}
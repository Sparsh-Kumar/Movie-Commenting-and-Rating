
// importing all the dependencies

const _ = require ('lodash');
const path = require ('path');
const { mailer } = require (path.resolve (__dirname, '..', 'mailer', 'mailer'));
const jwt = require ('jsonwebtoken');
const { validateEmail, validateUsername, validatePassword } = require (path.resolve (__dirname, '..', 'validators', 'validator'));
const { config } = require (path.resolve (__dirname, '..', 'config', 'config'));
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));

// defining the forgotpassword controller

const forgotpassword = (req, res) => {
    try {
        const { email } = _.pick (req.body, ['email']);
        if (!email) {
            throw new Error ('Email is not entered for password reset');
        } else if (!validateEmail (email)) {
            throw new Error ('Email passed is not of proper format');
        }

        // finding if the user with this email exists or not
        User.findOne ({
            email
        }).then ((user) => {

            if (!user) {
                throw new Error ('User with the given email does not exists');
            }

            // generate a token for one time use only 
            // generating a secret key by concatenating user's current password and time from when the user is created
            // let secret = `${user.password}${user.createdAt.getTime ()}`;

            let secretkey = `${user.password}${user.createdAt.getTime ()}`;

            let resettoken = jwt.sign ({
                _id: user._id
            }, secretkey, { expiresIn: 60 }); // expires in 60 secs

            return mailer (config.SENDER_USER, email, 'Request for password reset', 'Reset your password by clicking on the link below', `<p>Reset your password Click here <a href='${config.PROJECT_URL}/api/reset/${user._id}/${resettoken}'>Reset Password</a></p>`)

        }).then ((data) => {

            // returning the response through the api
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

// exporting the forgotpassword controller
module.exports = {
    forgotpassword
}
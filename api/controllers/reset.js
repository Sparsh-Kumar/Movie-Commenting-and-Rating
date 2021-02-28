

// importing all the dependencies

const _ = require ('lodash');
const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const jwt = require ('jsonwebtoken');
const { validatePassword } = require (path.resolve (__dirname, '..', 'validators', 'validator'));
const bcrypt = require ('bcrypt');


// defining the reset controller

const reset = (req, res) => {
    try {

        if (!req.params.id || !req.params.token) {
            throw new Error ('No token or Id present in the request');
        }
        let token = req.params.token;
        let _id = req.params.id;
        const new_password = _.pick (req.body, ['new_password']);
        if (!new_password) {
            throw new Error ('no new password is mentioned in the request');
        } else if (!validatePassword (new_password)) {
            throw new Error ('Please enter password in correct format');
        }

        // find the User from the Database using the req.params.id
        User.findOne ({
            _id
        }).then ((user) => {

            if (!user) {
                throw new Error ('user with that id not found');
            }

            // generate the secret key to decode the token
            const secretkey = `${user.password}${user.createdAt.getTime ()}`;
            const decodedtoken = jwt.verify (token, secretkey);
            if (decodedtoken._id !== _id) {
                throw new Error ('you are not authorized to reset the password for this user');
            } else {

                // hashing the new password passed into the req.body
                return bcrypt.hash (new_password, config.SALT_ROUNDS); // it returns a promise to make a new password hash
                
            }

        }).then ((hashedpassword) => {

            // return a promise to update the password for the user
            return User.findOneAndUpdate ({
                _id
            }, {
                $set: {
                    password: hashedpassword
                }
            }, { upsert: true, new: true, runValidators: true, context: 'query' });

        }).then ((updateduser) => {
            
            // returning the updated user
            return res.status (200).send ({
                status: 'success',
                updateduser
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

// exporting the reset controller

module.exports = {
    reset
}
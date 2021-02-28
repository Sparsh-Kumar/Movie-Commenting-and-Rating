

// importing all the dependencies
const path = require ('path');
const jwt = require ('jsonwebtoken');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { config } = require (path.resolve (__dirname, '..', 'config', 'config'));

// defining the function refreshtoken
const refreshtoken = (req, res) => {
    try {
        if (!req.params.refreshtoken) {
            throw new Error ('no refresh token is present in the request');
        }

        // getting the token from the request
        // and decoding the token !

        const token = req.params.refreshtoken;
        const decodedtoken = jwt.verify (token, config.REFRESH_TOKEN_SECRET);

        // finding the user with the decoded token id
        User.findOne ({
            _id: decodedtoken._id
        }).then ((user) => {
            if (!user) {
                throw new Error ('User with the given refresh token no longer exists');
            }

            const accesstoken = jwt.sign ({
                _id: user._id
            }, config.ACCESS_TOKEN_SECRET, { expiresIn: 60 });
            
            // returning the access token and refresh token to the user
            return res.status (200).send ({
                status: 'success',
                access_token: accesstoken,
                refresh_token: token
            })

        }).catch ((error) => {
            return res.status (401).send ({
                status: 'failue',
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

// exporting the refreshtoken controller

module.exports = {
    refreshtoken
}
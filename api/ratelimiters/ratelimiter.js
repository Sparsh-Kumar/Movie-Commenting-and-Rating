

// importing all the dependencies

const ratelimiter = require ('express-rate-limit');


// creating of accounts should be rate limited

const createAccountLimiter = ratelimiter ({
    windowMs: 1 * 60 * 1000, // 1 min
    max: 5, // can only created 5 accounts from 1 ip address
    message: 'Too many accounts are created from this ip address, please try after 1 minute.'
});

// reset password or forget password attempts should be rate limited

const forgotPasswordLimiter = ratelimiter ({
    windowMs: 1 * 60 * 1000, // 1 min
    max: 5,
    message: 'Too many password reset attempts are done from this ip address, please try after 1 minute'
});


// exporting the rate limiters

module.exports = {
    createAccountLimiter,
    forgotPasswordLimiter
}
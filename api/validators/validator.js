
// importing all the dependencies

const validator = require ('validator');
const passwordValidator = require ('password-validator');

// defining the password Schema

const passwordSchema = new passwordValidator ();
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

const jwt = require ('jsonwebtoken');


// defining the email Validation function

const validateEmail = (email = undefined) => {
    if (!email) {
        return false;
    } else {
        return validator.isEmail (email);
    }
}

// defining the validate Username function

const validateUsername = (username = undefined) => {
    if (!username) {
        return false;
    } else {
        return ((!validator.isEmpty (username)) && (validator.isAlphanumeric (username))); // only allowing alphanumeric and non empty usernames
    }
}

// defining the validate password function

const validatePassword = (password = undefined) => {
    if (!password) {
        return false;
    } else {
        return passwordSchema.validate (password);
    }
}


// defining the movie name validation

const validateMoviename = (moviename = undefined) => {
    if (!moviename) {
        return false;
    } else {
        let r = /^[ A-Za-z0-9_@./#&+-:.]*$/; // regex expression to allow some special chars and alphanumeric values
        return ((!validator.isEmpty (moviename)) && (r.test (moviename)));       
    }
}

// defining the validate rating function

const validateRating = (rate = undefined) => {
    if (!rate) {
        return false;
    } else if ((rate < 1) || (rate > 10)) {
        return false;
    } else {
        return true;
    }
}

// defining the validate comment function

const validateComment = (comment = undefined) => {
    if (!comment) {
        return false;
    } else if ((!comment.length) || (comment.length > 25)) {
        return false;
    } else {
        return true;
    }
}

// defining the validate encoded comment as encoded string may have long length of same non encoded string

const validateEncodedComment = (comment = undefined) => {
    if (!comment) {
        return false;
    } else if ((!comment.length) || (comment.length > 50)) {
        return false;
    } else {
        return true;
    }
}

// exporting the validator functions

module.exports = {
    validateEmail,
    validateUsername,
    validatePassword,
    validateMoviename,
    validateRating,
    validateComment,
    validateEncodedComment
}
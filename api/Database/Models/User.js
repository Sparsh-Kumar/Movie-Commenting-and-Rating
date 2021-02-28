

// importing the dependencies

const mongoose = require ('mongoose');
const path = require ('path');
const uniqueValidator = require ('mongoose-unique-validator');
const bcrypt = require ('bcrypt');
const { config } = require (path.resolve (__dirname, '..', '..', 'config', 'config'));
const { validateEmail, validateUsername, validatePassword } = require (path.resolve (__dirname, '..', '..', 'validators', 'validator'));

// RVG&3Uf-vmgR?DQ

// defining the User Schema

const UserSchema = new mongoose.Schema ({

    username: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        validate: {
            validator: (username) => {
                return validateUsername (username);
            },
            message: '{VALUE} is not a valid username'
        }
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        validate: {
            validator: (email) => {
                return validateEmail (email);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: (password) => {
                return validatePassword (password);
            },
            message: '{VALUE} is not a valid password'
        }
    },
    rated_movies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'movie'
        }
    ]

}, { timestamps: true });

// making use of uniqueValidator plugin of mongoose
UserSchema.plugin (uniqueValidator);

// encrypting the user passwords before saving them into the database
UserSchema.pre ('save', function (next) {
    let user = this;
    bcrypt.hash (user.password, config.SALT_ROUNDS, (error, hash) => {
        if (error) {
            return next (error);
        } else {
            user.password = hash;
            next ();
        }
    })
});


// defining the comparePassword static function
// this will check for correct password
UserSchema.statics.comparePassword = function (text, hash) {
    return bcrypt.compare (text, hash); // it returns a promise
}

// defining the model of UserSchema
const User = mongoose.model ('user', UserSchema);

// exporting the UserModel
module.exports = {
    User
}
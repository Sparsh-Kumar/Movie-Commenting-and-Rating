

// importing all the dependencies

const mongoose = require ('mongoose');
const path = require ('path');
const { validateRating } = require (path.resolve (__dirname, '..', '..', 'validators', 'validator'));

// defining the rating Schema

const ratingSchema = new mongoose.Schema ({

    rate: {
        type: Number,
        required: true,
        validate: {
            validator: (rate) => {
                return validateRating (rate);
            },
            message: '{VALUE} is not a valid rating'
        }
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    movie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie'
    }

});

// defining the rating model
const Rating = mongoose.model ('rating', ratingSchema);

// exporting the rating model
module.exports = {
    Rating
}
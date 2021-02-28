

// importing all the dependencies

const mongoose = require ('mongoose');
const path = require ('path');
const uniqueValidator = require ('mongoose-unique-validator');
const { validateMoviename } = require (path.resolve (__dirname, '..', '..', 'validators', 'validator'));

// defining the movie Schema


const movieSchema = new mongoose.Schema ({

    title: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        validate: {
            validator: (moviename) => {
                return validateMoviename (moviename);
            },
            message: '{VALUE} is not a valid movie name'
        }
    },

    comments: [ // when comments will be inserted into database then they should be urlencoded (or another way we can remove html chars)
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],

    total_rating: {
        type: Number,
        default: 0
    },

    avg_rating: {
        type: Number,
        default: 0
    },

    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'rating'
        }
    ]

}, { timestamps: true });

// making use of unique plugin
movieSchema.plugin (uniqueValidator);

// making the movie model
const Movie = new mongoose.model ('movie', movieSchema);

// exporting the Movie model
module.exports = {
    Movie
}
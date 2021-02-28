


// importing all the dependencies

const mongoose = require ('mongoose');
const path = require ('path');
const { validateEncodedComment } = require (path.resolve (__dirname, '..', '..', 'validators', 'validator'));


// defining the CommentSchema

const commentSchema = new mongoose.Schema ({
    comment: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (comment) => {
                return validateEncodedComment (comment);
            },
            message: '{VALUE} is not a valid comment'
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
})

// making the model of commentSchema
const Comment = mongoose.model ('comment', commentSchema);

// exporting the comment model
module.exports = {
    Comment
}
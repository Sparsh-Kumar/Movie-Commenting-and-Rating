

// importing all the dependencies
const _ = require ('lodash');
const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { Movie } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'Movie'));
const { Comment } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'Comment'));
const { validateComment } = require (path.resolve (__dirname, '..', 'validators', 'validator'));
const { validateEncodedComment } = require (path.resolve (__dirname, '..', 'validators', 'validator'));
const { validateMoviename } = require (path.resolve (__dirname, '..', 'validators', 'validator'));

// defining the comment controller
const comment = (req, res) => {
    try {

        // Comment validation
        // getting the comment name and encoding it
        let moviedoc = undefined;
        let { comment, moviename } = _.pick (req.body, ['comment', 'moviename']);
        if ((!comment) || (!validateComment (comment))) {
            throw new Error ('comment should be 25 characters in length');
        }
        // if the comment is valid then we will encode the comment as it can contain unwanted html chars or special chars
        comment = encodeURIComponent (comment);
        if (!validateEncodedComment (comment)) {
            throw new Error ('encoded comment has a length of more than 50 characters which is not allowed');
        }
        
        // Movie name validation
        if ((!moviename) || (!validateMoviename (moviename))) {
            throw new Error ('movie name in the request is not a valid movie name');
        }

        // if the movie name is valid then find the movie with the specified movie name
        Movie.findOne ({
            title: moviename
        }).then ((movie) => {

            // checking if the movie with the specified name is not there then throw an error
            if (!movie) {
                throw new Error ('there is no movie with this name');
            }

            moviedoc = movie;

            // if the movie with the specified movie name is found then return a promise to create a comment
            return Comment.create ({
                comment,
                user_id: req.user._id,
                movie_id: movie._id
            })
            
        }).then ((createdcomment) => {

            // return a promise to append comment into the movie document
            return Movie.findOneAndUpdate ({
                _id: moviedoc._id
            }, {
                $push: {
                    comments: createdcomment
                }
            }, { upsert: true, new: true, runValidators: true, context: 'query' });

        }).then ((updatedmoviedoc) => {

            // return updated movie doc to user
            return res.status (200).send ({
                status: 'success',
                updatedmoviedoc
            })

        }).catch ((error) => {

            // return error to the user
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

// exporting the comment controller
module.exports = {
    comment
}
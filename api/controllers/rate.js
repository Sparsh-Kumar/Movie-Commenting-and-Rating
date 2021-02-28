

// importing all the dependencies
const _ = require ('lodash');
const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { Movie } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'Movie'));
const { Rating } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'Rating'));
const { validateRating } = require (path.resolve (__dirname, '..', 'validators', 'validator'));
const { validateMoviename } = require (path.resolve (__dirname, '..', 'validators', 'validator'));


// defining the rate controller
const rate = (req, res) => {
    try {

        // retrieving the movie name and rating from the request body
        let { moviename, rating } = _.pick (req.body, ['moviename', 'rating']);
        rating = parseInt (rating);
        let moviedoc = undefined;
        let createdratingdoc = undefined;
        if ((!moviename) || (!validateMoviename (moviename))) {
            throw new Error ('Movie name is not a valid movie name');
        }

        // checking if a rating is of numeric value or not
        if ((!_.isNumber (rating)) || (_.isNaN (rating)) || (_.isNull (rating)) || (!validateRating (rating))) {
            throw new Error ('Rating provided in the body is not of proper type, [it should be a number b/w 1 to 10]');
        }

        // if the rating is in correct format, then
        // we will find the movie with the specified movie name

        Movie.findOne ({
            title: moviename
        }).then ((movie) => {

            // if there is no movie of specified movie name then throw an error
            if (!movie) {
                throw new Error ('no movie found with the specified movie name');
            }

            moviedoc = movie;
            // if movie is found with the specify movie name
            // then we will return a promise to find the rating on that movie by the logged in user

            return Rating.findOne ({
                user_id: req.user._id,
                movie_id: movie._id
            })

        }).then ((foundrating) => {

            // if the rating is found with the userid of logged in user and movie id of found movie then throw error
            if (foundrating) {
                throw new Error ('you have already rated this movie, you cannot rate it again');
            }

            // if no rating is found with the userid of logged in  user and movie id of the found movie, then proceed
            // return a promise to create a rating document
            return Rating.create ({
                rate: rating,
                user_id: req.user._id,
                movie_id: moviedoc._id
            })

        }).then ((createdrating) => {

            createdratingdoc = createdrating;
            let total_rating = moviedoc.total_rating + createdratingdoc.rate;
            let total_count = moviedoc.ratings.length + 1; // keeping in account the rate document that we are going to push into the movie ratings field (therefore increment by 1)
            let avg_rating = total_rating / total_count;

            // update the total_rating field to total_rating values and avg_rating field to avg_rating value
            // push the createdrating into the movie doc

            return Movie.findOneAndUpdate ({
                _id: moviedoc._id
            }, {
                $set: {
                    total_rating,
                    avg_rating
                },

                $push: {
                    ratings: createdrating
                }
            }, { upsert: true, new: true, runValidators: true, context: 'query' });

        }).then ((updatedmoviedoc) => {

            // push the creatdratingdoc id into the logged in user's rated_movies field
            return User.findOneAndUpdate ({
                _id: req.user._id
            }, {
                $push: {
                    rated_movies: updatedmoviedoc
                }
            }, { upsert: true, new: true, runValidators: true, context: 'query' });

        }).then ((updateduser) => {

            // return the updated user to the user
            return res.status (200).send ({
                status: 'success',
                updateduser
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

// exporting the rate controller
module.exports = {
    rate
}
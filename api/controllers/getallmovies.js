

// importing all the dependencies

const path = require ('path');
const _ = require ('lodash');
const { Movie } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'Movie'));
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));


// defining the getallmovies controller
// We will also apply pagination on the api

const getallmovies = (req, res) => {
    try {

        const page = req.params.page ? parseInt (req.params.page): 1;
        const limit = req.params.limit ? parseInt (req.params.limit): 1;

        if ((!_.isNumber (page)) || (!_.isNumber (limit))) {
            throw new Error ('page or limit are not of proper type');
        }

        if ((page < 0) || (limit < 0)) {
            throw new Error ('page and limit cannot have negative values');
        }

        // startIndex and endIndex values
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // making an empty object that holds the value of the current, prev and next pages
        const rep = {};

        // If the startIndex is greater than 0 then in that case
        // push previous page value and limit of data for each page

        if (startIndex > 0) {
            rep.previous = {
                details: {
                    page: page - 1,
                    limit
                }
            }
        }

        // push the current value in the rep object

        rep.current = {
            details: {
                page,
                limit
            }
        }

        Movie.countDocuments ({

        }).then ((countDocs) => {

            // if endindex < counted Objects then make the next property in rep Object
            if (endIndex < countDocs) {
                rep.next = {
                    details: {
                        page: page + 1,
                        limit
                    }
                }
            }

            // return a promise to find the specified results in descending sort order
            return Movie.find ({}).sort ({ avg_rating: -1 }).limit (limit).skip (startIndex);

        }).then ((movies) => {

            // return movies and rep object to the user

            return res.status (200).send ({
                status: 'success',
                movies,
                rep
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

// exporting the getallmovies controller

module.exports = {
    getallmovies
}
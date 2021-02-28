
//https://cloud.mongodb.com/v2/5f02bc1252f9292b1d239916#clusters/commandLineTools/InstaDatabase
// the above link is how you can import csv file in mongodb atlas

/*
    Important query to convert all the document fields to lowercase or uppercase
    db.movies.update ({}, [{$set: { title: { $toLower: "$title" } } }], {multi: true})
    (this query only works with update not updateMany) [for reference - https://stackoverflow.com/questions/9423932/update-mongodb-collection-using-tolower/9424383]
*/

config = {
    PORT: 80,
    database_URL: 'your_mongodb_database_url',
    REGISTER_TOKEN: 'Sample Register token',
    MAIL_SERVICE: 'gmail',
    PROJECT_URL: 'http://localhost',
    SENDER_USER: 'your_email_address',
    SENDER_PASSWORD: 'your_email_password',
    ACCESS_TOKEN_SECRET: 'Sample access token secret',
    REFRESH_TOKEN_SECRET: 'Sample refresh token secret',
    SALT_ROUNDS: 5
}

module.exports = {
    config
}
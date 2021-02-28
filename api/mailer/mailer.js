

// importing the nodemailer

const nodemailer = require ('nodemailer');
//const sendgridTransport = require ('nodemailer-sendgrid-transport');
const path = require ('path');
const { config } = require (path.resolve (__dirname, '..', 'config', 'config'));


// defining the mailer function

const mailer = (from = undefined, to = undefined, subject = undefined, text = undefined, html = undefined) => {

    try {

        // validating the values
        if (!from || !to || !subject || !text || !html) {
            throw new Error ('please enter all the fields');
        }

        // making the mail transport

        /*
        let mailTransporter = nodemailer.createTransport (sendgridTransport ({
            auth: config.SENDGRID_API_KEY
        }));
        */

        // YOU CAN USE ABOVE COMMENTED CODE TO SEND EMAILS VIA SENDGRID, WE ARE HERE USING GMAIL 

        let mailTransporter = nodemailer.createTransport ({
            service: config.MAIL_SERVICE,
            auth: {
                user: config.SENDER_USER,
                pass: config.SENDER_PASSWORD
            }
        })

        // defining the mail details

        const mailDetails = {
            from,
            to,
            subject,
            text,
            html
        }

        // returning the promise to the mailing function

        return new Promise ((resolve, reject) => {
            mailTransporter.sendMail (mailDetails, (error, data) => {
                if (error) {
                    reject (error);
                } else {
                    resolve (data);
                }
            })
        })
    } catch (error) {
        return new Promise ((resolve, reject) => {
            reject (error);
        })
    }

}


// exporting the mailer function

module.exports = {
    mailer
}
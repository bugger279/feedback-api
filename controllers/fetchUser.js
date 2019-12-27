const giveFeedbackModel = require('../models/giveFeedback');
const UserModel = require('../models/user');
// const sgMail = require('@sendgrid/mail');

const sendmail = require('sendmail')();

let fetchUsers = (req, res) => {
    let usernames = [];
    giveFeedbackModel.find({ "sender_id": req.params.sender_id }, (err, allotedData) => {
        if (err) {
            res.status(400).send({ "message": "No Users Alloted" });
        } else {
            res.send({ "usersList": allotedData });
            allotedData.forEach(userData => {
                usernames.push(userData["receiver_name"])
            });
            UserModel.find({ _id: req.params.sender_id }, (err, detailOfUser) => {
                // Send Grid Mailer 
                var fromEmail = "inderjeet.sav@neosofttech.com";
                // SENDGRID_APY_KEY = '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';
                // sgMail.setApiKey(SENDGRID_APY_KEY);
                // const msg = {
                //     to: detailOfUser[0].email,
                //     from: fromEmail,
                //     subject: 'Feedback Usernames',
                //     html: 'You have to give feedback to ' + usernames[0] + ', ' + usernames[1] + ' and ' + usernames[2]
                // };
                // sgMail.send(msg).then((result) => {
                //     console.log(result);
                // }).catch((error) => {
                //     console.log(error);
                //     console.log('error', JSON.stringify(error));
                // });

                // Send Mail Code
                sendmail({
                    from: fromEmail,
                    to: detailOfUser[0].email,
                    subject: 'Feedback Usernames',
                    html: 'You have to give feedback to ' + usernames[0] + ', ' + usernames[1] + ' and ' + usernames[2],
                }, function (err, reply) {
                    if (err) {
                        console.log("Not Sent");
                        console.log(err && err.stack);
                    } else {
                        console.log("Sent Successfully!");
                        console.dir(reply);
                    }
                });
            });
        }
    });

}

module.exports = { fetchUsers };
const
    express = require('express'),
    tripsRouter = new express.Router(),
    _ = require('underscore'),
    Trip = require('../models/Trip.js'),
    User = require('../models/User.js'),
    nodemailer = require('nodemailer'),
    twilio = require('twilio')

tripsRouter.route('/')
    .get((req, res) => {
        //need to find by user
        //console.log(req)

         
        //look through user's trips and find top 3 destinations
           
        Trip.aggregate([
            {
                $match: {
                    user: req.user._id
                }
            },
            {
                $group: {
                _id: "$end", count: { $sum: 1 }
                        }
            },
            { 
                $sort: { 
                count: -1 
                        } 
            },
            {
                $limit : 3
            }

        ])
        .exec(function(err, aggregatedTrips){
            if(err)console.log(err)
            console.log(aggregatedTrips)
            res.render('trip_selection', {sortedEnds: aggregatedTrips})
        })
    })

    // send a array of three trips
    //need to post to user
    .post((req, res) => {
        var newTrip = new Trip()
        if(req.body.end){
            newTrip.end = req.body.end
        }
        newTrip.user = req.user
        newTrip.save((err, trip) => {
        if(err){
                 res.json(err)
             }
             else {
                 console.log(newTrip)
                 res.redirect(`/trips/${newTrip.id}`)
             }
         })
    })
    
    //add get

tripsRouter.route('/:tripId')
    .get((req, res) => {
        Trip.findById(req.params.tripId, (err, trip) => {
            if(err) {
                res.json(err)
            } else {
                res.render('trip', {trip: trip})
            }
        })
    })
    .patch((req, res) => {
        Trip.findByIdAndUpdate(req.params.tripId, req.body, {new: true}, (err, trip) => {
            //not updating correctly
            console.log("req.body" + JSON.stringify(req.body))
            if(err){ return console.log(err)}
            else{
                //send back ajax
                console.log('Trip should have updated')
                res.json({success:true, message:"trip updated", trip: trip})
            }
        })
    })
tripsRouter.route('/:tripId/json')
    .get((req, res) => {
        
        Trip.findById(req.params.tripId, (err, trip) => {
            if(err) {
                res.json(err)
            }
            else{
                res.json(trip)
            }
        })
    })


tripsRouter.route('/:tripId/alarm/:tripDuration') 
    .get((req, res) => {
        var transporter = nodemailer.createTransport({ 
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD
            }
        })
        
        var currentTime = new Date(new Date().getTime()).toLocaleTimeString();
        const mailOptions = {
            from: process.env.GMAIL_EMAIL, // sender address
            to: req.user.email, // list of receivers
            subject: `Dozer`, // Subject line
            html: `<p>You are approaching your destination</p>`// plain text body
        };
        
        const
            accountSid = process.env.TWILIO_ACCOUNT_SID,
            authToken = process.env.TWILIO_AUTH_TOKEN,
            twilioNumber = process.env.TWILIO_NUMBER,
            client = new twilio(accountSid, authToken)
        
        Trip.findById(req.params.tripId, (err, trip) => {
            if(err) {
                res.json(err)
            } else {
                var alertSecs = trip.alertSeconds * 60
                var duration = req.params.tripDuration
                var interval = (duration - alertSecs) * 1000


                setTimeout(function() {
                    if(trip.method == "Email") { // if email run this 
                        transporter.sendMail(mailOptions, function (err, info) {
                            if(err) console.log(err)
                            else console.log(info);
                        })
                    } else if (trip.method == "Text") {
                        client.messages.create({
                            to: '+1' + req.user.contact,
                            from: twilioNumber,
                            body: 'You are approaching your destination'
                        })
                        .then((message) => console.log(message.sid));
                    } else if (trip.method == "Call") {
                        client.api.calls.create({
                            url: 'http://demo.twilio.com/docs/voice.xml',
                            to: '+1' + req.user.contact,
                            from: twilioNumber
                        })
                        .then((call) => console.log(call.sid));
                    };
                }, interval);
                return res.render('alarm', {trip: trip})
            }
        })
    })

module.exports = tripsRouter

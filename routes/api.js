var mongoose = require('mongoose');
var User = mongoose.model('User');
var File = mongoose.model('File');
var express = require('express');
var passport = require('passport');
var async = require('async');
var crypto = require('crypto');
var bCrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');

var router = express.Router();


function isAuthenticated(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods
    if (req.method === "GET") {
        return next();
    }
    if (req.isAuthenticated()) {
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};

// router.use('/users', isAuthenticated);


var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

router.route('/users')
    //gets all users
    .get(function(req, res) {
        User.find(function(err, user) {
            if (err) {
                return res.writeHead(500, err);
            }
            return res.send(user);
        });
    })
    .delete(function(req, res) {
        File.remove({}, function(err) {
            if (err)
                res.send(err);
            res.json("deleted");
        });
    });


router.route('/file')

//gets the menu
.get(function(req, res) {
    File.find(function(err, files) {
        if (err) {
            return res.writeHead(500, err);
        }
        return res.send(files);
    });
})

//adds a new item to menu
.post(function(req, res) {
    var newBooking = new Booking();
    newBooking.bookingType = req.body.bookingType;
    newBooking.journeyType = req.body.journeyType;
    newBooking.pickupLocation = req.body.pickupLocation;
    newBooking.dropLocation = req.body.dropLocation;
    newBooking.departDate = req.body.departDate;
    newBooking.returnDate = req.body.returnDate;
    newBooking.departTime = req.body.departTime;
    newBooking.returnTime = req.body.returnTime;
    newBooking.passengers = req.body.passengers;
    newBooking.carType = req.body.carType;
    newBooking.customerName = req.body.customerName;
    newBooking.customerEmail = req.body.customerEmail;
    newBooking.customerContact = req.body.customerContact;
    newBooking.customerAddress = req.body.customerAddress;
    newBooking.userId = req.body.userId;
    newBooking.otp = req.body.otp;
    newBooking.save(function(err, newBooking) {
        if (err) {
            return res.send(500, err);
        }
        var mobileNo = req.body.customerContact;
        var otp = req.body.otp;
        return res.send(JSON.stringify(newBooking));
    });
})

.delete(function(req, res) {
    Booking.remove({}, function(err) {
        if (err)
            res.send(err);
        res.json("deleted");
    });
});


router.route('/users/:id')

//deletes a user
.delete(function(req, res) {
    User.remove({
        _id: req.params.id
    }, function(err) {
        if (err)
            res.send(err);
        res.json("User deleted");
    });
});

router.route('/file/:id')

//deletes a user
.delete(function(req, res) {
        File.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("File deleted");
        });
    })
    //updates specified post
    .put(function(req, res) {
        File.findById(req.body._id, function(err, file) {
            if (err)
                res.send(err);
            file.monday = req.body.monday;
            file.tuesday = req.body.tuesday;
            file.wednesday = req.body.wednesday;
            file.thursday = req.body.thursday;
            file.friday = req.body.friday;
            file.saturday = req.body.saturday;
            file.sunday = req.body.sunday;

            file.save(function(err, file) {
                if (err)
                    res.send(err);
                res.json(file);
            });
        });
    });

module.exports = router;
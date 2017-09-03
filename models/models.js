var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var filesSchema = new mongoose.Schema({
    username: String,
    managerId: String,
    userFullName: String,
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
});

var userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    username: String,
    password: String,
    token: String,
    managerId: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

mongoose.model('File', filesSchema);
mongoose.model('User', userSchema);
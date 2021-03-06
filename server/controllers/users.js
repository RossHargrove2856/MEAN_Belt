console.log("Loading user controller...");

// Requires mongoose and bcrypt dependencies as well as the user model
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var User = mongoose.model("User");

// Creates users module for create and login functions
module.exports = {
    create: function(req,res) {
        var newUser = new User(req.body);
        newUser.save(function(err, user){
            if(err){
                console.log(err.message);
                return res.json(err);
            }
            return res.json(user);
        })
    },
    login: function(req,res) {
        var isValid = true;
        User.findOne({email:req.body.email}).exec(function(err, user) {
            if(err){
                return res.json(err);
            }
            if(!user) {
                isValid = false;
            } else {
                if(bcrypt.compareSync(req.body.password, user.password)) {
                    return res.json(user);
                } else {
                    isValid = false;
                }
            }
            if(!isValid) {
                return res.json({
                    "errors": {
                        "login": {
                            "message": "Invalid login"
                        }
                    }
                })
            }
        });
    }
}
// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// set up a mongoose model
var userSchema = new schema({
  email: String,
  password: String,
  name: String,
  phone: String,
  city: String,
  tradepoint: {
    tp: String,
    name: String,
    wp: String,
    tradepoint: String,
    address: String,
    city: String
  },
  atWork: Boolean,
  role: Number
});

userSchema.pre('save', function (next) {
  var user = this;
  // not isModified or isNew // if (this.isModified('password') || this.isNew)
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (pwd, done) {
  bcrypt.compare(pwd, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};

module.exports = mongoose.model('users', userSchema);

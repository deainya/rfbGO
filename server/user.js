// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var schema = mongoose.schema;
var bcrypt = require('bcrypt');

// set up a mongoose model
var userSchema = new schema({
  email: String,
  password: String,
  name: String,
  tradepoint: String,
  address: String
});

userSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) { return next(); } // not isModified or isNew // if (this.isModified('password') || this.isNew)
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

module.exports = mongoose.model('user', userSchema);

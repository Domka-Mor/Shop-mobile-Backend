const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"]
    },
    name: { type: String, required: true },
    surname: {type: String, required: true},
    adress: { type: String, required: true },
    country: { type: String, required: true },
    cart: {
        type: Array,
        default: []
    }
});

//userSchema.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed person.
//    this.model('Order').remove({ user: this._id }, next);
//});


module.exports = mongoose.model('User', userSchema);
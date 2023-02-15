const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    Insurance_pdf: {
        type: String
    }
}, {
    collection: 'users'
})

module.exports = mongoose.model('User', userSchema)
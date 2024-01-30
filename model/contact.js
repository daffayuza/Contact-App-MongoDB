const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    nohp: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
})

const Contact = mongoose.model('Contact', contactSchema)


module.exports = Contact
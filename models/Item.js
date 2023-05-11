const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Must provide item title']
    },
    price: {
        type: Number,
        required: [true, 'Must provide item price'],
        float: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required:false
    }
})

module.exports = mongoose.model('Item', itemSchema)
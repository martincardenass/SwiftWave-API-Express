const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Must provide Item Title']
    },
    price: {
        type: Number,
        required: [true, 'Must provide Item Price'],
        float: true
    },
    description: {
        type: String,
        float: false,
        required: false
    },
    amount: {
        type: Number,
        required: false
    },
    image: {
        type: String,
        required:false
    },
    date: { //? This will generate automatically
        type: Date,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: [true, 'Must provide Item Category']
    },
    isPopular: {
        type: Boolean,
        required: false
    }
})

module.exports = mongoose.model('Item', itemSchema)
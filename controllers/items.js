const Item = require('../models/Item')

//img upload
const multer = require('multer')
const path = require('path')

const getAllItems = async (req, res) => { // Get all Items
    try {
        const items = await Item.find(req.body)
        res.status(200).json({items})
    } catch (error) {
        res.status(500).json({msg: 'Error', error})
    }
}

const createItems = async (req, res) => { // Create a new Item
    try {
        const newItem = {
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            image: req.file.path
        }
        const item = await Item.create(newItem)
        res.status(201).send(item)
    } catch (error) {
        res.status(500).json({msg: 'Error!!', error})
    }
}

const getItem = async (req, res) => { // Get sinlge Item
    try {
        const {id:itemID} = req.params
        const item = await Item.findOne({_id:itemID})
        if(!item) {
            console.log('...')
            return res.status(404).json({msg: `No such item ${itemID}`})
        }
        res.status(200).json({item})
    } catch (error) {
        res.status(500).json({msg: 'Error', error})
    }
}

const deleteItem = async (req, res) => { 
    try {
        const {id:itemID} = req.params
        const item = await Item.findOneAndDelete({_id:itemID})
        res.status(200).json({item, status: `deleting ${itemID} success`})
    } catch (error) {
        res.status(500).json({msg: 'Error', error})
    }
}

const deleteAllItems = async (req, res) => {
    try {
        await Item.deleteMany()
        res.status(200).json({msg: 'Purged the database success'})
    } catch (error) {
        res.status(500).json({msg: 'Error', error})
    }
}

const updateItem = async (req, res) => {
    try {
        const itemID = req.params.id
        const update = {
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
        }
        req.file ? update.image = req.file.path : null
        const item = await Item.findOneAndUpdate({_id:itemID}, update,  {
            new:true, //runValidators: true
        })
        res.status(201).send(item)
        if(!item) {
            return res.status(404).json({msg: `No such item with ${itemID}`})
        }
    } catch (error) {
        res.status(500).json({msg: 'Error', error})
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage:storage}).single('image')

module.exports = {  // export as an object
    getAllItems,
    createItems,
    getItem,
    deleteItem,
    updateItem,
    deleteAllItems,
    upload
}
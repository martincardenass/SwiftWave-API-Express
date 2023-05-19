const Item = require('../models/Item')

//img upload
const multer = require('multer')
const path = require('path')

const getAllItems = async (req, res) => {
    try {
        const items = await Item.find(req.body)
        res.status(200).json({items})
    } catch (error) {
        res.status(500).json({msg: 'Error', error})
    }
}
const getItemsByPage = async (req, res) => { //* Get all Items
    try {
        //*sorting
        const sortField = req.query.sortField || 'price'
        const sortOrder = req.query.sortOrder || ''
        const sortParameters = {}
        sortParameters[sortField] = sortOrder === 'desc' ? -1 : 1

        //*pagination
        const limitSize = req.query.limit || 5
        const pageNumber =  req.query.page || 1
        const skipValue =(pageNumber - 1) * limitSize

        //*categories
        let query = {}
        if(req.query.category) { query.category = req.query.category } //? code for getting one category at a time
        

       const total = await Item.countDocuments(req.body) //?gets the total of items matching the query
       const queryTotal = await Item.countDocuments(query) //?gets the total of the items of a certain category
       const queryTotalPages = Math.ceil(queryTotal / 5)
       const totalPages = Math.ceil(total / limitSize) //?gets the total of pages
       const currentPage = pageNumber

        const items = await Item.find(query)
            .skip(skipValue)
            .limit(limitSize)
            .sort(sortParameters)

        res.status(200).json({items, total, totalPages, currentPage, queryTotal, queryTotalPages})
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
            amount: req.body.amount,
            image: req.file.path,
            date: Date.now(),
            category: req.body.category,
            isPopular: req.body.isPopular
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
            return res.status(404).json({msg: `No such item ${itemID}`})
        }
        console.log('req', item)
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
            amount: req.body.amount,
            isPopular: req.body.isPopular,
            category: req.body.category
        }
        req.file ? update.image = req.file.path : null
        const item = await Item.findOneAndUpdate({_id:itemID}, update,  {
            new:true, //runValidators: true
        })
        
        if(!item) {
            return res.status(404).json({msg: `No such item with ${itemID}`})
        }
        res.status(201).send(item)
    } catch (error) {
        res.status(500).json({msg: 'Error updating item', error})
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
    getItemsByPage,
    createItems,
    getItem,
    deleteItem,
    updateItem,
    deleteAllItems,
    upload
}
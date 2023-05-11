const express = require('express')
const router = express.Router()

//Routes
const itemsController = require('../controllers/items')
//const {getAllItems, createItems, getItem, deleteItem, deleteAllItems, updateItem} = require('../controllers/items') < another way
router.route('/items')
    .get(itemsController.getAllItems)
    .delete(itemsController.deleteAllItems)

router.post('/addItem', itemsController.upload, itemsController.createItems)

router.route('/items/:id')
    .get(itemsController.getItem)
    .delete(itemsController.deleteItem)
    .patch(itemsController.upload, itemsController.updateItem)

module.exports = router
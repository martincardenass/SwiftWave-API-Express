const express = require('express')
const router = express.Router()

//Routes
const itemsController = require('../controllers/items')
//const {getAllItems, createItems, getItem, deleteItem, deleteAllItems, updateItem} = require('../controllers/items') < another way
router.route('/items')
    .get(itemsController.getItemsByPage)
    .delete(itemsController.deleteAllItems)

router.route('/items/all')
    .get(itemsController.getAllItems)

router.post('/addItem', itemsController.upload, itemsController.createItems)

router.route('/items/:id')
    .get(itemsController.getItem)
    .delete(itemsController.deleteItem)
    .patch(itemsController.upload, itemsController.updateItem)

module.exports = router
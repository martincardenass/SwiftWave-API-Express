const express = require('express')
const router = express.Router()

//Routes
const itemsController = require('../controllers/items')

router.route('/items')
    .get(itemsController.getItemsByPage)
    // .delete(itemsController.deleteAllItems) 

router.route('/items/all')
    .get(itemsController.getAllItems)

router.route('/items/popular')
   .get(itemsController.getPopularItems)

router.post('/addItem', itemsController.upload, itemsController.createItems)

router.route('/items/:id')
    .get(itemsController.getItem)
    .delete(itemsController.deleteItem)
    .patch(itemsController.upload, itemsController.updateItem)

module.exports = router
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const verifyToken = require('../middleware/authMiddleware');

// Public search for customers
router.get('/search', inventoryController.searchItemsPublic);

// Admin-secured routes
router.get('/admin/all', verifyToken, inventoryController.getAllItemsAdmin);
router.post('/admin/add', verifyToken, inventoryController.addItemAdmin);

module.exports = router;

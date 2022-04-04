const express = require('express');

const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.route('/').get(categoryController.getAllCategories);
router.route('/').post(categoryController.createCategory);
router.route('/:slug').get(categoryController.getCategory);

module.exports = router;


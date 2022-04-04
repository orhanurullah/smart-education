const express = require('express');
const redirectMiddleware = require('../middlewares/redirectMiddleware');

const pageController = require('../controllers/pageControllers');

const router = express.Router();

router.route('/').get(pageController.getIndexPage);
router.route('/about').get(pageController.getAboutPage);
router.route('/contact').get(pageController.getContactPage);
router.route('/contact').post(pageController.sendEmail);

// Auth
router.route('/login').get(redirectMiddleware, pageController.getLoginPage);
router.route('/register').get(redirectMiddleware, pageController.getRegisterPage);

module.exports = router;


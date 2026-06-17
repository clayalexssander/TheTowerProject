const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get("/agenda", homeController.getAgenda);

module.exports = router;
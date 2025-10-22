const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const auth = require('../middleware/auth');

router.post('/', auth, mealController.addMeal);
router.get('/', auth, mealController.getMealsByDate); // ?date=YYYY-MM-DD
router.delete('/:id', auth, mealController.deleteMeal);

module.exports = router;

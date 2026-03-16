const express = require('express');
const router = express.Router();
const { addRecipe, getRecipes, searchRecipes } = require('../controllers/recipeController');
router.get('/recipes', getRecipes);
router.get('/recipes/search', searchRecipes);
router.post('/recipes', addRecipe);
module.exports = router;

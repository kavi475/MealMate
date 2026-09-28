import express from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  checkFavorite
} from '../controllers/favoriteController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All favorites require auth
router.get('/', auth, getFavorites);
router.post('/:menuItemId', auth, addFavorite);
router.delete('/:menuItemId', auth, removeFavorite);
router.post('/toggle/:menuItemId', auth, toggleFavorite);
router.get('/check/:menuItemId', auth, checkFavorite);

export default router;
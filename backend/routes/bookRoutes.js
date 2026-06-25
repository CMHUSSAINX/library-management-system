import express from 'express';
import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  getLibraryStats,
} from '../controllers/bookController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(protect, adminOnly, addBook);

router.get('/stats/summary', getLibraryStats);

router.route('/:id')
  .get(getBookById)
  .put(protect, adminOnly, updateBook)
  .delete(protect, adminOnly, deleteBook);

export default router;

import express from 'express';
import {
  borrowBook,
  returnBook,
  getUserActiveBorrows,
  getUserBorrowHistory,
  getAllActiveBorrows,
} from '../controllers/borrowController.js';
import { protect, adminOnly, memberOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-active', protect, getUserActiveBorrows);
router.get('/my-history', protect, getUserBorrowHistory);
router.get('/active', protect, adminOnly, getAllActiveBorrows);

router.post('/:bookId', protect, memberOnly, borrowBook);
router.post('/:bookId/return', protect, memberOnly, returnBook);

export default router;

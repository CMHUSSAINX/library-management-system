import borrowService from '../services/borrowService.js';

// @desc    Borrow a book
// @route   POST /api/borrow/:bookId
// @access  Private/Member
export const borrowBook = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;
    
    const record = await borrowService.borrowBook(userId, bookId);
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

// @desc    Return a borrowed book
// @route   POST /api/borrow/:bookId/return
// @access  Private/Member
export const returnBook = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;

    const record = await borrowService.returnBook(userId, bookId);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's active borrowings
// @route   GET /api/borrow/my-active
// @access  Private
export const getUserActiveBorrows = async (req, res, next) => {
  try {
    const records = await borrowService.getUserActiveBorrows(req.user._id);
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's complete borrow history
// @route   GET /api/borrow/my-history
// @access  Private
export const getUserBorrowHistory = async (req, res, next) => {
  try {
    const records = await borrowService.getUserBorrowHistory(req.user._id);
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active borrowings in system
// @route   GET /api/borrow/active
// @access  Private/Admin
export const getAllActiveBorrows = async (req, res, next) => {
  try {
    const records = await borrowService.getAllActiveBorrows();
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

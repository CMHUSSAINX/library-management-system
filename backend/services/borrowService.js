import BorrowRecord from '../models/BorrowRecord.js';
import Book from '../models/Book.js';

class BorrowService {
  // Borrow a book
  async borrowBook(userId, bookId) {
    // 1. Check if user already has an active borrow for this book
    const existingBorrow = await BorrowRecord.findOne({
      user: userId,
      book: bookId,
      status: 'borrowed',
    });

    if (existingBorrow) {
      throw new Error('You have already borrowed this book and have not returned it yet');
    }

    // 2. Retrieve the book and check availability
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    if (book.availableCopies <= 0) {
      throw new Error('No copies of this book are currently available');
    }

    // 3. Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    // 4. Create the borrow record (due date: 14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const record = await BorrowRecord.create({
      user: userId,
      book: bookId,
      dueDate,
    });

    return await record.populate('book');
  }

  // Return a book
  async returnBook(userId, bookId) {
    // 1. Find the active borrow record
    const record = await BorrowRecord.findOne({
      user: userId,
      book: bookId,
      status: 'borrowed',
    });

    if (!record) {
      throw new Error('No active borrowing record found for this book and user');
    }

    // 2. Retrieve the book and increment available copies
    const book = await Book.findById(bookId);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    // 3. Update the record
    record.status = 'returned';
    record.returnDate = new Date();
    await record.save();

    return record;
  }

  // Get active borrows for a specific user
  async getUserActiveBorrows(userId) {
    return await BorrowRecord.find({
      user: userId,
      status: 'borrowed',
    }).populate('book').sort({ borrowDate: -1 });
  }

  // Get all borrows (history & active) for a specific user
  async getUserBorrowHistory(userId) {
    return await BorrowRecord.find({ user: userId })
      .populate('book')
      .sort({ borrowDate: -1 });
  }

  // Get all active borrows in the system (Admin only)
  async getAllActiveBorrows() {
    return await BorrowRecord.find({ status: 'borrowed' })
      .populate('user', 'name email')
      .populate('book', 'title author isbn')
      .sort({ borrowDate: -1 });
  }
}

export default new BorrowService();

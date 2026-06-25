import Book from '../models/Book.js';
import BorrowRecord from '../models/BorrowRecord.js';
import User from '../models/User.js';

class BookService {
  // Add a new book
  async addBook(bookData) {
    const { title, author, isbn, genre, description, totalCopies } = bookData;

    const bookExists = await Book.findOne({ isbn });
    if (bookExists) {
      throw new Error('A book with this ISBN already exists');
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      genre,
      description,
      totalCopies,
      availableCopies: totalCopies, // Initially all copies are available
    });

    return book;
  }

  // Update book details
  async updateBook(id, updateData) {
    const book = await Book.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }

    // Calculate changes in copies
    if (updateData.totalCopies !== undefined) {
      const difference = updateData.totalCopies - book.totalCopies;
      const newAvailableCopies = book.availableCopies + difference;
      
      if (newAvailableCopies < 0) {
        throw new Error('Cannot reduce total copies below currently borrowed copies');
      }
      
      book.totalCopies = updateData.totalCopies;
      book.availableCopies = newAvailableCopies;
    }

    // Update other fields
    if (updateData.title) book.title = updateData.title;
    if (updateData.author) book.author = updateData.author;
    if (updateData.isbn) {
      const isbnExists = await Book.findOne({ isbn: updateData.isbn, _id: { $ne: id } });
      if (isbnExists) {
        throw new Error('ISBN is already taken by another book');
      }
      book.isbn = updateData.isbn;
    }
    if (updateData.genre) book.genre = updateData.genre;
    if (updateData.description) book.description = updateData.description;

    await book.save();
    return book;
  }

  // Delete book
  async deleteBook(id) {
    const book = await Book.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }

    // Check if the book has active borrowings
    const activeBorrows = await BorrowRecord.findOne({ book: id, status: 'borrowed' });
    if (activeBorrows) {
      throw new Error('Cannot delete book that is currently borrowed by a user');
    }

    await Book.findByIdAndDelete(id);
    return { message: 'Book deleted successfully' };
  }

  // Get and search books
  async getBooks(query = {}) {
    const { search, genre } = query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    if (genre) {
      filter.genre = { $regex: genre, $options: 'i' };
    }

    return await Book.find(filter).sort({ createdAt: -1 });
  }

  // Get single book details
  async getBookById(id) {
    const book = await Book.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }

  // Get system-wide stats
  async getStats() {
    const totalBooks = await Book.countDocuments();
    const books = await Book.find({});
    
    let totalCopiesCount = 0;
    let availableCopiesCount = 0;
    books.forEach(b => {
      totalCopiesCount += b.totalCopies;
      availableCopiesCount += b.availableCopies;
    });

    const activeBorrows = await BorrowRecord.countDocuments({ status: 'borrowed' });
    const totalUsers = await User.countDocuments({ role: 'member' });

    return {
      totalBooks,               // unique titles
      totalCopiesCount,         // sum of all copies
      availableCopiesCount,     // sum of available copies
      borrowedCopiesCount: activeBorrows,
      totalUsers,
    };
  }
}

export default new BookService();

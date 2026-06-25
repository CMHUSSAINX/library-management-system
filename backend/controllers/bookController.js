import bookService from '../services/bookService.js';

// @desc    Get all books (with optional search filter)
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res, next) => {
  try {
    const { search, genre } = req.query;
    const books = await bookService.getBooks({ search, genre });
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// @desc    Get book details by ID
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Private/Admin
export const addBook = async (req, res, next) => {
  try {
    const { title, author, isbn, genre, description, totalCopies } = req.body;

    if (!title || !author || !isbn || !genre || totalCopies === undefined) {
      res.status(400);
      throw new Error('Please fill all required fields: title, author, isbn, genre, totalCopies');
    }

    const book = await bookService.addBook({
      title,
      author,
      isbn,
      genre,
      description,
      totalCopies: Number(totalCopies),
    });

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req, res, next) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req, res, next) => {
  try {
    const result = await bookService.deleteBook(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get library statistics
// @route   GET /api/books/stats/summary
// @access  Public
export const getLibraryStats = async (req, res, next) => {
  try {
    const stats = await bookService.getStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

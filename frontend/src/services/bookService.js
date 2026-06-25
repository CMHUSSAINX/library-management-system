import api from './api';

const getBooks = async (params = {}) => {
  const response = await api.get('/books', { params });
  return response.data;
};

const getBook = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

const addBook = async (bookData) => {
  const response = await api.post('/books', bookData);
  return response.data;
};

const updateBook = async (id, bookData) => {
  const response = await api.put(`/books/${id}`, bookData);
  return response.data;
};

const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

const getStatsSummary = async () => {
  const response = await api.get('/books/stats/summary');
  return response.data;
};

const bookService = {
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
  getStatsSummary,
};

export default bookService;

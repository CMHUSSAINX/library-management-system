import api from './api';

const borrowBook = async (bookId) => {
  const response = await api.post(`/borrow/${bookId}`);
  return response.data;
};

const returnBook = async (bookId) => {
  const response = await api.post(`/borrow/${bookId}/return`);
  return response.data;
};

const getMyActiveBorrows = async () => {
  const response = await api.get('/borrow/my-active');
  return response.data;
};

const getMyBorrowHistory = async () => {
  const response = await api.get('/borrow/my-history');
  return response.data;
};

const getAllActiveBorrows = async () => {
  const response = await api.get('/borrow/active');
  return response.data;
};

const borrowService = {
  borrowBook,
  returnBook,
  getMyActiveBorrows,
  getMyBorrowHistory,
  getAllActiveBorrows,
};

export default borrowService;
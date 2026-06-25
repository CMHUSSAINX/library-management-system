import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import borrowService from '../services/borrowService';
import { Calendar, Clock, ArrowRightLeft, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './MyBooks.module.css';

const MyBooks = () => {
  const { user } = useAuth();
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const activeData = await borrowService.getMyActiveBorrows();
      setActiveBorrows(activeData);

      const historyData = await borrowService.getMyBorrowHistory();
      setBorrowHistory(historyData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch borrowing details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleReturn = async (bookId) => {
    setError('');
    setSuccess('');
    try {
      await borrowService.returnBook(bookId);
      setSuccess('Book returned successfully! Thank you.');
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper to check if a book is overdue
  const isOverdue = (dueDateString) => {
    return new Date(dueDateString) < new Date();
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Borrowing Hub</h1>
        <p className={styles.subtitle}>Track your current readings, check return due dates, and view past library transactions.</p>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'active' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <Clock size={16} />
          <span>Active Borrowings</span>
          {activeBorrows.length > 0 && (
            <span className={styles.badgeCount}>{activeBorrows.length}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'history' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <BookOpen size={16} />
          <span>Complete History</span>
        </button>
      </div>

      {success && <div className={styles.successAlert}>{success}</div>}
      {error && <div className={styles.errorAlert}>{error}</div>}

      {loading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p>Fetching your records...</p>
        </div>
      ) : activeTab === 'active' ? (
        activeBorrows.length === 0 ? (
          <div className={`glass-panel ${styles.emptyState}`}>
            <BookOpen size={48} className={styles.emptyIcon} />
            <h3>No active borrowings</h3>
            <p>You haven't borrowed any books currently. Browse the catalog to borrow books!</p>
          </div>
        ) : (
          <div className={styles.activeGrid}>
            {activeBorrows.map((record) => {
              const book = record.book;
              const overdue = isOverdue(record.dueDate);
              
              return (
                <div key={record._id} className={`glass-panel ${styles.borrowCard} ${overdue ? styles.overdueCard : ''}`}>
                  <div className={styles.cardHeader}>
                    <span className={styles.genre}>{book.genre}</span>
                    {overdue && (
                      <span className={`badge badge-danger ${styles.overdueBadge}`}>
                        <AlertCircle size={12} />
                        Overdue
                      </span>
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.bookTitle}>{book.title}</h3>
                    <p className={styles.bookAuthor}>by {book.author}</p>
                    
                    <div className={styles.datesGrid}>
                      <div className={styles.dateBlock}>
                        <Calendar size={14} className={styles.dateIcon} />
                        <div>
                          <span className={styles.dateLabel}>Borrowed On</span>
                          <span className={styles.dateVal}>{formatDate(record.borrowDate)}</span>
                        </div>
                      </div>
                      <div className={styles.dateBlock}>
                        <Clock size={14} className={styles.dateIcon} />
                        <div>
                          <span className={styles.dateLabel}>Return Due Date</span>
                          <span className={`${styles.dateVal} ${overdue ? styles.overdueText : ''}`}>
                            {formatDate(record.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <button
                      onClick={() => handleReturn(book._id || book)}
                      className="btn btn-secondary"
                      style={{ width: '100%', borderColor: overdue ? 'var(--error)' : 'var(--border-color)' }}
                    >
                      <ArrowRightLeft size={16} />
                      <span>Return This Book</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : borrowHistory.length === 0 ? (
        <div className={`glass-panel ${styles.emptyState}`}>
          <BookOpen size={48} className={styles.emptyIcon} />
          <h3>No borrowing history</h3>
          <p>Your transactions list is empty. Borrowed books will show up here once returned or active.</p>
        </div>
      ) : (
        <div className={`glass-panel ${styles.tableContainer}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Borrowed Date</th>
                <th>Returned Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {borrowHistory.map((record) => (
                <tr key={record._id}>
                  <td className={styles.tableTitle}>{record.book?.title || 'Unknown Title'}</td>
                  <td>{record.book?.author || 'Unknown Author'}</td>
                  <td>{formatDate(record.borrowDate)}</td>
                  <td>{record.status === 'returned' ? formatDate(record.returnDate) : '-'}</td>
                  <td>
                    <span className={`badge ${record.status === 'returned' ? 'badge-success' : 'badge-info'}`}>
                      {record.status === 'returned' ? 'Returned' : 'Borrowed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBooks;

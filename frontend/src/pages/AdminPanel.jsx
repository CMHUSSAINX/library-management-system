import { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import borrowService from '../services/borrowService';
import { Plus, Edit, Trash2, ListPlus, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [activeLogs, setActiveLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'logs'
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [description, setDescription] = useState('');
  const [totalCopies, setTotalCopies] = useState(1);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const booksData = await bookService.getBooks();
      setBooks(booksData);

      const logsData = await borrowService.getAllActiveBorrows();
      setActiveLogs(logsData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch library information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setTitle('');
    setAuthor('');
    setIsbn('');
    setGenre('Fiction');
    setDescription('');
    setTotalCopies(1);
    setError('');
  };

  const handleEditSelect = (book) => {
    setIsEditing(true);
    setEditId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn);
    setGenre(book.genre);
    setDescription(book.description || '');
    setTotalCopies(book.totalCopies);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const bookData = {
      title,
      author,
      isbn,
      genre,
      description,
      totalCopies: Number(totalCopies),
    };

    try {
      if (isEditing) {
        await bookService.updateBook(editId, bookData);
        setSuccess('Book updated successfully!');
      } else {
        await bookService.addBook(bookData);
        setSuccess('New book cataloged successfully!');
      }
      resetForm();
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Ensure data is valid.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    setError('');
    setSuccess('');
    try {
      await bookService.deleteBook(id);
      setSuccess('Book removed from catalog successfully.');
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book. Active borrowings may exist.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDateString) => {
    return new Date(dueDateString) < new Date();
  };

  const genresList = ['Fiction', 'Science', 'History', 'Technology', 'Biography', 'Mystery', 'Poetry', 'Philosophy'];

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Command Center</h1>
        <p className={styles.subtitle}>Manage your book catalog, track reader borrowings, and add new volumes to the library.</p>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'inventory' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <ListPlus size={16} />
          <span>Manage Inventory</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'logs' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <BookOpen size={16} />
          <span>Active Borrow Logs</span>
          {activeLogs.length > 0 && (
            <span className={styles.badgeCount}>{activeLogs.length}</span>
          )}
        </button>
      </div>

      {success && <div className={styles.successAlert}>{success}</div>}
      {error && <div className={styles.errorAlert}>{error}</div>}

      {activeTab === 'inventory' ? (
        <div className={styles.inventoryLayout}>
          {/* Form Segment */}
          <div className={`glass-panel ${styles.formContainer}`}>
            <h3 className={styles.formTitle}>
              {isEditing ? 'Edit Catalog Record' : 'Catalog New Book'}
            </h3>
            
            <form onSubmit={handleFormSubmit} className={styles.form}>
              <div className={styles.formField}>
                <label>Book Title</label>
                <input
                  type="text"
                  placeholder="Enter book title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Author</label>
                  <input
                    type="text"
                    placeholder="Author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label>ISBN Number</label>
                  <input
                    type="text"
                    placeholder="ISBN string"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="form-input"
                  >
                    {genresList.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formField}>
                  <label>Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={totalCopies}
                    onChange={(e) => setTotalCopies(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label>Description / Summary</label>
                <textarea
                  placeholder="Provide a brief synopsis of the book..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                  rows="3"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {isEditing ? 'Update Details' : 'Catalog Book'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Segment */}
          <div className={styles.listContainer}>
            <div className={styles.listHeader}>
              <h3>Catalog Titles</h3>
              <button onClick={fetchData} className={styles.refreshBtn} title="Reload Catalog">
                <RefreshCw size={14} />
              </button>
            </div>

            {loading && books.length === 0 ? (
              <div className={styles.spinnerContainer}>
                <div className={styles.spinner}></div>
              </div>
            ) : books.length === 0 ? (
              <div className={`glass-panel ${styles.emptyState}`}>
                <p>No books in the catalog yet.</p>
              </div>
            ) : (
              <div className={styles.scrollWrapper}>
                {books.map((book) => (
                  <div key={book._id} className={`glass-panel ${styles.bookItem}`}>
                    <div className={styles.bookDetails}>
                      <h4>{book.title}</h4>
                      <p>{book.author} | <span className={styles.genreLabel}>{book.genre}</span></p>
                      <span className={styles.copiesText}>
                        Copies: {book.availableCopies} available of {book.totalCopies} total
                      </span>
                    </div>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEditSelect(book)}
                        className={styles.editBtn}
                        title="Edit Book"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className={styles.deleteBtn}
                        title="Delete Book"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : loading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p>Fetching active borrowings...</p>
        </div>
      ) : activeLogs.length === 0 ? (
        <div className={`glass-panel ${styles.emptyState}`}>
          <BookOpen size={48} className={styles.emptyIcon} />
          <h3>No active borrow records</h3>
          <p>Currently, there are no books borrowed by users in the library.</p>
        </div>
      ) : (
        <div className={`glass-panel ${styles.tableContainer}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Borrower</th>
                <th>Email</th>
                <th>Book Title</th>
                <th>ISBN</th>
                <th>Borrowed On</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeLogs.map((log) => {
                const overdue = isOverdue(log.dueDate);
                return (
                  <tr key={log._id}>
                    <td className={styles.tableName}>{log.user?.name || 'Unknown User'}</td>
                    <td>{log.user?.email || 'N/A'}</td>
                    <td className={styles.tableTitle}>{log.book?.title || 'Unknown Title'}</td>
                    <td>{log.book?.isbn || 'N/A'}</td>
                    <td>{formatDate(log.borrowDate)}</td>
                    <td className={overdue ? styles.overdueText : ''}>{formatDate(log.dueDate)}</td>
                    <td>
                      <span className={`badge ${overdue ? 'badge-danger' : 'badge-info'}`}>
                        {overdue ? 'Overdue' : 'Active'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

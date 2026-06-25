import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import bookService from '../services/bookService';
import borrowService from '../services/borrowService';
import StatCard from '../components/StatCard';
import BookCard from '../components/BookCard';
import { Search, Filter, BookOpen, Layers, CheckCircle, ArrowRight } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [myActiveBorrows, setMyActiveBorrows] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCopiesCount: 0,
    availableCopiesCount: 0,
    borrowedCopiesCount: 0,
    totalUsers: 0,
  });

  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get books
      const booksData = await bookService.getBooks({ search, genre });
      setBooks(booksData);

      // Get stats
      const statsData = await bookService.getStatsSummary();
      setStats(statsData);

      // Get active borrows if user is logged in
      if (user && !isAdmin) {
        const activeRecords = await borrowService.getMyActiveBorrows();
        setMyActiveBorrows(activeRecords.map(record => record.book._id || record.book));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch library information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, genre, user]);

  const handleBorrow = async (bookId) => {
    setError('');
    setActionSuccess('');
    try {
      await borrowService.borrowBook(bookId);
      setActionSuccess('Book borrowed successfully! Enjoy reading.');
      fetchData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to borrow book.');
    }
  };

  const handleReturn = async (bookId) => {
    setError('');
    setActionSuccess('');
    try {
      await borrowService.returnBook(bookId);
      setActionSuccess('Book returned successfully! Thank you.');
      fetchData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book.');
    }
  };

  // Get list of unique genres in catalog for filtering
  const genresList = ['Fiction', 'Science', 'History', 'Technology', 'Biography', 'Mystery', 'Poetry', 'Philosophy'];

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Hero Welcome banner */}
      <header className={styles.hero}>
        <h1 className={styles.title}>
          Discover Your Next <span className={styles.glowText}>Great Story</span>
        </h1>
        <p className={styles.subtitle}>
          Search through thousands of cataloged books, manage borrowings, and track due dates in real-time.
        </p>
      </header>

      {/* Stats Summary Grid */}
      <section className={styles.statsGrid}>
        <StatCard
          title="Cataloged Titles"
          value={stats.totalBooks}
          icon={<Layers size={24} />}
          color="var(--primary)"
        />
        <StatCard
          title="Available Copies"
          value={stats.availableCopiesCount}
          icon={<CheckCircle size={24} />}
          color="var(--success)"
        />
        <StatCard
          title="Checked Out"
          value={stats.borrowedCopiesCount}
          icon={<BookOpen size={24} />}
          color="var(--secondary)"
        />
      </section>

      {/* Action alerts */}
      {actionSuccess && <div className={styles.successAlert}>{actionSuccess}</div>}
      {error && <div className={styles.errorAlert}>{error}</div>}

      {/* Search and filter controls */}
      <div className={`glass-panel ${styles.searchPanel}`}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>

        <div className={styles.filterBox}>
          <Filter className={styles.filterIcon} size={18} />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '40px' }}
          >
            <option value="">All Genres</option>
            {genresList.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog items */}
      <main className={styles.catalogSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Library Catalog</h2>
          <span className={styles.countBadge}>{books.length} Books Found</span>
        </div>

        {loading && books.length === 0 ? (
          <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p>Loading library catalog...</p>
          </div>
        ) : books.length === 0 ? (
          <div className={`glass-panel ${styles.emptyState}`}>
            <BookOpen size={48} className={styles.emptyIcon} />
            <h3>No books found</h3>
            <p>We couldn't find any books matching your search query. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className={styles.bookGrid}>
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                user={user}
                isAdmin={isAdmin}
                onBorrow={handleBorrow}
                onReturn={handleReturn}
                isBorrowedByMe={myActiveBorrows.includes(book._id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

import { BookOpen, Bookmark, Calendar, ArrowRightLeft, Trash2, Edit } from 'lucide-react';
import styles from './BookCard.module.css';

const BookCard = ({
  book,
  user,
  isAdmin,
  onBorrow,
  onReturn,
  onEdit,
  onDelete,
  isBorrowedByMe,
}) => {
  const isAvailable = book.availableCopies > 0;

  return (
    <div className={`glass-panel ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.genreBadge}>
          <Bookmark size={12} />
          <span>{book.genre}</span>
        </div>
        <div className={styles.availability}>
          <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
            {isAvailable ? 'Available' : 'Out of Stock'}
          </span>
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>by {book.author}</p>
        <p className={styles.description}>
          {book.description || 'No description provided for this catalog item.'}
        </p>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <strong>ISBN:</strong> {book.isbn}
          </span>
          <span className={styles.metaItem}>
            <strong>Copies:</strong> {book.availableCopies} / {book.totalCopies}
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        {isAdmin ? (
          <div className={styles.adminActions}>
            <button
              onClick={() => onEdit(book)}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '8px 16px' }}
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(book._id)}
              className="btn btn-danger"
              style={{ padding: '8px 16px' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : user ? (
          isBorrowedByMe ? (
            <button
              onClick={() => onReturn(book._id)}
              className="btn btn-secondary"
              style={{ width: '100%', borderColor: 'var(--success)', color: '#34d399' }}
            >
              <ArrowRightLeft size={16} />
              <span>Return Book</span>
            </button>
          ) : (
            <button
              onClick={() => onBorrow(book._id)}
              disabled={!isAvailable}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <BookOpen size={16} />
              <span>{isAvailable ? 'Borrow Book' : 'Out of Stock'}</span>
            </button>
          )
        ) : (
          <span className={styles.guestNote}>Sign in to borrow books</span>
        )}
      </div>
    </div>
  );
};

export default BookCard;

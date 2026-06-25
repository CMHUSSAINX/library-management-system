import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, LayoutDashboard, UserCheck, Shield, LogIn } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logoutUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <BookOpen className={styles.logoIcon} size={28} />
          <span className={styles.logoText}>Lumina<span className={styles.highlight}>Library</span></span>
        </Link>

        <div className={styles.navLinks}>
          <Link to="/" className={styles.link}>
            <LayoutDashboard size={18} />
            <span>Catalog</span>
          </Link>

          {user && !isAdmin && (
            <Link to="/my-books" className={styles.link}>
              <UserCheck size={18} />
              <span>My Borrowings</span>
            </Link>
          )}

          {user && isAdmin && (
            <Link to="/admin" className={styles.link}>
              <Shield size={18} />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>

        <div className={styles.authSection}>
          {user ? (
            <div className={styles.userControls}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userRole}>{user.role}</span>
              </div>
              <button onClick={handleLogout} className={styles.logoutBtn} title="Sign Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className={styles.loginBtn}>
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

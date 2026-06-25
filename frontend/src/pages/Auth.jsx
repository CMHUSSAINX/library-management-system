import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ShieldAlert, LogIn, UserPlus } from 'lucide-react';
import styles from './Auth.module.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // default role
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { loginUser, registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      const res = await loginUser(email, password);
      if (res.success) {
        setSuccess('Logged in successfully! Redirecting...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError(res.message);
      }
    } else {
      const res = await registerUser(name, email, password, role);
      if (res.success) {
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className={`${styles.wrapper} animate-fade-in`}>
      <div className={`glass-panel ${styles.container}`}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isLogin ? styles.activeTab : ''}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
          <button
            className={`${styles.tab} ${!isLogin ? styles.activeTab : ''}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            <UserPlus size={16} />
            <span>Sign Up</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.heading}>
            {isLogin ? 'Welcome Back' : 'Create Library Account'}
          </h2>
          <p className={styles.subtext}>
            {isLogin ? 'Log in to borrow books and view history' : 'Sign up as a reader or an administrator'}
          </p>

          {error && <div className={styles.errorAlert}>{error}</div>}
          {success && <div className={styles.successAlert}>{success}</div>}

          {!isLogin && (
            <div className={styles.inputGroup}>
              <User className={styles.inputIcon} size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <Mail className={styles.inputIcon} size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {!isLogin && (
            <div className={styles.roleSelection}>
              <span className={styles.roleLabel}>Account Role:</span>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="role"
                    value="member"
                    checked={role === 'member'}
                    onChange={() => setRole('member')}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioDesign}></span>
                  <span className={styles.radioText}>Member</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={() => setRole('admin')}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioDesign}></span>
                  <span className={styles.radioText}>Admin</span>
                </label>
              </div>
            </div>
          )}

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;

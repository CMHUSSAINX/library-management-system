import styles from './StatCard.module.css';

const StatCard = ({ title, value, icon, color = 'var(--primary)' }) => {
  return (
    <div className={`glass-panel ${styles.card}`}>
      <div className={styles.iconContainer} style={{ '--icon-color': color }}>
        {icon}
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        <h2 className={styles.value}>{value}</h2>
      </div>
    </div>
  );
};

export default StatCard;

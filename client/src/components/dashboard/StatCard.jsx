import { motion } from 'framer-motion';

const StatCard = ({ title, value, helper, icon }) => (
  <motion.article whileHover={{ y: -4 }} className="stat-card glass-card">
    <div className="stat-icon">{icon}</div>
    <div>
      <p>{title}</p>
      <h3>{value}</h3>
      <small>{helper}</small>
    </div>
  </motion.article>
);

export default StatCard;

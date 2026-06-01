import { motion } from 'framer-motion';

const EmptyState = ({ title, description, action }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state glass-card">
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </motion.div>
);

export default EmptyState;

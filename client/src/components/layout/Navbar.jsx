import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import { navLinks } from '../../utils/constants';

const Navbar = () => (
  <motion.nav initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="navbar glass-card">
    <Link to="/" className="brand-mark">
      <span className="brand-dot" />
      Velora Library OS
    </Link>
    <div className="nav-links">
      {navLinks.map((item) => (
        <a key={item.label} href={item.href}>
          {item.label}
        </a>
      ))}
    </div>
    <div className="nav-actions">
      <ThemeToggle />
      <Link className="ghost-button" to="/login/member">Login</Link>
      <Link className="primary-button" to="/select-role">Get Started</Link>
    </div>
  </motion.nav>
);

export default Navbar;

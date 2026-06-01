import { Navigate, Route, Routes } from 'react-router-dom';
import { FiBarChart2, FiBell, FiBook, FiBookmark, FiClock, FiDollarSign, FiGrid, FiHome, FiSettings, FiUsers } from 'react-icons/fi';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import AuthPage from './pages/auth/AuthPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import BooksPage from './pages/admin/BooksPage';
import MembersPage from './pages/admin/MembersPage';
import BorrowingPage from './pages/admin/BorrowingPage';
import ReservationsPage from './pages/admin/ReservationsPage';
import FinesPage from './pages/admin/FinesPage';
import ReportsPage from './pages/admin/ReportsPage';
import InventoryPage from './pages/admin/InventoryPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import SettingsPage from './pages/admin/SettingsPage';
import MemberDashboard from './pages/member/MemberDashboard';
import BrowseBooksPage from './pages/member/BrowseBooksPage';
import MyBorrowedPage from './pages/member/MyBorrowedPage';
import MyReservationsPage from './pages/member/MyReservationsPage';
import MyFinesPage from './pages/member/MyFinesPage';
import ProfilePage from './pages/member/ProfilePage';

const adminMenu = [
  { label: 'Dashboard', path: '/admin', exact: true, icon: <FiHome /> },
  { label: 'Books', path: '/admin/books', icon: <FiBook /> },
  { label: 'Members', path: '/admin/members', icon: <FiUsers /> },
  { label: 'Borrowing', path: '/admin/borrowing', icon: <FiClock /> },
  { label: 'Reservations', path: '/admin/reservations', icon: <FiBookmark /> },
  { label: 'Fines', path: '/admin/fines', icon: <FiDollarSign /> },
  { label: 'Reports', path: '/admin/reports', icon: <FiBarChart2 /> },
  { label: 'Inventory', path: '/admin/inventory', icon: <FiGrid /> },
  { label: 'Notifications', path: '/admin/notifications', icon: <FiBell /> },
  { label: 'Settings', path: '/admin/settings', icon: <FiSettings /> }
];

const memberMenu = [
  { label: 'Dashboard', path: '/member', exact: true, icon: <FiHome /> },
  { label: 'Browse Books', path: '/member/books', icon: <FiBook /> },
  { label: 'My Borrowed Books', path: '/member/borrowed', icon: <FiClock /> },
  { label: 'My Reservations', path: '/member/reservations', icon: <FiBookmark /> },
  { label: 'My Fines', path: '/member/fines', icon: <FiDollarSign /> },
  { label: 'Profile', path: '/member/profile', icon: <FiUsers /> },
  { label: 'Settings', path: '/member/settings', icon: <FiSettings /> }
];

const App = () => (
  <ErrorBoundary>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/select-role" element={<RoleSelectionPage />} />
      <Route path="/login/:role" element={<AuthPage mode="login" />} />
      <Route path="/register/:role" element={<AuthPage mode="register" />} />

      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin" element={<AppShell menu={adminMenu} title="Admin Dashboard" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="borrowing" element={<BorrowingPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="fines" element={<FinesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['member']} />}>
        <Route path="/member" element={<AppShell menu={memberMenu} title="Member Dashboard" />}>
          <Route index element={<MemberDashboard />} />
          <Route path="books" element={<BrowseBooksPage />} />
          <Route path="borrowed" element={<MyBorrowedPage />} />
          <Route path="reservations" element={<MyReservationsPage />} />
          <Route path="fines" element={<MyFinesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </ErrorBoundary>
);

export default App;

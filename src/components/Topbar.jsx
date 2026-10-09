import { LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import Brand from './Brand';
import { clearSession, getCurrentUser } from '../auth';

export default function Topbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function logout() {
    clearSession();
    navigate('/login', { replace: true });
  }

  const initials = user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SS';
  const links = user?.role === 'student'
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/apply', label: 'Apply' },
        { to: '/applications', label: 'Track' }
      ]
    : [{ to: '/officer', label: 'Review queue' }];

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <Brand compact />
        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="topbar-actions">
        <div className="user-chip">
          <span className="avatar">{initials}</span>
          <div>
            <strong>{user?.name || 'ScholarSecure User'}</strong>
            <span>{user?.roleLabel || 'Signed in'}</span>
          </div>
        </div>
        <button className="icon-button" onClick={logout} aria-label="Log out" title="Log out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

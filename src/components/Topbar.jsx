import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Brand from './Brand';

export default function Topbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('scholarsecure_session');
    navigate('/login');
  }

  return (
    <header className="dashboard-topbar">
      <Brand compact />
      <div className="topbar-actions">
        <div className="user-chip">
          <span className="avatar">MU</span>
          <div>
            <strong>Muhammad Uzair</strong>
            <span>Student</span>
          </div>
        </div>
        <button className="icon-button" onClick={logout} aria-label="Log out" title="Log out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

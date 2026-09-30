import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters for this prototype.');
      return;
    }

    localStorage.setItem('scholarsecure_session', 'student-demo');
    navigate('/dashboard');
  }

  return (
    <div className="login-layout">
      <aside className="login-aside">
        <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to home</Link>
        <div className="login-aside-content">
          <Brand />
          <span className="eyebrow light">Student access</span>
          <h1>Your scholarship progress stays in one place.</h1>
          <p>Sign in to review opportunities, manage applications and follow verification progress.</p>
          <div className="privacy-note">
            <ShieldCheck size={20} />
            <div>
              <strong>Security-aware prototype</strong>
              <span>No administrative controls are exposed to student accounts.</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="login-main">
        <div className="login-card">
          <div className="login-heading">
            <span className="eyebrow">Welcome back</span>
            <h2>Student sign in</h2>
            <p>Use any valid email and a password of at least 8 characters.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Email address</label>
            <div className="input-wrap">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <LockKeyhole size={18} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <div className="form-error" role="alert">{error}</div>}

            <button type="submit" className="button button-primary full-width">Sign in</button>
          </form>

          <div className="login-footnote">
            Prototype login only. Authentication enforcement will move to the backend in a later development phase.
          </div>
        </div>
      </main>
    </div>
  );
}

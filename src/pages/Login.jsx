import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand';
import { loginAPI } from '../api';

const DEMO_USERS = [
  { roleLabel: 'Student', email: 'student@scholarsecure.demo', accessCode: 'Student123!' },
  { roleLabel: 'Scholarship Officer', email: 'officer@scholarsecure.demo', accessCode: 'Officer123!' },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('student@scholarsecure.demo');
  const [password, setPassword] = useState('Student123!');
  const [passwordStrength, setPasswordStrength] = useState(() => window.checkPasswordStrength?.('Student123!') || null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginAPI(email, password);
      navigate(user.role === 'officer' ? '/officer' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  function useDemo(user) {
    setEmail(user.email);
    setPassword(user.accessCode);
    setPasswordStrength(window.checkPasswordStrength?.(user.accessCode) || null);
    setError('');
  }

  function handlePasswordChange(event) {
    const value = event.target.value;
    setPassword(value);
    setPasswordStrength(window.checkPasswordStrength?.(value) || null);
  }

  return (
    <div className="login-layout">
      <aside className="login-aside">
        <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to home</Link>
        <div className="login-aside-content">
          <Brand />
          <span className="eyebrow light">Role-based access</span>
          <h1>One portal, different responsibilities.</h1>
          <p>Students manage their own scholarship activity while officers review assigned applications and decisions.</p>
          <div className="privacy-note">
            <ShieldCheck size={20} />
            <div>
              <strong>Secure backend authentication</strong>
              <span>Passwords are hashed with bcrypt. Sessions use signed JWTs verified on every request.</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="login-main">
        <div className="login-card">
          <div className="login-heading">
            <span className="eyebrow">Secure access</span>
            <h2>Sign in to ScholarSecure</h2>
            <p>Your credentials are verified against the backend. Passwords are never stored in plaintext.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Email address</label>
            <div className="input-wrap">
              <Mail size={18} />
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>

            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <LockKeyhole size={18} />
              <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} autoComplete="current-password" />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordStrength && (
              <div className={`password-strength strength-${passwordStrength.level.toLowerCase()}`} aria-live="polite">
                <strong>Password strength: {passwordStrength.level}</strong>
                <span>{passwordStrength.message}</span>
              </div>
            )}

            {error && <div className="form-error" role="alert">{error}</div>}
            <button type="submit" className="button button-primary full-width" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="demo-accounts">
            <strong>Demo accounts</strong>
            {DEMO_USERS.map((user) => (
              <button type="button" key={user.email} className="demo-account" onClick={() => useDemo(user)}>
                <span>{user.roleLabel}</span>
                <small>{user.email}</small>
                <small>{user.accessCode}</small>
              </button>
            ))}
          </div>

          <div className="login-footnote">
            Backend-authenticated with bcrypt password hashing and JWT token generation.
          </div>
        </div>
      </main>
    </div>
  );
}

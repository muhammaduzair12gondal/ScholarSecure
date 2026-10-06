import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand';
import { authenticate, DEMO_USERS } from '../auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('student@scholarsecure.demo');
  const [password, setPassword] = useState('Student123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const user = authenticate(email, password);
    if (!user) {
      setError('Invalid demo credentials. Use one of the accounts shown below.');
      return;
    }

    navigate(user.role === 'officer' ? '/officer' : '/dashboard', { replace: true });
  }

  function useDemo(user) {
    setEmail(user.email);
    setPassword(user.accessCode);
    setError('');
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
              <strong>Activity 2 security demo</strong>
              <span>The signed-in role controls the dashboard, actions and private data shown.</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="login-main">
        <div className="login-card">
          <div className="login-heading">
            <span className="eyebrow">Demo access</span>
            <h2>Sign in to ScholarSecure</h2>
            <p>Use either demo account. The role is identified from the account, not selected manually.</p>
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
              <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <div className="form-error" role="alert">{error}</div>}
            <button type="submit" className="button button-primary full-width">Sign in</button>
          </form>

          <div className="demo-accounts">
            <strong>Demo accounts</strong>
            {DEMO_USERS.map((user) => (
              <button type="button" key={user.id} className="demo-account" onClick={() => useDemo(user)}>
                <span>{user.roleLabel}</span>
                <small>{user.email}</small>
                <small>{user.accessCode}</small>
              </button>
            ))}
          </div>

          <div className="login-footnote">
            Frontend prototype only. Production authorization must be enforced by a backend.
          </div>
        </div>
      </main>
    </div>
  );
}

import { ArrowRight, CheckCircle2, FileCheck2, LockKeyhole, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Brand from '../components/Brand';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="app-shell warm-bg">
      <header className="site-header container">
        <Brand />
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#security">Security</a>
          <Link to="/login" className="nav-login">Student login</Link>
        </nav>
      </header>

      <main>
        <section className="hero container">
          <div className="hero-copy">
            <span className="eyebrow">Student scholarship portal</span>
            <h1>Apply once. Track clearly. Share documents safely.</h1>
            <p>
              ScholarSecure gives students one place to discover scholarships, submit required information,
              follow application progress and keep sensitive documents under controlled access.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="button button-primary">
                Enter student portal <ArrowRight size={17} />
              </Link>
              <a href="#how-it-works" className="button button-ghost">See how it works</a>
            </div>
            <div className="trust-row">
              <span><ShieldCheck size={16} /> Role-aware access</span>
              <span><LockKeyhole size={16} /> Security-first design</span>
              <span><FileCheck2 size={16} /> Document verification workflow</span>
            </div>
          </div>

          <div className="hero-panel" aria-label="Scholarship application summary preview">
            <div className="panel-kicker">Application overview</div>
            <div className="hero-stat">
              <span>Current application</span>
              <strong>HEC Need-Based Scholarship</strong>
              <div className="progress-track"><span style={{ width: '68%' }} /></div>
              <small>Document review in progress</small>
            </div>
            <div className="mini-grid">
              <div><span>Documents</span><strong>4 / 5</strong></div>
              <div><span>Status</span><strong>Review</strong></div>
            </div>
            <div className="timeline-card">
              <div className="timeline-dot done" />
              <div><strong>Application submitted</strong><span>Completed</span></div>
              <div className="timeline-dot done" />
              <div><strong>Identity review</strong><span>Completed</span></div>
              <div className="timeline-dot active" />
              <div><strong>Document verification</strong><span>In progress</span></div>
            </div>
          </div>
        </section>

        <section className="feature-strip container" id="how-it-works">
          <article>
            <span className="feature-number">01</span>
            <Search size={22} />
            <h3>Find relevant opportunities</h3>
            <p>Search and filter scholarships by category, level and deadline without exposing private information.</p>
          </article>
          <article>
            <span className="feature-number">02</span>
            <FileCheck2 size={22} />
            <h3>Submit required evidence</h3>
            <p>Provide only the information and documents required for each application.</p>
          </article>
          <article>
            <span className="feature-number">03</span>
            <CheckCircle2 size={22} />
            <h3>Track every stage</h3>
            <p>Follow submission, review and verification status from one student-focused dashboard.</p>
          </article>
        </section>

        <section className="security-section container" id="security">
          <div>
            <span className="eyebrow">Designed with security in mind</span>
            <h2>Useful by default, private by design.</h2>
          </div>
          <div className="security-points">
            <p><strong>Least data collection.</strong> Student screens ask only for information needed for the scholarship workflow.</p>
            <p><strong>Clear role boundaries.</strong> Administrative controls are not exposed inside the student interface.</p>
            <p><strong>Secure development path.</strong> Backend authorization, hashing, logging and upload validation will be enforced as the project evolves.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

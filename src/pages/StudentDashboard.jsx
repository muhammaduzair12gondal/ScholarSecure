import { FileText, LockKeyhole, Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import Topbar from '../components/Topbar';
import { getApplications, getCurrentUser, maskCnic, maskPhone, updateApplicationStatus } from '../auth';

const scholarships = [
  { title: 'HEC Need-Based Scholarship', category: 'Need-based', deadline: '18 Oct 2026' },
  { title: 'Punjab Educational Endowment Fund', category: 'Merit + Need', deadline: '02 Nov 2026' },
  { title: 'University Merit Support Grant', category: 'Merit', deadline: '15 Nov 2026' }
];

export default function StudentDashboard() {
  const user = getCurrentUser();
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const application = getApplications().find((item) => item.studentName === user?.name) || getApplications()[0];

  const filtered = scholarships.filter((item) =>
    `${item.title} ${item.category}`.toLowerCase().includes(query.toLowerCase())
  );

  function testRestrictedAction() {
    const result = updateApplicationStatus(application.id, 'Approved');
    setMessage(result.message);
  }

  return (
    <div className="dashboard-shell">
      <Topbar />
      <main className="dashboard-main container-wide">
        <section className="dashboard-intro">
          <div>
            <span className="eyebrow">Student dashboard</span>
            <h1>Welcome, {user?.name}</h1>
            <p>Search scholarships, track your own application and view limited personal information.</p>
          </div>
          <div className="secure-status"><ShieldCheck size={18} /> Student role active</div>
        </section>

        <section className="metric-grid">
          <article><span>My applications</span><strong>1</strong><small>Only your records are shown</small></article>
          <article><span>Verification</span><strong>{application.documentStatus}</strong><small>Document contents stay private</small></article>
          <article><span>Status</span><strong>{application.status}</strong><small>Officer decision pending</small></article>
        </section>

        <section className="dashboard-grid">
          <div className="main-column">
            <div className="section-heading"><span className="eyebrow">Function 1</span><h2>Search scholarships</h2></div>
            <div className="filters-card">
              <div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search scholarships" /></div>
            </div>
            <div className="scholarship-list">
              {filtered.map((item) => (
                <article className="scholarship-card" key={item.title}>
                  <div className="scholarship-icon"><FileText size={20} /></div>
                  <div className="scholarship-content"><h3>{item.title}</h3><p>{item.category} · Deadline {item.deadline}</p></div>
                </article>
              ))}
            </div>
          </div>

          <aside className="side-column">
            <div className="tracker-card">
              <div className="section-heading"><span className="eyebrow">Functions 2 & 3</span><h2>My application</h2></div>
              <div className="application-name">{application.scholarship}</div>
              <div className="doc-row"><span>Status</span><strong>{application.status}</strong></div>
              <div className="doc-row"><span>Documents</span><strong>{application.documentStatus}</strong></div>
              <div className="doc-row"><span>Phone</span><strong>{maskPhone(application.phone)}</strong></div>
              <div className="doc-row"><span>CNIC</span><strong>{maskCnic(application.cnic)}</strong></div>
              <p className="privacy-caption">Sensitive values are masked for the student dashboard. Internal officer notes are not exposed.</p>
            </div>

            <div className="document-card">
              <span className="eyebrow">Restricted function test</span>
              <h3>Officer-only approval</h3>
              <p className="privacy-caption">This intentionally attempts the same protected decision function used by officers.</p>
              <button className="button button-primary full-width" onClick={testRestrictedAction}><LockKeyhole size={16} /> Try approve application</button>
              {message && <div className="form-error" role="alert">{message}</div>}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

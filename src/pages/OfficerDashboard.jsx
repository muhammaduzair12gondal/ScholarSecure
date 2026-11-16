import { CheckCircle2, FileCheck2, Search, ShieldCheck, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Topbar from '../components/Topbar';
import { fetchApplications, getStoredUser, updateApplicationStatusAPI } from '../api';

export default function OfficerDashboard() {
  const user = getStoredUser();
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchApplications();
        setApplications(data);
      } catch (err) {
        setMessage(err.message || 'Failed to load applications.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => applications.filter((item) =>
    `${item.appId} ${item.studentName} ${item.scholarship} ${item.status}`.toLowerCase().includes(query.toLowerCase())
  ), [applications, query]);

  async function decide(appId, status) {
    try {
      const result = await updateApplicationStatusAPI(appId, status);
      setMessage(result.message);
      // Update local state to reflect the change immediately
      setApplications((prev) =>
        prev.map((item) => item.appId === appId ? { ...item, status } : item)
      );
    } catch (err) {
      setMessage(err.message || 'Failed to update status.');
    }
  }

  return (
    <div className="dashboard-shell">
      <Topbar />
      <main className="dashboard-main container-wide">
        <section className="dashboard-intro">
          <div>
            <span className="eyebrow">Scholarship officer dashboard</span>
            <h1>Welcome, {user?.name}</h1>
            <p>Review assigned applications, verify evidence and record decisions.</p>
          </div>
          <div className="secure-status"><ShieldCheck size={18} /> Officer role active</div>
        </section>

        <section className="metric-grid">
          <article><span>Assigned applications</span><strong>{applications.length}</strong><small>From database</small></article>
          <article><span>Awaiting decision</span><strong>{applications.filter((a) => !['Approved', 'Rejected'].includes(a.status)).length}</strong><small>Needs review</small></article>
          <article><span>Completed decisions</span><strong>{applications.filter((a) => ['Approved', 'Rejected'].includes(a.status)).length}</strong><small>Saved in database</small></article>
        </section>

        <section>
          <div className="section-heading row-heading">
            <div><span className="eyebrow">Officer functions</span><h2>Assigned applications</h2></div>
          </div>
          <div className="filters-card">
            <div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search student, scholarship or status" /></div>
          </div>

          {loading && <div className="notice-box">Loading applications from server…</div>}
          {message && <div className="notice-box">{message}</div>}

          <div className="scholarship-list">
            {filtered.map((item) => (
              <article className="scholarship-card" key={item.appId}>
                <div className="scholarship-icon"><FileCheck2 size={21} /></div>
                <div className="scholarship-content">
                  <div className="scholarship-title-row">
                    <div><h3>{item.studentName}</h3><span>{item.appId} · {item.scholarship}</span></div>
                    <span className="status-pill">{item.status}</span>
                  </div>
                  <p>{item.documentStatus} · Created {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  <div className="meta-row">
                    <span>Phone: {item.phone}</span>
                    <span>CNIC: {item.cnic}</span>
                  </div>
                  <div className="notice-box"><strong>Internal note:</strong> {item.internalNote}</div>
                  <div className="modal-details">
                    <button className="button button-primary" onClick={() => decide(item.appId, 'Approved')}><CheckCircle2 size={16} /> Approve</button>
                    <button className="button" onClick={() => decide(item.appId, 'Rejected')}><XCircle size={16} /> Reject</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

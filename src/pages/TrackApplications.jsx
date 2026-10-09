import { ChevronDown, ChevronUp, FileSearch, Search, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import Topbar from '../components/Topbar';
import { getApplications, getCurrentUser, maskCnic, maskPhone } from '../auth';

export default function TrackApplications() {
  const user = getCurrentUser();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState('');

  const ownApplications = useMemo(
    () => getApplications().filter((item) => item.studentName === user?.name),
    [user?.name]
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return ownApplications.filter((item) => {
      const matchesQuery = !normalized || `${item.id} ${item.scholarship} ${item.status}`.toLowerCase().includes(normalized);
      const matchesStatus = status === 'All' || item.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [ownApplications, query, status]);

  function handleQuery(event) {
    const value = event.target.value;
    if (value.length > 60) {
      setError('Search text is limited to 60 characters.');
      return;
    }
    setError('');
    setQuery(value);
  }

  const statuses = ['All', ...new Set(ownApplications.map((item) => item.status))];

  return (
    <div className="dashboard-shell">
      <Topbar />
      <main className="dashboard-main container-wide module-page">
        <section className="dashboard-intro">
          <div>
            <span className="eyebrow">Activity 3 · Member 2 module</span>
            <h1>Search and track applications</h1>
            <p>Find your applications by reference, scholarship or status and open a record for more details.</p>
          </div>
          <div className="secure-status"><ShieldCheck size={18} /> Your records only</div>
        </section>

        <section className="module-card tracking-panel">
          <div className="tracking-toolbar">
            <div className="module-search"><Search size={18} /><input value={query} onChange={handleQuery} placeholder="Search reference, scholarship or status" /></div>
            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          {error && <div className="module-feedback error" role="alert">{error}</div>}

          <div className="result-count"><strong>{filtered.length}</strong> matching application{filtered.length === 1 ? '' : 's'}</div>
          <div className="tracking-list">
            {filtered.map((item) => {
              const expanded = expandedId === item.id;
              return (
                <article className="tracking-item" key={item.id}>
                  <div className="tracking-item-main">
                    <div className="module-icon"><FileSearch size={20} /></div>
                    <div className="tracking-copy">
                      <div className="tracking-title-row"><div><span>{item.id}</span><h3>{item.scholarship}</h3></div><span className="status-pill">{item.status}</span></div>
                      <p>Submitted {item.submitted} · {item.documentStatus}</p>
                    </div>
                    <button className="details-button" onClick={() => setExpandedId(expanded ? null : item.id)} aria-expanded={expanded}>
                      {expanded ? 'Hide details' : 'View details'} {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  {expanded && (
                    <div className="tracking-details">
                      <div><span>Study level</span><strong>{item.studyLevel || 'Not recorded'}</strong></div>
                      <div><span>CGPA</span><strong>{item.cgpa || 'Not recorded'}</strong></div>
                      <div><span>Phone</span><strong>{maskPhone(item.phone)}</strong></div>
                      <div><span>CNIC</span><strong>{maskCnic(item.cnic)}</strong></div>
                      <div className="detail-wide"><span>Student statement</span><strong>{item.statement || 'No statement recorded.'}</strong></div>
                    </div>
                  )}
                </article>
              );
            })}
            {filtered.length === 0 && <div className="empty-state"><FileSearch size={24} /><strong>No application found</strong><span>Try another reference, scholarship name or status filter.</span></div>}
          </div>
        </section>
      </main>
    </div>
  );
}

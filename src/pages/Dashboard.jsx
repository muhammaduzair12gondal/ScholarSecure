import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  FileText,
  GraduationCap,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import Topbar from '../components/Topbar';

const scholarships = [
  {
    id: 1,
    title: 'HEC Need-Based Scholarship',
    provider: 'Higher Education Commission',
    category: 'Need-based',
    level: 'Undergraduate',
    deadline: '18 Oct 2026',
    amount: 'Tuition support',
    description: 'Financial assistance for undergraduate students demonstrating academic progress and financial need.'
  },
  {
    id: 2,
    title: 'Punjab Educational Endowment Fund',
    provider: 'PEEF',
    category: 'Merit + Need',
    level: 'Undergraduate',
    deadline: '02 Nov 2026',
    amount: 'Annual award',
    description: 'Support for eligible students meeting merit and household-income requirements.'
  },
  {
    id: 3,
    title: 'University Merit Support Grant',
    provider: 'University Financial Aid Office',
    category: 'Merit',
    level: 'Undergraduate',
    deadline: '15 Nov 2026',
    amount: 'Partial tuition',
    description: 'Institutional support for students with strong semester performance and complete academic records.'
  },
  {
    id: 4,
    title: 'Digital Skills Access Scholarship',
    provider: 'National Skills Initiative',
    category: 'Skills',
    level: 'Undergraduate',
    deadline: '27 Nov 2026',
    amount: 'Course support',
    description: 'Training support for students pursuing software, data and cybersecurity learning tracks.'
  }
];

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [applied, setApplied] = useState([1]);
  const [toast, setToast] = useState('');

  const categories = ['All', 'Need-based', 'Merit + Need', 'Merit', 'Skills'];
  const filtered = useMemo(() => {
    return scholarships.filter((item) => {
      const matchesQuery = `${item.title} ${item.provider} ${item.category}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  function submitApplication(item) {
    if (!applied.includes(item.id)) {
      setApplied((current) => [...current, item.id]);
      setToast(`Application started for ${item.title}.`);
      setTimeout(() => setToast(''), 3000);
    }
    setSelected(null);
  }

  return (
    <div className="dashboard-shell">
      <Topbar />

      <main className="dashboard-main container-wide">
        <section className="dashboard-intro">
          <div>
            <span className="eyebrow">Student dashboard</span>
            <h1>Scholarships and applications</h1>
            <p>Find suitable opportunities, start an application and track verification progress.</p>
          </div>
          <div className="secure-status"><ShieldCheck size={18} /> Student role active</div>
        </section>

        <section className="metric-grid">
          <article><span>Active applications</span><strong>{applied.length}</strong><small>1 currently under review</small></article>
          <article><span>Documents verified</span><strong>4 / 5</strong><small>Income evidence pending</small></article>
          <article><span>Upcoming deadlines</span><strong>3</strong><small>Within the next 45 days</small></article>
        </section>

        <section className="dashboard-grid">
          <div className="main-column">
            <div className="section-heading row-heading">
              <div><span className="eyebrow">Explore</span><h2>Available scholarships</h2></div>
              <span className="result-count">{filtered.length} opportunities</span>
            </div>

            <div className="filters-card">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Search by scholarship, provider or category"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="filter-select-wrap">
                <SlidersHorizontal size={17} />
                <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
            </div>

            <div className="scholarship-list">
              {filtered.map((item) => {
                const isApplied = applied.includes(item.id);
                return (
                  <article className="scholarship-card" key={item.id}>
                    <div className="scholarship-icon"><GraduationCap size={22} /></div>
                    <div className="scholarship-content">
                      <div className="scholarship-title-row">
                        <div>
                          <h3>{item.title}</h3>
                          <span>{item.provider}</span>
                        </div>
                        {isApplied && <span className="status-pill"><Check size={14} /> Applied</span>}
                      </div>
                      <p>{item.description}</p>
                      <div className="meta-row">
                        <span><BookOpen size={15} /> {item.category}</span>
                        <span><CalendarDays size={15} /> {item.deadline}</span>
                        <span><FileText size={15} /> {item.amount}</span>
                      </div>
                    </div>
                    <button className="card-action" onClick={() => setSelected(item)} aria-label={`View ${item.title}`}>
                      <ChevronRight size={19} />
                    </button>
                  </article>
                );
              })}
              {filtered.length === 0 && (
                <div className="empty-state">No scholarships match your current search and filter.</div>
              )}
            </div>
          </div>

          <aside className="side-column">
            <div className="tracker-card">
              <div className="section-heading">
                <span className="eyebrow">Current application</span>
                <h2>Verification tracker</h2>
              </div>
              <div className="application-name">HEC Need-Based Scholarship</div>
              <div className="tracker-progress"><span style={{ width: '68%' }} /></div>
              <div className="tracker-list">
                <TrackerItem title="Application submitted" note="26 Sep 2026" state="done" />
                <TrackerItem title="Identity review" note="Completed" state="done" />
                <TrackerItem title="Document verification" note="In progress" state="active" />
                <TrackerItem title="Officer decision" note="Not started" state="pending" />
              </div>
            </div>

            <div className="document-card">
              <span className="eyebrow">Document checklist</span>
              <h3>Required evidence</h3>
              <DocItem name="Student ID" state="Verified" />
              <DocItem name="Latest transcript" state="Verified" />
              <DocItem name="Income evidence" state="Pending" pending />
              <DocItem name="Domicile" state="Verified" />
              <p className="privacy-caption">Only required document status is shown here. Sensitive document contents are not displayed on the dashboard.</p>
            </div>
          </aside>
        </section>
      </main>

      {selected && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close"><X size={19} /></button>
            <span className="eyebrow">Scholarship details</span>
            <h2 id="modal-title">{selected.title}</h2>
            <p className="modal-provider">{selected.provider}</p>
            <p>{selected.description}</p>
            <div className="modal-details">
              <div><span>Category</span><strong>{selected.category}</strong></div>
              <div><span>Study level</span><strong>{selected.level}</strong></div>
              <div><span>Deadline</span><strong>{selected.deadline}</strong></div>
              <div><span>Support</span><strong>{selected.amount}</strong></div>
            </div>
            <div className="notice-box">
              This prototype starts an application only. Document upload and server-side verification will be added in later secure development stages.
            </div>
            <button className="button button-primary full-width" onClick={() => submitApplication(selected)} disabled={applied.includes(selected.id)}>
              {applied.includes(selected.id) ? 'Application already started' : 'Start application'}
            </button>
          </div>
        </div>
      )}

      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}

function TrackerItem({ title, note, state }) {
  return (
    <div className={`tracker-item ${state}`}>
      <span className="tracker-marker">{state === 'done' ? <Check size={13} /> : ''}</span>
      <div><strong>{title}</strong><span>{note}</span></div>
    </div>
  );
}

function DocItem({ name, state, pending = false }) {
  return (
    <div className="doc-row">
      <div><FileText size={16} /><span>{name}</span></div>
      <span className={pending ? 'doc-status pending' : 'doc-status'}>{state}</span>
    </div>
  );
}

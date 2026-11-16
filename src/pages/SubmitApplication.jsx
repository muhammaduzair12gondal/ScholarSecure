import { CheckCircle2, FilePlus2, ShieldCheck, Upload } from 'lucide-react';
import { useState } from 'react';
import Topbar from '../components/Topbar';
import { createApplicationAPI, getStoredUser, SCHOLARSHIP_OPTIONS } from '../api';

const initialForm = { scholarship: '', studyLevel: '', cgpa: '', statement: '' };

export default function SubmitApplication() {
  const user = getStoredUser();
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFeedback(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const result = await createApplicationAPI(form);
      setFeedback({ ok: true, message: result.message });
      setSubmitted(result.application);
      setForm(initialForm);
    } catch (err) {
      setFeedback({ ok: false, message: err.message || 'Submission failed.' });
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    setFileError('');
    setSelectedFile(null);
    if (!file) return;

    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const maximumSize = 5 * 1024 * 1024;
    if (!allowedExtensions.includes(extension)) {
      setFileError('Only PDF, DOC or DOCX files are allowed.');
      event.target.value = '';
      return;
    }
    if (file.size > maximumSize) {
      setFileError('The supporting document must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }
    setSelectedFile(file);
  }

  return (
    <div className="dashboard-shell">
      <Topbar />
      <main className="dashboard-main container-wide module-page">
        <section className="dashboard-intro">
          <div>
            <span className="eyebrow">Scholarship application</span>
            <h1>Submit scholarship application</h1>
            <p>Complete the required fields and submit a new scholarship application for review.</p>
          </div>
          <div className="secure-status"><ShieldCheck size={18} /> Student-only action</div>
        </section>

        <section className="module-layout">
          <form className="module-card application-form" onSubmit={handleSubmit} noValidate>
            <div className="module-card-heading">
              <div className="module-icon"><FilePlus2 size={20} /></div>
              <div><span className="eyebrow">New application</span><h2>Application details</h2></div>
            </div>

            <label htmlFor="scholarship">Scholarship *</label>
            <select id="scholarship" name="scholarship" value={form.scholarship} onChange={updateField}>
              <option value="">Select a scholarship</option>
              {SCHOLARSHIP_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>

            <div className="form-two-column">
              <div>
                <label htmlFor="studyLevel">Study level *</label>
                <select id="studyLevel" name="studyLevel" value={form.studyLevel} onChange={updateField}>
                  <option value="">Select level</option>
                  <option>Undergraduate</option>
                  <option>Graduate</option>
                  <option>Postgraduate</option>
                </select>
              </div>
              <div>
                <label htmlFor="cgpa">CGPA *</label>
                <input id="cgpa" name="cgpa" type="number" min="0" max="4" step="0.01" placeholder="e.g. 3.20" value={form.cgpa} onChange={updateField} />
              </div>
            </div>

            <label htmlFor="statement">Personal statement *</label>
            <textarea id="statement" name="statement" rows="6" maxLength="500" placeholder="Briefly explain why you are applying (minimum 20 characters)." value={form.statement} onChange={updateField} />
            <div className="field-help"><span>Required · 20–500 characters</span><span>{form.statement.length}/500</span></div>

            <label htmlFor="supportingDocument">Supporting document (optional)</label>
            <div className="file-input-wrap">
              <Upload size={18} />
              <input id="supportingDocument" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            </div>
            <div className="field-help"><span>PDF, DOC or DOCX · maximum 5 MB</span><span>{selectedFile ? selectedFile.name : 'No file selected'}</span></div>
            {fileError && <div className="module-feedback error" role="alert">{fileError}</div>}

            {feedback && <div className={feedback.ok ? 'module-feedback success' : 'module-feedback error'} role="alert">{feedback.ok && <CheckCircle2 size={17} />}{feedback.message}</div>}
            <button className="button button-primary" type="submit" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit application'}
            </button>
          </form>

          <aside className="module-card module-summary">
            <span className="eyebrow">Submission preview</span>
            <h2>{submitted ? 'Application created' : `Applicant: ${user?.name}`}</h2>
            {submitted ? (
              <div className="submitted-record">
                <div><span>Reference</span><strong>{submitted.appId}</strong></div>
                <div><span>Scholarship</span><strong>{submitted.scholarship}</strong></div>
                <div><span>Status</span><strong>{submitted.status}</strong></div>
                <div><span>Study Level</span><strong>{submitted.studyLevel}</strong></div>
                <p>The record is now saved in the database and visible in the Track Applications module.</p>
              </div>
            ) : (
              <div className="security-note">
                <ShieldCheck size={21} />
                <div><strong>Backend validation enabled</strong><p>All fields are validated on the server. The JWT token is verified before the application is accepted.</p></div>
              </div>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}

import { ShieldCheck } from 'lucide-react';

export default function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <span className="brand-mark"><ShieldCheck size={20} strokeWidth={2} /></span>
      <span className="brand-text">ScholarSecure</span>
    </div>
  );
}

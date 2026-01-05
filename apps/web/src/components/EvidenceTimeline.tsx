import React, { useState } from 'react';
import { Clock, FileText, Newspaper, TrendingUp } from 'lucide-react';

const filters = ['All', 'SEC', 'IR', 'News', 'Macro'];

const mockEvidence = [
  {
    type: 'SEC',
    title: 'Form 8-K: Results of Operations and Financial Condition',
    time: '16:05 ET',
    date: 'Jan 15, 2026',
    source: 'sec.gov'
  },
  {
    type: 'IR',
    title: 'Q4 FY2025 Earnings Call Transcript',
    time: '16:00 ET',
    date: 'Jan 15, 2026',
    source: 'ir.nvidia.com'
  },
  {
    type: 'News',
    title: 'Nvidia delays next-gen Blackwell GPUs, cuts revenue outlook',
    time: '16:12 ET',
    date: 'Jan 15, 2026',
    source: 'reuters.com'
  },
  {
    type: 'News',
    title: 'Goldman Sachs downgrades semiconductor sector on demand concerns',
    time: '09:45 ET',
    date: 'Jan 15, 2026',
    source: 'bloomberg.com'
  },
  {
    type: 'SEC',
    title: 'Microsoft Form 10-Q: Notes on Capital Expenditures',
    time: '14:30 ET',
    date: 'Jan 15, 2026',
    source: 'sec.gov'
  },
  {
    type: 'Macro',
    title: 'Fed signals potential rate hold amid tech sector volatility',
    time: '08:00 ET',
    date: 'Jan 15, 2026',
    source: 'federalreserve.gov'
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case 'SEC': return FileText;
    case 'IR': return FileText;
    case 'News': return Newspaper;
    case 'Macro': return TrendingUp;
    default: return FileText;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'SEC': return { bg: 'rgb(var(--es-accent-rgb) / 0.12)', text: 'var(--es-accent)' };
    case 'IR': return { bg: 'rgb(var(--es-accent-rgb) / 0.10)', text: 'var(--es-accent)' };
    case 'News': return { bg: 'rgb(var(--es-accent-rgb) / 0.08)', text: 'var(--es-text-subtle)' };
    case 'Macro': return { bg: 'rgb(var(--es-accent-rgb) / 0.06)', text: 'var(--es-text-subtle)' };
    default: return { bg: 'var(--es-surface-subtle)', text: 'var(--es-text-muted)' };
  }
};

export function EvidenceTimeline() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredEvidence = activeFilter === 'All' 
    ? mockEvidence 
    : mockEvidence.filter(e => e.type === activeFilter);

  return (
    <div className="es-card es-card-pad">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 className="es-h2">Evidence Timeline</h3>
        
        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={activeFilter === filter ? "es-chip es-chip-accent" : "es-chip es-chip-muted"}
              style={{
                fontSize: '13px',
                fontWeight: activeFilter === filter ? 560 : 500,
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline items */}
      <div className="es-vstack-tight" style={{ gap: 12 }}>
        {filteredEvidence.map((item, idx) => {
          const Icon = getIcon(item.type);
          const colors = getTypeColor(item.type);
          
          return (
            <div key={idx} className="es-row">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: colors.bg,
                }}
              >
                <Icon style={{ width: 20, height: 20, color: colors.text }} />
              </div>

              <div style={{ minWidth: 0 }}>
                <div className="es-hstack" style={{ gap: 8, marginBottom: 6 }}>
                  <span
                    className="es-chip"
                    style={{
                      background: colors.bg,
                      color: colors.text,
                      borderColor: "transparent",
                      fontWeight: 700,
                    }}
                  >
                    {item.type}
                  </span>
                  <span className="es-caption es-truncate" style={{ color: "var(--es-text-faint)" }}>
                    {item.source}
                  </span>
                </div>

                <p className="es-h3 es-truncate" style={{ color: "var(--es-text)" }}>
                  {item.title}
                </p>
              </div>

              <div className="es-row-meta">
                <div className="es-hstack" style={{ gap: 6, justifyContent: "flex-end" }}>
                  <Clock style={{ width: 12, height: 12, color: "var(--es-text-faint)" }} />
                  <span className="es-caption" style={{ color: "var(--es-text-muted)" }}>
                    {item.date} • {item.time}
                  </span>
                </div>
                <button
                  type="button"
                  className="es-link"
                  aria-disabled
                  disabled
                  title="Demo-only: details coming soon"
                  style={{ cursor: "not-allowed" }}
                >
                  Show more
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

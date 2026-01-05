import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';

const mockResults = [
  {
    rank: 1,
    headline: 'NVIDIA announces new AI chip delay due to design flaw',
    evidence: [
      'CEO Jensen Huang confirmed in earnings call that Blackwell GPU production delayed by 3 months',
      'Manufacturing partner TSMC cited "unexpected yield issues" in 3nm process',
      'Q4 revenue guidance lowered from $14.5B to $12.8B (-11.7%)'
    ],
    whyRanks: ['Time Proximity', 'High Authority', 'Numeric Impact', 'Multi-Source'],
    citations: [
      { domain: 'sec.gov', time: '16:05 ET', type: 'SEC' },
      { domain: 'reuters.com', time: '16:12 ET', type: 'News' },
      { domain: 'ir.nvidia.com', time: '16:00 ET', type: 'IR' }
    ]
  },
  {
    rank: 2,
    headline: 'Semiconductor sector downgrade by Goldman Sachs',
    evidence: [
      'Goldman Sachs downgrades semiconductor sector to "Neutral" from "Buy"',
      'Analyst cites concerns over AI chip demand sustainability',
      'Price target for NVDA reduced from $850 to $720'
    ],
    whyRanks: ['Industry Impact', 'Authority', 'Price Target'],
    citations: [
      { domain: 'bloomberg.com', time: '09:45 ET', type: 'News' },
      { domain: 'goldmansachs.com', time: '09:30 ET', type: 'Research' }
    ]
  },
  {
    rank: 3,
    headline: 'Major cloud customer reduces AI infrastructure spending',
    evidence: [
      'Microsoft announces 15% cut in AI infrastructure capex for next quarter',
      'Cited "optimization of existing capacity" as primary reason',
      'NVDA mentioned as key supplier in SEC filing footnotes'
    ],
    whyRanks: ['Related Entity', 'Confirmation', 'SEC Filing'],
    citations: [
      { domain: 'sec.gov', time: '14:30 ET', type: 'SEC' },
      { domain: 'cnbc.com', time: '14:45 ET', type: 'News' }
    ]
  }
];

export function AttributionResults() {
  return (
    <div className="es-vstack-tight" style={{ gap: 20 }}>
      {mockResults.map((result) => (
        <div
          key={result.rank}
          className="es-card es-card-pad es-card-hover"
        >
          {/* Rank badge and headline */}
          <div className="es-result-head">
            <div 
              className="es-rank-badge"
              style={{
                background: result.rank === 1 ? 'var(--es-accent)' : 'rgb(var(--es-accent-rgb) / 0.06)',
                color: result.rank === 1 ? 'white' : 'var(--es-accent)',
                border: result.rank === 1 ? '1px solid transparent' : '1px solid rgb(var(--es-accent-rgb) / 0.28)',
              }}
            >
              {result.rank}
            </div>
            <h3 className="es-h3" style={{ flex: 1, minWidth: 0 }}>
              {result.headline}
            </h3>
          </div>

          {/* Evidence bullets */}
          <ul className="es-indent" style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {result.evidence.map((item, idx) => (
              <li key={idx} className="es-hstack" style={{ alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: 'var(--es-text-muted)', marginTop: 2 }}>•</span>
                <span style={{ fontSize: '14px', color: 'var(--es-text-subtle)' }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* Why it ranks chips */}
          <div className="es-indent" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {result.whyRanks.map((reason, idx) => (
              <span
                key={idx}
                className="es-chip es-chip-accent"
              >
                {reason}
              </span>
            ))}
          </div>

          {/* Citations */}
          <div className="es-indent" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {result.citations.map((citation, idx) => (
              <button
                key={idx}
                type="button"
                className="es-linkchip"
                aria-label={`Open citation: ${citation.domain} at ${citation.time}`}
                onClick={() => {}}
              >
                <FileText style={{ width: 12, height: 12 }} />
                <span style={{ color: 'inherit' }}>{citation.domain}</span>
                <span style={{ color: 'var(--es-text-faint)', fontWeight: 560 }}>•</span>
                <span style={{ color: 'inherit' }}>{citation.time}</span>
                <ExternalLink style={{ width: 12, height: 12, color: 'var(--es-text-faint)' }} />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AttributionResultsSkeleton() {
  return (
    <div className="es-vstack-tight" style={{ gap: 20 }}>
      {[1, 2, 3].map((k) => (
        <div key={k} className="es-card es-card-pad" style={{ opacity: 0.9 }}>
          <div className="es-result-head" style={{ marginBottom: 12 }}>
            <div className="es-rank-badge" style={{ background: "var(--es-surface-subtle)", border: "1px solid var(--es-border)", color: "transparent" }}>
              {k}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ height: 14, width: "72%", background: "var(--es-surface-subtle)", borderRadius: 8, border: "1px solid var(--es-border)" }} />
              <div style={{ marginTop: 10, height: 10, width: "55%", background: "var(--es-surface-subtle)", borderRadius: 8, border: "1px solid var(--es-border)" }} />
            </div>
          </div>
          <div className="es-indent" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ height: 10, width: "92%", background: "var(--es-surface-subtle)", borderRadius: 8, border: "1px solid var(--es-border)" }} />
            <div style={{ height: 10, width: "88%", background: "var(--es-surface-subtle)", borderRadius: 8, border: "1px solid var(--es-border)" }} />
            <div style={{ height: 10, width: "80%", background: "var(--es-surface-subtle)", borderRadius: 8, border: "1px solid var(--es-border)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

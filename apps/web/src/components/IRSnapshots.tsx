import React from 'react';
import { Copy, Check } from 'lucide-react';

const eventIR = {
  ticker: 'NVDA',
  event_time: '2026-01-15T16:05:00-05:00',
  price_move: -8.4,
  causes: [
    {
      headline: 'Blackwell GPU delay',
      confidence: 0.92,
      time_proximity_score: 0.95,
      authority_score: 0.88
    }
  ]
};

const reportIR = {
  query_id: 'attr_20260115_nvda_001',
  execution_time_ms: 4230,
  retrieval_stats: {
    initial_docs: 47,
    second_pass_docs: 12,
    total_sources: 59
  },
  judge_reasoning: 'High confidence attribution based on...'
};

export function IRSnapshots() {
  const [copiedLeft, setCopiedLeft] = React.useState(false);
  const [copiedRight, setCopiedRight] = React.useState(false);

  const handleCopy = async (text: string, side: 'left' | 'right') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no-op fallback (some browsers require user gesture / permissions)
    }
    if (side === 'left') {
      setCopiedLeft(true);
      setTimeout(() => setCopiedLeft(false), 2000);
    } else {
      setCopiedRight(true);
      setTimeout(() => setCopiedRight(false), 2000);
    }
  };

  const leftJson = React.useMemo(() => JSON.stringify(eventIR, null, 2), []);
  const rightJson = React.useMemo(() => JSON.stringify(reportIR, null, 2), []);

  return (
    <div className="es-ir-split">
      {/* Event IR */}
      <div className="es-card es-overflow-hidden es-codepanel">
        <div className="es-codepanel__header">
          <div style={{ minWidth: 0 }}>
            <div className="es-codepanel__title">Event IR (JSON)</div>
            <div className="es-codepanel__meta">Inspector view</div>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(leftJson, 'left')}
            className="es-icon-btn"
            aria-label="Copy Event IR JSON"
            title={copiedLeft ? "Copied" : "Copy JSON"}
          >
            {copiedLeft ? (
              <Check style={{ width: 16, height: 16, color: "rgb(34,197,94)" }} />
            ) : (
              <Copy style={{ width: 16, height: 16 }} />
            )}
          </button>
        </div>
        <div className="es-codepanel__body">
          <div className="es-codepanel__scroller" role="region" aria-label="Event IR JSON">
            <pre className="es-code">{leftJson}</pre>
          </div>
        </div>
      </div>

      {/* Report IR */}
      <div className="es-card es-overflow-hidden es-codepanel">
        <div className="es-codepanel__header">
          <div style={{ minWidth: 0 }}>
            <div className="es-codepanel__title">Report IR (JSON)</div>
            <div className="es-codepanel__meta">Inspector view</div>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(rightJson, 'right')}
            className="es-icon-btn"
            aria-label="Copy Report IR JSON"
            title={copiedRight ? "Copied" : "Copy JSON"}
          >
            {copiedRight ? (
              <Check style={{ width: 16, height: 16, color: "rgb(34,197,94)" }} />
            ) : (
              <Copy style={{ width: 16, height: 16 }} />
            )}
          </button>
        </div>
        <div className="es-codepanel__body">
          <div className="es-codepanel__scroller" role="region" aria-label="Report IR JSON">
            <pre className="es-code">{rightJson}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

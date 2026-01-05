import React from 'react';
import { TickerCombobox } from "./TickerCombobox";

interface TopNavProps {
  ticker: string;
  onTickerChange: (value: string) => void;
}

export function TopNav({
  ticker,
  onTickerChange,
}: TopNavProps) {
  return (
    <nav className="es-topnav">
      <div className="es-container es-topnav-inner">
        {/* Left: Brand */}
        <div className="es-vstack-tight" style={{ gap: 2 }}>
          <div className="es-hstack" style={{ gap: 8, alignItems: "baseline" }}>
            <span className="es-truncate" style={{ fontSize: "20px", fontWeight: 650 }}>
              EventSense-US
            </span>
          </div>
          <div className="es-caption es-truncate">
            Price Move Attribution (Ex-post)
          </div>
        </div>

        {/* Center: Ticker search */}
        <div style={{ justifySelf: "center", width: "100%", minWidth: 0 }}>
          <TickerCombobox value={ticker} onChange={onTickerChange} />
        </div>

        {/* Right: Profile pill */}
        <div className="es-hstack" style={{ justifySelf: "end" }}>
          <a
            className="es-profile-pill"
            href="https://x.com/YiannisChen"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Yiannis Chen profile on X"
          >
            <span className="es-avatar" aria-hidden="true">
              <img src="/avatar.jpg" alt="" />
            </span>
            <span className="es-profile-handle" style={{ fontSize: 13, fontWeight: 650, color: "var(--es-text)" }}>
              @YiannisChen
            </span>
          </a>
        </div>
      </div>
    </nav>
  );
}

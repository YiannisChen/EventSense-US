import React from "react";
import { FileDown, FileText } from "lucide-react";

export type Tab = "Results" | "Evidence" | "IR";

export function SectionBar({
  activeTab,
  onTabChange,
  onExportPdf,
  onExportIr,
  getButtonId,
  getPanelId,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onExportPdf: () => void;
  onExportIr: () => void;
  getButtonId: (tab: Tab) => string;
  getPanelId: (tab: Tab) => string;
}) {
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "Results", label: "Results" },
    { id: "Evidence", label: "Evidence" },
    { id: "IR", label: "IR" },
  ];
  const buttonRefs = React.useRef<Record<Tab, HTMLButtonElement | null>>({
    Results: null,
    Evidence: null,
    IR: null,
  });

  const focusTab = (tabId: Tab) => {
    buttonRefs.current[tabId]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const prevIdx = (idx - 1 + tabs.length) % tabs.length;
    const nextIdx = (idx + 1) % tabs.length;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(tabs[nextIdx].id);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(tabs[prevIdx].id);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onTabChange(tabs[idx].id);
    }
  };

  return (
    <div className="es-sectionbar">
      <div className="es-sectionbar-inner">
        <div className="es-sectiontabs" role="tablist" aria-label="Content tabs">
          {tabs.map((t, idx) => (
            <button
              key={t.id}
              id={getButtonId(t.id)}
              type="button"
              className={t.id === activeTab ? "es-sectiontab es-sectiontab--active" : "es-sectiontab"}
              onClick={() => onTabChange(t.id)}
              role="tab"
              aria-selected={t.id === activeTab}
              aria-controls={getPanelId(t.id)}
              ref={(node) => (buttonRefs.current[t.id] = node)}
              onKeyDown={(event) => handleKeyDown(event, idx)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="es-sectionbar-actions">
          <button
            type="button"
            className="es-btn es-btn-ghost"
            onClick={onExportPdf}
            disabled
            title="Demo-only: Export PDF coming soon"
          >
            <FileDown style={{ width: 16, height: 16 }} />
            <span>Export PDF</span>
          </button>
          {activeTab === "IR" ? (
            <button
              type="button"
              className="es-btn es-btn-ghost"
              onClick={onExportIr}
              disabled
              title="Demo-only: Export IR coming soon"
            >
              <FileText style={{ width: 16, height: 16 }} />
              <span>Export IR</span>
            </button>
          ) : null}
          <span className="es-caption" style={{ color: "var(--es-text-faint)" }}>Demo-only</span>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { TopNav } from './components/TopNav';
import { SectionBar, type Tab } from './components/SectionBar';
import { PriceChart } from './components/PriceChart';
import { AttributionResults, AttributionResultsSkeleton } from './components/AttributionResults';
import { EvidenceTimeline } from './components/EvidenceTimeline';
import { IRSnapshots } from './components/IRSnapshots';
import { AttributionPanel } from './components/AttributionPanel';
import { RunStatus } from './components/RunStatus';
import { Footer } from './components/Footer';

export default function App() {
  const tabMeta: Record<Tab, { buttonId: string; panelId: string }> = {
    Results: { buttonId: "tab-results", panelId: "panel-results" },
    Evidence: { buttonId: "tab-evidence", panelId: "panel-evidence" },
    IR: { buttonId: "tab-ir", panelId: "panel-ir" },
  };
  const [activeTab, setActiveTab] = useState<Tab>('Results');
  const [ticker, setTicker] = useState('NVDA');
  const [selectedDayET, setSelectedDayET] = useState('2026-01-15');
  const [nlQuery, setNlQuery] = useState('');
  const [options, setOptions] = useState({
    hybridRetrieval: true,
    secondPass: true,
    relatedEntities: false,
  });
  const [isRunning, setIsRunning] = useState(false);
  const runTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRunAttribution = () => {
    setIsRunning(true);
    if (runTimeoutRef.current) {
      clearTimeout(runTimeoutRef.current);
    }
    runTimeoutRef.current = setTimeout(() => setIsRunning(false), 7200); // 6 steps × 1.2s
  };

  const handleReset = () => {
    setNlQuery('');
    setSelectedDayET('');
  };

  useEffect(() => {
    return () => {
      if (runTimeoutRef.current) {
        clearTimeout(runTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <TopNav
        ticker={ticker}
        onTickerChange={setTicker}
      />
      
      <main className="es-page">
        <div className="es-container">
          {/* Workstation top section (above the fold) */}
          <div className="es-topworkstation">
            <PriceChart
              ticker={ticker}
              selectedDayET={selectedDayET}
              onSelectDayET={setSelectedDayET}
            />
            <AttributionPanel
              ticker={ticker}
              onTickerChange={setTicker}
              selectedDayET={selectedDayET}
              onSelectedDayChange={setSelectedDayET}
              nlQuery={nlQuery}
              onNlQueryChange={setNlQuery}
              options={options}
              onOptionsChange={setOptions}
              isRunning={isRunning}
              onRun={handleRunAttribution}
              onReset={handleReset}
            />
          </div>

          {/* SectionBar: tabs + exports between top workstation and content */}
          <SectionBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onExportPdf={() => console.log('Export PDF')}
            onExportIr={() => console.log('Export IR')}
            getButtonId={(tab) => tabMeta[tab].buttonId}
            getPanelId={(tab) => tabMeta[tab].panelId}
          />

          {/* Content section */}
          <div className="es-main-grid">
            <div style={{ minWidth: 0 }}>
              <div className="es-vstack-tight" style={{ gap: 24 }}>
                <div
                  id={tabMeta.Results.panelId}
                  role="tabpanel"
                  aria-labelledby={tabMeta.Results.buttonId}
                  hidden={activeTab !== 'Results'}
                  style={{ display: activeTab === 'Results' ? "block" : "none" }}
                >
                  <div className="es-card es-card-pad">
                    <h3 className="es-h2" style={{ marginBottom: '16px' }}>
                      Attribution Results (Top 3)
                    </h3>
                    {isRunning ? <AttributionResultsSkeleton /> : <AttributionResults />}
                  </div>
                </div>

                <div
                  id={tabMeta.Evidence.panelId}
                  role="tabpanel"
                  aria-labelledby={tabMeta.Evidence.buttonId}
                  hidden={activeTab !== 'Evidence'}
                  style={{ display: activeTab === 'Evidence' ? "block" : "none" }}
                >
                  <EvidenceTimeline />
                </div>

                <div
                  id={tabMeta.IR.panelId}
                  role="tabpanel"
                  aria-labelledby={tabMeta.IR.buttonId}
                  hidden={activeTab !== 'IR'}
                  style={{ display: activeTab === 'IR' ? "block" : "none" }}
                >
                  <IRSnapshots />
                </div>
              </div>
            </div>
            <aside style={{ minWidth: 0 }}>
              <RunStatus isRunning={isRunning} />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

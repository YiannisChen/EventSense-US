import React from 'react';
import { Clock, Search, Pickaxe, Shield, RefreshCw, Gavel, Check, Loader2 } from 'lucide-react';

interface RunStatusProps {
  isRunning: boolean;
}

const steps = [
  { id: 1, label: 'ET alignment', icon: Clock },
  { id: 2, label: 'Initial retrieval', icon: Search },
  { id: 3, label: 'Miner → Event IR', icon: Pickaxe },
  { id: 4, label: 'Critic → Audit checks', icon: Shield },
  { id: 5, label: 'Second-pass retrieval (≤1) + optional 1-hop', icon: RefreshCw },
  { id: 6, label: 'Judge → Top causes + Report IR', icon: Gavel }
];

export function RunStatus({ isRunning }: RunStatusProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    if (isRunning) {
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
      return () => clearInterval(interval);
    } else {
      setCurrentStep(0);
    }
  }, [isRunning]);

  const progress = isRunning ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="es-card es-card-pad">
      <h3 className="es-h2" style={{ marginBottom: '16px' }}>Run Status</h3>

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div className="es-progress-track">
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: 'var(--es-accent)',
              transition: "width 300ms ease"
            }}
          />
        </div>
        {isRunning && (
          <p className="es-caption" style={{ marginTop: '6px' }}>
            Step {currentStep + 1} of {steps.length}
          </p>
        )}
      </div>

      {/* Steps */}
      <div className="es-stepper">
        <div className="es-stepper-line" />
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isComplete = currentStep > idx;
          const isCurrent = currentStep === idx && isRunning;

          return (
            <div key={step.id} className="es-step">
              <div
                style={{
                  flexShrink: 0,
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 160ms ease, border-color 160ms ease",
                  background: isComplete 
                    ? 'var(--es-accent-tint)' 
                    : isCurrent 
                    ? 'var(--es-accent-tint)' 
                    : 'rgb(249, 250, 251)',
                  border: isCurrent ? '2px solid var(--es-accent)' : '1px solid var(--es-border)'
                }}
              >
                {isComplete ? (
                  <Check style={{ width: 16, height: 16, color: 'var(--es-accent)' }} />
                ) : isCurrent ? (
                  <Loader2 className="es-spin" style={{ width: 16, height: 16, color: 'var(--es-accent)' }} />
                ) : (
                  <Icon style={{ width: 16, height: 16, color: 'var(--es-text-faint)' }} />
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: isCurrent ? 650 : 500,
                    color: isComplete || isCurrent ? 'var(--es-text)' : 'var(--es-text-faint)'
                  }}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {!isRunning && (
        <div style={{ marginTop: 20, padding: 12, borderRadius: 12, background: 'var(--es-surface-subtle)' }}>
          <p className="es-caption" style={{ textAlign: 'center' }}>
            Ready to run attribution
          </p>
        </div>
      )}
    </div>
  );
}

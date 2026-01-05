import React from "react";
import { Search } from "lucide-react";
import { SPX100_TICKERS } from "../data/spx100";

export function TickerCombobox({
  value,
  onChange,
  placeholder = "Search ticker e.g., NVDA",
  ariaLabel = "Ticker",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const listboxId = React.useId();

  const query = value.trim().toUpperCase();

  const suggestions = React.useMemo(() => {
    if (!query) return SPX100_TICKERS.slice(0, 12);
    const starts = SPX100_TICKERS.filter((t) => t.startsWith(query));
    const contains = SPX100_TICKERS.filter((t) => !t.startsWith(query) && t.includes(query));
    return [...starts, ...contains].slice(0, 12);
  }, [query]);

  React.useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const commit = (t: string) => {
    onChange(t.toUpperCase());
    setIsOpen(false);
  };

  const activeOptionId =
    isOpen && suggestions.length > 0 ? `${listboxId}-item-${activeIndex}` : undefined;

  return (
    <div ref={rootRef} className="es-combobox">
      <Search className="es-combobox-icon" aria-hidden="true" />
      <input
        className="es-input"
        style={{ width: "100%", paddingLeft: 40, background: "var(--es-surface-subtle)" }}
        value={value}
        onChange={(e) => {
          onChange(e.target.value.toUpperCase());
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (!isOpen) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            const selected = suggestions[activeIndex];
            if (selected) commit(selected);
          } else if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
        placeholder={placeholder}
        aria-label={ariaLabel}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={activeOptionId}
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck={false}
        inputMode="text"
      />

      {isOpen && suggestions.length > 0 ? (
        <div
          id={listboxId}
          className="es-combobox-menu"
          role="listbox"
          aria-label="Ticker suggestions"
        >
          {suggestions.map((t, idx) => (
            <button
              key={t}
              id={`${listboxId}-item-${idx}`}
              type="button"
              className={idx === activeIndex ? "es-combobox-item es-combobox-item--active" : "es-combobox-item"}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(t)}
              role="option"
              aria-selected={idx === activeIndex}
            >
              <span style={{ fontWeight: 650 }}>{t}</span>
              {t === "BRK.B" || t === "BRK.A" ? (
                <span className="es-caption" style={{ marginLeft: 8, color: "var(--es-text-faint)" }}>
                  Berkshire Hathaway
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}


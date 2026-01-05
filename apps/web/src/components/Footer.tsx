import React from "react";

export function Footer() {
  return (
    <footer className="es-footer" aria-label="Footer">
      <div className="es-footer__inner">
        {/* Row 1 */}
        <div className="es-footer__row">
          <div className="es-footer__brand">
            <div className="es-footer__title">EventSense-US</div>
            <div className="es-footer__subtitle">Price Move Attribution (Ex-post)</div>
          </div>

          <nav className="es-footer__links" aria-label="Footer links">
            <a className="es-footer__link" href="#" onClick={(e) => e.preventDefault()}>
              Docs
            </a>
            <a className="es-footer__link" href="#" onClick={(e) => e.preventDefault()}>
              API
            </a>
            <a
              className="es-footer__link"
              href="https://github.com/YiannisChen"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="es-footer__link"
              href="https://x.com/YiannisChen"
              target="_blank"
              rel="noreferrer"
            >
              @YiannisChen
            </a>
          </nav>
        </div>

        {/* Row 2 */}
        <div className="es-footer__fineprint">
          <span>Demo UI. Chart is a placeholder; market data integration will be enabled later.</span>
          <span>Built by Yiannis Chen for academic demonstration.</span>
        </div>
      </div>
    </footer>
  );
}



/* ===========================================================================
   PROfinity — Tweaks Panel
   Provides: useTweaks, TweaksPanel, TweakSection, TweakColor, TweakSlider
   Loaded before app.jsx; registers globals on window so app.jsx can call them.
   =========================================================================== */
const { useState } = React;

/* ---- Hook ---------------------------------------------------------------- */
function useTweaks(defaults) {
  const [state, setState] = useState(defaults);
  return [state, (key, val) => setState(s => ({ ...s, [key]: val }))];
}

/* ---- TweakSection -------------------------------------------------------- */
function TweakSection({ label }) {
  return (
    <div style={{
      fontWeight: 700,
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: "0.09em",
      color: "rgba(255,255,255,0.38)",
      marginTop: 20,
      marginBottom: 10,
      paddingBottom: 6,
      borderBottom: "1px solid rgba(255,255,255,0.07)",
    }}>
      {label}
    </div>
  );
}

/* ---- TweakColor ---------------------------------------------------------- */
function TweakColor({ label, value, options, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{label}</span>
      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        {options.map(opt => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              data-swatch="true"
              title={opt}
              onClick={() => onChange(opt)}
              aria-pressed={active}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: opt,
                border: active ? "2.5px solid #fff" : "2px solid rgba(255,255,255,0.22)",
                boxShadow: active ? "0 0 0 1.5px rgba(0,0,0,0.45)" : "none",
                cursor: "pointer",
                outline: "none",
                padding: 0,
                flexShrink: 0,
                transform: active ? "scale(1.22)" : "scale(1)",
                transition: "transform 0.15s cubic-bezier(.34,1.56,.64,1), border-color 0.12s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ---- TweakSlider --------------------------------------------------------- */
function TweakSlider({ label, value, min, max, step = 1, unit = "", onChange }) {
  return (
    <div className="twk-panel" style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{label}</span>
        <span style={{ color: "#fff", fontWeight: 600, fontSize: 12, fontVariantNumeric: "tabular-nums" }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="twk-panel"
        style={{ width: "100%", margin: 0, cursor: "pointer", accentColor: "#ce9957", display: "block" }}
      />
    </div>
  );
}

/* ---- TweaksPanel --------------------------------------------------------- */
function TweaksPanel({ title, children }) {
  const [open, setOpen] = useState(false);

  const PANEL_W = 228;

  const panelStyle = {
    position: "fixed",
    right: 0,
    top: 0,
    bottom: 0,
    width: PANEL_W,
    background: "#12102a",
    zIndex: 9400,
    transform: open ? "translateX(0)" : "translateX(100%)",
    transition: "transform 0.28s cubic-bezier(.22,.61,.36,1)",
    overflowY: "auto",
    borderLeft: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
    boxShadow: open ? "-8px 0 32px rgba(0,0,0,0.35)" : "none",
  };

  const tabStyle = {
    position: "fixed",
    right: open ? PANEL_W : 0,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 9500,
    background: "#12102a",
    color: "#fff",
    border: "none",
    borderRadius: "8px 0 0 8px",
    padding: "12px 8px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 7,
    boxShadow: "-3px 0 14px rgba(0,0,0,0.3)",
    transition: "right 0.28s cubic-bezier(.22,.61,.36,1)",
    fontFamily: "inherit",
  };

  return (
    <>
      {/* Slide-out tab */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={tabStyle}
        aria-label={open ? "Close tweaks panel" : "Open tweaks panel"}
        aria-expanded={open}
        aria-controls="twk-body"
      >
        {/* Gear icon */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        {/* Vertical label */}
        <span style={{
          writingMode: "vertical-rl",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1,
        }}>
          {title}
        </span>
      </button>

      {/* Panel body */}
      <div id="twk-body" style={panelStyle} aria-hidden={!open} role="dialog" aria-label={title}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 16px 0",
          flexShrink: 0,
        }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#fff", letterSpacing: "-0.01em" }}>
            {title}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close tweaks panel"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.4)",
              fontSize: 18,
              lineHeight: 1,
              padding: "2px 4px",
              borderRadius: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "4px 16px 28px", flex: 1 }}>
          {children}
        </div>

        {/* Footer wordmark */}
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: 10,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.04em",
          flexShrink: 0,
        }}>
          PROFINITY DESIGN SYSTEM
        </div>
      </div>
    </>
  );
}

/* Expose to global scope so app.jsx can reference them across Babel script boundaries */
window.useTweaks = useTweaks;
window.TweaksPanel = TweaksPanel;
window.TweakSection = TweakSection;
window.TweakColor = TweakColor;
window.TweakSlider = TweakSlider;

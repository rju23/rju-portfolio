import { useState, useEffect, useRef } from "react";
import { MessageSquare, Code2, User, Grid3x3, Mail, ChevronDown, Paperclip, ArrowUp, Sparkles, Target } from "lucide-react";

const BORDER   = "rgba(255,255,255,0.07)";
const TEXT     = "#F4EFE7";
const TEXT_DIM = "rgba(244,239,231,0.58)";
const TEXT_MUTE= "rgba(244,239,231,0.32)";
const ACCENT   = "#D98A4C";

const NAV = [
  { id: "chat",     label: "Chat",     Icon: MessageSquare },
  { id: "projects", label: "Projects", Icon: Code2         },
  { id: "about",    label: "About",    Icon: User          },
  { id: "services", label: "Services", Icon: Grid3x3       },
  { id: "contact",  label: "Contact",  Icon: Mail          },
];

export default function App() {
  const [section, setSection] = useState("chat");
  const [splash, setSplash]   = useState(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;1,400;1,500&family=Inter:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{
      width: "100%", height: "100%",
      position: "relative", overflow: "hidden",
      background: "#0D0C0B",
      display: "flex",
      padding: "12px 0 12px 12px",
      fontFamily: "'Inter', sans-serif",
      color: TEXT,
    }}>

      {/* ── Background ── */}
      {splash && <SplashScreen onDone={() => setSplash(false)} />}
      <img
        id="parallax-bg"
        src="/bg.png"
        alt=""
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "108%", height: "108%",
          objectFit: "cover", objectPosition: "center",
          transition: "transform 0.08s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
          userSelect: "none", pointerEvents: "none",
        }}
      />

      {/* Readability overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 70% 40% at 30% 60%, rgba(10,9,8,0.35) 0%, rgba(10,9,8,0) 100%),
          radial-gradient(ellipse 100% 30% at 50% 100%, rgba(10,9,8,0.6) 0%, rgba(10,9,8,0) 70%),
          linear-gradient(to right, rgba(10,9,8,0.55) 0%, rgba(10,9,8,0.1) 35%, rgba(10,9,8,0) 60%)
        `,
      }} />

      {/* ── Sidebar ── */}
      <aside style={{
         position: "relative", zIndex: 10,
         width: 190, minWidth: 190,
         display: "flex", flexDirection: "column",
         background: "rgba(200,200,210,0.06)",
         backdropFilter: "blur(2px)",
         WebkitBackdropFilter: "blur(2px)",
         border: `1px solid ${BORDER}`,
         borderRadius: 18,
         overflow: "hidden",
      }}>

        {/* Brand */}
        <div style={{ padding: "28px 22px 22px" }}>
          <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.01em" }}>PK-1</div>
          <div style={{ fontSize: 11.5, color: TEXT_DIM, marginTop: 3 }}>
            Prakash's portfolio assistant.
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "4px 10px" }}>
          {NAV.map(({ id, label, Icon }) => (
            <NavItem
              key={id} label={label} Icon={Icon}
              active={section === id}
              onClick={() => setSection(id)}
            />
          ))}
        </nav>

        {/* Online status */}
        <div style={{
         padding: "50px 22px",
         display: "flex", alignItems: "center", gap: 9,
        }}>
          <span className="pulse-dot" style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#5FBF7A", flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>PK-1 online</div>
            <div style={{ fontSize: 10.5, color: TEXT_MUTE }}>Ready when you are.</div>
          </div>
        </div>

        {/* User */}
        <div style={{
          padding: "14px 18px 20px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(217,138,76,0.18)",
            color: ACCENT, fontSize: 13, fontWeight: 500,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>P</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Prakash</div>
            <div style={{ fontSize: 10.5, color: TEXT_MUTE }}>Developer. Builder.</div>
          </div>
          <ChevronDown size={14} color={TEXT_MUTE} />
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{
        flex: 1, position: "relative", zIndex: 10,
        padding: "12px 12px 12px 0",
        display: "flex", flexDirection: "column",
      }}>
        <TopBar />
        <HeroText />
        <InputBar />
      </main>

    </div>
  );
}

function NavItem({ label, Icon, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 11,
        width: "100%", padding: "10px 13px", marginBottom: 2,
        borderRadius: 9, border: "none", cursor: "pointer",
        fontSize: 13.5, fontFamily: "'Inter', sans-serif",
        fontWeight: active ? 500 : 400,
        color: active ? TEXT : hovered ? TEXT : "rgba(244,239,231,0.58)",
        background: active
          ? "rgba(255,255,255,0.08)"
          : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        textAlign: "left",
        transition: "background 0.15s ease, color 0.15s ease",
      }}
    >
      <Icon size={15} strokeWidth={active ? 2 : 1.5} />
      {label}
    </button>
  );
}

function InputBar({ onPromptClick }) {
  const [input, setInput]       = useState("");
  const [hovered, setHovered]   = useState(false);
  const [visible, setVisible]   = useState(false);
  const [shaking, setShaking]   = useState(false);
  const [focused, setFocused]   = useState(false);
  const [everShown, setEverShown] = useState(false);
  const hideTimer               = useRef(null);
  const shakeTimer              = useRef(null);
  const inputRef                = useRef(null);

  // Show the chips, marking that they've entered at least once so the
  // exit animation never plays on first paint.
  const showChips = () => { setEverShown(true); setVisible(true); };

  // Nudge the bar and bounce the chips in — the input is a prop, not a real field.
  const rejectTyping = () => {
    showChips();
    if (shaking) return;              // let the current nudge finish
    setShaking(true);
    shakeTimer.current = setTimeout(() => setShaking(false), 360);
  };

  useEffect(() => () => {
    clearTimeout(hideTimer.current);
    clearTimeout(shakeTimer.current);
  }, []);

  const PROMPTS = [
    { label: "What have you built?",       Icon: Code2    },
    { label: "Tell me about Prakash",       Icon: User     },
    { label: "What can he build for me?",   Icon: Sparkles },
    { label: "What is Prakash working on?", Icon: Target   },
  ];

  const handleZoneEnter = () => {
    clearTimeout(hideTimer.current);
    setHovered(true);
    showChips();
  };

  const handleZoneLeave = () => {
    hideTimer.current = setTimeout(() => {
      setHovered(false);
      // Keep them up while the caret is still in the bar.
      if (document.activeElement !== inputRef.current) setVisible(false);
    }, 120);
  };

  return (
    <div
      onMouseEnter={handleZoneEnter}
      onMouseLeave={handleZoneLeave}
      style={{ padding: "0 24px 24px" }}
    >
      {/* ── Suggestion chips ── */}
      <div style={{
        display: "flex", gap: 10, flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 12,
        minHeight: 44,
      }}>
        {PROMPTS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => { setInput(p.label); setVisible(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 16px", borderRadius: 12,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(244,239,231,0.75)",
              fontSize: 13, fontFamily: "'Inter', sans-serif",
              cursor: "pointer", whiteSpace: "nowrap",
              opacity: everShown ? undefined : 0,
              animation: !everShown
                ? "none"
                : visible
                  ? `chipBounceIn 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 0.06}s both`
                  : `chipBounceOut 0.45s cubic-bezier(0.22,1,0.36,1) ${(PROMPTS.length - 1 - i) * 0.06}s both`,
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              pointerEvents: visible ? "auto" : "none",
            }}
            tabIndex={visible ? 0 : -1}
            aria-hidden={!visible}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.09)";
              e.currentTarget.style.color = "#F4EFE7";
              e.currentTarget.style.borderColor = "rgba(217,138,76,0.3)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "rgba(244,239,231,0.75)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <p.Icon size={14} />
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Input bar ── */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => { showChips(); inputRef.current?.focus(); }}
        style={{
        position: "relative", overflow: "hidden",
        cursor: "text",
        display: "flex", alignItems: "center", gap: 12,
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: hovered || focused || input
          ? "1px solid rgba(217,138,76,0.45)"
          : "1px solid rgba(255,255,255,0.09)",
        borderRadius: 16, padding: "16px 16px 16px 22px",
        animation: shaking
          ? "shake 0.36s cubic-bezier(0.36,0.07,0.19,0.97)"
          : (!hovered && !focused && !input ? "breathe 3s ease-in-out infinite" : "none"),
        boxShadow: hovered || focused || input
          ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 2px rgba(217,138,76,0.08)"
          : "0 8px 32px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
      }}>
        <input
          value={input || ""}
          placeholder="Ask PK-1 anything…"
          onChange={(e) => {
            const next = e.target.value;
            // Deletions are allowed so a filled-in suggestion can be cleared;
            // anything that adds characters still gets rejected.
            if (next.length < input.length && (input.startsWith(next) || input.endsWith(next))) {
              setInput(next);
            } else {
              rejectTyping();
            }
          }}
          onPaste={(e) => { e.preventDefault(); rejectTyping(); }}
          ref={inputRef}
          onFocus={() => { setFocused(true); showChips(); }}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            const PASS = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Home", "End", "Tab"];
            if (PASS.includes(e.key) || e.metaKey || e.ctrlKey || e.altKey) return;
            e.preventDefault();
            rejectTyping();
          }}
          style={{
            flex: 1, fontSize: 15, zIndex: 2,
            color: input ? "#F4EFE7" : "rgba(244,239,231,0.32)",
            fontFamily: "'Inter', sans-serif",
            background: "transparent", border: "none", outline: "none",
            cursor: "text", caretColor: "rgba(217,138,76,0.8)",
          }}
        />

        <Paperclip size={17} color="rgba(244,239,231,0.32)" style={{ flexShrink: 0, zIndex: 2 }} />

        <button
          style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "none", cursor: "pointer", flexShrink: 0, zIndex: 2,
            background: input ? "#D98A4C" : "rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s ease, transform 0.12s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          <ArrowUp size={16} color={input ? "#1A1108" : "rgba(244,239,231,0.32)"} strokeWidth={2.2} />
        </button>
      </div>

      <p style={{
        textAlign: "center", fontSize: 11,
        color: "rgba(244,239,231,0.28)", marginTop: 10,
        fontFamily: "'Inter', sans-serif",
      }}>
        PK-1 can make mistakes. Bugs found will be corrected.
      </p>
    </div>
  );
}

function HeroText() {
  return (
    <div style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 60px", position: "relative", zIndex: 10, marginTop: "0px",
    }}>
      <div style={{ maxWidth: 620 }}>

        {/* Welcome line */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 12.5, color: "rgba(244,239,231,0.5)",
          letterSpacing: "0.06em", textTransform: "uppercase",
          marginBottom: 10, fontFamily: "'Inter', sans-serif",
        }}>
          <Sparkles size={13} color="#D98A4C" />
          Welcome to prakash.dev/chat
        </div>

        {/* PK-1 subtitle */}
        <p style={{
          fontSize: 14, color: "rgba(244,239,231,0.45)",
          fontFamily: "'Inter', sans-serif", fontWeight: 300,
          marginBottom: 20, letterSpacing: "0.01em",
        }}>
          Meet PK-1 — Prakash's personal AI portfolio assistant.
        </p>

        {/* Main headline with light effect */}
        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontStyle: "italic", fontWeight: 400,
          fontSize: 68, lineHeight: 1.04,
          letterSpacing: "-0.025em",
          // The background box is what background-clip:text paints into, so it
          // has to cover the descenders. Negative margin keeps layout unchanged.
          padding: "0.08em 0 0.22em",
          margin: "-0.08em 0 calc(28px - 0.22em)",
          overflow: "visible",
          backgroundImage: "linear-gradient(105deg, #FFFFFF 0%, #F7F2EA 45%, #F4EFE7 70%, #E8C99A 87%, #F0E2CB 97%, #F4EFE7 100%)",
          WebkitBackgroundClip: "text", backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          display: "inline-block", width: "fit-content",
        }}>
          Hey, I'm Prakash.
        </h1>

        {/* Bio */}
        <p style={{
          fontSize: 15.5, lineHeight: 1.75,
          color: "rgba(244,239,231,0.58)",
          fontFamily: "'Inter', sans-serif", fontWeight: 300,
          marginBottom: 10, maxWidth: 520,
        }}>
          I'm a final-year medical student and software developer — I build digital products, developer tools, and clean interfaces that solve real problems.
        </p>
        <p style={{
          fontSize: 15.5, lineHeight: 1.75,
          color: "rgba(244,239,231,0.45)",
          fontFamily: "'Inter', sans-serif", fontWeight: 300,
          maxWidth: 520,
        }}>
          Ask PK-1 anything about my work, or use the sidebar to explore directly.
        </p>

      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div style={{
      position: "relative", zIndex: 10,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 28px 0",
    }}>
      {/* Left — PK-1 chip */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        fontSize: 12, fontFamily: "'Inter', sans-serif",
        color: "rgba(244,239,231,0.45)",
      }}>
        <div style={{
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 20, padding: "4px 12px",
          fontSize: 12.5, fontWeight: 500,
          color: "rgba(244,239,231,0.85)",
        }}>
          PK-1
        </div>
        <span>v1.0</span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#D98A4C", display: "inline-block" }} />
        <span>Always building</span>
      </div>

      {/* Right — weather + location + icon */}
      <div style={{
        display: "flex", alignItems: "center", gap: 18,
        fontSize: 12.5, color: "rgba(244,239,231,0.55)",
        fontFamily: "'Inter', sans-serif",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Sparkles size={13} color="#D98A4C" />
          28°C
        </span>
        <span>Kingston, JM</span>
        <div style={{
          display: "flex", alignItems: "center", gap: 3,
          opacity: 0.5,
        }}>
          <div style={{ width: 2, height: 10, background: "rgba(244,239,231,0.8)", borderRadius: 2 }} />
          <div style={{ width: 2, height: 14, background: "rgba(244,239,231,0.8)", borderRadius: 2 }} />
          <div style={{ width: 2, height: 8, background: "rgba(244,239,231,0.8)", borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFading(true), 1800);
    const done  = setTimeout(() => onDone(), 2400);
    return () => { clearTimeout(timer); clearTimeout(done); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #C4622D 0%, #E8943A 40%, #D97B2A 70%, #B85520 100%)",
      opacity: fading ? 0 : 1,
      transition: "opacity 0.6s ease",
      pointerEvents: fading ? "none" : "all",
    }}>
      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 20,
      }}>
        <Sparkles size={32} color="#000" strokeWidth={1.5} />
      </div>

      {/* Powered by text */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 12, fontWeight: 400,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: "rgba(0,0,0,0.5)",
      }}>
        Powered by PK-1 AI
      </p>
    </div>
  );
}
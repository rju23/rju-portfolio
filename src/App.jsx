import { useState, useEffect, useRef } from "react";
import { MessageSquare, Code2, User, Grid3x3, Mail, ChevronDown, ChevronRight, Paperclip, ArrowUp, Sparkles, Target, FlaskConical, Gamepad2, ScrollText } from "lucide-react";
const BORDER   = "rgba(255,255,255,0.07)";
const TEXT     = "#F4EFE7";
const TEXT_DIM = "rgba(244,239,231,0.58)";
const TEXT_MUTE= "rgba(244,239,231,0.32)";
const ACCENT   = "#D98A4C";

const NAV = [
  { id: "chat",        label: "Chat",        Icon: MessageSquare },
  { id: "projects",    label: "Projects",    Icon: Code2         },
  { id: "about",       label: "About",       Icon: User          },
  { id: "services",    label: "Services",    Icon: Grid3x3       },
  { id: "contact",     label: "Contact",     Icon: Mail          },
  { id: "experiments", label: "Experiments", Icon: FlaskConical  },
  { id: "playground",  label: "Playground",  Icon: Gamepad2      },
  { id: "buildlog",    label: "Build Log",   Icon: ScrollText    },
];

export default function App() {
  const [section, setSection] = useState(
    () => window.location.pathname.replace(/^\//, "") || "chat"
  );
  const [splash, setSplash]   = useState(true);

  const navigateTo = (id) => {
    setSection(id);
    const path = id === "chat" ? "/" : `/${id}`;
    if (window.location.pathname !== path) {
      window.history.pushState({ pk1Section: id }, "", path);
    }
  };

  // Keep section in sync when the browser's own back/forward is used
  useEffect(() => {
    const onPopState = () => {
      const id = window.location.pathname.replace(/^\//, "") || "chat";
      setSection(id);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;1,400;1,500&family=Inter:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  console.log("current section:", section);
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
         position: "relative",
         background: "rgba(200,200,210,0.06)",
         backdropFilter: "blur(2px)",
         WebkitBackdropFilter: "blur(2px)",
         border: `1px solid ${BORDER}`,
         borderRadius: 18,
         overflow: "hidden",
      }}>

        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", paddingBottom: 80 }}>
          {/* Brand */}
          <div style={{ padding: "28px 22px 22px" }}>
            <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.01em" }}>PK-1</div>
            <div style={{ fontSize: 11.5, color: TEXT_DIM, marginTop: 3 }}>
              Prakash's portfolio assistant.
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "4px 10px", overflowY: "auto", overflowX: "hidden" }}>
            {NAV.map(({ id, label, Icon }) => (
              <NavItem
                key={id} label={label} Icon={Icon}
                active={section === id}
                onClick={() => navigateTo(id)}
              />
            ))}
          </nav>

          {/* Online status */}
          <div style={{
            padding: "14px 22px",
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
        </div>

        {/* User */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "14px 18px 20px",
          background: "rgba(200,200,210,0.04)",
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
        </div>
      </aside>

      {section === "playground" && <PlaygroundView onBack={() => navigateTo("chat")} />}

      {/* ── Main ── */}
      <main style={{
        flex: 1, position: "relative", zIndex: 10,
        padding: "12px 12px 12px 0",
      }}>
        <div style={{ position: "absolute", top: 12, left: 0, right: 12, zIndex: 3 }}>
          <TopBar />
        </div>

        <div style={{
          position: "absolute", inset: "12px 12px 12px 0",
          display: "flex", alignItems: "center", justifyContent: "center",
          paddingBottom: section === "chat" ? 90 : 0,
          zIndex: 1, overflow: "auto",
        }}>
          {section === "chat"        && <HeroText />}
          {section === "projects"    && <SectionView title="Projects"    sub="A selection of things I've built." />}
          {section === "about"       && <SectionView title="About"       sub="A bit about me." />}
          {section === "services"    && <SectionView title="Services"    sub="What I can build for you." />}
          {section === "contact"     && <SectionView title="Contact"     sub="Get in touch." />}
          {section === "experiments" && <SectionView title="Experiments" sub="Things I built just to see if I could." />}
          {section === "buildlog"    && <SectionView title="Build Log"   sub="How things get built." />}
        </div>

        {section === "chat" && (
          <div style={{ position: "absolute", bottom: -10, left: 0, right: 12, zIndex: 4 }}>
            <InputBar onNavigate={setSection} />
          </div>
        )}
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
        outline: active ? "1px solid rgba(217,138,76,0.25)" : "none",
        textAlign: "left",
        transform: hovered ? "translateX(3px)" : "translateX(0)",
        boxShadow: hovered ? "0 0 12px rgba(217,138,76,0.15), inset 0 0 12px rgba(217,138,76,0.04)" : "none",
        transition: "background 0.15s ease, color 0.15s ease, transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <Icon
          size={15}
          strokeWidth={active ? 2 : 1.5}
          color={hovered || active ? "#D98A4C" : "currentColor"}
          style={{ transition: "color 0.2s ease", flexShrink: 0 }}
        />
      {label}
    </button>
  );
}

function InputBar() {
  const [input, setInput]       = useState("");
  const [hovered, setHovered]   = useState(false);
  const [visible, setVisible]   = useState(false);
  const [shaking, setShaking]   = useState(false);
  const [focused, setFocused]   = useState(false);
  const [everShown, setEverShown] = useState(false);
  const hideTimer               = useRef(null);
  const shakeTimer              = useRef(null);
  const inputRef                = useRef(null);
  const trackRef                = useRef(null);

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
    { label: "What have you built?",        Icon: Code2        },
    { label: "Tell me about Prakash",        Icon: User         },
    { label: "What can he build for me?",    Icon: Grid3x3      },
    { label: "What is Prakash working on?",  Icon: Code2        },
    { label: "Show me his experiments",      Icon: FlaskConical },
    { label: "Take me to the playground",    Icon: Gamepad2     },
    { label: "View the build log",           Icon: ScrollText   },
    { label: "How can I contact Prakash?",   Icon: Mail         },
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
        position: "relative",
        marginBottom: 6, minHeight: 44,
        opacity: everShown ? (visible ? 1 : 0) : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
      }}>
        <div
          ref={trackRef}
          onScroll={() => {
            const track = trackRef.current;
            if (!track) return;
            const setWidth = track.scrollWidth / 2;
            if (track.scrollLeft >= setWidth) {
              track.scrollLeft -= setWidth;
            }
          }}
          style={{
            display: "flex", gap: 10, flexWrap: "nowrap",
            overflowX: "auto", overflowY: "hidden",
            paddingTop: 6, paddingBottom: 4, paddingRight: 40,
            scrollbarWidth: "none", msOverflowStyle: "none",
            maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        >
          {[...PROMPTS, ...PROMPTS].map((p, i) => (
            <button
              key={i}
              onClick={() => { setInput(p.label); setVisible(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
                padding: "9px 16px", borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "rgba(244,239,231,0.75)",
                fontSize: 13, fontFamily: "'Inter', sans-serif",
                cursor: "pointer", whiteSpace: "nowrap",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.15s ease",
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

        <button
          onClick={() => {
            const track = trackRef.current;
            if (!track) return;
            track.scrollBy({ left: 220, behavior: "smooth" });
          }}
          tabIndex={visible ? 0 : -1}
          aria-hidden={!visible}
          style={{
            position: "absolute", right: 0, top: "6px", bottom: "4px",
            width: 40, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(to right, rgba(13,12,11,0) 0%, rgba(13,12,11,0.85) 55%)",
            color: "rgba(217,138,76,0.75)",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#D98A4C"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "rgba(217,138,76,0.75)"; }}
        >
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
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
          placeholder="Ask PK-1 what it knows about my work…"
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
        PK-1 can make mistakes. Verify important information.
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
          backgroundImage: "linear-gradient(105deg, #FFFFFF 0%, #FFFFFF 50%, #F9F2E3 57%, #F0DFBE 70%, #E8C58A 82%, #E0A85C 91%, #EFD9AF 98%, #F4EFE7 100%)",
          WebkitBackgroundClip: "text", backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          display: "inline-block", width: "fit-content",
        }}>
          Hey, I'm Prakash.
        </h1>

        {/* Bio */}
        <p style={{
          fontSize: 15.5, lineHeight: 2,
          color: "rgba(244,239,231,0.58)",
          fontFamily: "'Inter', sans-serif", fontWeight: 300,
          marginBottom: 10, maxWidth: 520,
        }}>
          I'm a{" "}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.2)",
            borderRadius: 6, padding: "1px 8px",
            color: "rgba(134,239,172,0.9)",
            fontSize: 14.5,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20" />
              <path d="M9 5c0-1.5 6-1.5 6 0s-6 3-6 4.5 6 1.5 6 3-6 3-6 4.5 6 1.5 6 3" />
            </svg>
            final-year medical student
          </span>
          {" "}and{" "}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: 6, padding: "1px 8px",
            color: "rgba(165,180,252,0.9)",
            fontSize: 14.5,
          }}>
            <span style={{ fontSize: 12 }}>⌨</span>
            software developer
          </span>
          {" "}— I build apps, websites and other useful tools with clean interfaces to solve real problems.
        </p>
        <p style={{
          fontSize: 15.5, lineHeight: 1.75,
          color: "rgba(244,239,231,0.45)",
          fontFamily: "'Inter', sans-serif", fontWeight: 300,
          maxWidth: 520,
        }}>
          Ask PK-1 what it knows about my work, or use the side menu to explore directly.
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
        fontSize: 15, fontWeight: 400,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: "rgba(0,0,0,0.5)",
      }}>
        Powered by PK-1 AI
      </p>

      <p style={{
          position: "absolute", bottom: 28,
          fontFamily: "'Inter', sans-serif",
          fontSize: 11, fontWeight: 400,
          letterSpacing: "0.08em",
          color: "rgba(0,0,0,0.35)",
        }}>
          not a real AI
        </p>
      </div>
  );
}

function SectionView({ title, sub }) {
  return (
    <div style={{ padding: "0 48px", maxWidth: 780, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT }} />
        <h2 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 34, fontWeight: 400, color: TEXT, margin: 0 }}>
          {title}
        </h2>
      </div>
      <p style={{ fontSize: 13.5, color: TEXT_DIM, margin: "0 0 36px 17px" }}>{sub}</p>
      <div style={{
        border: `1px dashed ${BORDER}`, borderRadius: 14, minHeight: 260,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 10, color: TEXT_MUTE,
        background: "rgba(255,255,255,0.02)",
      }}>
        <span style={{ fontSize: 13 }}>Content coming soon.</span>
      </div>
    </div>
  );
}

function PlaygroundView({ onBack }) {
  const [active, setActive] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const experiments = [
    {
      id: "3d-cube",
      label: "PLAYGROUND",
      title: "Interactive 3D Cube",
      description: "A Three.js experiment — orbit, move and customise a 3D cube in different environments.",
      src: "/playground/3d-cube/index.html",
    },
  ];

  const openExperiment = (exp) => {
    setActive(exp);
    setLoaded(false);
    window.history.pushState({ pk1Playground: exp.id }, "", "");
  };

  const closeExperiment = () => {
    setActive(null);
    setLoaded(false);
  };

  // Browser back button closes the experiment instead of leaving the site
  useEffect(() => {
    const onPopState = () => {
      if (active) closeExperiment();
      else onBack();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [active]);

  if (active) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#000" }}>
        {!loaded && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 10,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #C4622D 0%, #E8943A 40%, #D97B2A 70%, #B85520 100%)",
          }}>
            <Sparkles size={32} color="#000" strokeWidth={1.5} />
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15, fontWeight: 400,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(0,0,0,0.5)", marginTop: 20,
            }}>
              Loading Playground…
            </p>
          </div>
        )}

        <iframe
          src={active.src}
          onLoad={() => setLoaded(true)}
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          title={active.title}
        />
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#0D0C0B", overflow: "auto" }}>
      <div style={{ padding: "48px 48px 32px", maxWidth: 780, margin: "0 auto" }}>
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
            color: "#F4EFE7", fontSize: 12.5, padding: "6px 14px",
            cursor: "pointer", fontFamily: "'Inter', sans-serif",
            marginBottom: 28,
          }}
        >
          ← Back to Chat
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT }} />
          <h2 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 34, fontWeight: 400, color: TEXT, margin: 0 }}>
            Playground
          </h2>
        </div>
        <p style={{ fontSize: 13.5, color: TEXT_DIM, margin: "0 0 32px 17px" }}>
          Things you can interact with.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {experiments.map(exp => (
            <button
              key={exp.id}
              onClick={() => openExperiment(exp)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start",
                padding: "20px 24px", borderRadius: 12, cursor: "pointer",
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.07)",
                textAlign: "left", fontFamily: "'Inter', sans-serif",
                transition: "background 0.15s ease, border-color 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(217,138,76,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.035)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
              <div style={{ fontSize: 10.5, color: ACCENT, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                {exp.label}
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, color: TEXT, marginBottom: 6 }}>{exp.title}</div>
              <div style={{ fontSize: 13, color: TEXT_DIM }}>{exp.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
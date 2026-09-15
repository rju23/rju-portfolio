import { useState, useEffect, useRef, Fragment } from "react";
import { createPortal } from "react-dom";
import emailjs from "@emailjs/browser";
import { MessageSquare, Code2, User, Grid3x3, Mail, ChevronDown, ChevronRight, Paperclip, ArrowUp, Sparkles, Target, FlaskConical, Gamepad2, ScrollText, Smartphone, Globe, Monitor, Stethoscope, IdCard, Wrench, ArrowRight, MapPin, Clock, Link2, Users, Check, AlertCircle, ShoppingCart, Pause, RefreshCw, Zap, WifiOff, Tag, Megaphone, Archive, Trophy, Timer, RotateCcw, Image, Music, Menu, X, Plus } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
const BORDER   = "rgba(255,255,255,0.07)";
const TEXT     = "#F4EFE7";
const TEXT_DIM = "rgba(244,239,231,0.58)";
const TEXT_MUTE= "rgba(244,239,231,0.32)";
const ACCENT   = "#D98A4C";

function openLightbox(src) {
  window.dispatchEvent(new CustomEvent("rv-lightbox", { detail: src }));
}

function Lightbox() {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const onOpen = (e) => setSrc(e.detail);
    window.addEventListener("rv-lightbox", onOpen);
    return () => window.removeEventListener("rv-lightbox", onOpen);
  }, []);

  useEffect(() => {
    if (!src) return;
    const onKey = (e) => { if (e.key === "Escape") setSrc(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src]);

  if (!src) return null;

  return (
    <div
      onClick={() => setSrc(null)}
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 32, cursor: "zoom-out",
      }}
    >
      <img
        src={src}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "100%", maxHeight: "100%",
          objectFit: "contain",
          borderRadius: 8,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          cursor: "default",
        }}
      />
    </div>
  );
}

const NAV = [
  { id: "chat",        label: "Chat",        Icon: MessageSquare },
  { id: "projects",    label: "Projects",    Icon: Code2         },
  { id: "about",       label: "About",       Icon: User          },
  { id: "services",    label: "Services",    Icon: Grid3x3       },
  { id: "contact",     label: "Contact",     Icon: Mail          },
  { id: "playground",  label: "Playground",  Icon: Gamepad2      },
  { id: "comingsoon",  label: "Coming Soon", Icon: Sparkles      },
];

export default function App() {
  const [section, setSection] = useState(
    () => {
      const path = window.location.pathname.replace(/^\//, "") || "chat";
      const valid = ["chat","projects","about","services","contact","playground","comingsoon"];
      return valid.includes(path) ? path : "chat";
    }
  );
  const [splash, setSplash]   = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navigateTo = (id) => {
    setSection(id);
    setMobileNavOpen(false);
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

  useEffect(() => {
    const redirect = sessionStorage.getItem("pk1_redirect");
    if (redirect) {
      sessionStorage.removeItem("pk1_redirect");
      const id = redirect.replace(/^\//, "") || "chat";
      const validSections = ["chat","projects","about","services","contact","playground","comingsoon"];
      if (validSections.includes(id)) {
        setSection(id);
        window.history.replaceState({ pk1Section: id }, "", "/rju-portfolio/" + (id === "chat" ? "" : id));
      }
    }
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
      <Lightbox />
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

      {/* ── Mobile hamburger button ── */}
      {!splash && (
        <button
          className="pk1-hamburger-btn"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation menu"
          style={{
            display: "none",
            position: "absolute", top: 22, left: 22, zIndex: 30,
            alignItems: "center", justifyContent: "center",
            background: "none", border: "none",
            padding: 0, color: TEXT, cursor: "pointer",
          }}
        >
          <Menu size={22} strokeWidth={2} />
        </button>
      )}

      {/* ── Mobile sidebar backdrop ── */}
      <div
        className={`pk1-sidebar-backdrop ${mobileNavOpen ? "pk1-sidebar-backdrop-open" : ""}`}
        onClick={() => setMobileNavOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside className={`pk1-sidebar ${mobileNavOpen ? "pk1-sidebar-open" : ""}`} style={{
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
        <button
          className="pk1-sidebar-close-btn"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation menu"
          style={{
            display: "none",
            position: "absolute", top: 14, right: 14, zIndex: 5,
            width: 30, height: 30, borderRadius: 8,
            alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.06)",
            border: `1px solid ${BORDER}`,
            color: TEXT, cursor: "pointer",
          }}
        >
          <X size={16} strokeWidth={2} />
        </button>

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
      <main className="pk1-main" style={{
        flex: 1, position: "relative", zIndex: 10,
        padding: "12px 12px 12px 0",
      }}>
        <div className="pk1-topbar-wrap" style={{ position: "absolute", top: 12, left: 0, right: 12, zIndex: 3 }}>
          <TopBar />
        </div>

        <div className={`pk1-scroll ${section === "chat" ? "pk1-scroll-chat" : ""}`} style={{
          position: "absolute",
          top: section === "chat" ? 12 : 84,
          left: 0, right: 12, bottom: 12,
          display: "flex", flexDirection: "column",
          alignItems: "stretch",
          justifyContent: section === "chat" ? "center" : "flex-start",
          paddingBottom: section === "chat" ? 90 : 40,
          zIndex: 1, overflowY: "auto", overflowX: "hidden",
        }}>
          {section === "chat"        && <HeroText />}
          {section === "projects"    && <ProjectsView onNavigate={navigateTo} />}
          {section === "about"       && <AboutView />}
          {section === "services"    && <ServicesView onNavigate={navigateTo} />}
          {section === "contact"     && <ContactView />}
          {section === "comingsoon" && <ComingSoonView />}
        </div>

        {section === "chat" && (
          <div className="pk1-inputbar-outer" style={{ position: "absolute", bottom: -10, left: 0, right: 12, zIndex: 4 }}>
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

function InputBar({ onNavigate }) {
  const [input, setInput]       = useState("");
  const [hovered, setHovered]   = useState(false);
  const [visible, setVisible]   = useState(false);
  const [shaking, setShaking]   = useState(false);
  const [focused, setFocused]   = useState(false);
  const [everShown, setEverShown] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);
  const hideTimer               = useRef(null);
  const shakeTimer              = useRef(null);
  const inputRef                = useRef(null);
  const trackRef                = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Show the chips, marking that they've entered at least once so the
  // exit animation never plays on first paint.
  const showChips = () => { setEverShown(true); setVisible(true); };

  // Nudge the bar and bounce the chips in - the input is a prop, not a real field.
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
    { label: "What's coming to PK-1?",       Icon: Sparkles     },
    { label: "Take me to the playground",    Icon: Gamepad2     },
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
      className="pk1-inputbar-wrap"
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
      {(() => {
        const textInputEl = (
          <input
            className="pk1-hero-input"
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
              flex: 1, minWidth: 0, fontSize: 15, zIndex: 2,
              width: "100%",
              color: input ? "#F4EFE7" : "rgba(244,239,231,0.32)",
              fontFamily: "'Inter', sans-serif",
              background: "transparent", border: "none", outline: "none",
              cursor: "text", caretColor: "rgba(217,138,76,0.8)",
              textOverflow: "ellipsis",
            }}
          />
        );

        const sendBtn = (
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
        );

        if (isMobile) {
          return (
            <div
              className="pk1-inputbar-mobile"
              onClick={() => { showChips(); inputRef.current?.focus(); }}
              style={{
                position: "relative", overflow: "hidden",
                cursor: "text",
                display: "flex", flexDirection: "column", gap: 10,
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: focused || input
                  ? "1px solid rgba(217,138,76,0.45)"
                  : "1px solid rgba(255,255,255,0.09)",
                borderRadius: 20, padding: "14px 16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                animation: shaking ? "shake 0.36s cubic-bezier(0.36,0.07,0.19,0.97)" : "none",
                transition: "box-shadow 0.4s ease, border-color 0.4s ease",
              }}
            >
              {/* Row 1 — text input only */}
              <div style={{ display: "flex", width: "100%" }}>
                {textInputEl}
              </div>

              {/* Row 2 — plus icon (left) · attach + send (right) */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                  aria-label="Add"
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    border: `1px solid ${BORDER}`, cursor: "pointer", flexShrink: 0,
                    background: "rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Plus size={16} color="rgba(244,239,231,0.6)" strokeWidth={2.2} />
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Paperclip size={17} color="rgba(244,239,231,0.32)" style={{ flexShrink: 0, zIndex: 2 }} />
                  {sendBtn}
                </div>
              </div>
            </div>
          );
        }

        return (
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
            {textInputEl}
            <Paperclip size={17} color="rgba(244,239,231,0.32)" style={{ flexShrink: 0, zIndex: 2 }} />
            {sendBtn}
          </div>
        );
      })()}

      <p style={{
        textAlign: "center", fontSize: 11,
        color: "rgba(244,239,231,0.28)", marginTop: 10,
        fontFamily: "'Inter', sans-serif",
      }}>
        PK-1 can make mistakes.{" "}
        <span
          onClick={() => onNavigate && onNavigate("contact")}
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          Contact
        </span>{" "}
        to verify important information.
      </p>
    </div>
  );
}

function HeroText() {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const medChip = (
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
  );

  const devChip = (
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
  );

  const headlineStyle = {
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
  };

  if (isMobile) {
    return (
      <div className="hero-outer" style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 60px", position: "relative", zIndex: 10, marginTop: "0px",
      }}>
        <div className="hero-welcome-top" style={{
          position: "fixed", top: 22, left: 0, right: 0, height: 22, zIndex: 30,
          display: "flex", alignItems: "center", justifyContent: "center",
          textAlign: "center",
          fontSize: 11, color: "rgba(244,239,231,0.5)",
          letterSpacing: "0.06em", textTransform: "uppercase",
          fontFamily: "'Inter', sans-serif",
        }}>
          Welcome to prakashsejwani.dev/chat
        </div>

        <div className="hero-inner" style={{ maxWidth: 620, textAlign: "center", marginTop: 64 }}>

          <img
            src="/favicon.svg"
            alt=""
            style={{ width: 40, height: 40, margin: "0 auto 16px", display: "block" }}
          />

          {/* Main headline with light effect */}
          <h1 className="hero-headline" style={{ ...headlineStyle, fontSize: 56 }}>
            Hey, I'm Prakash.
          </h1>

          {/* PK-1 subtitle */}
          <p className="hero-subtitle" style={{
            fontSize: 14, color: "rgba(244,239,231,0.45)",
            fontFamily: "'Inter', sans-serif", fontWeight: 300,
            marginBottom: 10, letterSpacing: "0.01em",
          }}>
            Meet PK-1 - Prakash's personal AI portfolio assistant.
          </p>

          <p className="hero-footer" style={{
            fontSize: 15.5, lineHeight: 1.75,
            color: "rgba(244,239,231,0.45)",
            fontFamily: "'Inter', sans-serif", fontWeight: 300,
            maxWidth: 520, margin: "0 auto",
          }}>
            Ask it what it knows about my work, or use the side menu to explore directly.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="hero-outer" style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 60px", position: "relative", zIndex: 10, marginTop: "0px",
    }}>
      <div className="hero-inner" style={{ maxWidth: 620 }}>

        {/* Welcome line */}
        <div className="hero-welcome" style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 12.5, color: "rgba(244,239,231,0.5)",
          letterSpacing: "0.06em", textTransform: "uppercase",
          marginBottom: 10, fontFamily: "'Inter', sans-serif",
        }}>
          <Sparkles size={13} color="#D98A4C" />
          Welcome to prakashsejwani.dev/chat
        </div>

        {/* PK-1 subtitle */}
        <p className="hero-subtitle" style={{
          fontSize: 14, color: "rgba(244,239,231,0.45)",
          fontFamily: "'Inter', sans-serif", fontWeight: 300,
          marginBottom: 20, letterSpacing: "0.01em",
        }}>
          Meet PK-1 - Prakash's personal AI portfolio assistant.
        </p>

        {/* Main headline with light effect */}
        <h1 className="hero-headline" style={headlineStyle}>
          Hey, I'm Prakash.
        </h1>

        {/* Bio */}
        <p className="hero-bio" style={{
          fontSize: 15.5, lineHeight: 2,
          color: "rgba(244,239,231,0.58)",
          fontFamily: "'Inter', sans-serif", fontWeight: 300,
          marginBottom: 10, maxWidth: 520,
        }}>
          I'm a{" "}
          {medChip}
          {" "}and{" "}
          {devChip}
          {" "}- I build apps, websites and other useful tools with clean interfaces to solve real problems.
        </p>
        <p className="hero-footer" style={{
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
      position: "relative", zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 28px 0",
    }}>
      {/* Left - PK-1 chip */}
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

      {/* Right - weather + location + icon */}
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

const STATUS_STYLES = {
  "Built":        { color: "#7FBF7F", background: "rgba(127,191,127,0.12)" },
  "In progress":  { color: ACCENT,    background: "rgba(217,138,76,0.14)"  },
  "Coming soon":  { color: TEXT_MUTE, background: "rgba(255,255,255,0.06)" },
};

const COMING_SOON_TABS = [
  {
    id: "experiments",
    label: "Experiments",
    Icon: FlaskConical,
    subtitle: "Things I built just to see if I could.",
    cards: [
      {
        tag: "Three.js · Medical",
        title: "Medical Visualizer",
        description: "Interactive visual representations of medical processes - SA node firing sequence, T1DM beta cell destruction, and more as I study.",
        status: "In progress",
      },
      {
        tag: "Audio · Canvas",
        title: "Music Visualizer",
        description: "A visualizer that reacts in real time to music being played.",
        status: "Built",
      },
      {
        tag: "Desktop · Electron",
        title: "Media Sync",
        description: "Sync two media players - pause one and the other immediately plays, and vice versa.",
        status: "Built",
      },
    ],
  },
  {
    id: "buildlog",
    label: "Build Log",
    Icon: ScrollText,
    subtitle: "How things get built.",
    cards: [
      {
        tag: "Coming soon",
        title: "Short entries. Real process.",
        description: "Build notes, decisions, what worked, what didn't - written as things happen, not after the fact.",
        status: "Coming soon",
      },
    ],
  },
];

function ComingSoonView() {
  const [activeTab, setActiveTab] = useState("experiments");
  const tab = COMING_SOON_TABS.find((t) => t.id === activeTab);
  const gridCols = tab.cards.length > 1 ? "repeat(auto-fit, minmax(300px, 1fr))" : "1fr";

  return (
    <div style={{ padding: "0 48px", maxWidth: 860, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <Sparkles size={18} color={ACCENT} strokeWidth={1.8} />
        <h2 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 34, fontWeight: 400, color: TEXT, margin: 0 }}>
          Coming Soon
        </h2>
      </div>
      <p style={{ fontSize: 13.5, color: TEXT_DIM, margin: "0 0 20px 17px" }}>
        A preview of what's next for PK-1.
      </p>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 12px", borderRadius: 999,
        background: "rgba(217,138,76,0.12)", border: "1px solid rgba(217,138,76,0.28)",
        color: ACCENT, fontSize: 11, letterSpacing: "0.04em",
        fontFamily: "'Inter', sans-serif", fontWeight: 500,
        marginBottom: 24, marginLeft: 17,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: ACCENT }} />
        In development
      </div>

      <div style={{
        display: "flex", gap: 4, marginLeft: 17, marginBottom: 24,
        borderBottom: `1px solid ${BORDER}`,
      }}>
        {COMING_SOON_TABS.map((t) => {
          const isActive = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "8px 14px", marginBottom: -1,
                background: "transparent", border: "none",
                borderBottom: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
                color: isActive ? TEXT : TEXT_DIM,
                fontSize: 13, fontFamily: "'Inter', sans-serif",
                fontWeight: isActive ? 500 : 400,
                cursor: "pointer",
              }}
            >
              <t.Icon size={14} strokeWidth={1.8} color={isActive ? ACCENT : "currentColor"} />
              {t.label}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 13.5, color: TEXT_DIM, margin: "0 0 20px 1px" }}>{tab.subtitle}</p>

      <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 14 }}>
        {tab.cards.map((card) => {
          const statusStyle = STATUS_STYLES[card.status] ?? STATUS_STYLES["Coming soon"];
          return (
            <div
              key={card.title}
              style={{
                padding: "22px 22px 20px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.035)",
                border: `1px solid ${BORDER}`,
                display: "flex", flexDirection: "column", gap: 10,
                cursor: "default",
              }}
            >
              <div style={{
                fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em",
                color: TEXT_MUTE, fontFamily: "'Inter', sans-serif", fontWeight: 500,
              }}>
                {card.tag}
              </div>

              <h3 style={{
                fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 400,
                fontSize: 19, color: TEXT, margin: 0,
              }}>
                {card.title}
              </h3>

              <p style={{ fontSize: 13, lineHeight: 1.65, color: TEXT_DIM, margin: "0 0 8px", flex: 1 }}>
                {card.description}
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span style={{
                  fontSize: 10.5, padding: "3px 9px", borderRadius: 999,
                  fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  letterSpacing: "0.02em",
                  color: statusStyle.color, background: statusStyle.background,
                }}>
                  {card.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PROJECTS = [
  { id: "876-revive",          title: "876 Revive & Drive",         tag: "Client Work",       description: "A Flutter car wash booking app with a full admin dashboard for managing bookings in real time.", platform: "Mobile" },
  { id: "scq-scoreboard",      title: "SCQ Scoreboard",             tag: "Personal · Selling", description: "A PC/Laptop desktop scoring app built for School's Challenge Quiz competitions. My first shipped product.", platform: "PC/Laptop" },
  { id: "uno-calculator",      title: "Uno Calculator",             tag: "Personal",           description: "A Flutter app that tracks and calculates Uno scores across multiple players and rounds.", platform: "Mobile" },
  { id: "client-management",   title: "Client Management System",   tag: "Personal Tool",      description: "A system I built for myself to manage clients, projects, contracts and follow-ups.", platform: "Web" },
  { id: "pk1-portfolio",       title: "PK-1 Portfolio",             tag: "Personal",           description: "This portfolio - an AI platform aesthetic built in React/Vite with a prompt-driven navigation system.", platform: "Web" },
  { id: "medical-visualizer",  title: "Medical Visualizer",         tag: "Experiment",         description: "Interactive Three.js visual representations of medical processes - SA node firing sequence, T1DM beta cell destruction.", platform: "Web" },
  { id: "music-visualizer",    title: "Music Visualizer",           tag: "Experiment",         description: "A real-time visualizer that reacts to music being played.", platform: "Web" },
  { id: "media-sync",          title: "Media Sync",                 tag: "Experiment",         description: "A desktop app that syncs two media players - pause one and the other immediately plays.", platform: "Desktop" },
  { id: "interactive-3d-cube", title: "Interactive 3D Cube",        tag: "Playground",         description: "A Three.js experiment - orbit, move and customise a 3D cube across different weather atmospheres.", platform: "Web" },
];

function ProjectsView({ onNavigate }) {
  const [activeProject, setActiveProject] = useState(null);

  const handleSelect = (project) => {
    setActiveProject(project.id);
  };

  return (
    <div style={{ padding: "0 48px", maxWidth: 980, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT }} />
        <h2 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 34, fontWeight: 400, color: TEXT, margin: 0 }}>
          Projects
        </h2>
      </div>
      <p style={{ fontSize: 13.5, color: TEXT_DIM, margin: "0 0 32px 17px" }}>Things I've built.</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 14,
      }}>
        {PROJECTS.map((project) => {
          const isActive = activeProject === project.id;
          const isRevive = project.id === "876-revive";
          const isScq = project.id === "scq-scoreboard";
          const isUno = project.id === "uno-calculator";
          const isPk1 = project.id === "pk1-portfolio";
          const isCm = project.id === "client-management";
          const isMed = project.id === "medical-visualizer";
          const isMusic = project.id === "music-visualizer";
          const isCube = project.id === "interactive-3d-cube";
          const isSync = project.id === "media-sync";

          const reviveDefaultBorder = "rgba(0,122,47,0.35)";
          const reviveHoverBorder = "rgba(0,122,47,0.7)";
          const scqDefaultBorder = "rgba(200,162,74,0.35)";
          const scqHoverBorder = "rgba(200,162,74,0.75)";
          const unoDefaultBorder = "rgba(227,38,58,0.35)";
          const unoHoverBorder = "rgba(227,38,58,0.7)";

          return (
            <div
              key={project.id}
              onClick={() => isCube ? onNavigate("playground") : handleSelect(project)}
              style={{
                position: "relative",
                overflow: (isMed || isMusic || isCube || isSync) ? "hidden" : "visible",
                padding: "20px 20px 18px",
                borderRadius: 12,
                background: isRevive
                  ? "#050F07"
                  : isScq
                  ? "radial-gradient(220px 140px at 30% -10%, rgba(240,200,74,0.22), transparent 65%), linear-gradient(160deg, #8a1420 0%, #5c0e18 55%, #2a0709 100%)"
                  : isUno
                  ? "radial-gradient(220px 140px at 80% -10%, rgba(245,196,0,0.25), transparent 60%), radial-gradient(200px 160px at 5% 115%, rgba(0,87,168,0.2), transparent 60%), linear-gradient(160deg, #4a0d14 0%, #29070b 55%, #170406 100%)"
                  : isCm
                  ? "#008080"
                  : isMed
                  ? "linear-gradient(135deg, #0a1628, #1a3a5c)"
                  : isMusic
                  ? "linear-gradient(135deg, #0b0b10, #1a0a2e)"
                  : isCube
                  ? "linear-gradient(135deg, #0a0908, #1a1510)"
                  : isSync
                  ? "linear-gradient(135deg, #0d0d1a, #1a1a2e)"
                  : "rgba(255,255,255,0.035)",
                ...(isRevive ? {
                  backgroundImage: "url('/images/grid.png')",
                  backgroundRepeat: "repeat",
                  backgroundSize: "480px",
                } : null),
                border: isRevive
                  ? `1px solid ${reviveDefaultBorder}`
                  : isScq
                  ? `1px solid ${scqDefaultBorder}`
                  : isUno
                  ? `1px solid ${unoDefaultBorder}`
                  : isCm
                  ? "2px solid #ffffff"
                  : isPk1
                  ? "1px solid rgba(217,138,76,0.2)"
                  : isMed
                  ? "1px solid rgba(100,160,255,0.25)"
                  : isMusic
                  ? "1px solid rgba(168,85,247,0.25)"
                  : isCube
                  ? "1px solid rgba(217,138,76,0.25)"
                  : isSync
                  ? "1px solid rgba(99,102,241,0.25)"
                  : (isActive ? "1px solid rgba(255,255,255,0.14)" : `1px solid ${BORDER}`),
                ...(isCm ? { borderRightColor: "#808080", borderBottomColor: "#808080" } : null),
                boxShadow: "none",
                display: "flex", flexDirection: "column", gap: 8,
                cursor: "pointer",
                transition: "transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = isUno ? "translateY(-4px)" : "translateY(-3px)";
                if (isRevive) {
                  e.currentTarget.style.borderColor = reviveHoverBorder;
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,122,47,0.15)";
                } else if (isScq) {
                  e.currentTarget.style.borderColor = scqHoverBorder;
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(200,162,74,0.18)";
                } else if (isUno) {
                  e.currentTarget.style.borderColor = unoHoverBorder;
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(227,38,58,0.22)";
                } else if (isCm) {
                  e.currentTarget.style.borderTopColor = "#808080";
                  e.currentTarget.style.borderLeftColor = "#808080";
                  e.currentTarget.style.borderRightColor = "#ffffff";
                  e.currentTarget.style.borderBottomColor = "#ffffff";
                  e.currentTarget.style.boxShadow = "inset 1px 1px 0 #808080";
                } else if (isPk1) {
                  e.currentTarget.style.borderColor = "rgba(217,138,76,0.5)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(217,138,76,0.1)";
                } else if (isMed) {
                  e.currentTarget.style.borderColor = "rgba(100,160,255,0.5)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(100,160,255,0.15)";
                } else if (isMusic) {
                  e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(168,85,247,0.15)";
                } else if (isCube) {
                  e.currentTarget.style.borderColor = "rgba(217,138,76,0.5)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(217,138,76,0.15)";
                } else if (isSync) {
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(99,102,241,0.15)";
                } else {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                }
                const link = e.currentTarget.querySelector("[data-view-link]");
                if (link) link.style.color = isRevive ? "#007A2F" : isScq ? "#f0c84a" : isUno ? "#F5C400" : isCm ? "#ffffff" : isPk1 ? ACCENT : isMed ? "rgba(100,160,255,0.8)" : isMusic ? "rgba(168,85,247,0.8)" : isCube ? "rgba(217,138,76,0.8)" : isSync ? "rgba(99,102,241,0.8)" : TEXT;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                if (isRevive) {
                  e.currentTarget.style.borderColor = reviveDefaultBorder;
                  e.currentTarget.style.boxShadow = "none";
                } else if (isScq) {
                  e.currentTarget.style.borderColor = scqDefaultBorder;
                  e.currentTarget.style.boxShadow = "none";
                } else if (isUno) {
                  e.currentTarget.style.borderColor = unoDefaultBorder;
                  e.currentTarget.style.boxShadow = "none";
                } else if (isCm) {
                  e.currentTarget.style.borderTopColor = "#ffffff";
                  e.currentTarget.style.borderLeftColor = "#ffffff";
                  e.currentTarget.style.borderRightColor = "#808080";
                  e.currentTarget.style.borderBottomColor = "#808080";
                  e.currentTarget.style.boxShadow = "none";
                } else if (isPk1) {
                  e.currentTarget.style.borderColor = "rgba(217,138,76,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                } else if (isMed) {
                  e.currentTarget.style.borderColor = "rgba(100,160,255,0.25)";
                  e.currentTarget.style.boxShadow = "none";
                } else if (isMusic) {
                  e.currentTarget.style.borderColor = "rgba(168,85,247,0.25)";
                  e.currentTarget.style.boxShadow = "none";
                } else if (isCube) {
                  e.currentTarget.style.borderColor = "rgba(217,138,76,0.25)";
                  e.currentTarget.style.boxShadow = "none";
                } else if (isSync) {
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
                  e.currentTarget.style.boxShadow = "none";
                } else {
                  e.currentTarget.style.borderColor = BORDER;
                }
                const link = e.currentTarget.querySelector("[data-view-link]");
                if (link) link.style.color = isRevive ? "#007A2F" : isScq ? "#c8a24a" : isUno ? "#F5C400" : isCm ? "#ffffff" : isPk1 ? ACCENT : isMed ? "rgba(100,160,255,0.8)" : isMusic ? "rgba(168,85,247,0.8)" : isCube ? "rgba(217,138,76,0.8)" : isSync ? "rgba(99,102,241,0.8)" : TEXT_MUTE;
              }}
            >
              <div style={{
                position: "absolute", top: 14, right: 16,
                fontSize: 10, padding: "3px 8px", borderRadius: isCm ? 0 : 999,
                color: isRevive ? "#007A2F" : isScq ? "#c8a24a" : isUno ? "#F5C400" : isCm ? "#ffffff" : isMed ? "rgba(100,160,255,0.8)" : isMusic ? "rgba(168,85,247,0.8)" : isCube ? "rgba(217,138,76,0.8)" : isSync ? "rgba(99,102,241,0.8)" : TEXT_MUTE,
                background: isRevive ? "rgba(0,122,47,0.1)" : isScq ? "rgba(200,162,74,0.12)" : isUno ? "rgba(245,196,0,0.12)" : isCm ? "rgba(255,255,255,0.1)" : isMed ? "rgba(100,160,255,0.1)" : isMusic ? "rgba(168,85,247,0.1)" : isCube ? "rgba(217,138,76,0.1)" : isSync ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.06)",
                border: isRevive ? "1px solid rgba(0,122,47,0.5)" : isScq ? "1px solid rgba(200,162,74,0.5)" : isUno ? "1px solid rgba(245,196,0,0.4)" : isCm ? "1px solid #ffffff" : isMed ? "1px solid rgba(100,160,255,0.35)" : isMusic ? "1px solid rgba(168,85,247,0.35)" : isCube ? "1px solid rgba(217,138,76,0.35)" : isSync ? "1px solid rgba(99,102,241,0.35)" : "none",
                fontFamily: "'Inter', sans-serif", fontWeight: 500,
                letterSpacing: "0.02em",
              }}>
                {project.platform}
              </div>

              <div style={{
                fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em",
                color: isRevive ? "#D4A017" : isScq ? "#2dd4bf" : isUno ? "#F5C400" : isCm ? "#ffffff" : isMed ? "rgba(100,160,255,0.8)" : isMusic ? "rgba(168,85,247,0.8)" : isCube ? "rgba(217,138,76,0.8)" : isSync ? "rgba(99,102,241,0.8)" : ACCENT, fontFamily: "'Inter', sans-serif", fontWeight: 500,
                paddingRight: 60,
              }}>
                {project.tag}
              </div>

              <h3 style={{
                fontFamily: isCm ? "'VT323', 'Fraunces', serif" : "'Fraunces', serif", fontStyle: isCm ? "normal" : "italic", fontWeight: isCm ? 700 : 400,
                fontSize: isCm ? 22 : 18, color: isRevive ? "#0A1F0D" : isScq ? "#f0c84a" : isUno ? "#fff" : isCm ? "#ffffff" : (isMed || isMusic || isCube || isSync) ? "#ffffff" : TEXT, margin: 0,
              }}>
                {project.title}
              </h3>

              <p style={{ fontSize: 13, lineHeight: 1.6, color: isRevive ? "rgba(10,31,13,0.68)" : isScq ? "rgba(255,255,255,0.6)" : isUno ? "rgba(255,255,255,0.62)" : isCm ? "rgba(255,255,255,0.75)" : isMed ? "rgba(255,255,255,0.65)" : isMusic ? "rgba(255,255,255,0.65)" : isCube ? "rgba(255,255,255,0.65)" : isSync ? "rgba(255,255,255,0.65)" : TEXT_DIM, margin: "0 0 6px", flex: 1 }}>
                {project.description}
              </p>

              <span
                data-view-link
                style={{
                  fontSize: 12, color: isRevive ? "#007A2F" : isScq ? "#c8a24a" : isUno ? "rgba(245,196,0,0.75)" : isCm ? "#ffffff" : isPk1 ? ACCENT : isMed ? "rgba(100,160,255,0.8)" : isMusic ? "rgba(168,85,247,0.8)" : isCube ? "rgba(217,138,76,0.8)" : isSync ? "rgba(99,102,241,0.8)" : TEXT_MUTE,
                  fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  transition: "color 0.18s ease",
                }}
              >
                View project →
              </span>

              {isMed && (
                <div
                  className="medvis-cell"
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: 28, height: 28,
                    pointerEvents: "none",
                  }}
                >
                  <svg
                    width="40" height="40" viewBox="0 0 40 40"
                    style={{ position: "absolute", top: -6, left: -6, overflow: "visible" }}
                  >
                    <g stroke="rgba(100,160,255,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none">
                      <path d="M29.9,29.9 L33.43,33.43 L31.31,35.55 M33.43,33.43 L35.55,31.31" />
                      <path d="M10.1,29.9 L6.57,33.43 L4.45,31.31 M6.57,33.43 L8.69,35.55" />
                      <path d="M10.1,10.1 L6.57,6.57 L8.69,4.45 M6.57,6.57 L4.45,8.69" />
                      <path d="M29.9,10.1 L33.43,6.57 L35.55,8.69 M33.43,6.57 L31.31,4.45" />
                    </g>
                  </svg>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    border: "2px solid rgba(100,160,255,0.5)",
                    background: "rgba(100,160,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(100,160,255,0.35)" }} />
                  </div>
                </div>
              )}

              {isMusic && (
                <div
                  style={{
                    position: "absolute", bottom: 14, right: 16,
                    display: "flex", alignItems: "flex-end", gap: 3,
                    height: 18, pointerEvents: "none",
                  }}
                >
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 4, borderRadius: 2, background: "#a855f7", opacity: 0.15,
                        animation: "audioBarsCard 1.2s ease-in-out infinite",
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {isSync && (
                <div
                  style={{
                    position: "absolute", bottom: 14, right: 16,
                    width: 36, height: 30, pointerEvents: "none",
                  }}
                >
                  <div style={{
                    position: "absolute", top: 0, left: 8,
                    width: 0, height: 0,
                    borderTop: "9px solid transparent",
                    borderBottom: "9px solid transparent",
                    borderLeft: "14px solid #6366f1",
                    opacity: 0.12,
                  }} />
                  <div style={{
                    position: "absolute", top: 10, left: 0,
                    width: 0, height: 0,
                    borderTop: "9px solid transparent",
                    borderBottom: "9px solid transparent",
                    borderLeft: "14px solid #6366f1",
                    opacity: 0.12,
                  }} />
                </div>
              )}

              {isCube && (
                <div
                  style={{
                    position: "absolute", bottom: 10, right: 14,
                    width: 44, height: 44, pointerEvents: "none",
                  }}
                >
                  {[
                    { size: 22, top: 10, left: 12, rotate: 12, delay: "0s" },
                    { size: 18, top: 0, left: 0, rotate: -18, delay: "0.4s" },
                    { size: 16, top: 18, left: -4, rotate: 32, delay: "0.8s" },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="cube-face-card"
                      style={{
                        position: "absolute",
                        top: f.top, left: f.left,
                        width: f.size, height: f.size,
                        border: "1px solid #D98A4C",
                        opacity: 0.12,
                        "--r": `${f.rotate}deg`,
                        animationDelay: f.delay,
                      }}
                    />
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {activeProject && (
        <ProjectShell
          projectId={activeProject}
          onBack={() => setActiveProject(null)}
          onNavigate={(section) => { setActiveProject(null); onNavigate(section); }}
        >
          {activeProject === "876-revive" ? (
            <ReviveProject onNextProject={() => setActiveProject("scq-scoreboard")} />
          ) : activeProject === "scq-scoreboard" ? (
            <ScoreboardProject onNextProject={() => setActiveProject("uno-calculator")} />
          ) : activeProject === "uno-calculator" ? (
            <UnoProject onNextProject={() => setActiveProject("client-management")} />
          ) : activeProject === "client-management" ? (
            <ClientManagerProject onNextProject={() => setActiveProject("pk1-portfolio")} />
          ) : activeProject === "pk1-portfolio" ? (
            <PortfolioProject
              onNextProject={() => setActiveProject("medical-visualizer")}
              onViewLiveSite={() => { setActiveProject(null); onNavigate("chat"); }}
            />
          ) : activeProject === "medical-visualizer" ? (
            <MedicalVisualizerProject />
          ) : activeProject === "music-visualizer" ? (
            <MusicVisualizerProject />
          ) : (
            <div style={{ color: "#F4EFE7", padding: 40 }}>
              Project experience coming soon for: {activeProject}
            </div>
          )}
        </ProjectShell>
      )}
    </div>
  );
}

const PROJECT_THEMES = {
  "876-revive":          { color: "#E85D26", label: "876 Revive & Drive" },
  "scq-scoreboard":      { color: "#2D6BE4", label: "SCQ Scoreboard" },
  "uno-calculator":      { color: "#E83B3B", label: "Uno Calculator" },
  "client-management":   { color: "#2DB57A", label: "Client Management" },
  "pk1-portfolio":       { color: "#D98A4C", label: "PK-1 Portfolio" },
  "medical-visualizer":  { color: "#26C4E8", label: "Medical Visualizer" },
  "music-visualizer":    { color: "#9B26E8", label: "Music Visualizer" },
  "media-sync":          { color: "#E8C426", label: "Media Sync" },
  "interactive-3d-cube": { color: "#4CE826", label: "Interactive 3D Cube" },
};

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function ProjectShell({ projectId, onBack, onNavigate, children }) {
  const theme = PROJECT_THEMES[projectId] ?? { color: ACCENT, label: projectId };
  const rgb = hexToRgb(theme.color);

  const hasOwnSplash = projectId === "876-revive" || projectId === "scq-scoreboard" || projectId === "uno-calculator" || projectId === "pk1-portfolio" || projectId === "client-management" || projectId === "medical-visualizer" || projectId === "music-visualizer";

  const [splashing, setSplashing] = useState(!hasOwnSplash);
  const [fading, setFading]       = useState(false);
  const [navOpen, setNavOpen]     = useState(false);

  useEffect(() => {
    if (hasOwnSplash) return;
    const fadeTimer = setTimeout(() => setFading(true), 1800);
    const doneTimer = setTimeout(() => setSplashing(false), 2300);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [hasOwnSplash]);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setNavOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const navButtonStyle = {
    width: "100%", textAlign: "left",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: 14,
    fontFamily: "'Inter', sans-serif", fontSize: 14,
    color: TEXT, cursor: "pointer",
    transition: "background 0.15s ease, border-color 0.15s ease",
  };

  return createPortal(
    <>
      {/* Layer 2 - project content */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "#0A0908",
        opacity: splashing ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}>
        {children}
      </div>

      {/* Layer 1 - splash */}
      {splashing && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: `radial-gradient(circle at 50% 45%, ${theme.color} 0%, #0A0908 75%)`,
          opacity: fading ? 0 : 1,
          transition: "opacity 0.5s ease",
          pointerEvents: fading ? "none" : "all",
        }}>
          <Sparkles size={48} color={theme.color} strokeWidth={1.5} />
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 400,
            fontSize: 22, color: "#fff", margin: "18px 0 8px",
          }}>
            {theme.label}
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12,
            color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em",
          }}>
            Loading...
          </p>
        </div>
      )}

      {/* Layer 3 - floating orb */}
      {!splashing && (
        <button
          onClick={() => setNavOpen(true)}
          style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 200,
            width: 44, height: 44, borderRadius: "50%",
            background: `${theme.color}E6`,
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            "--orb-color": rgb,
            animation: "orbPulse 3s ease-in-out infinite",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow = `0 0 20px 4px rgba(${rgb}, 0.5)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <Sparkles size={18} color="#fff" strokeWidth={1.8} />
        </button>
      )}

      {/* Navigation overlay */}
      {navOpen && (
        <div
          onClick={() => setNavOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 300,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "rgba(20,18,16,0.95)",
              borderRadius: 20, padding: 40,
              maxWidth: 400, width: "90%",
              display: "flex", flexDirection: "column", alignItems: "center",
              textAlign: "center",
              border: `1px solid rgba(${rgb},0.25)`,
            }}
          >
            <button
              onClick={() => setNavOpen(false)}
              aria-label="Close"
              style={{
                position: "absolute", top: 14, right: 16,
                background: "transparent", border: "none",
                color: TEXT_MUTE, fontSize: 20, lineHeight: 1,
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <Sparkles size={28} color={theme.color} strokeWidth={1.6} />

            <h3 style={{
              fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 400,
              fontSize: 22, color: TEXT, margin: "16px 0 6px",
            }}>
              Where to next?
            </h3>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13,
              color: TEXT_DIM, margin: "0 0 24px",
            }}>
              You're in {theme.label}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
              <button
                style={navButtonStyle}
                onClick={() => setNavOpen(false)}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = theme.color; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                Continue exploring
              </button>
              <button
                style={navButtonStyle}
                onClick={() => { setNavOpen(false); onBack(); }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = theme.color; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                Back to Projects
              </button>
              <button
                style={navButtonStyle}
                onClick={() => { setNavOpen(false); onNavigate("chat"); }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = theme.color; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                Go to Chat
              </button>
              <button
                style={navButtonStyle}
                onClick={() => { setNavOpen(false); onNavigate("contact"); }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = theme.color; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                Contact Prakash
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}

/* ============================== 876 Revive & Drive ============================== */

const RV = {
  bg: "#F5F4EC",
  grid: "url('/images/grid.png')",
  green: "#007A2F",
  darkGreen: "#005922",
  gold: "#D4A017",
  goldLight: "#FFE57F",
  ink: "#1A1A1A",
  inkDim: "rgba(26,26,26,0.55)",
  border: "rgba(0,122,47,0.2)",
  card: "rgba(255,255,255,0.7)",
};

const RV_SLIDES = [
  { src: "/images/slide-1.jpg", title: "Pick Your Services", subtitle: "Add-ons included" },
  { src: "/images/slide-2.jpg", title: "Set Your Location",  subtitle: "We come to you" },
  { src: "/images/slide-3.jpg", title: "Choose a Time",      subtitle: "Real-time availability" },
  { src: "/images/slide-4.jpg", title: "Review & Confirm",   subtitle: "WhatsApp handoff included" },
];

function PortfolioProject({ onNextProject, onViewLiveSite }) {
  const [splash, setSplash] = useState(true);

  return (
    <>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}

      <div style={{
        position: "fixed", inset: 0,
        background: "#0D0C0B",
        overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: splash ? 0 : 1,
        transition: "opacity 0.4s ease",
      }}>
        <img
          src="/bg.png"
          alt=""
          style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "108%", height: "108%",
            objectFit: "cover", objectPosition: "center",
            userSelect: "none", pointerEvents: "none",
          }}
        />

        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 70% 40% at 30% 60%, rgba(10,9,8,0.35) 0%, rgba(10,9,8,0) 100%),
            radial-gradient(ellipse 100% 30% at 50% 100%, rgba(10,9,8,0.6) 0%, rgba(10,9,8,0) 70%),
            linear-gradient(to right, rgba(10,9,8,0.55) 0%, rgba(10,9,8,0.1) 35%, rgba(10,9,8,0) 60%)
          `,
        }} />

        <div style={{
          position: "relative", zIndex: 1,
          width: "min(560px, 92vw)",
          background: "rgba(20,18,16,0.72)",
          border: `1px solid ${BORDER}`,
          borderRadius: 20,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          padding: "44px 40px",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}>
          <img
            src="/images/prakash.jpg"
            alt="Prakash Sejwani"
            style={{
              position: "absolute", bottom: -14, right: -14,
              width: 48, height: 48, borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${ACCENT}`,
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          />

          <Sparkles size={32} color={ACCENT} strokeWidth={1.5} />

          <h2 style={{
            fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 400,
            fontSize: 32, color: TEXT, margin: "18px 0 16px",
          }}>
            You're looking at it.
          </h2>

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.75, color: TEXT_DIM, margin: "0 0 14px" }}>
            This portfolio was designed and built entirely by me - from the atmospheric background and the floating sidebar, to the prompt-based navigation and every project page inside it.
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.75, color: TEXT_DIM, margin: "0 0 24px" }}>
            It is built with React and Vite, deployed on Vercel, and uses a real AI assistant (EmailJS for contact, iframe embeds for demos). No templates. No themes. Just ideas turned into code.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
            {["React", "Vite", "Vercel", "EmailJS"].map((t) => (
              <span key={t} style={{
                padding: "5px 14px", borderRadius: 999,
                border: "1px solid rgba(217,138,76,0.4)",
                color: ACCENT, fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 500,
              }}>
                {t}
              </span>
            ))}
          </div>

          <div style={{ width: "100%", height: 1, background: BORDER, marginBottom: 24 }} />

          <div style={{ display: "flex", gap: 12, width: "100%" }}>
            <button
              onClick={onViewLiveSite}
              style={{
                flex: 1, padding: "12px 0", borderRadius: 10,
                border: `1px solid ${BORDER}`, background: "transparent", color: TEXT,
                fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 13.5,
                cursor: "pointer",
              }}
            >
              View live site
            </button>
            <button
              onClick={onNextProject}
              style={{
                flex: 1, padding: "12px 0", borderRadius: 10,
                border: "none", background: ACCENT, color: "#1A1108",
                fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13.5,
                cursor: "pointer",
              }}
            >
              Next project →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function RvHeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((i) => (i + 1) % RV_SLIDES.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <div style={{
        position: "relative", width: "100%", aspectRatio: "9 / 19.5", maxHeight: 480,
        borderRadius: 12, overflow: "hidden",
        border: `1px solid ${RV.border}`,
        background: "#f5f4ec",
      }}>
        {RV_SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            style={{
              position: "absolute", inset: 0,
              opacity: i === active ? 1 : 0,
              transition: "opacity 400ms ease",
            }}
          >
            <img
              src={slide.src}
              alt={slide.title}
              onClick={() => openLightbox(slide.src)}
              style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block", background: "#f5f4ec", cursor: "zoom-in" }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.45) 100%)",
            }} />
            <div style={{ position: "absolute", left: 20, right: 20, bottom: 20 }}>
              <div style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: 22, color: "#fff" }}>
                {slide.title}
              </div>
              <div style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: 22, color: RV.gold }}>
                {slide.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
        {RV_SLIDES.map((slide, i) => (
          <span
            key={slide.src}
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i === active ? RV.green : "rgba(0,122,47,0.25)",
              transition: "background 300ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function RvSlideshow({ images, aspectRatio = "16 / 9", interval = 3500, style, fit = "contain" }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  return (
    <div>
      <div style={{
        position: "relative", width: "100%", aspectRatio,
        borderRadius: 12, overflow: "hidden",
        border: `1px solid ${RV.border}`,
        background: "rgba(0,122,47,0.06)",
        ...style,
      }}>
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            onClick={() => openLightbox(src)}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%", objectFit: fit, display: "block",
              opacity: i === active ? 1 : 0,
              cursor: "zoom-in",
              transition: "opacity 400ms ease",
            }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ))}
      </div>
      {images.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
          {images.map((src, i) => (
            <span
              key={src}
              style={{
                width: 8, height: 8, borderRadius: "50%",
                background: i === active ? RV.green : "rgba(0,122,47,0.25)",
                transition: "background 300ms ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RvReflection({ src, aspectRatio = "9 / 19", reflectionRatio = "9 / 7" }) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: reflectionRatio,
        overflow: "hidden",
        borderRadius: "0 0 12px 12px",
        marginTop: -1,
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.32), transparent 75%)",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.32), transparent 75%)",
        pointerEvents: "none",
      }}
    >
      <div style={{ width: "100%", aspectRatio, transform: "scaleY(-1)" }}>
        <img
          src={src}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>
    </div>
  );
}

function RvImagePlaceholder({ src, alt, style, label, fit = "cover" }) {
  return (
    <div
      style={{
        background: "rgba(0,122,47,0.06)",
        border: `1px solid ${RV.border}`,
        borderRadius: 12,
        overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
        ...style,
      }}
    >
      {label && (
        <span style={{
          position: "absolute", fontFamily: "'Roboto', sans-serif",
          fontSize: 12.5, color: RV.inkDim, textAlign: "center", padding: "0 16px",
        }}>
          {label}
        </span>
      )}
      <img
        src={src}
        alt={alt}
        onClick={() => openLightbox(src)}
        style={{ width: "100%", height: "100%", objectFit: fit, display: "block", position: "relative", zIndex: 1, cursor: "zoom-in" }}
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    </div>
  );
}

function RvPill({ children }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "6px 14px",
      borderRadius: 999,
      border: `1px solid rgba(0,122,47,0.4)`,
      color: RV.green,
      fontFamily: "'Roboto', sans-serif", fontSize: 12.5, fontWeight: 500,
      background: "rgba(0,122,47,0.05)",
    }}>
      {children}
    </span>
  );
}

function RvSectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 44 }}>
      {eyebrow && (
        <div style={{
          fontFamily: "'Roboto', sans-serif", fontSize: 12, fontWeight: 600,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: RV.green, marginBottom: 12,
        }}>
          {eyebrow}
        </div>
      )}
      <h2 style={{
        fontFamily: "'Roboto', sans-serif", fontWeight: 900,
        fontSize: 36, color: RV.ink, margin: 0,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          fontFamily: "'Roboto', sans-serif", fontSize: 14, color: RV.inkDim,
          marginTop: 12, maxWidth: 560, marginLeft: "auto", marginRight: "auto", lineHeight: 1.55,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

const RV_SCREENS = [
  { num: "01", name: "Home",     file: "screen-home.jpg",     desc: "Active booking status, balance, and one-tap booking" },
  { num: "02", name: "Services", file: "screen-services.jpg", desc: "Full catalog browsable by vehicle type and add-ons" },
  { num: "03", name: "Activity", file: "screen-activity.jpg", desc: "Booking history, cancellations, and payment status" },
  { num: "04", name: "Account",  file: "screen-account.jpg",  desc: "Saved vehicles, addresses, and preferences" },
];

const RV_STEPS = [
  { title: "Pick Services",     desc: "Choose services and add-ons. Cart persists across sessions." },
  { title: "Set Location",      desc: "Pin your address on a map or use a saved location." },
  { title: "Choose a Time",     desc: "Real-time availability based on driver schedules." },
  { title: "Review & Confirm",  desc: "Final summary. WhatsApp redirect. Terms." },
  { title: "WhatsApp Handoff",  desc: "Confirmation sent. Admin notified. Booking is live." },
];

const RV_FEATURES = [
  { Icon: Users,       title: "Guest and Account Booking", desc: "Guests book without an account. Logged-in users get saved details pre-filled. Both use the same booking flow." },
  { Icon: ShoppingCart, title: "Persistent Cart",           desc: "The cart survives logout and re-login. If an admin changes a price while a customer has it in their cart, the price updates automatically." },
  { Icon: Pause,        title: "Pause and Resume",          desc: "Step away mid-booking and pick up exactly where you left off. Requires an account." },
  { Icon: RefreshCw,    title: "Smart Time Refresh",        desc: "Slots refresh every 60 seconds. A 10-minute idle check catches stale selections before you confirm." },
  { Icon: Zap,          title: "Conflict Detection",        desc: "If two people try to book the same driver at the same second, only one gets it. The other retries automatically." },
  { Icon: WifiOff,      title: "Offline Fallback",          desc: "Booking drafts save locally when offline and sync when connection returns." },
];

const RV_GATES = [
  { name: "Operating hours", desc: "Is this time within business hours?" },
  { name: "Lead time",       desc: "Is there enough notice for a same-day booking?" },
  { name: "Blocked periods", desc: "Has the admin blocked this date or time range?" },
  { name: "Driver roster",   desc: "Is any driver actually scheduled to work today?" },
  { name: "Conflict check",  desc: "Does any driver have a gap big enough for this job?" },
  { name: "Load balancing",  desc: "Of the drivers available, who has the fewest jobs today?" },
  { name: "Atomic lock",     desc: "The slot is reserved in a single database transaction. If two bookings arrive at the same millisecond, only one wins. The other retries." },
];

const RV_RACE_CONDITIONS = [
  { title: "Two people tap Confirm at the exact same moment", problem: "Both see the slot as free.", solution: "A unique lock document means only one can write it - Firestore won't let both succeed." },
  { title: "The first attempt fails", problem: "The customer just gets an error.", solution: "The system quietly retries up to 3 times and suggests the next open slot if all fail." },
  { title: "All bookings pile onto one driver", problem: "One driver is overloaded while another sits idle.", solution: "The system counts each driver's bookings and always picks the one with the least - updated in the same transaction." },
  { title: "The admin needs to override the system", problem: "A driver finishing early can't be scheduled because the algorithm says occupied.", solution: "The admin can force a window open. Business rules like blackout dates and operating hours still apply." },
  { title: "A customer sits on the time picker for 10 minutes", problem: "The slot they chose may be gone by the time they confirm.", solution: "A quiet re-check runs in the background and flags the slot as stale before they submit." },
];

const RV_SETTINGS_TABS = [
  { Icon: Tag,          title: "Services",            desc: "Manage the full catalog. Set prices per vehicle type. Price changes reprice open customer carts in real time." },
  { Icon: Clock,         title: "Timing",               desc: "Set lead time, block dates, configure travel buffer. Changing the buffer re-checks all existing bookings before applying." },
  { Icon: Megaphone,     title: "Announcements",        desc: "Post banners to the app. The system auto-posts a fully booked banner when the day fills up and removes it when a slot opens." },
  { Icon: Smartphone,    title: "Guest Verification",   desc: "Toggle SMS verification for guest bookings. Phone number confirmed before any booking is created." },
  { Icon: Archive,       title: "Archives",             desc: "Past and cancelled bookings kept for records without cluttering the active view." },
  { Icon: FlaskConical,  title: "Testing Tools",        desc: "A full staging environment inside the production dashboard. Simulate a fully booked day, test scenarios, and run QA without touching real bookings." },
];

function RvSplash({ visible }) {
  const [phase, setPhase] = useState("start"); // start -> logo -> sweep -> tagline -> hold -> exit
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 20);
    const t2 = setTimeout(() => setPhase("sweep"), 20 + 800 + 300);
    const t3 = setTimeout(() => setPhase("tagline"), 20 + 800 + 300 + 750 + 150);
    const t4 = setTimeout(() => setExiting(true), 20 + 800 + 300 + 750 + 150 + 600 + 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="rv-splash-wrap"
      style={{
        position: "fixed", inset: 0, zIndex: 250,
        background: "#0A0A0A",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        opacity: exiting ? 0 : 1,
        transitionDuration: "0.5s",
      }}
    >
      <div
        className={`rv-splash-logo${phase !== "start" ? " rv-in" : ""}${phase === "sweep" || phase === "tagline" || phase === "hold" ? " rv-sweep" : ""}`}
        style={{
          width: "62%", maxWidth: 320, aspectRatio: "1 / 1",
          borderRadius: 18,
          background: "rgba(0,122,47,0.12)",
          border: `1px solid ${RV.border}`,
        }}
      >
        <img
          src="/images/logo.jpeg"
          alt="876 Revive & Drive"
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18, display: "block" }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>

      <div className={`rv-splash-tagline${phase === "tagline" || phase === "hold" ? " rv-in" : ""}`} style={{ marginTop: 24, textAlign: "center" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 26 }}>
          <span style={{
            background: "linear-gradient(90deg, #FFFFFF, #C0C0C0, #E8E8E8)",
            WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            876 Revive
          </span>
          <span style={{
            background: "linear-gradient(90deg, #D4A017, #FFE57F, #B8860B, #FFD700)",
            WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            {" "}& Drive
          </span>
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11,
          letterSpacing: "0.18em", color: "#007A2F", marginTop: 8,
        }}>
          MOBILE CAR WASH & VEHICLE DETAILING
        </div>
      </div>
    </div>
  );
}

function ReviveProject({ onNextProject }) {
  const [splashing, setSplashing] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplashing(false), 4700);
    return () => clearTimeout(t);
  }, []);

  const cardStyle = {
    background: RV.card,
    border: `1px solid ${RV.border}`,
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    borderTop: `3px solid ${RV.green}`,
    padding: 16,
  };

  return (
    <>
      <RvSplash visible={splashing} />

      <div
        className="pk1-scroll"
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: RV.bg,
          backgroundImage: RV.grid,
          backgroundSize: "480px",
          backgroundRepeat: "repeat",
          overflowY: "auto",
          fontFamily: "'Roboto', sans-serif", color: RV.ink,
          display: "flex", flexDirection: "column", gap: 48,
        }}
      >
        {/* HERO */}
        <section style={{ padding: "56px 24px 70px", maxWidth: 1100, margin: "0 auto" }}>
          <div className="rv-two-col" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <div style={{
                fontSize: 12, fontWeight: 600,
                letterSpacing: "0.14em", textTransform: "uppercase", color: RV.green, marginBottom: 18,
              }}>
                CLIENT WORK · MOBILE + WEB
              </div>
              <h1 style={{
                fontWeight: 900, fontSize: "clamp(30px, 4.2vw, 46px)", lineHeight: 1.2, margin: 0,
              }}>
                <span style={{ color: RV.ink }}>A car wash booking</span><br />
                <span style={{ color: RV.green }}>system that works.</span>
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: RV.inkDim, marginTop: 20, maxWidth: 480 }}>
                Built for 876 Revive & Drive - a mobile car wash business in Jamaica. One app for customers, one dashboard for the admin, connected in real time.
              </p>
              <div style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
                <a
                  href="https://github.com/rju23/Revive-and-drive-portfolio/releases/download/v1.0.0/app-release.apk"
                  style={{
                    padding: "13px 26px", borderRadius: 10, border: "none",
                    background: RV.green, color: "#fff", fontFamily: "'Roboto', sans-serif",
                    fontSize: 14, fontWeight: 500, cursor: "pointer", textDecoration: "none",
                    display: "inline-flex", alignItems: "center",
                  }}
                >
                  Download App
                </a>
                <a
                  href="https://pk-876rd-portfolio-demo.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "13px 26px", borderRadius: 10, background: "transparent",
                    border: `1px solid ${RV.green}`, color: RV.green, fontFamily: "'Roboto', sans-serif",
                    fontSize: 14, fontWeight: 500, cursor: "pointer", textDecoration: "none",
                    display: "inline-flex", alignItems: "center",
                  }}
                >
                  Try Dashboard
                </a>
              </div>
              <div style={{
                marginTop: 18, maxWidth: 480, padding: "14px 16px",
                borderRadius: 10, border: `1px solid ${RV.green}33`, background: `${RV.green}0d`,
                display: "flex", flexDirection: "column", gap: 8,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: RV.green,
                }}>
                  Demo Disclaimers
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.55, color: RV.inkDim, margin: 0 }}>
                  This is a snapshot of the client's actual app and dashboard, not the live version - it won't receive updates as their real product evolves. Since this demo was copied over from the client's project, a few things may be broken, but I did my best to keep the main features working.
                </p>
                <p style={{ fontSize: 12.5, lineHeight: 1.55, color: RV.inkDim, margin: 0 }}>
                  <span style={{ color: RV.ink, fontWeight: 600 }}>Dashboard login</span> - akashiedits100@gmail.com / kingboss1234
                </p>
                <p style={{ fontSize: 12.5, lineHeight: 1.55, color: RV.inkDim, margin: 0 }}>
                  <span style={{ color: RV.ink, fontWeight: 600 }}>Installing the APK</span> - since it's not on the Play Store, Mobile will show a warning ("Unknown app" / "Play Protect"). That's expected - tap "Install anyway" (or "More details" → "Install anyway") to proceed.
                </p>
                <p style={{ fontSize: 12.5, lineHeight: 1.55, color: RV.ink, fontWeight: 700, margin: 0 }}>
                  Heads up: on the booking screen's "select address" step, the map won't load properly - this replica wasn't set up with a Google Maps API key.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 26 }}>
                <RvPill>Flutter</RvPill>
                <RvPill>Firebase</RvPill>
                <RvPill>Mobile</RvPill>
                <RvPill>Web Dashboard</RvPill>
              </div>
            </div>

            <RvHeroSlideshow />
          </div>
        </section>

        {/* PROBLEM */}
        <section style={{ background: RV.darkGreen, padding: "63px 24px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <p style={{
              fontStyle: "italic", fontWeight: 300, fontSize: 21, lineHeight: 1.55,
              color: "#fff", margin: "0 0 22px",
            }}>
              "Before this app, bookings came in over WhatsApp and phone calls. No schedule. No way to know if a driver was free. A missed call was a missed booking."
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0 }}>
              876 Revive & Drive needed a complete system. Not just an app.
            </p>
          </div>
        </section>

        {/* THE APP */}
        <section style={{ padding: "70px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <RvSectionHeading title="The App" subtitle="Four screens. Everything a customer needs." />
          <div style={{
            display: "flex", flexWrap: "nowrap", gap: 28, overflowX: "auto",
          }}>
            {RV_SCREENS.map((s) => (
              <div key={s.name} style={{ display: "flex", flexDirection: "column", gap: 12, flex: "1 1 0", minWidth: 160 }}>
                <div>
                  <RvImagePlaceholder
                    src={`/images/${s.file}`}
                    alt={s.name}
                    style={{ aspectRatio: "9 / 19", width: "100%", background: RV.bg }}
                  >
                  </RvImagePlaceholder>
                  <div style={{ marginBottom: -70 }}>
                    <RvReflection src={`/images/${s.file}`} aspectRatio="9 / 19" reflectionRatio="9 / 6" />
                  </div>
                </div>
                <div style={{ position: "relative", height: "auto" }}>
                  <div style={{ fontWeight: 900, fontSize: 34, color: "rgba(0,122,47,0.15)", lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontWeight: 600, fontSize: 14.5, color: RV.green, marginTop: -6 }}>{s.name}</div>
                  <div style={{ fontSize: 12.5, color: RV.inkDim, lineHeight: 1.5, marginTop: 4 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOOKING FLOW */}
        <section style={{ padding: "28px 24px 70px", maxWidth: 1100, margin: "0 auto" }}>
          <RvSectionHeading title="How a booking works" />
          <div style={{
            display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 24, position: "relative",
          }}>
            {RV_STEPS.map((step, i) => (
              <div key={step.title} style={{
                flex: "1 1 170px", display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center", position: "relative", minWidth: 150,
              }}>
                {i < RV_STEPS.length - 1 && (
                  <div className="rv-step-line" style={{
                    position: "absolute", top: 18, left: "60%", width: "90%", height: 1,
                    background: RV.border,
                  }} />
                )}
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", background: RV.green,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 14, position: "relative", zIndex: 1,
                }}>
                  {i + 1}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: 12.5, color: RV.inkDim, lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURE SPOTLIGHT */}
        <section style={{ padding: "28px 24px 70px", maxWidth: 1100, margin: "0 auto" }}>
          <RvSectionHeading title="What makes it stand out" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {RV_FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} style={cardStyle}>
                <Icon size={24} color={RV.green} strokeWidth={1.8} style={{ marginBottom: 14 }} />
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 14, color: RV.inkDim, lineHeight: 1.55 }}>{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* BOOKING ALGORITHM */}
        <section style={{ padding: "28px 24px 77px", maxWidth: 1160, margin: "0 auto" }}>
          <div className="rv-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
            <div>
              <h2 style={{ fontWeight: 900, fontSize: 36, lineHeight: 1.3, margin: "0 0 18px" }}>
                Two layers of protection against double-bookings.
              </h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: RV.inkDim, marginBottom: 36 }}>
                When a booking comes in, the system temporarily blocks out a window around that slot while it waits for admin approval. Once the admin confirms and sets the real service time, the schedule adjusts to the exact duration. The longer that approval takes, the wider the temporary block sits - which is why fast approvals keep the schedule tight. The algorithm handles instant collisions automatically. The admin keeps the calendar accurate.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {RV_GATES.map((g, i) => (
                  <div key={g.name} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{
                      fontFamily: "monospace", color: RV.green,
                      fontSize: 15, fontWeight: 700, flexShrink: 0, width: 26,
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 4 }}>{g.name}</div>
                      <div style={{ fontSize: 13, color: RV.inkDim, lineHeight: 1.55 }}>{g.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 6 }}>
              {RV_RACE_CONDITIONS.map((rc) => (
                <div key={rc.title} style={cardStyle}>
                  <div style={{ fontWeight: 700, fontSize: 14.5, color: RV.gold, marginBottom: 8 }}>{rc.title}</div>
                  <div style={{ fontSize: 13, color: RV.inkDim, lineHeight: 1.55, marginBottom: 6 }}>
                    <strong style={{ color: RV.ink }}>Problem:</strong> {rc.problem}
                  </div>
                  <div style={{ fontSize: 13, color: RV.inkDim, lineHeight: 1.55 }}>
                    <strong style={{ color: RV.ink }}>Solution:</strong> {rc.solution}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DASHBOARD */}
        <section style={{ padding: "28px 24px 77px", maxWidth: 1100, margin: "0 auto" }}>
          <RvSectionHeading title="The Admin Dashboard" subtitle="Real-time control over every booking, driver, and setting." />

          <RvSlideshow
            images={["/images/dashboard-home1.png", "/images/dashboard-home2.png"]}
            aspectRatio="224 / 100"
            style={{ marginBottom: 12 }}
          />
          <p style={{ fontSize: 13, color: RV.inkDim, textAlign: "center", marginBottom: 48, marginTop: 12 }}>
            Live driver grid, booking stats, and override controls on one screen.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {RV_SETTINGS_TABS.map(({ Icon, title, desc }) => (
              <div key={title} style={{ ...cardStyle, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <Icon size={20} color={RV.green} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 13, color: RV.inkDim, lineHeight: 1.55 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OVERRIDE */}
        <section style={{ background: RV.darkGreen, padding: "63px 24px" }}>
          <div className="rv-two-col" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 48, alignItems: "start" }}>
            <div>
              <h2 style={{ fontWeight: 900, fontSize: 36, color: "#fff", margin: "0 0 10px" }}>The Override</h2>
              <div style={{ fontWeight: 500, fontSize: 15, color: RV.gold, marginBottom: 24 }}>
                When the algorithm says no, but administrator knows better.
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "rgba(255,255,255,0.75)", marginBottom: 18 }}>
                The system normally blocks a driver if their schedule shows a conflict. But sometimes a driver finishes early, or two stops can be back-to-back. The override lets the administrator force a window open.
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "rgba(255,255,255,0.75)", marginBottom: 28 }}>
                It only bypasses the occupancy check. Operating hours, blackout dates, lead time, and driver roster rules still apply. It is a narrow, auditable exception - not a way to break the system.
              </p>

              <div style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12, padding: 20,
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
              }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: RV.gold, marginBottom: 8 }}>
                    What it bypasses
                  </div>
                  <div style={{ fontSize: 13, color: "#fff" }}>Driver occupancy conflict</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                    What it does NOT bypass
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}>
                    Operating hours · Blackout dates · Lead time · Driver roster
                  </div>
                </div>
              </div>
            </div>

            <RvImagePlaceholder
              src="/images/dashboard-override.png"
              alt="Override screenshot"
              fit="cover"
              style={{ width: "100%", aspectRatio: "16 / 10", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
            />
          </div>
        </section>

        {/* REAL-TIME SYNC */}
        <section style={{ padding: "70px 24px 30px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <RvSectionHeading title="App and dashboard, always in sync." />
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
            <div style={{ ...cardStyle, flex: 1, textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Customer App</div>
              <div style={{ fontSize: 12.5, color: RV.inkDim }}>Booking confirmed</div>
            </div>
            <div style={{ position: "relative", flex: "0 0 100px", height: 4, background: RV.border, borderRadius: 2 }}>
              <div className="rv-sync-pulse" style={{
                position: "absolute", top: -3, width: 10, height: 10, borderRadius: "50%",
                background: RV.gold, boxShadow: `0 0 10px ${RV.gold}`,
              }} />
            </div>
            <div style={{ ...cardStyle, flex: 1, textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Admin Dashboard</div>
              <div style={{ fontSize: 12.5, color: RV.inkDim }}>Booking appears</div>
            </div>
          </div>
          <p style={{ fontSize: 13.5, color: RV.inkDim, lineHeight: 1.55 }}>
            The moment a customer confirms, it appears in the dashboard. Override a slot in the dashboard, it shows as available in the app. No refresh. No delay.
          </p>
        </section>

        {/* TECH STACK */}
        <section style={{ padding: "14px 24px 30px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <RvSectionHeading title="Built with" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {["Flutter", "Dart", "Firebase", "Firestore", "Cloud Functions", "FCM", "Google Maps", "React", "JavaScript"].map((t) => (
              <RvPill key={t}>{t}</RvPill>
            ))}
          </div>
        </section>

        {/* STATUS */}
        <section style={{ padding: "0 24px 70px", textAlign: "center" }}>
          <p style={{ fontSize: 15, color: RV.inkDim, maxWidth: 560, margin: "0 auto", lineHeight: 1.55 }}>
            Delivered and in use. Pending Play Store deployment. Driver app phase planned.
          </p>
        </section>

        {/* NEXT PROJECT */}
        <div
          onClick={onNextProject}
          style={{
            background: RV.darkGreen,
            padding: "20px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
            cursor: "pointer",
            fontSize: 14, color: "#fff",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.6)" }}>876 Revive & Drive</span>
          <span>Next · SCQ Scoreboard →</span>
        </div>
      </div>
    </>
  );
}

/* ============================== SCQ Scoreboard ============================== */

const SCQ = {
  maroonDeep: "#1a0508",
  maroon: "#3f0b11",
  maroonLight: "#7a101c",
  gold: "#c8a24a",
  goldBright: "#f0c84a",
  goldGlow: "rgba(200,162,74,0.4)",
  teal: "#2dd4bf",
  cpBg: "#0b0f14",
  cpSurface: "#0f172a",
  text: "rgba(255,255,255,0.92)",
  muted: "rgba(255,255,255,0.55)",
};

const SCQ_ROUNDS = {
  ALTERNATE: { label: "ALTERNATE", duration: 240, correct: 1, wrong: 0 },
  SPEED:     { label: "SPEED",     duration: 60,  correct: 1, wrong: 0 },
  BUZZER:    { label: "BUZZER",    duration: 240, correct: 2, wrong: -2 },
};

const SCQ_WHATSAPP = "https://wa.me/18763718377";
const SCQ_WIN_DOWNLOAD = "https://github.com/rju23/scq-scoreboard-updates/releases/download/v2.6.0/SCQ-Scoreboard-Setup-2.6.0.exe";
const SCQ_MAC_DOWNLOAD = "https://github.com/rju23/School-Challenge-Quiz-Scoreboard/releases/download/v2.6.8/SCQ.Scoreboard-2.6.0-arm64.dmg";

function useScqFonts() {
  useEffect(() => {
    if (document.getElementById("scq-fonts-link")) return;
    const link = document.createElement("link");
    link.id = "scq-fonts-link";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

function ScqSplash({ visible }) {
  const [phase, setPhase] = useState("start"); // start -> logo -> sweep -> tagline -> hold -> exit
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 20);
    const t2 = setTimeout(() => setPhase("sweep"), 20 + 800 + 300);
    const t3 = setTimeout(() => setPhase("tagline"), 20 + 800 + 300 + 750 + 150);
    const t4 = setTimeout(() => setExiting(true), 20 + 800 + 300 + 750 + 150 + 600 + 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="rv-splash-wrap"
      style={{
        position: "fixed", inset: 0, zIndex: 250,
        background: SCQ.maroonDeep,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        opacity: exiting ? 0 : 1,
        transitionDuration: "0.5s",
      }}
    >
      <div
        className={`rv-splash-logo${phase !== "start" ? " rv-in" : ""}${phase === "sweep" || phase === "tagline" || phase === "hold" ? " rv-sweep" : ""}`}
        style={{ width: 160, height: 160, borderRadius: 18 }}
      >
        <img
          src="/images/scq-logo.png"
          alt="SCQ Scoreboard"
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>

      <div className={`rv-splash-tagline${phase === "tagline" || phase === "hold" ? " rv-in" : ""}`} style={{ marginTop: 24, textAlign: "center" }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 22, color: SCQ.gold }}>
          SCQ Scoreboard
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 11,
          letterSpacing: "0.15em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)", marginTop: 8,
        }}>
          Competition-Grade Quiz Software
        </div>
      </div>
    </div>
  );
}

function ScoreboardDivider({ label }) {
  return (
    <div style={{
      background: "linear-gradient(90deg, #3f0b11, #7a101c, #3f0b11)",
      borderTop: "1px solid rgba(200,162,74,0.4)",
      borderBottom: "1px solid rgba(200,162,74,0.4)",
      padding: "10px 40px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 8,
    }}>
      <span style={{ color: "#c8a24a", fontFamily: "'Orbitron', sans-serif", fontSize: 11, letterSpacing: "0.2em" }}>
        ◆ {label}
      </span>
      <span style={{ color: "rgba(200,162,74,0.4)", fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.1em" }}>
        SCQ SCOREBOARD
      </span>
    </div>
  );
}

function ScqPill({ children, small }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: small ? "5px 12px" : "6px 16px", borderRadius: 999,
      border: `1px solid ${SCQ.gold}`, color: SCQ.gold,
      fontFamily: "'Inter', sans-serif", fontSize: small ? 11.5 : 12.5, fontWeight: 500,
      letterSpacing: "0.02em", whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function ScqSectionHeading({ title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 40 }}>
      <h2 style={{
        fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "clamp(22px, 3.2vw, 32px)",
        color: SCQ.gold, margin: 0,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: SCQ.muted,
          marginTop: 12, maxWidth: 620, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ScqDownloadButtons({ stacked }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: stacked ? "center" : "flex-start" }}>
        <a
          href={SCQ_WIN_DOWNLOAD}
          style={{
            padding: "14px 26px", borderRadius: 10, border: "none",
            background: SCQ.gold, color: SCQ.maroonDeep, textDecoration: "none",
            fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14,
            display: "inline-flex", alignItems: "center",
          }}
        >
          Download for PC/Laptop
        </a>
        <a
          href={SCQ_MAC_DOWNLOAD}
          style={{
            padding: "14px 26px", borderRadius: 10, background: "transparent",
            border: `1px solid ${SCQ.gold}`, color: SCQ.gold, textDecoration: "none",
            fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14,
            display: "inline-flex", alignItems: "center",
          }}
        >
          Download for macOS
        </a>
      </div>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 12, color: SCQ.muted,
        marginTop: 12, textAlign: stacked ? "center" : "left",
      }}>
        PC/Laptop includes automatic in-app updates · macOS updates via website download
      </p>
    </div>
  );
}

function ScqDemo() {
  const [demo, setDemo] = useState({
    started: false,
    teamA: "Team A",
    teamB: "Team B",
    scoreA: 0,
    scoreB: 0,
    round: "ALTERNATE",
    timeRemaining: 240,
    timerRunning: false,
    audioClips: [],
    audioPlaying: false,
    visualActive: false,
  });
  const [teamAInput, setTeamAInput] = useState("");
  const [teamBInput, setTeamBInput] = useState("");
  const [audioNameInput, setAudioNameInput] = useState("");
  const [flashA, setFlashA] = useState(false);
  const [flashB, setFlashB] = useState(false);
  const audioTimeoutRef = useRef(null);

  useEffect(() => {
    if (!demo.timerRunning) return;
    const interval = setInterval(() => {
      setDemo((d) => {
        if (d.timeRemaining <= 0) return { ...d, timerRunning: false };
        return { ...d, timeRemaining: d.timeRemaining - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [demo.timerRunning]);

  useEffect(() => {
    return () => { if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current); };
  }, []);

  const startDemo = () => {
    setDemo((d) => ({
      ...d,
      started: true,
      teamA: teamAInput.trim() || "Team A",
      teamB: teamBInput.trim() || "Team B",
    }));
  };

  const selectRound = (roundKey) => {
    setDemo((d) => ({
      ...d,
      round: roundKey,
      timeRemaining: SCQ_ROUNDS[roundKey].duration,
      timerRunning: false,
    }));
  };

  const applyScore = (team, result) => {
    const points = SCQ_ROUNDS[demo.round][result];
    setDemo((d) => ({
      ...d,
      [team === "A" ? "scoreA" : "scoreB"]: d[team === "A" ? "scoreA" : "scoreB"] + points,
    }));
    if (team === "A") { setFlashA(true); setTimeout(() => setFlashA(false), 350); }
    else { setFlashB(true); setTimeout(() => setFlashB(false), 350); }
  };

  const toggleTimer = (action) => {
    if (action === "start") setDemo((d) => ({ ...d, timerRunning: true }));
    if (action === "pause") setDemo((d) => ({ ...d, timerRunning: false }));
    if (action === "reset") setDemo((d) => ({ ...d, timerRunning: false, timeRemaining: SCQ_ROUNDS[d.round].duration }));
  };

  const resetScores = () => {
    setDemo((d) => ({ ...d, scoreA: 0, scoreB: 0 }));
  };

  const addAudioClip = () => {
    const name = audioNameInput.trim();
    if (!name) return;
    setDemo((d) => ({ ...d, audioClips: [...d.audioClips, name] }));
    setAudioNameInput("");
  };

  const playAudio = () => {
    setDemo((d) => ({ ...d, audioPlaying: true }));
    if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current);
    audioTimeoutRef.current = setTimeout(() => setDemo((d) => ({ ...d, audioPlaying: false })), 2200);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const cpButtonBase = {
    border: "none", borderRadius: 8, cursor: "pointer",
    fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12.5,
    padding: "8px 12px", color: "#fff",
  };

  if (!demo.started) {
    return (
      <div style={{
        maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column",
        alignItems: "center", gap: 18, padding: "24px 20px",
      }}>
        <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, color: SCQ.gold, margin: 0, textAlign: "center" }}>
          Run a match
        </h3>
        <div style={{ display: "flex", gap: 12, width: "100%", flexWrap: "wrap" }}>
          <input
            value={teamAInput}
            onChange={(e) => setTeamAInput(e.target.value)}
            placeholder="Team A"
            style={{
              flex: 1, minWidth: 140, padding: "12px 14px", borderRadius: 8,
              background: SCQ.cpBg, border: `1px solid rgba(255,255,255,0.12)`,
              color: SCQ.text, fontFamily: "'Inter', sans-serif", fontSize: 14, outline: "none",
            }}
            onFocus={(e) => { e.target.style.borderColor = SCQ.gold; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
          />
          <input
            value={teamBInput}
            onChange={(e) => setTeamBInput(e.target.value)}
            placeholder="Team B"
            style={{
              flex: 1, minWidth: 140, padding: "12px 14px", borderRadius: 8,
              background: SCQ.cpBg, border: `1px solid rgba(255,255,255,0.12)`,
              color: SCQ.text, fontFamily: "'Inter', sans-serif", fontSize: 14, outline: "none",
            }}
            onFocus={(e) => { e.target.style.borderColor = SCQ.gold; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
          />
        </div>
        <button
          onClick={startDemo}
          className="scq-cp-btn"
          style={{
            ...cpButtonBase, background: SCQ.gold, color: SCQ.maroonDeep,
            padding: "14px 38px", fontSize: 15, fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
          }}
        >
          Kick Off
        </button>
      </div>
    );
  }

  const roundMeta = SCQ_ROUNDS[demo.round];

  return (
    <>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        background: SCQ.cpBg, border: `1px solid ${SCQ.goldGlow}`, borderRadius: 999,
        padding: "8px 22px", maxWidth: 320, margin: "0 auto 8px",
      }}>
        <span className="scq-pulse-live" style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11.5, letterSpacing: "0.12em", color: SCQ.gold }}>
          MATCH IN PROGRESS
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
        <button
          onClick={resetScores}
          className="scq-cp-btn"
          style={{
            border: `1px solid ${SCQ.gold}`, borderRadius: 8, cursor: "pointer",
            fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12.5,
            padding: "8px 18px", color: SCQ.gold, background: "transparent",
          }}
        >
          Reset Scores
        </button>
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 0, flexWrap: "wrap", padding: "20px 12px 60px",
        overflowX: "auto", maxWidth: "100%",
      }}>
        {/* LEFT - Control Panel */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase", color: SCQ.muted,
          }}>
            PC Screen
          </span>
          <div style={{
            width: "clamp(300px, 34vw, 380px)",
            transform: "perspective(900px) rotateX(-4deg)",
            background: SCQ.cpBg, borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.55)",
            overflow: "hidden",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 14px", background: SCQ.cpSurface,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fb7185" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f0c84a" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2dd4bf" }} />
              <span style={{
                marginLeft: 8, fontFamily: "'Inter', sans-serif", fontSize: 11.5,
                color: SCQ.teal, fontWeight: 500,
              }}>
                Control Panel
              </span>
            </div>

            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Round selector */}
              <div style={{ display: "flex", gap: 8 }}>
                {Object.keys(SCQ_ROUNDS).map((key) => {
                  const active = demo.round === key;
                  return (
                    <button
                      key={key}
                      onClick={() => selectRound(key)}
                      className="scq-cp-btn"
                      style={{
                        ...cpButtonBase, flex: "1 1 0", minWidth: 0, padding: "8px 6px", fontSize: 11.5,
                        borderRadius: 999,
                        background: active ? SCQ.teal : "rgba(255,255,255,0.06)",
                        color: active ? "#0b0f14" : SCQ.text,
                      }}
                    >
                      {SCQ_ROUNDS[key].label}
                    </button>
                  );
                })}
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontFamily: "'Inter', sans-serif", fontSize: 10.5, color: SCQ.muted,
              }}>
                <span>(+1 / 0)</span>
                <span>(+1 / 0)</span>
                <span>(+2 / -2)</span>
              </div>

              {/* Score controls + timer */}
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)", gap: 8, alignItems: "center" }}>
                <div style={{ textAlign: "center", minWidth: 0 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: SCQ.teal, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {demo.teamA}
                  </div>
                  <div className={flashA ? "scq-score-flash" : ""} style={{
                    fontFamily: "'Orbitron', sans-serif", fontSize: 32, color: "#fff", margin: "4px 0",
                  }}>
                    {demo.scoreA}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
                    <button className="scq-cp-btn" onClick={() => applyScore("A", "correct")} style={{ ...cpButtonBase, background: SCQ.teal, color: "#0b0f14", padding: "6px 7px", fontSize: 10.5, whiteSpace: "nowrap" }}>✓ Correct</button>
                    <button className="scq-cp-btn" onClick={() => applyScore("A", "wrong")} style={{ ...cpButtonBase, background: "#fb7185", padding: "6px 7px", fontSize: 10.5, whiteSpace: "nowrap" }}>✗ Wrong</button>
                  </div>
                </div>

                <div style={{ textAlign: "center", minWidth: 0 }}>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 24, color: SCQ.gold }}>
                    {formatTime(demo.timeRemaining)}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 6, justifyContent: "center" }}>
                    <button className="scq-cp-btn" onClick={() => toggleTimer("start")} style={{ ...cpButtonBase, background: "rgba(255,255,255,0.08)", padding: "5px 7px", fontSize: 10, whiteSpace: "nowrap" }}>Start</button>
                    <button className="scq-cp-btn" onClick={() => toggleTimer("pause")} style={{ ...cpButtonBase, background: "rgba(255,255,255,0.08)", padding: "5px 7px", fontSize: 10, whiteSpace: "nowrap" }}>Pause</button>
                    <button className="scq-cp-btn" onClick={() => toggleTimer("reset")} style={{ ...cpButtonBase, background: "rgba(255,255,255,0.08)", padding: "5px 7px", fontSize: 10, whiteSpace: "nowrap" }}>Reset</button>
                  </div>
                </div>

                <div style={{ textAlign: "center", minWidth: 0 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: SCQ.teal, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {demo.teamB}
                  </div>
                  <div className={flashB ? "scq-score-flash" : ""} style={{
                    fontFamily: "'Orbitron', sans-serif", fontSize: 32, color: "#fff", margin: "4px 0",
                  }}>
                    {demo.scoreB}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
                    <button className="scq-cp-btn" onClick={() => applyScore("B", "correct")} style={{ ...cpButtonBase, background: SCQ.teal, color: "#0b0f14", padding: "6px 7px", fontSize: 10.5, whiteSpace: "nowrap" }}>✓ Correct</button>
                    <button className="scq-cp-btn" onClick={() => applyScore("B", "wrong")} style={{ ...cpButtonBase, background: "#fb7185", padding: "6px 7px", fontSize: 10.5, whiteSpace: "nowrap" }}>✗ Wrong</button>
                  </div>
                </div>
              </div>

              {/* Audio + Visual */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: SCQ.muted, marginBottom: 6 }}>Audio clips</div>
                  <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                    <input
                      value={audioNameInput}
                      onChange={(e) => setAudioNameInput(e.target.value)}
                      placeholder="Audio clip name"
                      style={{
                        flex: 1, minWidth: 0, padding: "6px 8px", borderRadius: 6,
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                        color: SCQ.text, fontFamily: "'Inter', sans-serif", fontSize: 11, outline: "none",
                      }}
                    />
                    <button className="scq-cp-btn" onClick={addAudioClip} style={{ ...cpButtonBase, background: "rgba(255,255,255,0.1)", padding: "6px 10px", fontSize: 10.5, whiteSpace: "nowrap" }}>Add Clip</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 70, overflowY: "auto" }}>
                    {demo.audioClips.map((clip, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, color: SCQ.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clip}</span>
                        <button
                          className="scq-cp-btn"
                          onClick={playAudio}
                          style={{
                            ...cpButtonBase, padding: "3px 8px", fontSize: 10,
                            background: demo.audioPlaying ? SCQ.teal : "rgba(45,212,191,0.25)",
                            color: demo.audioPlaying ? "#0b0f14" : SCQ.teal,
                            animation: demo.audioPlaying ? "scoreFlash 0.6s ease-in-out infinite" : "none",
                          }}
                        >
                          ▶ Play
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: SCQ.muted, marginBottom: 6 }}>Visual</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <button className="scq-cp-btn" onClick={() => setDemo((d) => ({ ...d, visualActive: true }))} style={{ ...cpButtonBase, background: "rgba(255,255,255,0.1)", padding: "6px 10px", fontSize: 10.5, whiteSpace: "nowrap" }}>Show Visual</button>
                    <button className="scq-cp-btn" onClick={() => setDemo((d) => ({ ...d, visualActive: false }))} style={{ ...cpButtonBase, background: "rgba(255,255,255,0.1)", padding: "6px 10px", fontSize: 10.5, whiteSpace: "nowrap" }}>Hide Visual</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HDMI line */}
        <div style={{
          width: 260, minWidth: 80, height: 2, background: "rgba(200,162,74,0.55)",
          position: "relative", alignSelf: "center", margin: "0 12px",
        }}>
          <span style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: SCQ.maroonDeep, padding: "2px 8px",
            fontFamily: "monospace", fontSize: 9, color: SCQ.gold, letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}>
            Likely HDMI Connection
          </span>
        </div>

        {/* RIGHT - Main Scoreboard */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase", color: SCQ.gold,
          }}>
            Second Screen
          </span>
          <div style={{
            width: "clamp(340px, 40vw, 480px)",
            transform: "perspective(900px) rotateX(4deg)",
            borderRadius: 14, border: `2px solid ${SCQ.gold}`,
            boxShadow: "0 26px 60px rgba(0,0,0,0.6)",
            position: "relative", overflow: "hidden",
            background: `radial-gradient(900px 300px at 50% 0%, rgba(200,162,74,0.22), transparent 60%), linear-gradient(180deg, ${SCQ.maroonLight}, ${SCQ.maroonDeep})`,
          }}>
            <div className="scq-broadcast-glow" style={{
              position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
              width: 300, height: 200, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(240,200,74,0.35), transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)", padding: "30px 18px 40px", gap: 12, alignItems: "center", position: "relative" }}>
              <div style={{ textAlign: "center", minWidth: 0 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{demo.teamA}</div>
                <div className={flashA ? "scq-score-flash" : ""} style={{
                  fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
                  fontSize: "clamp(2.4rem, 5vw, 3.6rem)", color: SCQ.goldBright,
                  textShadow: "0 0 20px rgba(240,200,74,0.6)",
                }}>
                  {demo.scoreA}
                </div>
              </div>

              <div style={{ textAlign: "center", minWidth: 0 }}>
                <div style={{
                  display: "inline-block", padding: "4px 14px", borderRadius: 999,
                  border: `1px solid ${SCQ.gold}`, color: SCQ.gold,
                  fontFamily: "'Inter', sans-serif", fontSize: 10.5, letterSpacing: "0.08em",
                  marginBottom: 10,
                }}>
                  {roundMeta.label}
                </div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, color: "#fff" }}>
                  {formatTime(demo.timeRemaining)}
                </div>
              </div>

              <div style={{ textAlign: "center", minWidth: 0 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{demo.teamB}</div>
                <div className={flashB ? "scq-score-flash" : ""} style={{
                  fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
                  fontSize: "clamp(2.4rem, 5vw, 3.6rem)", color: SCQ.goldBright,
                  textShadow: "0 0 20px rgba(240,200,74,0.6)",
                }}>
                  {demo.scoreB}
                </div>
              </div>
            </div>

            {demo.audioPlaying && (
              <div style={{
                position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
                display: "flex", gap: 4, alignItems: "flex-end", height: 20,
              }}>
                <span className="scq-audio-bar" style={{ animationDelay: "0s" }} />
                <span className="scq-audio-bar" style={{ animationDelay: "0.15s" }} />
                <span className="scq-audio-bar" style={{ animationDelay: "0.3s" }} />
              </div>
            )}

            {demo.visualActive && (
              <div style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <button
                  onClick={() => setDemo((d) => ({ ...d, visualActive: false }))}
                  style={{
                    position: "absolute", top: 12, right: 14, background: "transparent",
                    border: "none", color: SCQ.gold, fontSize: 18, cursor: "pointer",
                  }}
                  aria-label="Dismiss visual"
                >
                  ✕
                </button>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, color: SCQ.gold }}>
                  [ Visual Question ]
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const SCQ_FEATURE_ROWS = [
  { name: "Three Round Types", desc: "Alternate, Speed, Buzzer - each with correct timers and point values" },
  { name: "Dual Screen Sync", desc: "Control Panel + Main Scoreboard update instantly together" },
  { name: "Main Timer", desc: "Per-round countdown with start, pause, reset and hold-to-confirm" },
  { name: "Question Timer", desc: "Separate per-question countdown controllable from the panel" },
  { name: "Score Undo", desc: "Double-tap Shift to reverse the last scoring action" },
  { name: "Visual Questions", desc: "Push image questions to the audience screen from the control panel" },
  { name: "Audio Clips", desc: "Upload and play audio with hotkey support" },
  { name: "Junior and Senior Modes", desc: "Speed round adapts - 3 minutes for senior, 4 subjects for junior" },
  { name: "Query Adjustments", desc: "Retroactive point corrections with confirm modal" },
  { name: "Presenting Mode", desc: "Dedicated second-monitor layout for large venues" },
];

const SCQ_INSTALL_STEPS = [
  { title: "If this appears when downloading", img: "/images/scq-smartscreen-1.webp" },
  { title: "Click More Info", img: "/images/scq-smartscreen-2.webp" },
  { title: "Then click Run Anyway", img: "/images/scq-smartscreen-3.webp" },
];

function ScqPricingFeature({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      <span style={{ color: SCQ.gold, flexShrink: 0 }}>✓</span>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{children}</span>
    </div>
  );
}

function ScoreboardProject({ onNextProject }) {
  useScqFonts();
  const [splashing, setSplashing] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplashing(false), 4700);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <ScqSplash visible={splashing} />

      <div
        className="pk1-scroll"
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "linear-gradient(180deg, #7a101c 0%, #3f0b11 40%, #1a0508 100%)",
          overflowY: "auto",
          fontFamily: "'Inter', sans-serif", color: "#fff",
        }}
      >
        {/* SECTION 1 - HERO */}
        <section style={{
          minHeight: "100vh", display: "grid", gridTemplateColumns: "1.05fr 0.95fr",
          gap: 40, alignItems: "center", padding: "90px 48px 60px", maxWidth: 1200, margin: "0 auto",
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(0,0,0,0.35)", borderRadius: 999, padding: "6px 14px",
              marginBottom: 22,
            }}>
              <span className="scq-pulse-live" style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.08em", color: "#fff" }}>LIVE</span>
            </div>

            <h1 style={{
              fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "clamp(34px, 5vw, 52px)",
              lineHeight: 1.0, margin: 0,
            }}>
              <span style={{ color: SCQ.goldBright, textShadow: "0 0 24px rgba(240,200,74,0.55)" }}>SCQ</span><br />
              <span style={{ color: "#fff" }}>Scoreboard</span>
            </h1>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: SCQ.muted, marginTop: 20, maxWidth: 480, lineHeight: 1.5 }}>
              Built for Jamaican coaches training for TVJ's School's Challenge Quiz competition.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.7)", marginTop: 12, maxWidth: 480, lineHeight: 1.7 }}>
              Most teams train with a tally on a whiteboard. SCQ Scoreboard gives coaches a full match simulation - the same rounds, timing, and scoring format used in official TVJ matches, with a broadcast-quality audience display and a separate control panel for the scorer. The scorer sees the full tally breakdown. The audience sees only the scores. Visuals and audio work exactly as they do on the real TVJ broadcast.
            </p>

            <div style={{ marginTop: 28 }}>
              <ScqDownloadButtons />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
              <ScqPill small>Free mode available</ScqPill>
              <ScqPill small>Premium unlock</ScqPill>
              <ScqPill small>Digital delivery</ScqPill>
            </div>
          </div>

          <div className="scq-broadcast-glow-wrap" style={{
            position: "relative", borderRadius: 16, border: `2px solid ${SCQ.gold}`,
            overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
            background: `radial-gradient(900px 320px at 50% 0%, rgba(200,162,74,0.25), transparent 60%), ${SCQ.maroonDeep}`,
          }}>
            <div className="scq-broadcast-glow" style={{
              position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
              width: 360, height: 220, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(240,200,74,0.35), transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", padding: "22px 24px 10px", textAlign: "center" }}>
              <span style={{
                display: "inline-block", padding: "5px 18px", borderRadius: 999,
                border: `1px solid ${SCQ.gold}`, color: SCQ.gold,
                fontFamily: "'Inter', sans-serif", fontSize: 11.5, letterSpacing: "0.1em",
              }}>
                ALTERNATE
              </span>
            </div>
            <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", padding: "28px 24px 34px", gap: 12 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 10 }}>Team A</div>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "clamp(3rem, 6vw, 4.4rem)",
                  color: SCQ.goldBright, textShadow: "0 0 24px rgba(240,200,74,0.6)",
                }}>
                  -
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 10 }}>Team B</div>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "clamp(3rem, 6vw, 4.4rem)",
                  color: SCQ.goldBright, textShadow: "0 0 24px rgba(240,200,74,0.6)",
                }}>
                  -
                </div>
              </div>
            </div>
            <div style={{
              position: "relative", padding: "10px 16px", textAlign: "center",
              borderTop: "1px solid rgba(200,162,74,0.3)",
            }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, color: SCQ.muted, letterSpacing: "0.04em" }}>
                Not endorsed by TVJ · Used by real coaches
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 1.5 - WHY I BUILT IT */}
        <ScoreboardDivider label="PRE-MATCH - WHY THIS EXISTS" />
        <section style={{ padding: "60px 24px 70px", maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "clamp(22px, 3.2vw, 32px)",
            color: SCQ.gold, margin: "0 0 20px", textAlign: "center",
          }}>
            Why I built it
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.8,
            color: "rgba(255,255,255,0.78)", margin: 0, textAlign: "center",
          }}>
            Schools competing in TVJ's School's Challenge Quiz train the way they always have - drawing tallies on whiteboards. I built SCQ Scoreboard to change that. Coaches now run full match simulations with real timing, real scoring rules, and a display that looks like the actual broadcast. The app is not officially endorsed by TVJ, but it is being used by coaches who have purchased it.
          </p>
        </section>

        {/* SECTION 2 - DUAL WINDOW SHOWCASE */}
        <ScoreboardDivider label="ROUND 1 - DUAL WINDOW SETUP" />
        <section style={{ padding: "60px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
          <ScqSectionHeading
            title="Two screens. One match."
            subtitle="Run the Control Panel on your laptop. Project the Main Scoreboard to a TV or projector."
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: SCQ.teal, textAlign: "center", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Control Panel
              </div>
              <div
                onClick={() => openLightbox("/images/scq-cp.webp")}
                style={{
                  background: SCQ.cpBg, borderRadius: 12, padding: 10,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)", cursor: "zoom-in",
                }}
              >
                <img
                  src="/images/scq-cp.webp"
                  alt="Control Panel screenshot"
                  style={{ width: "100%", borderRadius: 8, display: "block" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: SCQ.gold, textAlign: "center", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Main Scoreboard
              </div>
              <div
                onClick={() => openLightbox("/images/scq-ms.webp")}
                style={{
                  background: SCQ.maroonDeep, borderRadius: 12, padding: 10,
                  border: `1px solid ${SCQ.gold}`,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)", cursor: "zoom-in",
                }}
              >
                <img
                  src="/images/scq-ms.webp"
                  alt="Main Scoreboard screenshot"
                  style={{ width: "100%", borderRadius: 8, display: "block" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 - LIVE STATS SCOREBOARD */}
        <ScoreboardDivider label="ROUND 2 - BY THE NUMBERS" />
        <section style={{
          position: "relative", overflow: "hidden", padding: "60px 24px",
          background: `radial-gradient(900px 320px at 50% 0%, rgba(200,162,74,0.22), transparent 60%), linear-gradient(180deg, ${SCQ.maroonLight}, ${SCQ.maroonDeep})`,
        }}>
          <div className="scq-broadcast-glow" style={{
            position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
            width: 420, height: 240, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(240,200,74,0.35), transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 0, maxWidth: 700, margin: "0 auto", flexWrap: "wrap",
          }}>
            {[
              { value: "3", label: "ROUND TYPES" },
              { value: "2", label: "SCREENS" },
              { value: "∞", label: "MATCH FORMATS" },
            ].map((stat, i) => (
              <div key={stat.label} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center", padding: "0 40px" }}>
                  <div style={{
                    fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "clamp(2.6rem, 5vw, 3.6rem)",
                    color: SCQ.goldBright, textShadow: "0 0 20px rgba(240,200,74,0.6)",
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, letterSpacing: "0.1em", color: "#fff", marginTop: 6 }}>
                    {stat.label}
                  </div>
                </div>
                {i < 2 && <div style={{ width: 1, height: 60, background: "rgba(200,162,74,0.4)" }} />}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4 - INTERACTIVE DEMO */}
        <ScoreboardDivider label="ROUND 3 - TRY IT YOURSELF" />
        <section style={{ padding: "60px 16px 80px" }}>
          <ScqSectionHeading
            title="Try it yourself"
            subtitle="A simplified version of the actual app. Control panel on the left, audience display on the right."
          />
          <ScqDemo />
        </section>

        {/* SECTION 5 - FEATURES AS LEADERBOARD */}
        <ScoreboardDivider label="ROUND 4 - FEATURES" />
        <section style={{ padding: "60px 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
          <ScqSectionHeading title="What's in the match" />
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            {SCQ_FEATURE_ROWS.map((row, i) => (
              <div
                key={row.name}
                style={{
                  display: "grid", gridTemplateColumns: "50px 1fr 1fr 40px", alignItems: "center",
                  gap: 12, padding: "14px 18px",
                  background: i % 2 === 0 ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.12)",
                }}
              >
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 15, color: SCQ.gold }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13.5, color: "#fff" }}>
                  {row.name}
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: SCQ.muted }}>
                  {row.desc}
                </span>
                <span style={{ color: SCQ.gold, fontSize: 16, textAlign: "right" }}>✓</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6 - INSTALLATION GUIDE */}
        <ScoreboardDivider label="ROUND 5 - INSTALLATION" />
        <section style={{ padding: "60px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
          <ScqSectionHeading
            title="First-time install on PC/Laptop"
            subtitle="You may see a SmartScreen warning. This is expected for new software. The app is malware-checked and code-certified by SSL.com."
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {SCQ_INSTALL_STEPS.map((step, i) => (
              <div key={step.title} style={{
                background: SCQ.maroon, borderRadius: 12, padding: 20,
                border: "1px solid rgba(200,162,74,0.25)",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: SCQ.gold,
                  color: SCQ.maroonDeep, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 14, marginBottom: 14,
                }}>
                  {i + 1}
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#fff", margin: "0 0 14px", fontWeight: 500 }}>
                  {step.title}
                </p>
                <img
                  src={step.img}
                  alt={step.title}
                  style={{ width: "100%", borderRadius: 8, display: "block" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7 - PRICING AS MATCH ENTRY */}
        <ScoreboardDivider label="ROUND 6 - LICENSING" />
        <section style={{ padding: "60px 24px 40px", maxWidth: 1100, margin: "0 auto" }}>
          <ScqSectionHeading
            title="Pick your plan"
            subtitle="One-time payment · License key delivered to your email · Payment via bank transfer"
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {/* Panel 1 - Individual */}
            <div style={{ background: "rgba(0,0,0,0.3)", borderTop: `3px solid ${SCQ.gold}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.12em", color: SCQ.gold, textTransform: "uppercase" }}>STANDARD</span>
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, color: "#fff", margin: 0 }}>Individual</h3>
              <div>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 34, color: SCQ.goldBright }}>15,000</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: SCQ.muted, marginLeft: 6 }}>JMD</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <ScqPricingFeature>1 device</ScqPricingFeature>
                <ScqPricingFeature>One-time payment</ScqPricingFeature>
                <ScqPricingFeature>All current features</ScqPricingFeature>
                <ScqPricingFeature>Free bug fixes for life</ScqPricingFeature>
                <ScqPricingFeature>Ideal for coaches and students</ScqPricingFeature>
              </div>
              <a
                href={SCQ_WHATSAPP}
                target="_blank" rel="noopener noreferrer"
                style={{
                  marginTop: "auto", textAlign: "center", padding: "12px 16px", borderRadius: 8,
                  background: "#25d366", color: "#fff", textDecoration: "none",
                  fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13.5,
                }}
              >
                💬 Purchase via WhatsApp
              </a>
            </div>

            {/* Panel 2 - Additional Devices */}
            <div style={{ background: "rgba(0,0,0,0.3)", borderTop: `3px solid ${SCQ.gold}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.12em", color: SCQ.gold, textTransform: "uppercase" }}>EXTEND</span>
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, color: "#fff", margin: 0 }}>Additional Devices</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.85)" }}>
                  <span>2nd device</span><span style={{ color: SCQ.goldBright, fontWeight: 600 }}>+5,000 JMD</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.85)" }}>
                  <span>3rd device</span><span style={{ color: SCQ.goldBright, fontWeight: 600 }}>+5,000 JMD</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.85)" }}>
                  <span>4th device+</span><span style={{ color: SCQ.goldBright, fontWeight: 600 }}>+2,000 JMD each</span>
                </div>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: SCQ.muted, margin: 0 }}>
                Same license key activates across all devices
              </p>
              <a
                href={SCQ_WHATSAPP}
                target="_blank" rel="noopener noreferrer"
                style={{
                  marginTop: "auto", textAlign: "center", padding: "12px 16px", borderRadius: 8,
                  background: "#25d366", color: "#fff", textDecoration: "none",
                  fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13.5,
                }}
              >
                💬 Add a Device via WhatsApp
              </a>
            </div>

            {/* Panel 3 - Rally Pass */}
            <div style={{ background: "rgba(0,0,0,0.3)", borderTop: `3px solid ${SCQ.gold}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.12em", color: SCQ.gold, textTransform: "uppercase" }}>EVENT</span>
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, color: "#fff", margin: 0 }}>Rally Pass</h3>
              <div>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 34, color: SCQ.goldBright }}>5,000</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: SCQ.muted, marginLeft: 6 }}>JMD</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <ScqPricingFeature>Unlimited devices</ScqPricingFeature>
                <ScqPricingFeature>3-day access</ScqPricingFeature>
                <ScqPricingFeature>Must activate within 7 days</ScqPricingFeature>
                <ScqPricingFeature>Ideal for large rally events</ScqPricingFeature>
              </div>
              <a
                href={SCQ_WHATSAPP}
                target="_blank" rel="noopener noreferrer"
                style={{
                  marginTop: "auto", textAlign: "center", padding: "12px 16px", borderRadius: 8,
                  background: "#25d366", color: "#fff", textDecoration: "none",
                  fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13.5,
                }}
              >
                💬 Purchase via WhatsApp
              </a>
            </div>
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12, color: SCQ.muted,
            textAlign: "center", marginTop: 28, maxWidth: 700, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7,
          }}>
            All payments via bank transfer. License key sent after payment confirmed. All sales are final after activation. Contact support before purchasing a new license if you have activation issues.
          </p>
        </section>

        {/* SECTION 8 - STATUS */}
        <ScoreboardDivider label="FINAL WHISTLE" />
        <section style={{ padding: "70px 24px 90px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "clamp(26px, 4vw, 38px)", color: SCQ.gold, margin: 0 }}>
            Live and selling.
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: SCQ.muted, marginTop: 14, maxWidth: 560, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
            Used in real School's Challenge Quiz competitions in Jamaica. Free mode available. Premium license sold separately.
          </p>
          <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
            <ScqDownloadButtons stacked />
          </div>
        </section>

        {/* SECTION 9 - NEXT PROJECT */}
        <div
          onClick={onNextProject}
          style={{
            width: "100%", background: SCQ.maroonDeep,
            padding: "26px 32px", display: "flex", justifyContent: "flex-end",
            alignItems: "center", cursor: "pointer",
          }}
        >
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: SCQ.gold, fontWeight: 500 }}>
            Next · Uno Calculator →
          </span>
        </div>
      </div>
    </>
  );
}

const UNO_COLORS = {
  red:    "#E3263A",
  yellow: "#F5C400",
  green:  "#1A9E4A",
  blue:   "#0057A8",
  black:  "#1A1A1A",
  white:  "#FFFFFF",
  wild:   "linear-gradient(135deg, #E3263A, #F5C400, #1A9E4A, #0057A8)",
};

function useUnoFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);
}

function UnoCard({ color, label, children, animClass }) {
  const bg = UNO_COLORS[color] || UNO_COLORS.red;
  const isWild = color === "wild";

  return (
    <div
      className={animClass}
      style={{
        position: "relative",
        width: "min(520px, 92vw)",
        height: "min(720px, 88vh)",
        borderRadius: 24,
        background: bg,
        backgroundImage: isWild ? UNO_COLORS.wild : undefined,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        flexShrink: 0,
      }}
    >
      {/* white inner border */}
      <div style={{
        position: "absolute", inset: 8,
        borderRadius: 18,
        border: "6px solid #FFFFFF",
        pointerEvents: "none",
      }} />

      {/* top-left corner */}
      <div style={{
        position: "absolute", top: 22, left: 22,
        width: 40, height: 56,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
        }} />
        <span style={{
          position: "relative",
          fontFamily: "'Nunito', sans-serif", fontWeight: 900,
          fontSize: 22, color: "#FFFFFF",
        }}>
          {label}
        </span>
      </div>

      {/* bottom-right corner */}
      <div style={{
        position: "absolute", bottom: 22, right: 22,
        width: 40, height: 56,
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: "rotate(180deg)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
        }} />
        <span style={{
          position: "relative",
          fontFamily: "'Nunito', sans-serif", fontWeight: 900,
          fontSize: 22, color: "#FFFFFF",
        }}>
          {label}
        </span>
      </div>

      {/* center oval */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%", height: "82%",
        borderRadius: "50% / 16%",
        background: "#FFFFFF",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        boxSizing: "border-box",
      }}>
        <div style={{
          width: "100%", maxHeight: "100%",
          overflowY: "auto",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "26px 28px",
          boxSizing: "border-box",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function UnoPillBadge({ children, color = "#E3263A", background }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: 999,
      fontSize: 11.5, fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
      color: background ? color : "#fff",
      background: background || color,
    }}>
      {children}
    </span>
  );
}

const UNO_CARD_VALUES = {
  "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
  "Skip": 20, "Rev": 20, "+2": 20, "Wild": 50, "+4": 50,
};

function UnoDemoCard() {
  const [selected, setSelected] = useState([]);
  const [saved, setSaved] = useState(false);

  const total = selected.reduce((sum, c) => sum + UNO_CARD_VALUES[c.face], 0);

  const addCard = (face) => {
    setSelected((prev) => [...prev, { face, uid: `${face}-${Date.now()}-${Math.random()}` }]);
  };
  const removeCard = (uid) => {
    setSelected((prev) => prev.filter((c) => c.uid !== uid));
  };
  const clear = () => setSelected([]);
  const save = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSelected([]);
    }, 1200);
  };

  const faces = ["0","1","2","3","4","5","6","7","8","9","Skip","Rev","+2","Wild","+4"];
  const faceColor = (f) => {
    if (["Skip","Rev","+2"].includes(f)) return UNO_COLORS.blue;
    if (["Wild","+4"].includes(f)) return "#1A1A1A";
    return UNO_COLORS.red;
  };

  return (
    <>
      <h3 style={{
        fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 20,
        color: "#1A1A1A", margin: "0 0 12px", textAlign: "center",
      }}>
        Try the calculator
      </h3>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6,
        width: "100%", marginBottom: 10,
      }}>
        {faces.map((f) => (
          <button
            key={f}
            onClick={() => addCard(f)}
            style={{
              aspectRatio: "1 / 0.6",
              borderRadius: 8,
              border: "none",
              background: faceColor(f),
              color: "#fff",
              fontFamily: "'Nunito', sans-serif", fontWeight: 800,
              fontSize: 11,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "2px 4px",
              textAlign: "center",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{
        width: "100%", minHeight: 30,
        display: "flex", flexWrap: "wrap", gap: 6,
        marginBottom: 10, overflowX: "auto",
      }}>
        {selected.map((c) => (
          <span
            key={c.uid}
            onClick={() => removeCard(c.uid)}
            style={{
              padding: "3px 9px", borderRadius: 999,
              background: UNO_COLORS.blue, color: "#fff",
              fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 500,
              cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            {c.face} ×
          </span>
        ))}
      </div>

      <div style={{
        width: "100%", padding: "10px 14px", borderRadius: 12,
        background: "#F3F3F3", textAlign: "center", marginBottom: 12,
      }}>
        <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15, color: "#1A1A1A" }}>
          Round Total: {total} pts
        </span>
      </div>

      <div style={{ display: "flex", gap: 10, width: "100%" }}>
        <button
          onClick={clear}
          style={{
            flex: 1, padding: "10px 0", borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.15)", background: "#fff",
            color: "#1A1A1A", fontFamily: "'Inter', sans-serif", fontWeight: 600,
            fontSize: 13, cursor: "pointer",
          }}
        >
          Clear
        </button>
        <button
          onClick={save}
          style={{
            flex: 1.4, padding: "10px 0", borderRadius: 10,
            border: "none", background: UNO_COLORS.red,
            color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 600,
            fontSize: 13, cursor: "pointer",
          }}
        >
          {saved ? "✓ Saved!" : "Save Score"}
        </button>
      </div>
    </>
  );
}

const UNO_CARDS = [
  { id: "intro",      color: "red",    label: "01" },
  { id: "story",      color: "yellow", label: "02" },
  { id: "calculator", color: "green",  label: "03" },
  { id: "modes",      color: "blue",   label: "04" },
  { id: "houserules", color: "wild",   label: "UNO" },
  { id: "demo",       color: "red",    label: "05" },
  { id: "download",   color: "yellow", label: "06" },
];

const UNO_BG_CARD_POSITIONS = [
  { top: "6%",  left: "4%",  rotate: -18, color: UNO_COLORS.red },
  { top: "10%", left: "84%", rotate: 22,  color: UNO_COLORS.yellow },
  { top: "40%", left: "2%",  rotate: 12,  color: UNO_COLORS.blue },
  { top: "68%", left: "88%", rotate: -25, color: UNO_COLORS.green },
  { top: "80%", left: "8%",  rotate: 30,  color: UNO_COLORS.yellow },
  { top: "4%",  left: "45%", rotate: -10, color: UNO_COLORS.blue },
  { top: "88%", left: "50%", rotate: 16,  color: UNO_COLORS.red },
  { top: "35%", left: "92%", rotate: -30, color: UNO_COLORS.green },
];

const UNO_BG_DOTS = [
  { top: "15%", left: "20%", color: UNO_COLORS.red },
  { top: "25%", left: "70%", color: UNO_COLORS.yellow },
  { top: "55%", left: "12%", color: UNO_COLORS.green },
  { top: "60%", left: "80%", color: UNO_COLORS.blue },
  { top: "78%", left: "35%", color: UNO_COLORS.red },
  { top: "90%", left: "65%", color: UNO_COLORS.yellow },
  { top: "8%",  left: "60%", color: UNO_COLORS.blue },
];

function UnoBackdrop() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* radial gradient blobs */}
      <div style={{
        position: "absolute", top: "-15%", left: "-15%",
        width: "60vw", height: "60vw",
        background: `radial-gradient(circle, ${UNO_COLORS.red} 0%, transparent 70%)`,
        opacity: 0.11,
      }} />
      <div style={{
        position: "absolute", top: "-18%", right: "-15%",
        width: "55vw", height: "55vw",
        background: `radial-gradient(circle, ${UNO_COLORS.yellow} 0%, transparent 70%)`,
        opacity: 0.1,
      }} />
      <div style={{
        position: "absolute", bottom: "-25%", left: "50%", transform: "translateX(-50%)",
        width: "70vw", height: "60vw",
        background: `radial-gradient(circle, ${UNO_COLORS.blue} 0%, transparent 70%)`,
        opacity: 0.12,
      }} />

      {/* scattered uno card shapes */}
      {UNO_BG_CARD_POSITIONS.map((c, i) => (
        <div key={i} style={{
          position: "absolute",
          top: c.top, left: c.left,
          width: 72, height: 108,
          borderRadius: 10,
          background: c.color,
          border: "2px solid rgba(255,255,255,0.5)",
          opacity: 0.11,
          transform: `rotate(${c.rotate}deg)`,
        }} />
      ))}

      {/* scattered dots */}
      {UNO_BG_DOTS.map((d, i) => (
        <div key={i} style={{
          position: "absolute",
          top: d.top, left: d.left,
          width: 4, height: 4,
          borderRadius: "50%",
          background: d.color,
          opacity: 0.32,
        }} />
      ))}
    </div>
  );
}

function UnoSplash({ visible }) {
  const [phase, setPhase] = useState("start");
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 20);
    const t2 = setTimeout(() => setPhase("sweep"), 20 + 800 + 300);
    const t3 = setTimeout(() => setPhase("tagline"), 20 + 800 + 300 + 750 + 150);
    const t4 = setTimeout(() => setExiting(true), 20 + 800 + 300 + 750 + 150 + 600 + 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="rv-splash-wrap"
      style={{
        position: "fixed", inset: 0, zIndex: 250,
        background: "#1A1A1A",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        opacity: exiting ? 0 : 1,
        transitionDuration: "0.5s",
      }}
    >
      <div
        className={`rv-splash-logo${phase !== "start" ? " rv-in" : ""}${phase === "sweep" || phase === "tagline" || phase === "hold" ? " rv-sweep" : ""}`}
        style={{ width: 140, height: 140, borderRadius: 24 }}
      >
        <img
          src="/images/uno-icon.png"
          alt="UNO Scorekeeper"
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>

      <div className={`rv-splash-tagline${phase === "tagline" || phase === "hold" ? " rv-in" : ""}`} style={{ marginTop: 24, textAlign: "center" }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 24, color: "#fff" }}>
          UNO Scorekeeper
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 11,
          letterSpacing: "0.15em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)", marginTop: 8,
        }}>
          Score Calculator For Game Night
        </div>
      </div>
    </div>
  );
}

function UnoProject({ onNextProject }) {
  useUnoFonts();

  const [splashing, setSplashing] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setSplashing(false), 4700);
    return () => clearTimeout(t);
  }, []);

  const throwForward = () => {
    if (animating || currentIndex >= UNO_CARDS.length - 1) return;
    setAnimating(true);
    setDirection("forward");
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setAnimating(false);
    }, 380);
  };

  const throwBack = () => {
    if (animating || currentIndex <= 0) return;
    setAnimating(true);
    setDirection("back");
    setTimeout(() => {
      setCurrentIndex((i) => i - 1);
      setAnimating(false);
    }, 380);
  };

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) throwForward();
      else throwBack();
    }
    touchStartX.current = null;
  };

  const card = UNO_CARDS[currentIndex];
  const animClass = animating
    ? (direction === "forward" ? "throw-right" : "throw-left")
    : (direction === "forward" ? "deal-in" : direction === "back" ? "deal-in-left" : "");

  const isSecondToLast = currentIndex === UNO_CARDS.length - 2;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "#141414",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <UnoBackdrop />

      <UnoSplash visible={splashing} />

      <>
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {/* ghost cards */}
            <div style={{
              position: "absolute",
              transform: "translateY(8px) scale(0.97)",
              zIndex: -1,
              background: "#2a2a2a",
              borderRadius: 24,
              width: "min(520px, 92vw)",
              height: "min(720px, 88vh)",
              opacity: 0.6,
            }} />
            <div style={{
              position: "absolute",
              transform: "translateY(16px) scale(0.94)",
              zIndex: -2,
              background: "#2a2a2a",
              borderRadius: 24,
              width: "min(520px, 92vw)",
              height: "min(720px, 88vh)",
              opacity: 0.35,
            }} />

            <UnoCard key={card.id} color={card.color} label={card.label} animClass={animClass}>
              {card.id === "intro" && (
                <>
                  <img src="/images/uno-icon.png" alt="UNO" style={{ width: 64, marginBottom: 14 }} />
                  <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 32, color: "#1A1A1A", margin: "0 0 12px", textAlign: "center" }}>
                    UNO Scorekeeper
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(0,0,0,0.55)", textAlign: "center", margin: "0 0 18px", lineHeight: 1.6 }}>
                    A score calculator built for the card game that already has rules nobody agrees on.
                  </p>
                  <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
                    <UnoPillBadge color={UNO_COLORS.red}>Flutter</UnoPillBadge>
                    <UnoPillBadge color={UNO_COLORS.red}>Mobile</UnoPillBadge>
                    <UnoPillBadge color={UNO_COLORS.red}>iOS</UnoPillBadge>
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.4)", margin: 0 }}>
                    Throw the card to continue →
                  </p>
                </>
              )}

              {card.id === "story" && (
                <div style={{ width: "100%" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{
                      fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700,
                      letterSpacing: "0.1em", color: UNO_COLORS.yellow, textTransform: "uppercase",
                    }}>
                      Why it exists
                    </span>
                    <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 26, color: "#1A1A1A", margin: "6px 0 16px" }}>
                      Built for game night.
                    </h2>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(0,0,0,0.65)", lineHeight: 1.6, margin: 0, textAlign: "left" }}>
                      UNO scoring is more complicated than most people realize. Cards have real point values. There are two ways to win. And every group plays with their own house rules.
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(0,0,0,0.65)", lineHeight: 1.6, margin: 0, textAlign: "left" }}>
                      I built UNO Scorekeeper so nobody has to keep score in their head or on a napkin. You tap the cards you played, it calculates the points.
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(0,0,0,0.65)", lineHeight: 1.6, margin: 0, textAlign: "left" }}>
                      It even has a "PK House Rules" preset - because every group eventually invents their own rules, and mine deserved to be saved.
                    </p>
                  </div>
                </div>
              )}

              {card.id === "calculator" && (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 20, color: "#1A1A1A", margin: "0 0 3px" }}>
                    Tap the cards. Get the score.
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.5)", margin: "0 0 12px" }}>
                    Real UNO point values, built in.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginBottom: 12, width: "100%" }}>
                    {["0","1","2","3","4","5","6","7","8","9","Skip","Rev","+2","Wild","+4"].map((f) => {
                      const c = ["Skip","Rev","+2"].includes(f) ? UNO_COLORS.blue : ["Wild","+4"].includes(f) ? "#1A1A1A" : UNO_COLORS.red;
                      return (
                        <div key={f} style={{
                          aspectRatio: "1 / 0.55", borderRadius: 6, background: c,
                          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 9.5,
                        }}>
                          {f}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: 11.5, color: "rgba(0,0,0,0.6)", fontFamily: "'Inter', sans-serif", textAlign: "left", marginBottom: 10, lineHeight: 1.7 }}>
                    <div>Number cards → Face value (0–9)</div>
                    <div>Skip / Rev / +2 → 20 points each</div>
                    <div>Wild / +4 → 50 points each</div>
                  </div>
                  <div style={{ padding: "8px 14px", borderRadius: 12, background: "#F3F3F3", display: "inline-block" }}>
                    <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: "#1A1A1A" }}>
                      Round Total: 70 pts
                    </span>
                  </div>
                </div>
              )}

              {card.id === "modes" && (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 24, color: "#1A1A1A", margin: "0 0 16px" }}>
                    Two ways to play.
                  </h2>
                  <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    <div style={{ flex: 1, padding: "14px 12px", borderRadius: 14, background: "rgba(0,87,168,0.1)", textAlign: "left" }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: UNO_COLORS.blue, marginBottom: 6 }}>
                        Max Points Win
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.6)", lineHeight: 1.5, marginBottom: 8 }}>
                        The player who reaches the target score first wins. Points are good.
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(0,0,0,0.4)", fontStyle: "italic" }}>
                        First to 500 wins
                      </div>
                    </div>
                    <div style={{ flex: 1, padding: "14px 12px", borderRadius: 14, background: "rgba(227,38,58,0.08)", textAlign: "left" }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: UNO_COLORS.red, marginBottom: 6 }}>
                        Max Points Lose
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.6)", lineHeight: 1.5, marginBottom: 8 }}>
                        Points accumulate against you. First to the limit is out.
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(0,0,0,0.4)", fontStyle: "italic" }}>
                        First to 500 loses
                      </div>
                    </div>
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.45)", margin: 0 }}>
                    Set your own target score. Default is 500.
                  </p>
                </div>
              )}

              {card.id === "houserules" && (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 26, margin: "0 0 14px" }}>
                    <span style={{ color: UNO_COLORS.red }}>PK</span>{" "}
                    <span style={{ color: UNO_COLORS.yellow }}>House</span>{" "}
                    <span style={{ color: UNO_COLORS.green }}>Rules</span>
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "rgba(0,0,0,0.6)", lineHeight: 1.6, margin: "0 0 16px" }}>
                    Every group eventually makes up their own rules. UNO Scorekeeper lets you save yours - and comes with a built-in PK House Rules preset so you can play the right way from the start.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                    <UnoPillBadge color={UNO_COLORS.red}>Stack +2s and +4s</UnoPillBadge>
                    <UnoPillBadge color={UNO_COLORS.yellow}>0 = swap hands with anyone</UnoPillBadge>
                    <UnoPillBadge color={UNO_COLORS.green}>7 = swap with chosen player</UnoPillBadge>
                    <UnoPillBadge color={UNO_COLORS.blue}>Jump-in rule</UnoPillBadge>
                  </div>
                </div>
              )}

              {card.id === "demo" && <UnoDemoCard />}

              {card.id === "download" && (
                <div style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <img src="/images/uno-icon.png" alt="UNO" style={{ width: 56, marginBottom: 12 }} />
                  <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 28, color: "#1A1A1A", margin: "0 0 6px" }}>
                    UNO Scorekeeper
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(0,0,0,0.5)", margin: "0 0 22px" }}>
                    Free. Available on Mobile.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginBottom: 16 }}>
                    <a href="https://github.com/rju23/uno-calculator-app/releases/download/v1.0/Uno.Calculator.apk" style={{
                      padding: "12px 0", borderRadius: 12, background: UNO_COLORS.green,
                      color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13.5,
                      textDecoration: "none", textAlign: "center",
                    }}>
                      Download for Mobile
                    </a>
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "rgba(0,0,0,0.4)", margin: "0 0 24px" }}>
                    Built with Flutter · No ads · No accounts needed
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, color: "rgba(0,0,0,0.3)", margin: 0 }}>
                    ← Throw back to replay
                  </p>
                </div>
              )}
            </UnoCard>
          </div>

          <div style={{
            position: "fixed", bottom: 32, left: 0, right: 0,
            display: "flex", justifyContent: "center", alignItems: "center", gap: 20,
            zIndex: 200,
          }}>
            {currentIndex > 0 && (
              <button
                onClick={throwBack}
                disabled={animating}
                style={{
                  padding: "10px 20px", borderRadius: 999,
                  background: "rgba(0,0,0,0.6)", color: "#fff",
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13,
                  cursor: animating ? "default" : "pointer",
                }}
              >
                ← Draw Back
              </button>
            )}

            <span style={{
              fontFamily: "'Inter', sans-serif", fontSize: 12,
              color: "rgba(255,255,255,0.45)",
            }}>
              Card {currentIndex + 1} of {UNO_CARDS.length}
            </span>

            {currentIndex < UNO_CARDS.length - 1 && (
              <button
                onClick={throwForward}
                disabled={animating}
                className={isSecondToLast ? "uno-pulse" : ""}
                style={{
                  padding: "10px 20px", borderRadius: 999,
                  background: UNO_COLORS[card.color] === UNO_COLORS.wild ? UNO_COLORS.red : (UNO_COLORS[card.color] || UNO_COLORS.red),
                  backgroundImage: card.color === "wild" ? UNO_COLORS.wild : undefined,
                  color: "#fff",
                  border: "none",
                  fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13,
                  cursor: animating ? "default" : "pointer",
                }}
              >
                {isSecondToLast ? "UNO! →" : "Throw →"}
              </button>
            )}

            {currentIndex === UNO_CARDS.length - 1 && (
              <button
                onClick={onNextProject}
                style={{
                  padding: "10px 20px", borderRadius: 999,
                  background: UNO_COLORS.green,
                  color: "#fff",
                  border: "none",
                  fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Next Project →
              </button>
            )}
          </div>
        </>
    </div>
  );
}

function AboutView() {
  const bodyStyle = {
    fontSize: 15.5,
    lineHeight: 1.8,
    color: "rgba(244,239,231,0.62)",
    fontWeight: 300,
    marginBottom: 22,
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100%",
      overflowX: "hidden",
      boxSizing: "border-box",
    }}>
      {/* SECTION 1 — HERO */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "40% 60%",
        minHeight: "70vh",
        paddingLeft: 56,
      }}>
        {/* LEFT — Photo */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img
            src="/images/prakash.jpg"
            alt="Prakash Sejwani"
            onClick={() => openLightbox("/images/prakash.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block", cursor: "zoom-in" }}
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "40%",
            background: "linear-gradient(to top, rgba(196,98,45,0.4), transparent)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0,
            width: 2,
            background: "linear-gradient(to bottom, transparent, rgba(217,138,76,0.5), transparent)",
          }} />
        </div>

        {/* RIGHT — Headline */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 48px",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 24, right: 24,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
            opacity: 0.15,
          }}>
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "#D98A4C" }} />
            ))}
          </div>

          <div style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#D98A4C",
            marginBottom: 24,
            fontFamily: "'Inter', sans-serif",
          }}>
            Prakash Sejwani
          </div>

          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(52px, 7vw, 88px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "#F4EFE7",
            margin: "0 0 32px",
          }}>
            A<br />
            <span style={{ color: "#D98A4C" }}>Builder</span><br />
            at<br />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 0, lineHeight: 1, letterSpacing: "-0.08em", margin: "0 -4px" }}>
              <span style={{ color: "#D98A4C", marginRight: "-14px" }}>He</span>
              <img
                src="/images/heart.png"
                alt="heart"
                style={{
                  width: "0.95em",
                  height: "0.95em",
                  objectFit: "contain",
                  display: "inline-block",
                  verticalAlign: "middle",
                  filter: "drop-shadow(0 0 8px rgba(217,138,76,0.4))",
                }}
              />
              <span style={{ color: "#D98A4C", marginLeft: "-18px" }}>rt.</span>
            </span>
          </h1>

          <div style={{ width: 48, height: 2, background: "#D98A4C", marginBottom: 24 }} />

          <p style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: "rgba(244,239,231,0.52)",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            margin: 0,
            maxWidth: 340,
          }}>
            Final-year medical student. Software developer. Building at the intersection of both.
          </p>

          <div style={{
            position: "absolute",
            bottom: 32, left: 48,
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 11, color: "rgba(244,239,231,0.25)",
            letterSpacing: "0.1em", textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif",
          }}>
            <div style={{ width: 24, height: 1, background: "rgba(244,239,231,0.2)" }} />
            Scroll
          </div>
        </div>
      </div>

      {/* SECTION 2 — TIMELINE */}
      <div style={{
        borderTop: "1px solid rgba(217,138,76,0.2)",
        borderBottom: "1px solid rgba(217,138,76,0.2)",
        padding: "28px 0 28px 56px",
        marginTop: 32,
        marginRight: -200,
        width: "calc(100% + 200px)",
        display: "flex",
        alignItems: "flex-start",
        background: "rgba(217,138,76,0.03)",
      }}>
        {[
          { year: "2025", label: "First app", sub: "SCQ Scoreboard", pulse: false },
          { year: "2025", label: "First client", sub: "876 Revive", pulse: false },
          { year: "2026", label: "Completing MD", sub: "University of WI", pulse: false },
          { year: "Now", label: "Building", sub: "everything", pulse: true },
        ].map((item, i, arr) => (
          <Fragment key={i}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 }}>
              <div style={{
                fontFamily: "'Fraunces', serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "#D98A4C",
                marginBottom: 6,
              }}>{item.year}</div>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#D98A4C", marginBottom: 8, flexShrink: 0,
                boxShadow: item.pulse ? "0 0 0 3px rgba(217,138,76,0.2)" : "none",
              }} className={item.pulse ? "pulse-dot" : ""} />
              <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(244,239,231,0.75)", textAlign: "center" }}>{item.label}</div>
              <div style={{ fontSize: 10, color: "rgba(244,239,231,0.35)", textAlign: "center", marginTop: 2 }}>{item.sub}</div>
            </div>
            {i < arr.length - 1 ? (
              <div style={{
                flex: 1,
                height: 1,
                background: "linear-gradient(90deg, rgba(217,138,76,0.4), rgba(217,138,76,0.1))",
                marginTop: 29,
              }} />
            ) : (
              <div style={{
                flex: "0 0 260px",
                height: 1,
                background: "rgba(217,138,76,0.35)",
                marginTop: 29,
              }} />
            )}
          </Fragment>
        ))}
      </div>

      {/* SECTION 3 — CONTENT */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 280px",
        gap: 0,
        padding: "0 0 0 56px",
      }}>
        {/* LEFT — text content */}
        <div style={{ padding: "52px 48px 52px 0", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          {/* Water jug blockquote */}
          <div style={{
            borderLeft: "3px solid #D98A4C",
            paddingLeft: 20,
            margin: "0 0 28px",
            borderRadius: 0,
          }}>
            <p style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: "italic",
              fontSize: 17,
              color: "rgba(244,239,231,0.82)",
              lineHeight: 1.7,
              margin: 0,
              fontWeight: 400,
            }}>
              That same instinct shows up everywhere. When water went out and I only had jugs, I didn't just deal with it. I built a gravity-fed system out of a metal straw and a large bottle so I'd have controlled running water. That's just how my brain works. If there's a problem, I'm already thinking about the system that solves it.
            </p>
          </div>

          <p style={{
            fontSize: 17,
            lineHeight: 1.78,
            color: "rgba(244,239,231,0.72)",
            fontWeight: 300,
            margin: "0 0 22px",
            fontFamily: "'Inter', sans-serif",
          }}>
            From a young age, technology was the thing I couldn't stay away from. Not in the "future programmer" sense, I wasn't writing code in my bedroom. I was the person who knew the tricks nobody else knew, the one people called when something needed fixing, formatting, or figuring out. I rooted phones when that was still a thing. I spent hours on computers just because computers were interesting.
          </p>

          <p style={bodyStyle}>
            I'm a final-year medical student at the University of the West Indies, and somewhere between studying and the chaos of COVID, I discovered I could build software. December 2025 was when it clicked. I built a scoring app for School's Challenge Quiz because the problem was right in front of me and no good solution existed. Watching it work, watching people use it, watching it actually sell, that opened something. I saw the intersection of everything I loved: technology, problem-solving, and now healthcare.
          </p>
          <p style={bodyStyle}>
            Since then I've shipped a Flutter car wash booking app for a paying client, built an interactive admin dashboard, created medical tools including a drug learning platform, and kept building, most recently a Three.js model of SA node electrical activity. I work with AI as a core part of my development process, not as a shortcut, but as the tool that makes it possible for someone who thinks in systems rather than syntax to build things that actually work.
          </p>
          <p style={bodyStyle}>
            The direction I'm heading is clear. AI and healthcare are going to collide in ways that most people in tech don't fully understand yet, because they've never been in a ward. I have. That combination is where I want to be.
          </p>

          {/* Stat row */}
          <div style={{
            display: "flex",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "24px 0",
            margin: "32px 0",
          }}>
            {[
              { num: "5+", label: "Apps Shipped", sub: null },
              { num: "2", label: "Paying Clients", sub: null },
              { num: "1", label: "Degree", sub: "(almost)" },
            ].map((stat, i) => (
              <Fragment key={i}>
                {i > 0 && <div style={{ width: 1, background: "rgba(255,255,255,0.07)", margin: "0 8px" }} />}
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{
                    fontFamily: "'Fraunces', serif",
                    fontStyle: "italic",
                    fontSize: 40,
                    color: "#D98A4C",
                    lineHeight: 1,
                    marginBottom: 6,
                  }}>{stat.num}</div>
                  <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(244,239,231,0.4)" }}>
                    {stat.label}
                  </div>
                  {stat.sub && <div style={{ fontSize: 10, fontStyle: "italic", color: "rgba(244,239,231,0.25)" }}>{stat.sub}</div>}
                </div>
              </Fragment>
            ))}
          </div>

          {/* Skill tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "28px 0" }}>
            {[
              { label: "Flutter", rotate: "-1.5deg" },
              { label: "Firebase", rotate: "1deg" },
              { label: "React", rotate: "-0.5deg" },
              { label: "Electron", rotate: "1.5deg" },
              { label: "Three.js", rotate: "-1deg" },
              { label: "Next.js", rotate: "0.8deg" },
              { label: "Dart", rotate: "-1.2deg" },
              { label: "Vite", rotate: "1.3deg" },
              { label: "& others", rotate: "-0.8deg" },
            ].map((skill) => (
              <span key={skill.label} style={{
                display: "inline-block",
                padding: "5px 12px",
                borderRadius: 20,
                border: "1px solid rgba(217,138,76,0.25)",
                color: "rgba(244,239,231,0.55)",
                fontSize: 12,
                fontFamily: "'Inter', sans-serif",
                transform: `rotate(${skill.rotate})`,
                background: "rgba(217,138,76,0.04)",
                transition: "border-color 0.2s ease, color 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(217,138,76,0.6)"; e.currentTarget.style.color = "#F4EFE7"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(217,138,76,0.25)"; e.currentTarget.style.color = "rgba(244,239,231,0.55)"; }}
              >
                {skill.label}
              </span>
            ))}
          </div>

          <p style={{
            fontSize: 14,
            fontStyle: "italic",
            color: "rgba(244,239,231,0.38)",
            lineHeight: 1.7,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 20,
            marginTop: 8,
            fontFamily: "'Inter', sans-serif",
          }}>
            Outside of building: cooking, badminton, rewatching ATLA for what is genuinely{" "}
            <span style={{
              borderBottom: "1.5px solid rgba(217,138,76,0.55)",
              paddingBottom: 1,
              color: "rgba(244,239,231,0.48)",
            }}>
              an uncountable number of times
            </span>
            , and whatever game has my attention this week. I also really want an Arduino kit. That one's coming.
          </p>
        </div>

        {/* RIGHT — decorative sidebar */}
        <div style={{ padding: "52px 32px", display: "flex", flexDirection: "column", gap: 40 }}>
          <div style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(244,239,231,0.15)",
            fontFamily: "'Inter', sans-serif",
            alignSelf: "flex-end",
          }}>
            Medical Student · Software Developer
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, alignSelf: "center" }}>
            <div style={{ width: 1, height: 80, background: "linear-gradient(to bottom, transparent, rgba(217,138,76,0.4))" }} />
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#D98A4C", opacity: 0.6 }} />
            <div style={{ width: 1, height: 80, background: "linear-gradient(to bottom, rgba(217,138,76,0.4), transparent)" }} />
          </div>

          <div style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: "italic",
            fontSize: 120,
            fontWeight: 400,
            color: "rgba(217,138,76,0.06)",
            lineHeight: 1,
            alignSelf: "center",
            userSelect: "none",
          }}>
            PK
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
            opacity: 0.1,
            alignSelf: "center",
          }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "#D98A4C" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = (focused) => ({
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: focused ? "1px solid rgba(217,138,76,0.45)" : "1px solid rgba(255,255,255,0.09)",
  borderRadius: 10,
  color: TEXT,
  fontSize: 13.5,
  fontFamily: "'Inter', sans-serif",
  padding: "11px 14px",
  outline: "none",
  transition: "border-color 0.15s ease",
});

const COOLDOWN_SECONDS   = 60;
const COOLDOWN_STORE_KEY = "pk1_contact_cooldown_until";

// Reads the cooldown's end timestamp from localStorage and returns the
// remaining whole seconds, so a page reload resumes it instead of resetting it.
function readStoredCooldown() {
  try {
    const until = Number(localStorage.getItem(COOLDOWN_STORE_KEY));
    if (!until) return 0;
    const remaining = Math.ceil((until - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0; // storage unavailable (private mode, etc.) - fail open
  }
}

function ContactView() {
  const formRef   = useRef(null);
  const [status, setStatus]   = useState("idle"); // idle | sending | success | error
  const [focusedField, setFocusedField] = useState(null);
  const [cooldown, setCooldown] = useState(readStoredCooldown);

  // Resume the countdown on mount if a cooldown is still active from before reload.
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown(readStoredCooldown());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cooldown <= 0 && status === "success") setStatus("idle");
  }, [cooldown]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formRef.current.honeypot.value) return; // bot detected, do nothing

    setStatus("sending");

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      formRef.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then(() => {
        setStatus("success");
        formRef.current?.reset();

        const until = Date.now() + COOLDOWN_SECONDS * 1000;
        try { localStorage.setItem(COOLDOWN_STORE_KEY, String(until)); } catch {}
        setCooldown(COOLDOWN_SECONDS);

        const interval = setInterval(() => {
          const remaining = readStoredCooldown();
          setCooldown(remaining);
          if (remaining <= 0) clearInterval(interval);
        }, 1000);
      })
      .catch(() => {
        setStatus("error");
      });
  };

  return (
    <div style={{ padding: "0 48px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT }} />
        <h2 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 34, fontWeight: 400, color: TEXT, margin: 0 }}>
          Contact
        </h2>
      </div>
      <p style={{ fontSize: 13.5, color: TEXT_DIM, margin: "0 0 36px 17px" }}>Get in touch.</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(220px, 320px) 1fr",
        gap: 28,
      }}>
        {/* ── Left: info ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: TEXT_DIM, margin: 0 }}>
            Have a project in mind or just want to talk? Reach out.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: TEXT_DIM }}>
              <MapPin size={15} color={ACCENT} strokeWidth={1.8} />
              Kingston, Jamaica
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: TEXT_DIM }}>
              <Clock size={15} color={ACCENT} strokeWidth={1.8} />
              Usually replies within 24 hours
            </div>
            <a
              href="mailto:sejwaniraj23@gmail.com"
              style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: TEXT, textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = ACCENT}
              onMouseLeave={e => e.currentTarget.style.color = TEXT}
            >
              <Mail size={15} color={ACCENT} strokeWidth={1.8} />
              sejwaniraj23@gmail.com
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a
              href="https://wa.me/18763718377"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "10px 14px", borderRadius: 10,
                background: "rgba(255,255,255,0.035)",
                border: `1px solid ${BORDER}`,
                color: TEXT, fontSize: 13, fontFamily: "'Inter', sans-serif",
                textDecoration: "none", transition: "border-color 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(217,138,76,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = "rgba(255,255,255,0.035)"; }}
            >
              <FaWhatsapp size={18} color={ACCENT} />
              WhatsApp
            </a>
            <a
              href="https://www.linkedin.com/in/prakash-sejwani-92b4b4350"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "10px 14px", borderRadius: 10,
                background: "rgba(255,255,255,0.035)",
                border: `1px solid ${BORDER}`,
                color: TEXT, fontSize: 13, fontFamily: "'Inter', sans-serif",
                textDecoration: "none", transition: "border-color 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(217,138,76,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = "rgba(255,255,255,0.035)"; }}
            >
              <Users size={15} color={ACCENT} strokeWidth={1.8} />
              LinkedIn
            </a>
            <a
              href="https://github.com/rju23"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "10px 14px", borderRadius: 10,
                background: "rgba(255,255,255,0.035)",
                border: `1px solid ${BORDER}`,
                color: TEXT, fontSize: 13, fontFamily: "'Inter', sans-serif",
                textDecoration: "none", transition: "border-color 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(217,138,76,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = "rgba(255,255,255,0.035)"; }}
            >
              <Link2 size={15} color={ACCENT} strokeWidth={1.8} />
              GitHub
            </a>
          </div>
        </div>

        {/* ── Right: form ── */}
        <div style={{
          padding: 24, borderRadius: 12,
          background: "rgba(255,255,255,0.035)",
          border: `1px solid ${BORDER}`,
        }}>
          <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <fieldset
              disabled={status === "sending" || cooldown > 0}
              style={{ border: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <label style={{ display: "block", fontSize: 12, color: TEXT_DIM, marginBottom: 6 }}>Name</label>
                <input
                  type="text" name="from_name" required
                  placeholder="Your name"
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle(focusedField === "name")}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: TEXT_DIM, marginBottom: 6 }}>Email</label>
                <input
                  type="email" name="from_email" required
                  placeholder="you@example.com"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle(focusedField === "email")}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: TEXT_DIM, marginBottom: 6 }}>Message</label>
                <textarea
                  name="message" required rows={5}
                  placeholder="What are you trying to build?"
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle(focusedField === "message"), resize: "vertical", fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </fieldset>

            {/* Honeypot - hidden from real users, bots fill it */}
            <input
              type="text"
              name="honeypot"
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            {status === "success" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#5FBF7A" }}>
                <Check size={14} />
                Message sent. I'll be in touch soon.
              </div>
            )}

            {status === "error" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#E88" }}>
                <AlertCircle size={14} />
                Something went wrong. Try emailing directly.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending" || cooldown > 0}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px 20px", borderRadius: 10, border: "none",
                background: (status === "sending" || cooldown > 0) ? "rgba(217,138,76,0.5)" : ACCENT,
                color: "#1A1108",
                fontSize: 13.5, fontWeight: 500, fontFamily: "'Inter', sans-serif",
                cursor: (status === "sending" || cooldown > 0) ? "default" : "pointer",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={e => { if (status !== "sending" && cooldown === 0) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(217,138,76,0.35)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {status === "sending"
                ? "Sending…"
                : cooldown > 0
                  ? `Wait ${cooldown}s`
                  : <>Send message <ArrowRight size={15} strokeWidth={2.2} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const SERVICES = [
  {
    Icon: Smartphone,
    title: "Mobile App Development",
    tag: "Flutter · Mobile",
    description:
      "Mobile apps built on Flutter - a single codebase that's cross-platform by design, so an iOS release is a natural next step rather than a rebuild.",
  },
  {
    Icon: Globe,
    title: "Web App Development",
    tag: "React / Vite · Dashboards · Supabase",
    description:
      "Fast, responsive web apps and dashboards backed by real infrastructure - the kind of tool your team actually keeps open all day.",
  },
  {
    Icon: Monitor,
    title: "Desktop App Development",
    tag: "Electron · PC/Laptop",
    description:
      "Native-feeling desktop software for workflows that live on a screen, not a browser tab - built for reliability over novelty.",
  },
  {
    Icon: Stethoscope,
    title: "Clinical & Medical Tools",
    tag: "Built by someone who's been in the room",
    highlight: true,
    description:
      "Tools for clinics, charting and patient workflows, designed by a final-year medical student who understands the workflow before it's ever written in code. That's the difference between software that looks right and software that actually holds up on a busy ward.",
  },
  {
    Icon: IdCard,
    title: "Portfolio & Personal Brand Sites",
    tag: "For professionals & creatives",
    description:
      "A site that makes the case for you before anyone reads a resume - clean, fast, and built around how you actually want to be seen.",
  },
  {
    Icon: Wrench,
    title: "Maintenance & Support",
    tag: "Ongoing care for what's already live",
    description:
      "Bugs fixed, dependencies kept current, small improvements shipped - so the thing you launched keeps working long after launch day.",
  },
];

function ServicesView({ onNavigate }) {
  return (
    <div className="svc-page" style={{ padding: "0 48px", maxWidth: 860, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT }} />
        <h2 className="svc-title" style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 34, fontWeight: 400, color: TEXT, margin: 0 }}>
          Services
        </h2>
      </div>
      <p style={{ fontSize: 13.5, color: TEXT_DIM, margin: "0 0 32px 17px" }}>
        What I can build for you.
      </p>

      <div className="svc-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 14,
      }}>
        {SERVICES.map(({ Icon, title, tag, description, highlight }) => (
          <div
            key={title}
            className="svc-card"
            style={{
              padding: "22px 22px 24px",
              borderRadius: 12,
              background: highlight ? "rgba(217,138,76,0.06)" : "rgba(255,255,255,0.035)",
              border: highlight ? "1px solid rgba(217,138,76,0.3)" : `1px solid ${BORDER}`,
              display: "flex", flexDirection: "column", gap: 10,
            }}
          >
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 34, height: 34, borderRadius: 9,
              background: highlight ? "rgba(217,138,76,0.16)" : "rgba(255,255,255,0.06)",
              color: ACCENT, flexShrink: 0,
            }}>
              <Icon size={16} strokeWidth={1.8} />
            </div>

            <div>
              <h3 style={{
                fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 400,
                fontSize: 18, color: TEXT, margin: "0 0 4px",
              }}>
                {title}
              </h3>
              <div style={{
                fontSize: 11, color: highlight ? ACCENT : TEXT_MUTE,
                letterSpacing: "0.03em", marginBottom: 10,
              }}>
                {tag}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: TEXT_DIM, margin: 0 }}>
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="svc-cta" style={{
        marginTop: 36, marginBottom: 24,
        padding: "26px 30px", borderRadius: 14,
        background: "rgba(255,255,255,0.035)",
        border: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 20, flexWrap: "wrap",
      }}>
        <div className="svc-cta-text">
          <h3 style={{
            fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 400,
            fontSize: 20, color: TEXT, margin: "0 0 4px",
          }}>
            Have something in mind?
          </h3>
          <p style={{ fontSize: 13, color: TEXT_DIM, margin: 0 }}>
            Tell me what you're trying to build, and we'll figure out the rest.
          </p>
        </div>
        <button
          onClick={() => onNavigate && onNavigate("contact")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "11px 20px", borderRadius: 10, border: "none",
            background: ACCENT, color: "#1A1108",
            fontSize: 13.5, fontWeight: 500, fontFamily: "'Inter', sans-serif",
            cursor: "pointer", flexShrink: 0,
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(217,138,76,0.35)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          Get in touch
          <ArrowRight size={15} strokeWidth={2.2} />
        </button>
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
      description: "A Three.js experiment - orbit, move and customise a 3D cube in different weather atmospheres.",
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

/* ============================================================
   CLIENT MANAGER PROJECT - Win95 desktop experience
   ============================================================ */

const CM_COLORS = {
  desktop: "#008080",
  gray: "#c0c0c0",
  dark: "#808080",
  white: "#ffffff",
  navy: "#000080",
  black: "#000000",
  red: "#800000",
  yellow: "#ffffcc",
  blue: "#e8f4fd",
};

const CM_RAISED_BORDER = {
  borderTop: "2px solid #ffffff",
  borderLeft: "2px solid #ffffff",
  borderRight: "2px solid #808080",
  borderBottom: "2px solid #808080",
};

const CM_INSET_BORDER = {
  borderTop: "2px solid #808080",
  borderLeft: "2px solid #808080",
  borderRight: "2px solid #ffffff",
  borderBottom: "2px solid #ffffff",
};

function CmInset({ children, style }) {
  return (
    <div style={{ background: "#ffffff", ...CM_INSET_BORDER, padding: 6, ...style }}>
      {children}
    </div>
  );
}

function CmButton({ children, style, onClick }) {
  return (
    <button
      onClick={onClick}
      className="cm-win-btn-generic"
      style={{
        background: "#c0c0c0",
        ...CM_RAISED_BORDER,
        padding: "3px 10px",
        cursor: "pointer",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 11,
        color: "#000",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function CmStatBox({ value, label, color }) {
  return (
    <div style={{ background: "#c0c0c0", ...CM_INSET_BORDER, padding: "8px 12px", textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: color || CM_COLORS.black }}>{value}</div>
      <div style={{ fontSize: 9, color: "#333" }}>{label}</div>
    </div>
  );
}

function Win95Window({ title, icon, children, style, onFocus, zIndex, defaultPos, isMobile, maximized, onMinimize, onToggleMaximize, onClose }) {
  const dragRef = useRef(null);
  const posRef = useRef(defaultPos);
  const [pos, setPos] = useState(defaultPos);

  const onMouseDown = (e) => {
    if (isMobile) return;
    if (maximized) return;
    if (e.target.closest(".cm-win-btn")) return;
    const startX = e.clientX - posRef.current.left;
    const startY = e.clientY - posRef.current.top;
    const onMove = (e) => {
      const newPos = { left: e.clientX - startX, top: e.clientY - startY };
      posRef.current = newPos;
      setPos(newPos);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    onFocus();
  };

  return (
    <div
      ref={dragRef}
      onMouseDown={() => !isMobile && onFocus()}
      style={{
        position: isMobile ? "static" : "absolute",
        top: isMobile ? undefined : (maximized ? 10 : pos.top),
        left: isMobile ? undefined : (maximized ? 10 : pos.left),
        right: !isMobile && maximized ? 10 : undefined,
        background: "#c0c0c0",
        ...CM_RAISED_BORDER,
        boxShadow: "2px 2px 0 #000000",
        minWidth: isMobile ? undefined : 240,
        width: isMobile ? "100%" : (maximized ? "auto" : undefined),
        zIndex: isMobile ? undefined : zIndex,
        marginBottom: isMobile ? 12 : undefined,
        ...style,
        ...(maximized ? { width: undefined } : null),
      }}
    >
      <div
        onMouseDown={onMouseDown}
        style={{
          background: style?.titlebarBg || "linear-gradient(90deg, #000080, #1084d0)",
          color: "white",
          padding: "3px 6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: isMobile || maximized ? "default" : "grab",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 14 }}>{icon}</span>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, fontWeight: 700, color: "#fff" }}>
            {title}
          </span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {[
            { sym: "_", action: onMinimize },
            { sym: "□", action: onToggleMaximize },
            { sym: "✕", action: onClose },
          ].map(({ sym, action }) => (
            <div
              key={sym}
              className="cm-win-btn"
              onClick={(e) => { e.stopPropagation(); action && action(); }}
              style={{
                width: 16, height: 14,
                background: "#c0c0c0",
                borderTop: "1px solid #ffffff",
                borderLeft: "1px solid #ffffff",
                borderRight: "1px solid #808080",
                borderBottom: "1px solid #808080",
                fontSize: 9, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#000",
              }}
            >
              {sym}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: 10 }}>{children}</div>
    </div>
  );
}

function CmBootScreen({ onDone }) {
  const lines = [
    "CLIENT MANAGER v1.0",
    "Prakash Sejwani Development Systems",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Initializing Firebase........... OK",
    "Loading client records........... OK",
    "Checking contract status......... OK",
    "Starting notification service.... OK",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "System ready.",
  ];
  const [visibleCount, setVisibleCount] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (visibleCount < lines.length) {
      const t = setTimeout(() => setVisibleCount((c) => c + 1), 300);
      return () => clearTimeout(t);
    } else {
      const t1 = setTimeout(() => setFading(true), 800);
      const t2 = setTimeout(() => onDone(), 1300);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [visibleCount]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "#000080",
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity: fading ? 0 : 1,
      transition: "opacity 0.5s ease",
    }}>
      <div style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#00ff00" }}>
        {lines.slice(0, visibleCount).map((line, i) => (
          <div key={i}>
            {line}
            {i === visibleCount - 1 && <CmCursor />}
          </div>
        ))}
      </div>
    </div>
  );
}

function CmCursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((o) => !o), 400);
    return () => clearInterval(t);
  }, []);
  return <span style={{ opacity: on ? 1 : 0 }}>█</span>;
}

const CM_SLIDES = [
  { src: "/images/cm-login.png", caption: "Login - Clients and developer sign in here" },
  { src: "/images/adminside.png", caption: "Admin Dashboard - Project overview and status tracking" },
  { src: "/images/adminclientsview.png", caption: "Clients List - All clients with contact details" },
  { src: "/images/clientcalenderview.png", caption: "Calendar - Key deadlines color-coded by urgency" },
  { src: "/images/clientside.png", caption: "Client Portal - What your client sees" },
  { src: "/images/adminsettingspage.png", caption: "Settings - Bank accounts for invoice generation" },
];

function CmSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % CM_SLIDES.length);
        setVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(t);
  }, [paused]);

  const goTo = (next) => {
    setVisible(false);
    setTimeout(() => {
      setIndex(next);
      setVisible(true);
    }, 300);
  };

  const prev = () => goTo((index - 1 + CM_SLIDES.length) % CM_SLIDES.length);
  const next = () => goTo((index + 1) % CM_SLIDES.length);

  return (
    <div
      style={{ ...CM_RAISED_BORDER, background: "#c0c0c0", boxShadow: "2px 2px 0 #000000" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{
        background: "linear-gradient(90deg, #000080, #1084d0)",
        color: "white", padding: "3px 6px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, fontWeight: 700 }}>
          🖼 Image Viewer - Client Manager Screenshots
        </span>
        <div style={{ display: "flex", gap: 2 }}>
          {["_", "□", "✕"].map((sym) => (
            <div key={sym} style={{
              width: 16, height: 14, background: "#c0c0c0",
              borderTop: "1px solid #ffffff", borderLeft: "1px solid #ffffff",
              borderRight: "1px solid #808080", borderBottom: "1px solid #808080",
              fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#000",
            }}>
              {sym}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: 10 }}>
        <CmInset style={{ height: 380, background: "#000", padding: 4, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <img
            src={CM_SLIDES[index].src}
            alt={CM_SLIDES[index].caption}
            style={{
              maxWidth: "100%", maxHeight: "100%", objectFit: "contain",
              opacity: visible ? 1 : 0, transition: "opacity 0.3s ease",
            }}
          />
        </CmInset>
        <div style={{ background: "#c0c0c0", padding: "6px 4px", textAlign: "center", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#333" }}>
          {CM_SLIDES[index].caption}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <CmButton onClick={prev}>◄ Prev</CmButton>
          <span style={{ fontSize: 10.5 }}>({index + 1} / {CM_SLIDES.length})</span>
          <CmButton onClick={next}>Next ►</CmButton>
        </div>
      </div>
    </div>
  );
}

function MedicalVisualizerProject() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [splashing, setSplashing] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), 2800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!(iframeLoaded && minTimeElapsed) || fading) return;
    setFading(true);
    const t = setTimeout(() => setSplashing(false), 500);
    return () => clearTimeout(t);
  }, [iframeLoaded, minTimeElapsed, fading]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#0a1628" }}>
      {splashing && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#0a1628",
          opacity: fading ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="20" y="6" width="8" height="36" rx="2" fill="#ffffff" />
            <rect x="6" y="20" width="36" height="8" rx="2" fill="#ffffff" />
          </svg>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 400,
            fontSize: 22, color: "#ffffff", margin: "18px 0 8px",
          }}>
            Medical Visualizer
          </h2>
          <p className="medvis-pulse-text" style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12,
            color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em",
          }}>
            Loading visualization...
          </p>
        </div>
      )}

      <iframe
        src="/medical-visualizer/index.html"
        onLoad={() => setIframeLoaded(true)}
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        title="Medical Visualizer"
      />
    </div>
  );
}

function MusicVisualizerProject() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [splashing, setSplashing] = useState(true);
  const [fading, setFading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const iframeRef = useRef(null);

  const dismissInstructions = () => {
    setShowInstructions(false);
    iframeRef.current?.focus();
    iframeRef.current?.contentWindow?.focus();
  };

  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), 4500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!(iframeLoaded && minTimeElapsed) || fading) return;
    setFading(true);
    const t = setTimeout(() => setSplashing(false), 500);
    return () => clearTimeout(t);
  }, [iframeLoaded, minTimeElapsed, fading]);

  const bars = [0, 1, 2, 3];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#0b0b10" }}>
      {/* splash */}
      {splashing && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#0b0b10",
          opacity: fading ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 36 }}>
            {bars.map((i) => (
              <div
                key={i}
                className="musicvis-bar"
                style={{
                  width: 6, borderRadius: 3, background: "#a855f7",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 400,
            fontSize: 22, color: "#ffffff", margin: "18px 0 8px",
          }}>
            Music Visualizer
          </h2>
          <p className="medvis-pulse-text" style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12,
            color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em",
          }}>
            Loading...
          </p>
        </div>
      )}

      {/* iframe */}
      <iframe
        ref={iframeRef}
        tabIndex={0}
        src="/music-visualizer/index.html"
        allow="microphone"
        onLoad={() => setIframeLoaded(true)}
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        title="Music Visualizer"
      />

      {/* instruction overlay - renders on top of iframe */}
      {iframeLoaded && showInstructions && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
        }}>
          <div style={{
            background: "#15121c", borderRadius: 14, padding: 32, maxWidth: 360,
            border: "1px solid rgba(168,85,247,0.25)",
          }}>
            <h3 style={{
              fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 400,
              fontSize: 22, color: "#ffffff", margin: "0 0 14px",
            }}>
              How to use
            </h3>
            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13,
              color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: 22,
            }}>
              1. Play music on your device<br />
              2. Click "Start mic" to activate<br />
              3. Allow microphone access when prompted
              <br /><br />
              Keyboard shortcuts:<br />
              [1] Radial mode<br />
              [2] Waveform mode<br />
              [3] Both modes
              <br /><br />
              Use the Sensitivity slider to adjust reactivity.
            </div>
            <button
              onClick={dismissInstructions}
              style={{
                width: "100%", padding: "12px 0", borderRadius: 8,
                background: "#a855f7", color: "#ffffff", border: "none",
                fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Got it, let's go
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ClientManagerProject({ onNextProject }) {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const [booted, setBooted] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);
  const [windowOrder, setWindowOrder] = useState(["cm", "portal", "notify", "contract"]);
  const [clock, setClock] = useState(new Date().toLocaleTimeString("en-JM", { hour: "2-digit", minute: "2-digit" }));
  const [windowState, setWindowState] = useState({ cm: "open", portal: "open", notify: "open", contract: "open" });
  const [maximized, setMaximized] = useState({ cm: false, portal: false, notify: false, contract: false });

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setClock(new Date().toLocaleTimeString("en-JM", { hour: "2-digit", minute: "2-digit" }));
    }, 30000);
    return () => clearInterval(t);
  }, []);

  const bringToFront = (id) => {
    setWindowOrder((prev) => [...prev.filter((w) => w !== id), id]);
  };

  const zOf = (id) => 100 + windowOrder.indexOf(id);

  const closeWindow = (id) => setWindowState((s) => ({ ...s, [id]: "closed" }));
  const minimizeWindow = (id) => setWindowState((s) => ({ ...s, [id]: "minimized" }));
  const restoreWindow = (id) => {
    setWindowState((s) => ({ ...s, [id]: "open" }));
    bringToFront(id);
  };
  const toggleMaximize = (id) => setMaximized((m) => ({ ...m, [id]: !m[id] }));

  const handleTaskbarClick = (id) => {
    if (windowState[id] !== "open") restoreWindow(id);
    else bringToFront(id);
  };

  const windowMeta = {
    cm: { icon: "🖥", label: "Client Manager" },
    portal: { icon: "👤", label: "Client Portal" },
    notify: { icon: "📬", label: "Notifications" },
    contract: { icon: "📄", label: "Contract Viewer" },
  };

  const desktopIcons = [
    { icon: "🖥", label: "Client Manager.exe", id: "cm" },
    { icon: "👤", label: "Client Portal.exe", id: "portal" },
    { icon: "📬", label: "Notifications.exe", id: "notify" },
    { icon: "📄", label: "Contract Viewer.exe", id: "contract" },
  ];

  const featureListStyle = { fontSize: 10, lineHeight: 1.8, color: "#333", margin: "8px 0 0", paddingLeft: 0, listStyle: "none" };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "#008080",
      overflowY: "auto",
      overflowX: "hidden",
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: 11,
      color: "#000000",
      display: "flex",
      flexDirection: "column",
    }}>
      {!booted && <CmBootScreen onDone={() => setBooted(true)} />}

      {booted && (
        <>
          {/* ============ TOP SECTION - intro + slideshow ============ */}
          <div style={{
            background: "#d4d0c8",
            flexShrink: 0,
          }}>
            <div style={{
              background: "linear-gradient(90deg, #000080, #1084d0)",
              color: "white", padding: "8px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, fontWeight: 700 }}>
                🖥 Client Manager
              </span>
              <div style={{ display: "flex", gap: 2 }}>
                {["_", "□", "✕"].map((sym) => (
                  <div key={sym} className="cm-win-btn" style={{
                    width: 16, height: 14, background: "#c0c0c0",
                    borderTop: "1px solid #ffffff", borderLeft: "1px solid #ffffff",
                    borderRight: "1px solid #808080", borderBottom: "1px solid #808080",
                    fontSize: 9, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#000",
                  }}>
                    {sym}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "20px 24px 12px" }}>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: "#000080" }}>
                "A bespoke client and project management system - built for running a freelance software business."
              </div>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#333", lineHeight: 1.7, marginTop: 12 }}>
                This is the internal system I use to manage every client and project. It tracks projects through a fixed delivery pipeline, generates contracts and invoices, handles e-signatures, and sends automated email notifications at every stage.
              </p>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#333", lineHeight: 1.7 }}>
                If you start a project with me, you will receive login credentials to the Client Portal - where you can view your project status, sign documents, and track deadlines. All communication about your build happens here.
              </p>

              <CmInset style={{ borderLeft: `3px solid ${CM_COLORS.navy}`, marginBottom: 16 }}>
                <div style={{ fontSize: 10.5, lineHeight: 1.7 }}>
                  📋 Access is private. No public demo is available.<br />
                  &nbsp;&nbsp;&nbsp;This page exists to show what the system does.
                </div>
              </CmInset>

              <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
                <CmStatBox value="13" label="Email Templates" />
                <CmStatBox value="2-sided" label="Portal Roles" />
                <CmStatBox value="6" label="Doc Types" />
                <CmStatBox value="JMD" label="Currency" />
              </div>

              <CmSlideshow />
            </div>
          </div>

          {/* ============ BOTTOM SECTION - desktop ============ */}
          <div style={{
            position: "relative",
            overflow: "visible",
            background: "#008080",
            minHeight: isMobile ? undefined : 780,
            paddingBottom: isMobile ? undefined : 40,
          }}>
            {!isMobile && (
              <div style={{
                position: "absolute", top: 12, left: 12,
                display: "flex", flexDirection: "column", gap: 16,
                padding: 12, zIndex: 1,
              }}>
                {desktopIcons.map((d) => (
                  <div
                    key={d.id}
                    onDoubleClick={() => handleTaskbarClick(d.id)}
                    style={{
                      width: 72, display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 4, cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: 24 }}>{d.icon}</div>
                    <div style={{
                      fontFamily: "'VT323', monospace", fontSize: 11, color: "#fff",
                      textAlign: "center", textShadow: "1px 1px 1px rgba(0,0,0,0.6)",
                    }}>
                      {d.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{
              display: isMobile ? "flex" : "block",
              flexDirection: "column",
              gap: isMobile ? 12 : 0,
              padding: isMobile ? 12 : 0,
              position: isMobile ? undefined : "relative",
              minHeight: isMobile ? undefined : 700,
              minWidth: isMobile ? undefined : 900,
            }}>
              {/* WINDOW 1 - Client Manager.exe */}
              {windowState.cm !== "closed" && windowState.cm !== "minimized" && (
              <Win95Window
                title="Client Manager.exe" icon="🖥"
                onFocus={() => bringToFront("cm")}
                zIndex={zOf("cm")}
                defaultPos={{ top: 20, left: 100 }}
                isMobile={isMobile}
                maximized={maximized.cm}
                onMinimize={() => minimizeWindow("cm")}
                onToggleMaximize={() => toggleMaximize("cm")}
                onClose={() => closeWindow("cm")}
                style={{ width: isMobile ? "100%" : 400 }}
              >
                <div style={{ background: "#c0c0c0", borderBottom: "1px solid #808080", padding: "2px 6px", display: "flex", gap: 14, fontSize: 11, marginTop: -10, marginLeft: -10, marginRight: -10, marginBottom: 10 }}>
                  {["File", "View", "Clients", "Calendar", "Settings"].map((m) => <span key={m}>{m}</span>)}
                </div>

                <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                  <CmStatBox value="3" label="Active" />
                  <CmStatBox value="1" label="Attention" color={CM_COLORS.red} />
                  <CmStatBox value="2" label="On Track" color="#008000" />
                  <CmStatBox value="0" label="Late Fees" />
                </div>

                <CmInset>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700 }}><span style={{ color: "#008000" }}>✅ ON TRACK</span> - Ellis Rogers</span>
                    <span style={{ color: "#666", fontSize: 10 }}>Large · Deposit</span>
                  </div>
                  <div style={{
                    display: "inline-block", background: CM_COLORS.yellow,
                    padding: "2px 6px", fontSize: 10, margin: "6px 0", border: "1px solid #808080",
                  }}>
                    ⚡ Next: Deposit pending confirmation
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, margin: "6px 0" }}>
                    <span>Fee: JMD $23,456,234</span>
                    <span>Update: Every other Friday</span>
                  </div>
                  <div style={{ height: 16, background: "#c0c0c0", ...CM_INSET_BORDER, position: "relative", display: "flex", alignItems: "center" }}>
                    <div style={{
                      height: "100%", width: "40%", background: CM_COLORS.navy,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ color: "#fff", fontSize: 9, whiteSpace: "nowrap" }}>Contract Stage</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 9.5, color: "#333", marginTop: 8 }}>
                    🚀 Stage 1: Oct 2 · 🔧 Stage 2: Oct 12 · 🔍 Review: Oct 7
                  </div>
                </CmInset>

                <ul style={featureListStyle}>
                  <li>✦ Brief → Contract → Deposit → Dev → Stage 1/2 → Complete</li>
                  <li>✦ Maintenance: Active / Paused / Cancelled</li>
                  <li>✦ Late review tracking + automatic deadline extension</li>
                  <li>✦ Escalating late fees + tiered unarchiving calculator</li>
                  <li>✦ Contract amendment versioning system</li>
                </ul>

                <CmInset style={{ marginTop: 10, borderLeft: `3px solid ${CM_COLORS.navy}` }}>
                  <div style={{ fontSize: 10, lineHeight: 1.6 }}>
                    📋 If you start a project, you get login credentials
                    to the Client Portal. All project updates,
                    documents, and notifications flow through here.
                  </div>
                </CmInset>
              </Win95Window>
              )}

              {/* WINDOW 2 - Client Portal.exe */}
              {windowState.portal !== "closed" && windowState.portal !== "minimized" && (
              <Win95Window
                title="Client Portal.exe" icon="👤"
                onFocus={() => bringToFront("portal")}
                zIndex={zOf("portal")}
                defaultPos={{ top: 40, left: 520 }}
                isMobile={isMobile}
                maximized={maximized.portal}
                onMinimize={() => minimizeWindow("portal")}
                onToggleMaximize={() => toggleMaximize("portal")}
                onClose={() => closeWindow("portal")}
                style={{ width: isMobile ? "100%" : 320, titlebarBg: "linear-gradient(90deg, #1a4a1a, #2d8a2d)" }}
              >
                <div style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#000080" }}>Welcome, Ellis Rogers</div>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 8 }}>Here's an overview of your project(s).</div>

                <CmInset>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700 }}>Test Project</span>
                    <span style={{ fontSize: 9, color: "#666" }}>Large · Deposit</span>
                  </div>
                  <CmInset style={{ background: CM_COLORS.blue, margin: "6px 0", fontSize: 10 }}>
                    Your deposit invoice is ready.
                  </CmInset>
                  <CmInset style={{ background: "#ffe0e0", color: CM_COLORS.red, fontSize: 10, marginBottom: 6 }}>
                    ⚠ Deposit outstanding - Blocking: developer cannot proceed.
                  </CmInset>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 10 }}>
                    <div>Fee: JMD $23,456,234</div>
                    <div>Update day: Friday</div>
                    <div>Deposit: Unpaid</div>
                    <div>Midpoint: N/A</div>
                  </div>
                  <div style={{ fontSize: 10, marginTop: 8, textDecoration: "underline", color: "#000080" }}>
                    View Contract · Deposit Invoice · Final Invoice · Maintenance
                  </div>
                </CmInset>

                <ul style={featureListStyle}>
                  <li>✦ Clients see only their own project(s)</li>
                  <li>✦ Plain-language alerts with countdowns</li>
                  <li>✦ E-signature on all documents</li>
                  <li>✦ Shared calendar with all key deadlines</li>
                  <li>✦ Focus-based refetch - alerts always current</li>
                </ul>
              </Win95Window>
              )}

              {/* WINDOW 3 - Notifications.exe */}
              {windowState.notify !== "closed" && windowState.notify !== "minimized" && (
              <Win95Window
                title="Notifications.exe" icon="📬"
                onFocus={() => bringToFront("notify")}
                zIndex={zOf("notify")}
                defaultPos={{ top: 280, left: 100 }}
                isMobile={isMobile}
                maximized={maximized.notify}
                onMinimize={() => minimizeWindow("notify")}
                onToggleMaximize={() => toggleMaximize("notify")}
                onClose={() => closeWindow("notify")}
                style={{ width: isMobile ? "100%" : 360, titlebarBg: "linear-gradient(90deg, #800000, #c04040)" }}
              >
                <CmInset style={{ background: "#0a0a0a", fontSize: 10, lineHeight: 1.9 }}>
                  <div style={{ color: "#00ff00" }}>[09:41:22] CONTRACT_SIGNED     Ellis Rogers → Test Project</div>
                  <div style={{ color: "#4488ff" }}>[09:38:10] DEPOSIT_INVOICE     Generated - Ellis Rogers</div>
                  <div style={{ color: "#ffff00" }}>[09:15:04] STATUS_CHANGE       Brief → Contract</div>
                  <div style={{ color: "#ffffff" }}>[08:52:11] CLIENT_REGISTERED   Ellis Rogers joined portal</div>
                  <div style={{ color: "#4488ff" }}>[08:30:00] PROJECT_CREATED     Test Project (Large)</div>
                </CmInset>

                <CmInset style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 28 }}>📨</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10.5, marginBottom: 8 }}>
                      Ellis Rogers signed the contract for "Test Project". Next: Generate deposit invoice.
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <CmButton>OK</CmButton>
                      <CmButton>View Project</CmButton>
                    </div>
                  </div>
                </CmInset>

                <ul style={featureListStyle}>
                  <li>✦ 13 lifecycle email templates</li>
                  <li>✦ Emails sent on every status change automatically</li>
                  <li>✦ Developer notified instantly on document signing</li>
                  <li>✦ Server-side Gmail SMTP - origin-locked for security</li>
                </ul>
              </Win95Window>
              )}

              {/* WINDOW 4 - Contract Viewer.exe */}
              {windowState.contract !== "closed" && windowState.contract !== "minimized" && (
              <Win95Window
                title="Contract Viewer.exe" icon="📄"
                onFocus={() => bringToFront("contract")}
                zIndex={zOf("contract")}
                defaultPos={{ top: 280, left: 480 }}
                isMobile={isMobile}
                maximized={maximized.contract}
                onMinimize={() => minimizeWindow("contract")}
                onToggleMaximize={() => toggleMaximize("contract")}
                onClose={() => closeWindow("contract")}
                style={{ width: isMobile ? "100%" : 320 }}
              >
                <div style={{ background: "#fff", ...CM_INSET_BORDER }}>
                  {[
                    ["📄", "Contract", "Scope, timeline, terms"],
                    ["💰", "Deposit Invoice", "Upfront payment"],
                    ["💰", "Midpoint Invoice", "Medium/Large only"],
                    ["💰", "Final Invoice", "On completion"],
                    ["📝", "Amendment", "Scope changes, versioned"],
                    ["🔧", "Maintenance", "Ongoing support agreement"],
                  ].map(([icon, name, desc], i) => (
                    <div key={name} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "5px 8px", fontSize: 10,
                      borderBottom: i < 5 ? "1px solid #c0c0c0" : "none",
                    }}>
                      <span>{icon} {name} - {desc}</span>
                      <CmButton style={{ fontSize: 9, padding: "1px 6px" }}>View</CmButton>
                    </div>
                  ))}
                </div>

                <CmInset style={{ marginTop: 10, fontSize: 10, lineHeight: 1.7 }}>
                  ✍ SIGNATURE BLOCK<br />
                  ━━━━━━━━━━━━━━━━━━━━━━━━━━<br />
                  Client types name + confirms<br />
                  → Timestamp written to Firestore<br />
                  → Developer notified by email<br />
                  ━━━━━━━━━━━━━━━━━━━━━━━━━━<br />
                  Status: ⏳ Awaiting signature
                </CmInset>

                <ul style={featureListStyle}>
                  <li>✦ All documents generated from live project data</li>
                  <li>✦ Sequential invoice numbering</li>
                  <li>✦ Amendment versioning (v1, v2, v3...)</li>
                  <li>✦ Signature stored in Firestore with timestamp</li>
                </ul>
              </Win95Window>
              )}
            </div>

            {!isMobile && (
              <div style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                background: "#c0c0c0",
                borderTop: "2px solid #ffffff",
                padding: "2px 4px",
                display: "flex", alignItems: "center", gap: 4,
                height: 30, zIndex: 9999,
              }}>
                <div style={{ ...CM_RAISED_BORDER, background: "#c0c0c0", padding: "3px 10px", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                  ⊞ Start
                </div>
                <div style={{ width: 1, height: 20, background: "#808080", margin: "0 2px" }} />
                {Object.keys(windowMeta).map((id) => {
                  const active = windowState[id] === "open" && windowOrder[windowOrder.length - 1] === id;
                  return (
                    <div
                      key={id}
                      onClick={() => handleTaskbarClick(id)}
                      style={{
                        ...(active ? CM_INSET_BORDER : CM_RAISED_BORDER),
                        background: "#c0c0c0",
                        padding: "3px 10px", fontSize: 10.5, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 4,
                        opacity: windowState[id] === "open" ? 1 : 0.6,
                        fontStyle: windowState[id] === "closed" ? "italic" : "normal",
                      }}
                    >
                      {windowMeta[id].icon} {windowMeta[id].label}
                    </div>
                  );
                })}
                <div
                  onClick={onNextProject}
                  style={{
                    marginLeft: "auto", ...CM_RAISED_BORDER, background: "#c0c0c0",
                    padding: "3px 10px", fontSize: 10.5, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Next Project →
                </div>
                <div style={{ ...CM_INSET_BORDER, background: "#c0c0c0", padding: "3px 10px", fontSize: 10.5 }}>
                  {clock}
                </div>
              </div>
            )}

            {isMobile && (
              <div style={{ padding: "0 12px 20px" }}>
                <button
                  onClick={onNextProject}
                  style={{
                    width: "100%", background: "#c0c0c0", ...CM_RAISED_BORDER,
                    padding: "10px", fontSize: 12, fontWeight: 700,
                    fontFamily: "'Share Tech Mono', monospace", cursor: "pointer",
                  }}
                >
                  Next Project →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

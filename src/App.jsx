import { useState, useEffect } from "react";
import {
  MessageSquare, LayoutGrid, User, Wrench, Mail,
  Sun, ArrowUp, ChevronDown
} from "lucide-react";

const ACCENT = "#C4622D";
const CREAM = "#F5F2EA";
const SIDEBAR_BG = "#EDE9DF";
const BORDER = "#DDD9CF";
const TEXT = "#1B1814";
const MUTED = "#7A7268";
const LIGHT = "#A8A096";
const PROMPT_BG = "#E8E4DA";

const NAV = [
  { id: "chat",     label: "Chat",     Icon: MessageSquare },
  { id: "projects", label: "Projects", Icon: LayoutGrid },
  { id: "about",    label: "About",    Icon: User },
  { id: "services", label: "Services", Icon: Wrench },
  { id: "contact",  label: "Contact",  Icon: Mail },
];

const PROMPTS = [
  { label: "What have you built?",        section: "projects" },
  { label: "Tell me about Prakash",        section: "about"    },
  { label: "What can he build for me?",    section: "services" },
  { label: "What is Prakash working on?",  section: "projects" },
];

export default function Portfolio() {
  const [section, setSection] = useState("chat");
  const [input, setInput]     = useState("");
  const [hoveredPrompt, setHoveredPrompt] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  const handleSubmit = () => {
    const match = PROMPTS.find(p => p.label === input);
    if (match) { setSection(match.section); setInput(""); }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
      background: CREAM, color: TEXT,
    }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 196, minWidth: 196,
        background: SIDEBAR_BG,
        borderRight: `1px solid ${BORDER}`,
        display: "flex", flexDirection: "column",
      }}>
        {/* Brand */}
        <div style={{ padding: "20px 18px 18px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontWeight: 500, fontSize: 13.5, letterSpacing: "-0.01em" }}>PK-1</div>
          <div style={{ fontSize: 11.5, color: MUTED, marginTop: 3, lineHeight: 1.4 }}>
            Prakash's portfolio assistant.
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px" }}>
          {NAV.map(({ id, label, Icon }) => {
            const active = section === id;
            return (
              <button
                key={id}
                onClick={() => setSection(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  width: "100%", padding: "7px 10px",
                  borderRadius: 6, border: "none", cursor: "pointer",
                  fontSize: 13, fontFamily: "'Inter', sans-serif",
                  fontWeight: active ? 500 : 400,
                  color: active ? ACCENT : "#5A5248",
                  background: active ? "#E0D9CC" : "transparent",
                  textAlign: "left",
                  transition: "background 0.12s ease, color 0.12s ease",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#E5E1D6"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={14} strokeWidth={active ? 2 : 1.5} style={{ flexShrink: 0 }} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "14px 18px", borderTop: `1px solid ${BORDER}` }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 12.5, color: MUTED, fontFamily: "'Inter', sans-serif",
            padding: 0,
          }}>
            <Sun size={13} />
            Theme
            <ChevronDown size={11} style={{ marginLeft: 2 }} />
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{
        flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Viewport */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {section === "chat"     && <ChatView onPromptClick={setInput} hoveredPrompt={hoveredPrompt} setHoveredPrompt={setHoveredPrompt} />}
          {section === "projects" && <SectionView title="Projects" sub="A selection of things I've built." />}
          {section === "about"    && <SectionView title="About" sub="A bit about me." />}
          {section === "services" && <SectionView title="Services" sub="What I can build for you." />}
          {section === "contact"  && <SectionView title="Contact" sub="Get in touch." />}
        </div>

        {/* ── Persistent Input Bar ── */}
        <div style={{
          padding: "14px 28px 18px",
          borderTop: `1px solid ${BORDER}`,
          background: CREAM,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#EDE9DF",
            border: `1px solid ${input ? ACCENT + "55" : BORDER}`,
            borderRadius: 10, padding: "9px 10px 9px 14px",
            transition: "border-color 0.15s ease",
          }}>
            <span
              onKeyDown={handleKey}
              style={{
                flex: 1, fontSize: 13.5,
                color: input ? TEXT : LIGHT,
                cursor: "default", userSelect: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {input || "Ask PK-1 anything…"}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!input}
              style={{
                width: 30, height: 30, borderRadius: 7,
                border: "none", cursor: input ? "pointer" : "default",
                background: input ? ACCENT : BORDER,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s ease", flexShrink: 0,
              }}
            >
              <ArrowUp size={15} color={input ? "#fff" : LIGHT} strokeWidth={2} />
            </button>
          </div>
          <p style={{
            fontSize: 11, color: LIGHT, textAlign: "center",
            margin: "7px 0 0", letterSpacing: "0.01em",
          }}>
            PK-1 can make mistakes. Verify important information.
          </p>
        </div>
      </main>
    </div>
  );
}

function ChatView({ onPromptClick, hoveredPrompt, setHoveredPrompt }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      minHeight: "100%", padding: "48px 40px 32px",
      boxSizing: "border-box",
    }}>
      <div style={{ width: "100%", maxWidth: 560 }}>

        {/* Eyebrow */}
        <div style={{
          fontSize: 12, fontWeight: 500, color: ACCENT,
          letterSpacing: "0.06em", textTransform: "uppercase",
          marginBottom: 16,
        }}>
          PK-1
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 54, fontWeight: 400,
          lineHeight: 1.08, letterSpacing: "-0.025em",
          color: TEXT, margin: "0 0 22px",
        }}>
          Hey, I'm Prakash.
        </h1>

        {/* Intro */}
        <p style={{
          fontSize: 15, lineHeight: 1.72, color: "#4E4840",
          margin: "0 0 8px", maxWidth: 460,
        }}>
          I build digital products, developer tools, and clean interfaces
          that solve real problems.
        </p>
        <p style={{
          fontSize: 13.5, lineHeight: 1.65, color: MUTED,
          margin: "0 0 40px",
        }}>
          PK-1 is my portfolio assistant. Ask anything or explore using the sidebar.
        </p>

        {/* Prompt grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 9,
        }}>
          {PROMPTS.map((p) => (
            <button
              key={p.label}
              onClick={() => onPromptClick(p.label)}
              onMouseEnter={() => setHoveredPrompt(p.label)}
              onMouseLeave={() => setHoveredPrompt(null)}
              style={{
                padding: "11px 15px",
                background: hoveredPrompt === p.label ? "#E0DACF" : PROMPT_BG,
                border: `1px solid ${hoveredPrompt === p.label ? "#CCC7BB" : BORDER}`,
                borderRadius: 8, cursor: "pointer",
                textAlign: "left", fontSize: 13.5,
                color: "#353028", lineHeight: 1.45,
                fontFamily: "'Inter', sans-serif",
                transition: "background 0.12s ease, border-color 0.12s ease",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionView({ title, sub }) {
  return (
    <div style={{
      padding: "44px 48px 32px",
      minHeight: "100%", boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: ACCENT, flexShrink: 0,
        }} />
        <h2 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 30, fontWeight: 400, letterSpacing: "-0.015em",
          color: TEXT, margin: 0,
        }}>
          {title}
        </h2>
      </div>
      <p style={{ fontSize: 13.5, color: MUTED, margin: "0 0 36px 18px" }}>{sub}</p>

      {/* Placeholder */}
      <div style={{
        border: `1px dashed ${BORDER}`,
        borderRadius: 10, minHeight: 260,
        display: "flex", alignItems: "center",
        justifyContent: "center", flexDirection: "column",
        gap: 8, color: LIGHT,
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke={LIGHT} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 9h18M9 21V9" />
        </svg>
        <span style={{ fontSize: 13 }}>Content coming soon.</span>
      </div>
    </div>
  );
}

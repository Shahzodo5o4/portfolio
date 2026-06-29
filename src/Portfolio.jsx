import { useState, useEffect, useRef } from "react";
import {
  Github, Linkedin, Mail, Phone, MapPin, ArrowRight, ArrowDown,
  Sun, Moon, Database, Code2, Brain, Map as MapIcon, GraduationCap,
  Briefcase, Award, ExternalLink, Send, Menu, X, Languages, Check,
} from "lucide-react";

/* ============================================================================
   Shahzod Bahronov — Data Analyst Portfolio
   Single-file React component (Tailwind core utilities + lucide-react icons).
   Theming is handled with React state + token strings (no `dark:` variant) so
   it works reliably in the preview sandbox. Scroll animations use the native
   IntersectionObserver, and prefers-reduced-motion is respected.
   ========================================================================== */

/* ---------- CV data (single source of truth) ------------------------------ */
const PROFILE = {
  name: "Shahzod Bahronov",
  title: "Data Analyst",
  location: "Tashkent, Uzbekistan",
  email: "shahzod.bahronov05@gmail.com",
  phone: "+998 94 426 22 40",
  summary:
    "Data analyst with a Computer Engineering background, turning raw data into clear, actionable insights with SQL, Python, and Tableau. Google-certified across the full analytics workflow — from data cleaning to business intelligence.",
  socials: {
    github: "#", // ← replace with real GitHub URL
    linkedin: "#", // ← replace with real LinkedIn URL
  },
};

// Quick "at a glance" stats shown in the hero (mono = data-console feel).
const STATS = [
  { label: "Google certs", value: "4" },
  { label: "ML projects", value: "2" },
  { label: "English", value: "IELTS 6.5" },
];

const SKILL_GROUPS = [
  { icon: Database, title: "Data Analysis & BI", items: ["SQL", "Tableau", "Excel", "Google Sheets", "Pattern Recognition"] },
  { icon: Code2, title: "Programming", items: ["Python (pandas, NumPy)", "SQL"] },
  { icon: Brain, title: "Machine Learning", items: ["Supervised & Unsupervised Learning", "Deep Learning basics"] },
  { icon: MapIcon, title: "Tools & Geospatial", items: ["QGIS", "Remote Sensing"] },
];

const LANGUAGES = [
  { name: "Uzbek", level: "Native" },
  { name: "English", level: "IELTS 6.5 (B2)" },
  { name: "Russian", level: "B1" },
];

const PROJECTS = [
  {
    title: "AquaMonitor v2.0",
    subtitle: "Satellite-Based Water Reservoir Monitoring",
    timeline: "Mar 2025 – May 2025",
    description:
      "A monitoring system that tracks water reservoir levels from Sentinel-2 multispectral satellite imagery, using deep learning for automated water-body segmentation and change detection over time. Geospatial data is processed and visualized in QGIS.",
    tech: ["Python", "Deep Learning", "Sentinel-2", "QGIS", "Remote Sensing"],
  },
  {
    title: "AI Traffic Object Detection",
    subtitle: "Driver Assistance (ADAS)",
    timeline: "2025",
    description:
      "A real-time traffic object detection system for advanced driver-assistance. An ensemble architecture combining YOLOv8s and MobileNetV3 handles detection and classification, deployed in a Flask web application with browser-playable video output.",
    tech: ["Python", "YOLOv8s", "MobileNetV3", "Flask", "Computer Vision"],
  },
];

// Combined, date-ordered timeline of roles and study.
const TIMELINE = [
  {
    kind: "experience", role: "Assistant Teacher — Cisco CCNA",
    org: "Quick Education Group NTM, Tashkent", date: "Jun 2025 – Jul 2025",
    points: ["Taught core principles of system and network administration", "Demonstrated configuration of real-world networking devices"],
  },
  {
    kind: "experience", role: "Data Science Project — Team Member",
    org: "Tashkent University of Information Technologies", date: "Mar 2025 – May 2025",
    points: ["Conducted data collection and research to support team decisions", "Prepared regular progress reports and reviews"],
  },
  {
    kind: "education", role: "B.Sc. in Computer Engineering",
    org: "Tashkent University of Information Technologies", date: "Sep 2022 – May 2026",
    points: ["Foundation across programming, data, and engineering"],
  },
];

const CERTS = [
  { name: "Google Data Analytics", issuer: "Professional Certificate", featured: true },
  { name: "Google Advanced Data Analytics", issuer: "Certificate", featured: true },
  { name: "Google Business Intelligence", issuer: "Certificate", featured: true },
  { name: "Mathematics for Machine Learning", issuer: "and Data Science", featured: false },
  { name: "Cisco CCNA 200-301", issuer: "Networking", featured: false },
];

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "timeline", label: "Experience" },
  { id: "certs", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

/* ---------- small hooks / helpers ----------------------------------------- */

// Returns true once the element scrolls into view (one-shot), for reveal anims.
function useReveal(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

// Wrapper that fades + lifts its children in when scrolled into view.
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, shown] = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function smoothTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ========================================================================== */

export default function Portfolio() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("about");

  // Theme tokens — every color decision flows from here.
  const c = isDark
    ? {
        bg: "bg-slate-950", text: "text-slate-100", muted: "text-slate-400",
        card: "bg-slate-900", cardHover: "hover:border-cyan-400",
        border: "border-slate-800", navBg: "bg-slate-950", chip: "bg-slate-800 text-slate-300",
        soft: "bg-slate-900", rule: "bg-slate-800",
      }
    : {
        bg: "bg-slate-50", text: "text-slate-900", muted: "text-slate-500",
        card: "bg-white", cardHover: "hover:border-cyan-500",
        border: "border-slate-200", navBg: "bg-white", chip: "bg-slate-100 text-slate-600",
        soft: "bg-white", rule: "bg-slate-200",
      };
  const accent = isDark ? "text-cyan-400" : "text-cyan-600";
  const accentBg = isDark ? "bg-cyan-400" : "bg-cyan-500";

  // Lightweight scrollspy to highlight the active nav link.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const go = (id) => { setMenuOpen(false); smoothTo(id); };

  // Background grid + glow (inline styles → not bound by Tailwind core utils).
  const gridStyle = {
    backgroundImage: isDark
      ? "linear-gradient(rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.05) 1px, transparent 1px)"
      : "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
    backgroundSize: "44px 44px",
  };
  const glowStyle = {
    background: isDark
      ? "radial-gradient(600px circle at 70% 10%, rgba(34,211,238,0.12), transparent 60%), radial-gradient(500px circle at 10% 30%, rgba(16,185,129,0.10), transparent 55%)"
      : "radial-gradient(600px circle at 70% 10%, rgba(8,145,178,0.10), transparent 60%), radial-gradient(500px circle at 10% 30%, rgba(16,185,129,0.08), transparent 55%)",
  };

  return (
    <div className={`${c.bg} ${c.text} min-h-screen font-sans transition-colors duration-500`}>
      {/* ---------------- NAV ---------------- */}
      <header className={`${c.navBg} ${c.border} border-b sticky top-0 z-50`}>
        <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <button onClick={() => go("about")} className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight">
            <span className={accent}>{"</>"}</span>
            <span>shahzod.dev</span>
          </button>

          {/* desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  active === s.id ? accent : `${c.muted} hover:${isDark ? "text-slate-100" : "text-slate-900"}`
                }`}
              >
                {s.label}
              </button>
            ))}
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} c={c} />
          </div>

          {/* mobile controls */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} c={c} />
            <button onClick={() => setMenuOpen(!menuOpen)} className={`p-2 rounded-md ${c.muted}`} aria-label="Menu">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* mobile menu */}
        {menuOpen && (
          <div className={`md:hidden ${c.border} border-t px-5 py-3 flex flex-col`}>
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => go(s.id)} className={`text-left px-2 py-2.5 text-sm rounded-md ${active === s.id ? accent : c.muted}`}>
                {s.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ---------------- HERO ---------------- */}
      <section id="about" className="relative overflow-hidden" style={{ scrollMarginTop: "70px" }}>
        <div className="absolute inset-0 pointer-events-none" style={gridStyle} />
        <div className="absolute inset-0 pointer-events-none" style={glowStyle} />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <Reveal>
            <p className={`font-mono text-xs sm:text-sm ${accent} mb-5 flex items-center gap-2`}>
              <span className={`inline-block w-8 h-px ${accentBg}`} />
              AVAILABLE FOR DATA ROLES · {PROFILE.location.toUpperCase()}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              {PROFILE.name.split(" ")[0]}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                {PROFILE.name.split(" ")[1]}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className={`mt-3 text-lg sm:text-2xl font-medium ${c.muted}`}>
              {PROFILE.title}
              <span className={accent}> // </span>
              turning data into decisions
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className={`mt-6 max-w-2xl text-base sm:text-lg leading-relaxed ${c.muted}`}>{PROFILE.summary}</p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => go("projects")}
                className={`${accentBg} text-slate-950 font-semibold px-5 py-3 rounded-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5`}
              >
                View my work <ArrowRight size={18} />
              </button>
              <button
                onClick={() => go("contact")}
                className={`${c.border} border ${c.text} font-semibold px-5 py-3 rounded-lg flex items-center gap-2 transition-colors ${c.cardHover}`}
              >
                Contact me <Mail size={18} />
              </button>
            </div>
          </Reveal>

          {/* hero stat strip */}
          <Reveal delay={320}>
            <div className={`mt-12 grid grid-cols-3 gap-3 max-w-lg`}>
              {STATS.map((s) => (
                <div key={s.label} className={`${c.card} ${c.border} border rounded-xl px-4 py-3`}>
                  <div className={`font-mono text-xl sm:text-2xl font-bold ${accent}`}>{s.value}</div>
                  <div className={`text-xs ${c.muted} mt-0.5`}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-14 hidden sm:flex">
            <button onClick={() => go("skills")} className={`${c.muted} flex items-center gap-2 text-sm font-mono`}>
              <ArrowDown size={16} className="animate-bounce" /> scroll
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- SKILLS ---------------- */}
      <Section id="skills" eyebrow="01 — Toolkit" title="Skills dashboard" c={c} accent={accent} accentBg={accentBg}>
        <div className="grid sm:grid-cols-2 gap-4">
          {SKILL_GROUPS.map((g, i) => {
            const Icon = g.icon;
            return (
              <Reveal key={g.title} delay={i * 80}>
                <div className={`${c.card} ${c.border} border ${c.cardHover} rounded-2xl p-6 h-full transition-colors`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`${c.soft} ${c.border} border rounded-lg p-2 ${accent}`}>
                      <Icon size={20} />
                    </span>
                    <h3 className="font-semibold">{g.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((it) => (
                      <span key={it} className={`${c.chip} text-sm px-3 py-1 rounded-full`}>{it}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* languages */}
        <Reveal delay={120}>
          <div className={`${c.card} ${c.border} border rounded-2xl p-6 mt-4`}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`${c.soft} ${c.border} border rounded-lg p-2 ${accent}`}><Languages size={20} /></span>
              <h3 className="font-semibold">Languages</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {LANGUAGES.map((l) => (
                <div key={l.name} className={`${c.soft} ${c.border} border rounded-xl px-4 py-3`}>
                  <div className="font-medium">{l.name}</div>
                  <div className={`font-mono text-sm ${accent}`}>{l.level}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ---------------- PROJECTS ---------------- */}
      <Section id="projects" eyebrow="02 — Selected work" title="Featured projects" c={c} accent={accent} accentBg={accentBg}>
        <div className="grid lg:grid-cols-2 gap-5">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <article className={`${c.card} ${c.border} border ${c.cardHover} rounded-2xl p-6 sm:p-7 h-full flex flex-col transition-colors`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{p.title}</h3>
                    <p className={`text-sm ${accent} font-medium`}>{p.subtitle}</p>
                  </div>
                  <span className={`font-mono text-xs ${c.muted} whitespace-nowrap pt-1`}>{p.timeline}</span>
                </div>
                <p className={`mt-4 text-sm leading-relaxed ${c.muted} flex-1`}>{p.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className={`${c.chip} font-mono text-xs px-2.5 py-1 rounded-md`}>{t}</span>
                  ))}
                </div>
                <div className={`mt-6 pt-5 ${c.border} border-t flex gap-3`}>
                  <a href="#" className={`flex items-center gap-1.5 text-sm font-medium ${c.muted} hover:${accent.replace("text-", "text-")} transition-colors`}>
                    <Github size={16} /> Code
                  </a>
                  <a href="#" className={`flex items-center gap-1.5 text-sm font-medium ${accent}`}>
                    <ExternalLink size={16} /> Live demo
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------- TIMELINE ---------------- */}
      <Section id="timeline" eyebrow="03 — Journey" title="Experience & education" c={c} accent={accent} accentBg={accentBg}>
        <div className="relative">
          {/* vertical rail */}
          <div className={`absolute left-3 top-1 bottom-1 w-px ${c.rule}`} />
          <div className="space-y-6">
            {TIMELINE.map((item, i) => {
              const Icon = item.kind === "education" ? GraduationCap : Briefcase;
              return (
                <Reveal key={i} delay={i * 80}>
                  <div className="relative pl-12">
                    <span className={`absolute left-0 top-0.5 ${c.card} ${c.border} border rounded-full p-1.5 ${accent}`}>
                      <Icon size={16} />
                    </span>
                    <div className={`${c.card} ${c.border} border rounded-2xl p-5`}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h3 className="font-semibold">{item.role}</h3>
                        <span className={`font-mono text-xs ${c.muted}`}>{item.date}</span>
                      </div>
                      <p className={`text-sm ${accent} mt-0.5`}>{item.org}</p>
                      <ul className="mt-3 space-y-1.5">
                        {item.points.map((pt, j) => (
                          <li key={j} className={`text-sm ${c.muted} flex gap-2`}>
                            <Check size={15} className={`${accent} mt-0.5 shrink-0`} /> {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ---------------- CERTIFICATIONS ---------------- */}
      <Section id="certs" eyebrow="04 — Credentials" title="Certifications" c={c} accent={accent} accentBg={accentBg}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CERTS.map((cert, i) => (
            <Reveal key={cert.name} delay={i * 70}>
              <div className={`${c.card} ${c.border} border ${c.cardHover} rounded-2xl p-5 h-full flex items-start gap-3 transition-colors`}>
                <span className={`${c.soft} ${c.border} border rounded-lg p-2 ${cert.featured ? accent : c.muted}`}>
                  <Award size={20} />
                </span>
                <div>
                  <h3 className="font-medium leading-snug">{cert.name}</h3>
                  <p className={`text-sm ${c.muted}`}>{cert.issuer}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------- CONTACT ---------------- */}
      <Section id="contact" eyebrow="05 — Say hello" title="Let's work together" c={c} accent={accent} accentBg={accentBg}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* direct channels */}
          <Reveal>
            <div className="space-y-3">
              <p className={`${c.muted} mb-5`}>
                Open to data analyst and analytics roles. The fastest way to reach me is email — or use the form.
              </p>
              <ContactRow icon={Mail} label="Email" value={PROFILE.email} href={`mailto:${PROFILE.email}`} c={c} accent={accent} />
              <ContactRow icon={Phone} label="Phone" value={PROFILE.phone} href={`tel:${PROFILE.phone.replace(/\s/g, "")}`} c={c} accent={accent} />
              <ContactRow icon={MapPin} label="Location" value={PROFILE.location} c={c} accent={accent} />

              <div className="flex gap-3 pt-3">
                <SocialIcon icon={Github} href={PROFILE.socials.github} label="GitHub" c={c} accent={accent} />
                <SocialIcon icon={Linkedin} href={PROFILE.socials.linkedin} label="LinkedIn" c={c} accent={accent} />
                <SocialIcon icon={Mail} href={`mailto:${PROFILE.email}`} label="Email" c={c} accent={accent} />
              </div>
            </div>
          </Reveal>

          {/* mailto form (no backend; composes an email) */}
          <Reveal delay={100}>
            <ContactForm c={c} accent={accent} accentBg={accentBg} email={PROFILE.email} />
          </Reveal>
        </div>
      </Section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className={`${c.border} border-t`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={`font-mono text-sm ${c.muted}`}>© {new Date().getFullYear()} {PROFILE.name}</p>
          <p className={`text-sm ${c.muted}`}>Built with React & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

/* ---------- reusable presentational components ----------------------------- */

function ThemeToggle({ isDark, onToggle, c }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className={`p-2 rounded-md ${c.muted} ${c.border} border transition-colors`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

// Section shell: consistent spacing + a mono eyebrow and a heading with rule.
function Section({ id, eyebrow, title, c, accent, accentBg, children }) {
  return (
    <section id={id} style={{ scrollMarginTop: "70px" }} className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
      <Reveal>
        <p className={`font-mono text-xs sm:text-sm ${accent} flex items-center gap-2 mb-3`}>
          <span className={`inline-block w-6 h-px ${accentBg}`} /> {eyebrow}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

function ContactRow({ icon: Icon, label, value, href, c, accent }) {
  const inner = (
    <div className={`${c.card} ${c.border} border rounded-xl px-4 py-3 flex items-center gap-3 transition-colors`}>
      <span className={`${accent}`}><Icon size={18} /></span>
      <div>
        <div className={`text-xs ${c.muted}`}>{label}</div>
        <div className="text-sm font-medium break-all">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{inner}</a> : inner;
}

function SocialIcon({ icon: Icon, href, label, c, accent }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`${c.card} ${c.border} border rounded-lg p-3 ${c.muted} hover:${accent.replace("text-", "text-")} transition-colors`}
    >
      <Icon size={20} />
    </a>
  );
}

// Controlled inputs + a button that opens the user's mail client (mailto).
function ContactForm({ c, accent, accentBg, email }) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");

  const send = () => {
    const subject = encodeURIComponent(`Portfolio enquiry from ${name || "someone"}`);
    const body = encodeURIComponent(`${msg}\n\n— ${name}${from ? ` (${from})` : ""}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const field = `${c.soft} ${c.border} border rounded-lg px-4 py-3 w-full text-sm outline-none focus:border-cyan-400 transition-colors`;

  return (
    <div className={`${c.card} ${c.border} border rounded-2xl p-6 space-y-3`}>
      <input className={field} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className={field} placeholder="Your email" value={from} onChange={(e) => setFrom(e.target.value)} />
      <textarea className={`${field} resize-none`} rows={4} placeholder="Your message" value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button
        onClick={send}
        className={`${accentBg} text-slate-950 font-semibold px-5 py-3 rounded-lg flex items-center justify-center gap-2 w-full transition-transform hover:-translate-y-0.5`}
      >
        Send message <Send size={16} />
      </button>
    </div>
  );
}

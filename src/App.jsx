import { useState, useEffect, useRef } from "react";

// ─── ENORA BRAND ─────────────────────────────────────────────────────────────
const T = {
  bg: "#000000",
  surface: "#0a0a0a",
  card: "#111111",
  cardBorder: "#1e1e1e",
  teal: "#2ec4b6",
  magenta: "#e8005a",
  orange: "#f4a52a",
  white: "#ffffff",
  muted: "#777777",
  subtle: "#2a2a2a",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const LEVELS = [
  { code: "A1", name: "Beginner",           color: T.teal,    desc: "Alphabet, greetings, simple words and numbers." },
  { code: "A2", name: "Elementary",         color: T.teal,    desc: "Basic communication, everyday phrases, past tense." },
  { code: "B1", name: "Intermediate",       color: T.orange,  desc: "Opinions, travel, work topics, modal verbs." },
  { code: "B2", name: "Upper-Intermediate", color: T.orange,  desc: "Complex grammar, abstract topics, academic texts." },
  { code: "C1", name: "Advanced",           color: T.magenta, desc: "Nuanced expression, academic and professional texts." },
  { code: "C2", name: "Proficient",         color: T.magenta, desc: "Near-native fluency, subtle distinctions, mastery." },
];

const NAV_ITEMS = [
  { id: "home",       label: "Home" },
  { id: "levels",     label: "Learn" },
  { id: "test",       label: "Level Test" },
  { id: "ielts",      label: "IELTS" },
  { id: "grammar",    label: "Grammar" },
  { id: "vocabulary", label: "Vocabulary" },
  { id: "writing",    label: "Writing" },
  { id: "resources",  label: "Resources" },
  { id: "blog",       label: "Blog" },
  { id: "about",      label: "About" },
];

const LEVEL_TEST_QUESTIONS = [
  { q: "Choose the correct sentence:", options: ["She go to school.", "She goes to school.", "She going to school.", "She goed to school."], answer: 1, skill: "Grammar" },
  { q: "What is the plural of 'child'?", options: ["childs", "childes", "children", "childrens"], answer: 2, skill: "Vocabulary" },
  { q: "Which word means 'happy'?", options: ["sad", "angry", "joyful", "tired"], answer: 2, skill: "Vocabulary" },
  { q: "Complete: 'If I ___ you, I would apologise.'", options: ["am", "was", "were", "be"], answer: 2, skill: "Grammar" },
  { q: "Choose the correct preposition: 'She arrived ___ Monday morning.'", options: ["in", "on", "at", "by"], answer: 1, skill: "Grammar" },
  { q: "'Despite the rain, they enjoyed the picnic.' What does 'despite' mean?", options: ["because of", "without", "in spite of", "after"], answer: 2, skill: "Reading" },
  { q: "Which sentence is in the passive voice?", options: ["The chef cooked dinner.", "Dinner was cooked by the chef.", "The chef is cooking dinner.", "The chef had cooked dinner."], answer: 1, skill: "Grammar" },
  { q: "Choose the most formal word for 'get':", options: ["grab", "obtain", "snag", "score"], answer: 1, skill: "Vocabulary" },
  { q: "Identify the error: 'He don't like coffee.'", options: ["He", "don't", "like", "coffee"], answer: 1, skill: "Grammar" },
  { q: "Which sentence uses a relative clause correctly?", options: ["The book, who I read, was great.", "The book, which I read, was great.", "The book, that I read was great.", "The book which I read, was great."], answer: 1, skill: "Grammar" },
  { q: "What does 'ubiquitous' mean?", options: ["rare", "found everywhere", "beautiful", "outdated"], answer: 1, skill: "Vocabulary" },
  { q: "'___ it rains, the match will be cancelled.'", options: ["While", "Although", "If", "Since"], answer: 2, skill: "Grammar" },
  { q: "'The economy contracted sharply.' This means:", options: ["grew quickly", "shrank significantly", "changed slightly", "improved steadily"], answer: 1, skill: "Reading" },
  { q: "Which collocates with 'make'?", options: ["make a travel", "make a mistake", "make a discussion", "make a sleep"], answer: 1, skill: "Vocabulary" },
  { q: "'Although she was tired, she continued.' Identify the clause type:", options: ["result", "purpose", "concession", "condition"], answer: 2, skill: "Grammar" },
];

const GRAMMAR_LESSONS = [
  { title: "Present Simple vs Continuous", level: "A2", content: "Use Present Simple for habits and facts. Use Present Continuous for actions happening right now. Example: 'I work in a school.' vs 'I am working on a project.'" },
  { title: "Past Perfect", level: "B1", content: "Use Past Perfect (had + past participle) for actions completed before another past action. Example: 'She had already left when I arrived.'" },
  { title: "Conditional Sentences", level: "B2", content: "Zero, First, Second, and Third conditionals express different degrees of possibility. 'If I study, I pass.' / 'If I studied, I would pass.'" },
  { title: "Passive Voice", level: "B1", content: "Form the passive with 'be + past participle'. Use it when the action matters more than who does it. Example: 'The report was written by the team.'" },
  { title: "Articles: a, an, the", level: "A1", content: "Use 'a/an' for indefinite nouns and 'the' for specific or previously mentioned nouns. 'I saw a cat. The cat was black.'" },
  { title: "Relative Clauses", level: "B2", content: "Defining relative clauses identify which person/thing. Non-defining add extra information (use commas). 'The man who called is here.' vs 'My brother, who lives in London, is visiting.'" },
];

const VOCAB_SETS = [
  { title: "Academic Word List – Set 1", level: "B2", words: ["analyse", "concept", "context", "establish", "evidence", "factors", "identify", "indicate"] },
  { title: "Daily Routines", level: "A1", words: ["wake up", "brush teeth", "have breakfast", "go to work", "have lunch", "cook dinner", "go to sleep"] },
  { title: "Business English", level: "C1", words: ["stakeholder", "synergy", "leverage", "benchmark", "paradigm", "mitigate", "facilitate"] },
  { title: "Feelings & Emotions", level: "A2", words: ["happy", "sad", "excited", "nervous", "angry", "surprised", "bored", "confused"] },
];

const BLOG_POSTS = [
  { title: "10 Tips to Improve Your Vocabulary Fast", date: "May 5, 2026", tag: "Vocabulary", excerpt: "Building a rich vocabulary doesn't have to be painful. Here are ten evidence-based strategies that really work for adult learners..." },
  { title: "How to Write a Band 7+ IELTS Essay", date: "April 28, 2026", tag: "IELTS", excerpt: "Many candidates plateau at Band 6.5. The difference between 6.5 and 7 often comes down to three key skills you can practise today..." },
  { title: "Why Reading Fiction Improves Your English", date: "April 20, 2026", tag: "Reading", excerpt: "Research consistently shows that extensive reading is one of the most efficient paths to fluency in any language..." },
  { title: "Common Grammar Mistakes & How to Fix Them", date: "April 12, 2026", tag: "Grammar", excerpt: "Whether it's subject-verb agreement or article usage, certain errors show up time and again. Let's fix them once and for all..." },
];

const RESOURCES = [
  { title: "A1–A2 Vocabulary Worksheet", type: "PDF", level: "A1/A2" },
  { title: "B1 Grammar Practice Pack", type: "PDF", level: "B1" },
  { title: "IELTS Writing Templates", type: "PDF", level: "B2–C1" },
  { title: "100 Academic Collocations", type: "PDF", level: "C1" },
  { title: "Phrasal Verbs Reference Guide", type: "PDF", level: "B1–B2" },
  { title: "IELTS Speaking Cue Cards Pack", type: "PDF", level: "B2" },
];

const FAQ = [
  { q: "Do I need to create an account?", a: "No. Everything on ENORA is free and requires no login. Just open the site and start learning." },
  { q: "Which IELTS version should I prepare for?", a: "Choose Academic for university applications; General Training for immigration, work visas, or secondary education." },
  { q: "How accurate is the Level Test?", a: "Our test gives a solid CEFR-aligned indication. For official certification, take a recognised exam like Cambridge or IELTS." },
  { q: "Can I use this site on my phone?", a: "Absolutely. ENORA is fully mobile-responsive and works on any device." },
  { q: "Is the AI writing correction free?", a: "Yes — completely free, with no usage limits." },
];

const WRITING_SYSTEM = `You are an expert English language tutor and IELTS examiner. Analyse the student's writing and provide:

**1. Grammar Feedback** – identify specific errors with corrections
**2. Vocabulary Feedback** – comment on range, accuracy, and suggest upgrades
**3. Coherence & Structure** – comment on organisation, linking, paragraph structure
**4. IELTS Band Estimate** – estimated band score with brief justification (if applicable)
**5. Improved Version** – rewrite the text at a higher level
**6. Top 3 Suggestions** – most impactful improvements

Be specific, encouraging, and educational.`;

// ─── LOGO COMPONENT ───────────────────────────────────────────────────────────

function EnoraLogo({ height = 36 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", lineHeight: 1 }}>
      <span style={{ fontFamily: "Arial Black, Impact, sans-serif", fontWeight: 900, fontSize: height, color: T.white, letterSpacing: "-1px", lineHeight: 1 }}>EN</span>
      <svg width={height * 0.82} height={height * 1.1} viewBox="0 0 50 60" style={{ display: "block", margin: "0 1px" }}>
        <ellipse cx="25" cy="30" rx="24" ry="8" fill="none" stroke={T.magenta} strokeWidth="2.2" opacity="0.95" transform="rotate(-15, 25, 30)"/>
        <circle cx="25" cy="30" r="20" fill="#0a3347"/>
        <ellipse cx="23" cy="26" rx="18" ry="12" fill={T.teal} opacity="0.85"/>
        <rect x="6" y="26" width="38" height="8" fill={T.orange} opacity="0.35" rx="2"/>
        <circle cx="32" cy="22" r="7" fill="#061e2a" opacity="0.5"/>
        <circle cx="48" cy="22" r="2.5" fill={T.magenta}/>
        <circle cx="2" cy="38" r="2.5" fill={T.magenta}/>
      </svg>
      <span style={{ fontFamily: "Arial Black, Impact, sans-serif", fontWeight: 900, fontSize: height, color: T.white, letterSpacing: "-1px", lineHeight: 1 }}>RA</span>
    </div>
  );
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

function Badge({ text, color }) {
  return (
    <span style={{
      background: color + "18", color, border: `1px solid ${color}40`,
      borderRadius: 4, padding: "2px 10px", fontSize: 10, fontWeight: 800,
      letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace",
    }}>{text}</span>
  );
}

function Card({ children, style = {}, hover = true, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: T.card, borderRadius: 12,
        border: `1px solid ${hov && accent ? accent + "55" : T.cardBorder}`,
        transition: "border-color 0.25s, transform 0.22s, box-shadow 0.22s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov && accent ? `0 8px 32px ${accent}14` : "none",
        ...style,
      }}
    >{children}</div>
  );
}

function Btn({ children, onClick, variant = "teal", style = {}, small, disabled }) {
  const [hov, setHov] = useState(false);
  const variants = {
    teal:    { background: hov ? "#1fa89c" : T.teal,    color: "#000" },
    magenta: { background: hov ? "#c4004d" : T.magenta, color: "#fff" },
    orange:  { background: hov ? "#d4881a" : T.orange,  color: "#000" },
    ghost:   { background: hov ? "#1a1a1a" : "transparent", color: T.muted, border: `1px solid ${T.subtle}` },
    white:   { background: hov ? "#e0e0e0" : T.white,   color: "#000" },
  };
  const v = variants[variant] || variants.teal;
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...v, borderRadius: 8,
        padding: small ? "7px 18px" : "12px 28px",
        fontSize: small ? 11 : 13,
        fontWeight: 800, fontFamily: "inherit",
        border: v.border || "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.18s",
        letterSpacing: 1, textTransform: "uppercase",
        ...style,
      }}>{children}</button>
  );
}

function SectionLabel({ children, color = T.muted }) {
  return (
    <div style={{ fontSize: 11, letterSpacing: 4, color, textTransform: "uppercase", fontFamily: "monospace", fontWeight: 800, marginBottom: 8 }}>
      {children}
    </div>
  );
}

function Stars() {
  const pts = Array.from({ length: 50 }, (_, i) => ({
    x: (i * 41 + 7) % 100, y: (i * 67 + 3) % 100,
    r: ((i * 17) % 3) * 0.5 + 0.5, d: (i * 0.13) % 4,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {pts.map((s, i) => (
        <div key={i} style={{
          position: "absolute", left: s.x + "%", top: s.y + "%",
          width: s.r * 2, height: s.r * 2, borderRadius: "50%",
          background: "#fff", opacity: 0.35,
          animation: `twinkle ${2 + s.d}s ease-in-out ${s.d}s infinite`,
        }}/>
      ))}
      <style>{`
        @keyframes twinkle{0%,100%{opacity:.1}50%{opacity:.7}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function HomePage({ setPage }) {
  const features = [
    { title: "A1 → C2 Levels",         desc: "Structured lessons for every CEFR level.", color: T.teal },
    { title: "AI Writing Correction",   desc: "Instant grammar, vocabulary & coherence feedback.", color: T.magenta },
    { title: "Full IELTS Preparation",  desc: "Mock tests, strategies, band score guidance.", color: T.orange },
    { title: "100% Free",               desc: "No login, no fees. Just open and learn.", color: T.teal },
    { title: "Learn Anywhere",          desc: "Fully responsive on phone, tablet, and desktop.", color: T.magenta },
    { title: "Free Worksheets",         desc: "Download PDF practice packs for offline study.", color: T.orange },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 70%, #071824 0%, #000 65%)",
        border: `1px solid ${T.cardBorder}`, borderRadius: 16,
        padding: "76px 36px 72px", textAlign: "center", marginBottom: 48,
      }}>
        <Stars />

        {/* Background planet blobs */}
        <div style={{ position: "absolute", right: -80, top: -80, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #0f3d52, #000)", opacity: 0.4, animation: "floatY 10s ease-in-out infinite" }}/>
        <div style={{ position: "absolute", left: -60, bottom: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${T.magenta}30, transparent)`, opacity: 0.6 }}/>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", marginBottom: 28 }}>
            <EnoraLogo height={52} />
          </div>
          <div style={{ fontSize: 11, letterSpacing: 6, color: T.teal, fontWeight: 800, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 22 }}>
            English Learning Platform
          </div>
          <h1 style={{
            fontSize: "clamp(26px,5vw,50px)", fontWeight: 900, color: T.white,
            margin: "0 0 18px", lineHeight: 1.1, fontFamily: "Arial Black, sans-serif",
          }}>
            Launch Your English<br />
            <span style={{ color: T.teal }}>To The Next Level</span>
          </h1>
          <p style={{ fontSize: "clamp(14px,2vw,16px)", color: T.muted, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.85 }}>
            Free, structured English from A1 to C2. Lessons, grammar, vocabulary, IELTS prep, and AI writing correction — no login required.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => setPage("levels")} style={{ padding: "13px 32px", fontSize: 13 }}>Start Learning</Btn>
            <Btn onClick={() => setPage("test")} variant="magenta" style={{ padding: "13px 32px", fontSize: 13 }}>Take Level Test</Btn>
            <Btn onClick={() => setPage("ielts")} variant="orange" style={{ padding: "13px 32px", fontSize: 13 }}>IELTS Prep</Btn>
          </div>
        </div>
      </div>

      {/* ── QUICK NAV ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 10, marginBottom: 48 }}>
        {[
          { label: "Grammar",    page: "grammar",    color: T.teal },
          { label: "Vocabulary", page: "vocabulary", color: T.orange },
          { label: "Writing",    page: "writing",    color: T.magenta },
          { label: "Resources",  page: "resources",  color: T.teal },
          { label: "Blog",       page: "blog",       color: T.orange },
          { label: "About",      page: "about",      color: T.magenta },
        ].map(item => (
          <Card key={item.page} style={{ padding: "18px 10px", textAlign: "center", cursor: "pointer" }} accent={item.color}>
            <div onClick={() => setPage(item.page)}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, margin: "0 auto 10px" }}/>
              <span style={{ fontWeight: 800, color: T.white, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace" }}>{item.label}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* ── LESSON OF THE DAY ── */}
      <div style={{
        background: "linear-gradient(135deg, #071824, #000e08)",
        border: `1px solid ${T.teal}28`, borderRadius: 14, padding: 30, marginBottom: 48,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -16, top: -16, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${T.teal}18, transparent)` }}/>
        <SectionLabel color={T.teal}>Lesson of the Day</SectionLabel>
        <h3 style={{ margin: "0 0 10px", fontSize: 21, color: T.white, fontFamily: "Arial Black, sans-serif" }}>The Present Perfect Tense</h3>
        <p style={{ margin: "0 0 18px", color: T.muted, lineHeight: 1.85, fontSize: 14 }}>
          Use <strong style={{ color: T.white }}>have/has + past participle</strong> to talk about experiences or actions connected to the present.<br />
          Example: <em style={{ color: T.teal }}>"I have visited three countries."</em>
        </p>
        <Btn onClick={() => setPage("grammar")} variant="ghost" small>Explore Grammar →</Btn>
      </div>

      {/* ── FEATURES ── */}
      <SectionLabel>Why ENORA</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 12, marginBottom: 52 }}>
        {features.map(f => (
          <Card key={f.title} style={{ padding: 24 }} accent={f.color}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.color, marginBottom: 14 }}/>
            <h3 style={{ margin: "0 0 8px", fontSize: 14, color: T.white, fontWeight: 800, letterSpacing: 0.5 }}>{f.title}</h3>
            <p style={{ margin: 0, color: T.muted, fontSize: 13, lineHeight: 1.7 }}>{f.desc}</p>
          </Card>
        ))}
      </div>

      {/* ── LEVELS ── */}
      <SectionLabel>Choose Your Level</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px,1fr))", gap: 10 }}>
        {LEVELS.map(l => (
          <Card key={l.code} style={{ padding: "20px 16px", textAlign: "center", cursor: "pointer", border: `1px solid ${l.color}20` }} accent={l.color}>
            <div onClick={() => setPage("levels")}>
              <div style={{ fontSize: 30, fontWeight: 900, color: l.color, fontFamily: "Arial Black, sans-serif", marginBottom: 4 }}>{l.code}</div>
              <div style={{ fontWeight: 800, color: T.white, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>{l.name}</div>
              <div style={{ color: T.muted, fontSize: 11, lineHeight: 1.6 }}>{l.desc.slice(0, 48)}…</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LevelsPage() {
  const [selected, setSelected] = useState(null);
  const lessonData = {
    A1: {
      lessons: ["Alphabet & Phonics", "Numbers 1–100", "Colours & Shapes", "Greetings & Introductions", "My Family", "Days & Months"],
      grammar: ["Subject Pronouns (I, you, he…)", "To be (am / is / are)", "Indefinite Articles (a / an)", "Simple plurals"],
      vocab: ["Body parts", "Animals", "Food & drink", "Common verbs: go, eat, have, like"],
      reading: "Sam is a student. He is seven years old. He has a cat. His cat is black and white. He likes his cat very much.",
      poem: "Rain, rain, go away,\nCome again another day.\nLittle children want to play,\nRain, rain, go away.",
      exercise: { type: "mcq", q: "What colour is Sam's cat?", options: ["Orange and white", "Black and white", "Brown", "Grey"], answer: 1 },
      writing: "Write 3 sentences about yourself. (Name, age, hobby)",
      speaking: "Say hello and introduce yourself. Tell a partner your name and where you are from.",
    },
    B1: {
      lessons: ["Describing experiences", "Making comparisons", "Giving opinions", "Talking about the future", "Problem-solving language"],
      grammar: ["Present Perfect vs Past Simple", "Modal verbs (should, must, might)", "Comparatives & Superlatives", "First Conditional"],
      vocab: ["Travel & tourism", "Health & lifestyle", "Work & jobs", "Linking words: however, therefore, although"],
      reading: "Climate change is one of the most pressing issues of our time. Scientists agree that global temperatures have risen significantly since the industrial revolution, largely due to human activity. Governments and individuals must act now to reduce carbon emissions before irreversible damage occurs.",
      poem: "The Road Not Taken – Robert Frost\n\nTwo roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth…",
      exercise: { type: "fill", q: "Complete: 'I have ___ (live) in this city for ten years.'", answer: "lived" },
      writing: "Write a paragraph (80–100 words) describing a place you have visited and why you enjoyed it.",
      speaking: "Describe a memorable experience from your past. Where were you? What happened? How did you feel?",
    },
    C1: {
      lessons: ["Academic writing style", "Complex argumentation", "Hedging & softening language", "Discourse markers", "Idiomatic expressions"],
      grammar: ["Inversion for emphasis", "Mixed conditionals", "Subjunctive mood", "Nominalization"],
      vocab: ["Abstract nouns", "Collocations with 'make', 'do', 'take'", "Formal vs informal register", "Nuanced adjectives"],
      reading: "The phenomenon of cognitive dissonance, first articulated by Leon Festinger in 1957, describes the psychological discomfort experienced when an individual holds two or more contradictory beliefs simultaneously. Contemporary research has expanded this concept to encompass not merely beliefs, but actions and attitudes, revealing its pervasive influence on decision-making.",
      poem: "Sonnet 18 – Shakespeare\n\nShall I compare thee to a summer's day?\nThou art more lovely and more temperate.\nRough winds do shake the darling buds of May,\nAnd summer's lease hath all too short a date…",
      exercise: { type: "mcq", q: "'Pervasive' most closely means:", options: ["occasional", "widespread", "controversial", "limited"], answer: 1 },
      writing: "Discuss: 'Social media has done more harm than good.' Write 250 words with a balanced argument.",
      speaking: "Discuss the ethical implications of AI in healthcare — consider benefits and risks.",
    },
  };

  if (selected) {
    const l = selected;
    const d = lessonData[l.code] || lessonData.B1;
    return (
      <div>
        <Btn onClick={() => setSelected(null)} variant="ghost" small style={{ marginBottom: 24 }}>← Back</Btn>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, padding: "20px 24px", border: `1px solid ${l.color}25`, borderRadius: 12, background: T.card }}>
          <span style={{ fontSize: 48, fontWeight: 900, color: l.color, fontFamily: "Arial Black, sans-serif" }}>{l.code}</span>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, color: T.white, fontFamily: "Arial Black, sans-serif" }}>{l.name}</h2>
            <p style={{ margin: 0, color: T.muted, fontSize: 13 }}>{l.desc}</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px,1fr))", gap: 16 }}>
          {[{ title: "Lessons", items: d.lessons }, { title: "Grammar", items: d.grammar }, { title: "Vocabulary", items: d.vocab }].map(s => (
            <Card key={s.title} style={{ padding: 22 }} accent={l.color}>
              <SectionLabel color={l.color}>{s.title}</SectionLabel>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {s.items.map(item => <li key={item} style={{ color: T.muted, marginBottom: 7, fontSize: 14, lineHeight: 1.6 }}>{item}</li>)}
              </ul>
            </Card>
          ))}
          <Card style={{ padding: 22 }} accent={l.color}>
            <SectionLabel color={l.color}>Reading Text</SectionLabel>
            <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.9, borderLeft: `2px solid ${l.color}50`, paddingLeft: 14, margin: 0, fontFamily: "Georgia, serif" }}>{d.reading}</p>
          </Card>
          <Card style={{ padding: 22 }} accent={l.color}>
            <SectionLabel color={l.color}>Poem / Literary Text</SectionLabel>
            <pre style={{ color: T.muted, fontSize: 13, lineHeight: 2, whiteSpace: "pre-wrap", margin: 0, borderLeft: `2px solid ${l.color}50`, paddingLeft: 14, fontFamily: "Georgia, serif" }}>{d.poem}</pre>
          </Card>
          <Card style={{ padding: 22 }} accent={l.color}>
            <SectionLabel color={l.color}>Exercise</SectionLabel>
            <p style={{ color: T.white, fontSize: 15, marginBottom: 14, fontWeight: 700 }}>{d.exercise.q}</p>
            {d.exercise.type === "mcq"
              ? <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {d.exercise.options.map((opt, i) => (
                    <div key={i} style={{ background: T.surface, border: `1px solid ${T.subtle}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontSize: 14, color: T.muted }}>
                      {String.fromCharCode(65+i)}. {opt}
                    </div>
                  ))}
                </div>
              : <input placeholder="Type your answer…" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.subtle}`, fontSize: 14, background: T.surface, color: T.white, fontFamily: "inherit", boxSizing: "border-box" }} />
            }
          </Card>
          <Card style={{ padding: 22 }} accent={l.color}>
            <SectionLabel color={l.color}>Writing Prompt</SectionLabel>
            <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{d.writing}</p>
            <textarea rows={4} placeholder="Write your response here…" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.subtle}`, fontSize: 14, background: T.surface, color: T.white, fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" }} />
          </Card>
          <Card style={{ padding: 22 }} accent={l.color}>
            <SectionLabel color={l.color}>Speaking Practice</SectionLabel>
            <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.85 }}>{d.speaking}</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionLabel>Learn by Level</SectionLabel>
      <p style={{ color: T.muted, marginBottom: 32, fontSize: 15 }}>Choose your CEFR level to access lessons, grammar, vocabulary, texts, and exercises.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(275px,1fr))", gap: 14 }}>
        {LEVELS.map(l => (
          <Card key={l.code} style={{ padding: 28, cursor: "pointer", border: `1px solid ${l.color}20` }} accent={l.color}>
            <div onClick={() => setSelected(l)}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: l.color, fontFamily: "Arial Black, sans-serif" }}>{l.code}</span>
                <div>
                  <div style={{ fontWeight: 800, color: T.white, fontSize: 16 }}>{l.name}</div>
                  <Badge text={l.code} color={l.color} />
                </div>
              </div>
              <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>{l.desc}</p>
              <Btn variant="ghost" small>Explore →</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LevelTestPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);

  const calcLevel = () => {
    const score = LEVEL_TEST_QUESTIONS.filter((q, i) => answers[i] === q.answer).length;
    const p = score / LEVEL_TEST_QUESTIONS.length;
    const idx = p < 0.2 ? 0 : p < 0.38 ? 1 : p < 0.55 ? 2 : p < 0.72 ? 3 : p < 0.88 ? 4 : 5;
    return { ...LEVELS[idx], score };
  };

  if (step === 0) return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <Card style={{ padding: 48, textAlign: "center" }}>
        <SectionLabel color={T.teal}>Level Test</SectionLabel>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: T.white, fontFamily: "Arial Black, sans-serif", marginBottom: 16 }}>Find Your Level</h2>
        <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.85, marginBottom: 28 }}>
          {LEVEL_TEST_QUESTIONS.length} questions across grammar, vocabulary, and reading.
          Takes about <strong style={{ color: T.white }}>8–12 minutes</strong>. No login required.
        </p>
        <Btn onClick={() => setStep(1)} style={{ padding: "13px 40px", fontSize: 14 }}>Begin Test →</Btn>
      </Card>
    </div>
  );

  if (step === 2) {
    const level = calcLevel();
    return (
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <Card style={{ padding: 48, textAlign: "center" }}>
          <SectionLabel color={T.teal}>Your Result</SectionLabel>
          <div style={{ border: `1px solid ${level.color}35`, borderRadius: 12, padding: "26px 40px", margin: "16px 0 24px", background: level.color + "07" }}>
            <div style={{ fontSize: 60, fontWeight: 900, color: level.color, fontFamily: "Arial Black, sans-serif" }}>{level.code}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.white, marginTop: 4 }}>{level.name}</div>
            <div style={{ color: T.muted, marginTop: 8, fontSize: 13, fontFamily: "monospace" }}>Score: {level.score}/{LEVEL_TEST_QUESTIONS.length}</div>
          </div>
          <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.85, marginBottom: 28 }}>
            We recommend starting at the <strong style={{ color: T.white }}>{level.name}</strong> level. Use our lessons and exercises to improve step by step.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Btn onClick={() => { setStep(0); setAnswers({}); setCurrent(0); }} variant="ghost">Retake</Btn>
            <Btn variant="teal">Go to {level.code} Lessons →</Btn>
          </div>
        </Card>
      </div>
    );
  }

  const q = LEVEL_TEST_QUESTIONS[current];
  const progress = (current / LEVEL_TEST_QUESTIONS.length) * 100;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: T.muted, fontSize: 11, fontFamily: "monospace", letterSpacing: 1 }}>Q {current+1} / {LEVEL_TEST_QUESTIONS.length}</span>
          <Badge text={q.skill} color={T.teal} />
        </div>
        <div style={{ background: T.subtle, borderRadius: 4, height: 3 }}>
          <div style={{ background: `linear-gradient(90deg, ${T.teal}, ${T.magenta})`, borderRadius: 4, height: 3, width: `${progress}%`, transition: "width 0.4s" }}/>
        </div>
      </div>
      <Card style={{ padding: 32 }}>
        <h3 style={{ fontSize: 17, color: T.white, marginBottom: 22, lineHeight: 1.65, fontWeight: 800 }}>{q.q}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
          {q.options.map((opt, i) => {
            const sel = answers[current] === i;
            return (
              <div key={i} onClick={() => setAnswers(a => ({ ...a, [current]: i }))} style={{
                background: sel ? T.teal + "12" : T.surface,
                border: `1px solid ${sel ? T.teal : T.subtle}`,
                borderRadius: 8, padding: "11px 18px", cursor: "pointer",
                fontSize: 14, color: sel ? T.white : T.muted,
                fontWeight: sel ? 700 : 400, transition: "all 0.15s",
              }}>
                <span style={{ marginRight: 10, fontFamily: "monospace", color: sel ? T.teal : T.subtle, fontWeight: 800 }}>{String.fromCharCode(65+i)}.</span>{opt}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Btn onClick={() => setCurrent(c => Math.max(0, c-1))} variant="ghost" small disabled={current === 0}>← Prev</Btn>
          {current < LEVEL_TEST_QUESTIONS.length - 1
            ? <Btn onClick={() => setCurrent(c => c+1)} small>Next →</Btn>
            : <Btn onClick={() => setStep(2)} variant="magenta" small>Submit ✓</Btn>
          }
        </div>
      </Card>
    </div>
  );
}

function IELTSPage({ setPage }) {
  const [sub, setSub] = useState(null);

  if (!sub) return (
    <div>
      <SectionLabel>IELTS Preparation</SectionLabel>
      <p style={{ color: T.muted, marginBottom: 32, fontSize: 15 }}>Comprehensive preparation for Academic and General Training IELTS.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        {[
          { id: "academic", title: "IELTS Academic",          desc: "University admission, professional registration.", color: T.teal },
          { id: "general",  title: "IELTS General Training",  desc: "Immigration, work visas, secondary education.",   color: T.orange },
        ].map(t => (
          <Card key={t.id} style={{ padding: 24, cursor: "pointer", textAlign: "center" }} accent={t.color}>
            <div onClick={() => setSub(t.id)}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, margin: "0 auto 12px" }}/>
              <h3 style={{ margin: "0 0 8px", fontSize: 16, color: T.white, fontWeight: 800 }}>{t.title}</h3>
              <p style={{ margin: "0 0 16px", color: T.muted, fontSize: 13 }}>{t.desc}</p>
              <Btn variant="ghost" small>Explore →</Btn>
            </div>
          </Card>
        ))}
      </div>

      <SectionLabel>Practice by Skill</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px,1fr))", gap: 12, marginBottom: 32 }}>
        {[
          { id: "listening", title: "Listening", desc: "4 sections, 40 questions. Note completion, MCQs, maps.", color: T.teal },
          { id: "reading",   title: "Reading",   desc: "3 passages, 40 questions. T/F/NG, matching, headings.", color: T.orange },
          { id: "writing",   title: "Writing",   desc: "Task 1 (graphs/letters) + Task 2 (essays). Band descriptors.", color: T.magenta },
          { id: "speaking",  title: "Speaking",  desc: "Parts 1–3. Fluency, coherence, lexical range.", color: T.teal },
        ].map(s => (
          <Card key={s.id} style={{ padding: 22, cursor: "pointer" }} accent={s.color}>
            <div onClick={() => setSub(s.id)}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, marginBottom: 12 }}/>
              <h4 style={{ margin: "0 0 6px", fontSize: 15, color: T.white, fontWeight: 800 }}>{s.title}</h4>
              <p style={{ margin: 0, color: T.muted, fontSize: 13, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: 26, marginBottom: 24 }}>
        <SectionLabel color={T.teal}>Band Score Guide</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px,1fr))", gap: 8 }}>
          {[
            { band: "9",     desc: "Expert",    color: T.teal },
            { band: "8–8.5", desc: "Very Good", color: T.teal },
            { band: "7–7.5", desc: "Good",      color: T.orange },
            { band: "6–6.5", desc: "Competent", color: T.orange },
            { band: "5–5.5", desc: "Modest",    color: T.magenta },
            { band: "4–4.5", desc: "Limited",   color: T.magenta },
          ].map(b => (
            <div key={b.band} style={{ background: b.color + "0e", border: `1px solid ${b.color}28`, borderRadius: 8, padding: "12px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: b.color, fontFamily: "Arial Black, sans-serif" }}>{b.band}</div>
              <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, marginTop: 4, letterSpacing: 0.5 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </Card>
      <Btn onClick={() => setPage("writing")} variant="magenta">Try AI Writing Correction →</Btn>
    </div>
  );

  if (sub === "speaking") return (
    <div>
      <Btn onClick={() => setSub(null)} variant="ghost" small style={{ marginBottom: 24 }}>← Back</Btn>
      <SectionLabel>IELTS Speaking</SectionLabel>
      {[
        { part: "Part 1 — Introduction (4–5 min)", prompts: ["Tell me about your hometown.", "Do you enjoy cooking? Why/why not?", "What kind of music do you like?"], tip: "Give extended answers. Don't just say 'Yes' or 'No'." },
        { part: "Part 2 — Long Turn / Cue Card (3–4 min)", prompts: ["Describe a person who has influenced you. Say who they are, how you know them, and why they influenced you."], tip: "Prepare for 1 minute, then speak for 1–2 minutes without stopping." },
        { part: "Part 3 — Discussion (4–5 min)", prompts: ["Why do some people prefer to work alone?", "How has technology changed communication?", "Should governments fund space exploration?"], tip: "Give opinions, explain, and speculate. Use: 'It seems to me…', 'I would argue that…'" },
      ].map(p => (
        <Card key={p.part} style={{ padding: 24, marginBottom: 12 }} accent={T.teal}>
          <h3 style={{ margin: "0 0 10px", fontSize: 14, color: T.white, fontWeight: 800 }}>{p.part}</h3>
          <div style={{ background: T.teal + "0e", border: `1px solid ${T.teal}22`, borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: T.teal }}>Tip: {p.tip}</div>
          {p.prompts.map(pr => <div key={pr} style={{ background: T.surface, border: `1px solid ${T.subtle}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8, fontSize: 14, color: T.muted }}>{pr}</div>)}
        </Card>
      ))}
    </div>
  );

  if (sub === "writing") return (
    <div>
      <Btn onClick={() => setSub(null)} variant="ghost" small style={{ marginBottom: 24 }}>← Back</Btn>
      <SectionLabel>IELTS Writing</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 14 }}>
        {[
          { title: "Task 1 – Academic", tips: ["Describe trends, not individual data points", "Vary language: rose, surged, declined, plateaued", "Always include an overview paragraph", "Min 150 words"], sample: "The chart shows internet access in three countries 2000–2020. Summarise the main features." },
          { title: "Task 1 – General Training", tips: ["Match tone to audience (formal/informal)", "Cover all three bullet points fully", "Open and close appropriately", "Min 150 words"], sample: "You stayed at a hotel and were disappointed. Write to the manager explaining the problem and requesting action." },
          { title: "Task 2 – Essay", tips: ["4 paragraphs: Intro + Body ×2 + Conclusion", "State your position clearly in the intro", "Topic sentence + evidence + example per body paragraph", "Min 250 words"], sample: "Some believe governments should invest more in public transport than roads. To what extent do you agree?" },
        ].map(t => (
          <Card key={t.title} style={{ padding: 24 }} accent={T.magenta}>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, color: T.white, fontWeight: 800 }}>{t.title}</h3>
            <div style={{ background: T.magenta + "0e", border: `1px solid ${T.magenta}22`, borderRadius: 8, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: T.magenta, marginBottom: 6, letterSpacing: 2, fontFamily: "monospace" }}>SAMPLE QUESTION</div>
              <p style={{ margin: 0, fontSize: 13, color: T.muted, lineHeight: 1.75 }}>{t.sample}</p>
            </div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {t.tips.map(tip => <li key={tip} style={{ color: T.muted, fontSize: 13, marginBottom: 6 }}>{tip}</li>)}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <Btn onClick={() => setSub(null)} variant="ghost" small style={{ marginBottom: 24 }}>← Back</Btn>
      <Card style={{ padding: 32 }}>
        <p style={{ color: T.muted, lineHeight: 1.85, fontSize: 15, marginBottom: 20 }}>
          Full practice materials for this section are being prepared. Use the Writing page for AI-powered feedback, or browse Grammar and Vocabulary to strengthen your foundation.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Btn onClick={() => setSub("writing")} small>Writing Tasks</Btn>
          <Btn onClick={() => setSub("speaking")} variant="magenta" small>Speaking Practice</Btn>
        </div>
      </Card>
    </div>
  );
}

function WritingPage() {
  const [text, setText] = useState("");
  const [type, setType] = useState("general");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const correct = async () => {
    if (text.trim().length < 20) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: WRITING_SYSTEM,
          messages: [{ role: "user", content: `Type: ${type === "ielts_t2" ? "IELTS Task 2 essay" : type === "ielts_t1" ? "IELTS Task 1" : "General English writing"}\n\nStudent text:\n\n${text}` }],
        }),
      });
      const data = await res.json();
      const content = data.content?.map(b => b.text || "").join("") || "";
      if (!content) throw new Error("Empty");
      setResult(content);
    } catch {
      setError("Unable to connect to the AI right now. Please try again in a moment.");
    }
    setLoading(false);
  };

  return (
    <div>
      <SectionLabel>AI Writing Correction</SectionLabel>
      <p style={{ color: T.muted, marginBottom: 28, fontSize: 15 }}>
        Paste your writing below. ENORA's AI tutor gives detailed feedback on grammar, vocabulary, coherence — plus an IELTS band estimate where relevant.
      </p>
      <Card style={{ padding: 28, marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {[{ id: "general", label: "General Writing" }, { id: "ielts_t1", label: "IELTS Task 1" }, { id: "ielts_t2", label: "IELTS Task 2" }].map(t => (
            <div key={t.id} onClick={() => setType(t.id)} style={{
              padding: "7px 18px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 800,
              letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace",
              background: type === t.id ? T.teal : T.surface,
              color: type === t.id ? "#000" : T.muted,
              border: `1px solid ${type === t.id ? T.teal : T.subtle}`,
              transition: "all 0.15s",
            }}>{t.label}</div>
          ))}
        </div>
        <textarea
          value={text} onChange={e => setText(e.target.value)}
          placeholder="Paste your essay, paragraph, or any English writing here…"
          rows={10}
          style={{ width: "100%", padding: "14px 16px", borderRadius: 8, border: `1px solid ${T.subtle}`, fontSize: 15, fontFamily: "Georgia, serif", lineHeight: 1.9, boxSizing: "border-box", resize: "vertical", background: T.surface, color: T.white, outline: "none" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: T.muted, fontSize: 11, fontFamily: "monospace" }}>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
          <Btn onClick={correct} variant="magenta" disabled={text.trim().length < 20}>{loading ? "Analysing…" : "Get Feedback →"}</Btn>
        </div>
      </Card>

      {error && <Card style={{ padding: 18, border: `1px solid ${T.magenta}35`, marginBottom: 14 }} hover={false}><p style={{ color: T.magenta, margin: 0, fontSize: 14 }}>{error}</p></Card>}

      {loading && (
        <Card style={{ padding: 36, textAlign: "center" }} hover={false}>
          <p style={{ color: T.muted, fontSize: 14, marginBottom: 16, fontFamily: "monospace" }}>Analysing your writing…</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: T.teal, animation: `bounce 0.8s ease-in-out ${i*0.15}s infinite` }}/>)}
          </div>
        </Card>
      )}

      {result && (
        <Card style={{ padding: 32 }} hover={false}>
          <SectionLabel color={T.teal}>Feedback Report</SectionLabel>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.9, color: T.muted, fontSize: 15, fontFamily: "Georgia, serif" }}>
            {result.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
              part.startsWith("**")
                ? <strong key={i} style={{ color: T.white, fontFamily: "system-ui, sans-serif", fontSize: 13, letterSpacing: 0.5 }}>{part.slice(2,-2)}</strong>
                : part
            )}
          </div>
        </Card>
      )}
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </div>
  );
}

function GrammarPage() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? GRAMMAR_LESSONS : GRAMMAR_LESSONS.filter(l => l.level === filter);

  return (
    <div>
      <SectionLabel>Grammar</SectionLabel>
      <p style={{ color: T.muted, marginBottom: 22, fontSize: 15 }}>Clear, practical grammar explanations for every level.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
        {["All","A1","A2","B1","B2","C1"].map(f => {
          const lv = LEVELS.find(l => l.code === f);
          return (
            <div key={f} onClick={() => setFilter(f)} style={{
              padding: "5px 16px", borderRadius: 6, cursor: "pointer", fontSize: 10, fontWeight: 800,
              letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace",
              background: filter === f ? (lv?.color || T.teal) : T.surface,
              color: filter === f ? "#000" : T.muted,
              border: `1px solid ${filter === f ? (lv?.color || T.teal) : T.subtle}`,
              transition: "all 0.15s",
            }}>{f}</div>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(265px,1fr))", gap: 12 }}>
        {filtered.map(lesson => {
          const lv = LEVELS.find(l => l.code === lesson.level);
          const open = selected?.title === lesson.title;
          return (
            <Card key={lesson.title} style={{ padding: 22, cursor: "pointer" }} accent={lv?.color}>
              <div onClick={() => setSelected(open ? null : lesson)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: lv?.color || T.teal, flexShrink: 0 }}/>
                  <div>
                    <div style={{ fontWeight: 800, color: T.white, fontSize: 14 }}>{lesson.title}</div>
                    <Badge text={lesson.level} color={lv?.color || T.teal} />
                  </div>
                </div>
                {open && (
                  <div style={{ borderLeft: `2px solid ${(lv?.color || T.teal)}50`, paddingLeft: 14, marginTop: 14 }}>
                    <p style={{ margin: 0, color: T.muted, fontSize: 14, lineHeight: 1.9 }}>{lesson.content}</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function VocabPage() {
  const [search, setSearch] = useState("");
  const [revealed, setRevealed] = useState({});
  const filtered = VOCAB_SETS.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <SectionLabel>Vocabulary</SectionLabel>
      <p style={{ color: T.muted, marginBottom: 20, fontSize: 15 }}>Word sets by topic and level. Click to reveal.</p>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vocabulary sets…"
        style={{ width: "100%", padding: "12px 18px", borderRadius: 8, border: `1px solid ${T.subtle}`, fontSize: 14, background: T.card, color: T.white, fontFamily: "inherit", marginBottom: 24, boxSizing: "border-box", outline: "none" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(265px,1fr))", gap: 14 }}>
        {filtered.map(set => {
          const lv = LEVELS.find(l => l.code === set.level);
          const open = revealed[set.title];
          return (
            <Card key={set.title} style={{ padding: 24, cursor: "pointer" }} accent={lv?.color}>
              <div onClick={() => setRevealed(r => ({ ...r, [set.title]: !r[set.title] }))}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 14, color: T.white, fontWeight: 800 }}>{set.title}</h3>
                  <Badge text={set.level} color={lv?.color || T.teal} />
                </div>
                <div style={{ color: T.muted, fontSize: 11, fontFamily: "monospace", marginBottom: open ? 14 : 0 }}>{set.words.length} words · {open ? "click to hide" : "click to reveal"}</div>
                {open && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {set.words.map(w => (
                      <span key={w} style={{ background: (lv?.color || T.teal) + "12", color: lv?.color || T.teal, border: `1px solid ${(lv?.color || T.teal)}28`, borderRadius: 6, padding: "4px 12px", fontSize: 12, fontFamily: "monospace" }}>{w}</span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ResourcesPage() {
  return (
    <div>
      <SectionLabel>Resources</SectionLabel>
      <p style={{ color: T.muted, marginBottom: 28, fontSize: 15 }}>Free downloadable worksheets, reference guides, and practice packs.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(265px,1fr))", gap: 12 }}>
        {RESOURCES.map(r => {
          const lv = LEVELS.find(l => r.level.includes(l.code));
          return (
            <Card key={r.title} style={{ padding: 22 }} accent={lv?.color || T.teal}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: lv?.color || T.teal, flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: T.white, fontSize: 14, marginBottom: 6 }}>{r.title}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Badge text={r.type} color={T.teal} />
                    <Badge text={r.level} color={lv?.color || T.orange} />
                  </div>
                </div>
              </div>
              <Btn variant="ghost" small>⬇ Download</Btn>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function BlogPage() {
  const tagColor = { Vocabulary: T.teal, IELTS: T.magenta, Reading: T.orange, Grammar: T.teal };
  return (
    <div>
      <SectionLabel>Blog</SectionLabel>
      <p style={{ color: T.muted, marginBottom: 28, fontSize: 15 }}>Expert tips, strategies, and insights for English learners.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(285px,1fr))", gap: 16 }}>
        {BLOG_POSTS.map(post => {
          const c = tagColor[post.tag] || T.teal;
          return (
            <Card key={post.title} style={{ padding: 28, cursor: "pointer" }} accent={c}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <Badge text={post.tag} color={c} />
                <span style={{ color: T.muted, fontSize: 11, fontFamily: "monospace" }}>{post.date}</span>
              </div>
              <h3 style={{ margin: "0 0 10px", fontSize: 17, color: T.white, fontWeight: 800, lineHeight: 1.4 }}>{post.title}</h3>
              <p style={{ margin: "0 0 18px", color: T.muted, fontSize: 13, lineHeight: 1.8 }}>{post.excerpt}</p>
              <Btn variant="ghost" small>Read More →</Btn>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div style={{ maxWidth: 740, margin: "0 auto" }}>
      <SectionLabel>About ENORA</SectionLabel>
      <Card style={{ padding: 32, marginBottom: 16 }} hover={false}>
        <h3 style={{ margin: "0 0 14px", fontSize: 20, color: T.white, fontWeight: 800 }}>Our Mission</h3>
        <p style={{ color: T.muted, lineHeight: 1.9, fontSize: 15, margin: 0 }}>
          ENORA was built to make high-quality English education accessible to everyone — regardless of age, background, or budget. From absolute beginners taking their first steps with the alphabet, to advanced learners preparing for IELTS Band 8+, ENORA provides structured, engaging resources for every stage of the English learning journey.
        </p>
      </Card>
      <Card style={{ padding: 32, marginBottom: 16 }} hover={false}>
        <h3 style={{ margin: "0 0 20px", fontSize: 20, color: T.white, fontWeight: 800 }}>FAQ</h3>
        {FAQ.map((item, i) => (
          <div key={i} style={{ borderBottom: i < FAQ.length-1 ? `1px solid ${T.cardBorder}` : "none", paddingBottom: 16, marginBottom: 16 }}>
            <h4 style={{ margin: "0 0 6px", fontSize: 13, color: T.teal, fontWeight: 800, fontFamily: "monospace", letterSpacing: 0.5 }}>{item.q}</h4>
            <p style={{ margin: 0, color: T.muted, fontSize: 14, lineHeight: 1.85 }}>{item.a}</p>
          </div>
        ))}
      </Card>
      <Card style={{ padding: 32 }} hover={false}>
        <h3 style={{ margin: "0 0 14px", fontSize: 20, color: T.white, fontWeight: 800 }}>Contact & Tutoring Booking</h3>
        <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.75, marginBottom: 18 }}>Interested in one-to-one sessions or group classes? Our qualified tutors are available online for personalised lessons.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <input placeholder="Your name" style={{ padding: "11px 14px", borderRadius: 8, border: `1px solid ${T.subtle}`, fontSize: 14, fontFamily: "inherit", background: T.surface, color: T.white }} />
          <input placeholder="Email address" style={{ padding: "11px 14px", borderRadius: 8, border: `1px solid ${T.subtle}`, fontSize: 14, fontFamily: "inherit", background: T.surface, color: T.white }} />
        </div>
        <textarea placeholder="Tell us about your goals, level, and availability…" rows={4} style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${T.subtle}`, fontSize: 14, fontFamily: "inherit", background: T.surface, color: T.white, boxSizing: "border-box", resize: "vertical", marginBottom: 14 }} />
        <Btn>Send Message</Btn>
      </Card>
    </div>
  );
}

function AdminPage() {
  const [pw, setPw] = useState("");
  const [auth, setAuth] = useState(false);

  if (!auth) return (
    <div style={{ maxWidth: 360, margin: "60px auto" }}>
      <Card style={{ padding: 40, textAlign: "center" }}>
        <SectionLabel color={T.teal}>Admin</SectionLabel>
        <h2 style={{ fontSize: 22, color: T.white, fontWeight: 800, marginBottom: 22 }}>Dashboard Login</h2>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter admin password"
          style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${T.subtle}`, fontSize: 14, fontFamily: "inherit", background: T.surface, color: T.white, marginBottom: 14, boxSizing: "border-box" }} />
        <Btn onClick={() => pw === "admin123" ? setAuth(true) : alert("Incorrect password")} style={{ width: "100%" }}>Login →</Btn>
        <p style={{ color: T.muted, fontSize: 11, marginTop: 14, fontFamily: "monospace" }}>Demo password: admin123</p>
      </Card>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <SectionLabel>Admin Dashboard</SectionLabel>
        <Btn onClick={() => setAuth(false)} variant="ghost" small>Logout</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(235px,1fr))", gap: 12 }}>
        {[
          { title: "Manage Lessons",    desc: "Add, edit, or delete lessons for any CEFR level.",    color: T.teal },
          { title: "Manage Exercises",  desc: "Create MCQs, fill-in-the-blank, writing prompts.",     color: T.orange },
          { title: "IELTS Mock Tests",  desc: "Upload and manage full mock test papers.",             color: T.magenta },
          { title: "Reading Texts",     desc: "Upload or edit reading passages and literary texts.",   color: T.teal },
          { title: "Vocabulary Sets",   desc: "Add new word lists and manage existing sets.",          color: T.orange },
          { title: "Resources & PDFs",  desc: "Upload downloadable worksheets and guides.",            color: T.magenta },
          { title: "Homepage Content",  desc: "Edit hero text, features, lesson of the day.",         color: T.teal },
          { title: "Blog Posts",        desc: "Write and publish new articles and tips.",              color: T.orange },
        ].map(item => (
          <Card key={item.title} style={{ padding: 22, cursor: "pointer", border: `1px solid ${item.color}18` }} accent={item.color}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, marginBottom: 12 }}/>
            <h3 style={{ margin: "0 0 8px", fontSize: 13, color: T.white, fontWeight: 800, letterSpacing: 0.5 }}>{item.title}</h3>
            <p style={{ margin: "0 0 14px", color: T.muted, fontSize: 12, lineHeight: 1.7 }}>{item.desc}</p>
            <Btn variant="ghost" small>Manage →</Btn>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 22, padding: "14px 18px", border: `1px solid ${T.orange}28`, borderRadius: 8, background: T.orange + "07" }}>
        <p style={{ margin: 0, color: T.orange, fontSize: 12, fontFamily: "monospace" }}>
          Admin Demo Mode — In production, this connects to a backend CMS with full CRUD, authentication, and audit logging.
        </p>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────

export default function ENORAWebsite() {
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => { contentRef.current?.scrollTo?.(0, 0); }, [page]);

  const searchResults = search.length > 1 ? [
    ...GRAMMAR_LESSONS.filter(l => l.title.toLowerCase().includes(search.toLowerCase())).map(l => ({ label: l.title, sub: "Grammar · " + l.level, page: "grammar" })),
    ...VOCAB_SETS.filter(v => v.title.toLowerCase().includes(search.toLowerCase())).map(v => ({ label: v.title, sub: "Vocabulary · " + v.level, page: "vocabulary" })),
    ...BLOG_POSTS.filter(b => b.title.toLowerCase().includes(search.toLowerCase())).map(b => ({ label: b.title, sub: "Blog · " + b.tag, page: "blog" })),
  ] : [];

  const pages = {
    home: <HomePage setPage={setPage} />,
    levels: <LevelsPage />,
    test: <LevelTestPage />,
    ielts: <IELTSPage setPage={setPage} />,
    grammar: <GrammarPage />,
    vocabulary: <VocabPage />,
    writing: <WritingPage />,
    resources: <ResourcesPage />,
    blog: <BlogPage />,
    about: <AboutPage />,
    admin: <AdminPage />,
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: T.bg, color: T.white }}>

      {/* ── HEADER ── */}
      <header style={{
        background: "rgba(0,0,0,0.97)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.cardBorder}`,
        position: "sticky", top: 0, zIndex: 100, padding: "0 20px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, height: 62 }}>
          <div onClick={() => setPage("home")} style={{ cursor: "pointer", flexShrink: 0 }}>
            <EnoraLogo height={30} />
          </div>

          <nav style={{ display: "flex", gap: 2, flex: 1, justifyContent: "center", overflow: "hidden" }}>
            {NAV_ITEMS.slice(0, 8).map(item => (
              <div key={item.id} onClick={() => setPage(item.id)} style={{
                padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 10, fontWeight: 800,
                letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace",
                color: page === item.id ? T.teal : T.muted,
                background: page === item.id ? T.teal + "10" : "transparent",
                borderBottom: `2px solid ${page === item.id ? T.teal : "transparent"}`,
                transition: "all 0.15s", whiteSpace: "nowrap",
              }}>{item.label}</div>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowSearch(s => !s)} style={{ background: "none", border: `1px solid ${T.subtle}`, borderRadius: 6, color: T.muted, fontSize: 14, cursor: "pointer", padding: "5px 11px", fontFamily: "monospace" }}>⌕</button>
              {showSearch && (
                <div style={{ position: "absolute", right: 0, top: "110%", zIndex: 200, width: 280 }}>
                  <Card style={{ padding: 10 }} hover={false}>
                    <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${T.subtle}`, fontSize: 12, background: T.surface, color: T.white, fontFamily: "monospace", boxSizing: "border-box", outline: "none" }} />
                    {searchResults.map(r => (
                      <div key={r.label} onClick={() => { setPage(r.page); setSearch(""); setShowSearch(false); }}
                        style={{ padding: "9px 12px", borderRadius: 6, cursor: "pointer", marginTop: 4, background: T.surface }}>
                        <div style={{ fontWeight: 700, color: T.white, fontSize: 13 }}>{r.label}</div>
                        <div style={{ color: T.muted, fontSize: 10, fontFamily: "monospace" }}>{r.sub}</div>
                      </div>
                    ))}
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile pill nav */}
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, paddingTop: 4, scrollbarWidth: "none" }}>
          {NAV_ITEMS.map(item => (
            <div key={item.id} onClick={() => setPage(item.id)} style={{
              padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontSize: 10, fontWeight: 800,
              letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace",
              color: page === item.id ? "#000" : T.muted,
              background: page === item.id ? T.teal : T.surface,
              border: `1px solid ${page === item.id ? T.teal : T.subtle}`,
              flexShrink: 0, whiteSpace: "nowrap", transition: "all 0.15s",
            }}>{item.label}</div>
          ))}
        </div>
      </header>

      {/* ── MAIN ── */}
      <main ref={contentRef} style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px 80px" }}>
        {pages[page] || <HomePage setPage={setPage} />}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: T.surface, borderTop: `1px solid ${T.cardBorder}`, padding: "44px 20px 26px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px,1fr))", gap: 32, marginBottom: 36 }}>
            <div>
              <div style={{ marginBottom: 14 }}><EnoraLogo height={24} /></div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: T.muted, margin: 0 }}>Free, structured English learning for every level. No login, no fees.</p>
            </div>
            {[
              { title: "Learn", links: ["Start by Level", "Level Test", "Grammar", "Vocabulary"] },
              { title: "Exam Prep", links: ["IELTS Academic", "IELTS General", "Writing Correction", "Mock Tests"] },
              { title: "Site", links: ["About & FAQ", "Blog", "Resources", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color: T.white, margin: "0 0 14px", fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace" }}>{col.title}</h4>
                {col.links.map(link => <div key={link} style={{ color: T.muted, fontSize: 13, marginBottom: 10, cursor: "pointer", fontFamily: "monospace" }}>{link}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${T.cardBorder}`, paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 11, color: T.muted, fontFamily: "monospace" }}>© 2026 ENORA · All rights reserved</span>
            <span style={{ fontSize: 11, color: T.muted, fontFamily: "monospace" }}>Built for English learners everywhere</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
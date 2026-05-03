import React, { useState, useCallback, useRef, useEffect, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── SVG Icons (memoized) ────────────────────────────────────────────────────────────────
const Icons = {
  sofa: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 15V11a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
      <path d="M3 15h18" /><path d="M6 9V6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3" />
      <path d="M8 15v3" /><path d="M16 15v3" />
      <rect x="5" y="11" width="14" height="4" rx="1" />
    </svg>
  )),
  bed: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 17v-3a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v3" />
      <path d="M2 17h20" /><rect x="4" y="8" width="16" height="3" rx="1" />
      <path d="M7 11v-3" /><path d="M17 11v-3" />
      <circle cx="7" cy="5" r="1.5" /><circle cx="17" cy="5" r="1.5" />
    </svg>
  )),
  table: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" /><path d="M7 19v2" /><path d="M17 19v2" /><path d="M12 5v-2" />
      <line x1="7" y1="8" x2="7" y2="10" /><line x1="12" y1="8" x2="12" y2="10" /><line x1="17" y1="8" x2="17" y2="10" />
    </svg>
  )),
  chair: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="16" height="9" rx="1.5" />
      <path d="M8 17v3" /><path d="M16 17v3" />
      <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <path d="M8 12h8" /><line x1="12" y1="8" x2="12" y2="6" />
    </svg>
  )),
  cabinet: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
      <rect x="4" y="7" width="4" height="3" rx="0.5" /><rect x="16" y="7" width="4" height="3" rx="0.5" />
      <circle cx="7.5" cy="17.5" r="1" fill="currentColor" /><circle cx="16.5" cy="17.5" r="1" fill="currentColor" />
    </svg>
  )),
  desk: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="3" rx="0.75" />
      <path d="M4 9v9" /><path d="M20 9v9" /><path d="M2 18h20" />
      <rect x="8" y="12" width="8" height="1.5" rx="0.5" />
      <line x1="7" y1="6" x2="7" y2="4" /><line x1="12" y1="6" x2="12" y2="4" /><line x1="17" y1="6" x2="17" y2="4" />
    </svg>
  )),
  check: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )),
  star: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )),
  rotate: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )),
  reset: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )),
  arrowRight: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )),
  close: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )),
  user: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )),
  mail: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  )),
  phone: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )),
};

// ─── FONTS (static, no re-renders) ─────────────────────────────────────────────────────────────────
const FontLoader = memo(() => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }
    body { font-family: 'DM Sans', sans-serif; background: #f8fafc; color: #0f172a; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

    .cf-layout {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      align-items: flex-start;
      padding: 0.5rem;
      width: 100%;
    }
    .cf-panel { flex: 0 0 220px; min-width: 0; }
    .cf-canvas { flex: 1 1 0; min-width: 0; }

    @media (max-width: 600px) {
      .cf-layout { flex-direction: row; gap: 0.4rem; padding: 0.4rem; }
      .cf-panel { flex: 0 0 130px; }
      .cf-canvas { flex: 1 1 0; }
      .hero-title { font-size: 1.2rem !important; }
      .hero-sub { display: none !important; }
      .step-label { display: none; }
      .canvas-h { height: 200px !important; }
      .mat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 3px !important; }
      .mat-swatch { width: 20px !important; height: 20px !important; }
      .mat-name { font-size: 6px !important; }
      .chip-sm { padding: 3px 6px !important; font-size: 9px !important; }
      .q-inner { padding: 0.7rem !important; margin: 0.4rem !important; max-width: 95vw !important; }
      .q-h2 { font-size: 0.9rem !important; }
      .q-aitext { font-size: 11px !important; }
      .furniture-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 4px !important; }
      .furniture-btn { padding: 6px 2px !important; }
      .furniture-icon { width: 16px !important; height: 16px !important; }
      .furniture-label { font-size: 8px !important; }
      .panel-inner { padding: 0.5rem !important; }
      .hero-badges { display: none !important; }
      .stepper-bar { padding: 0.4rem 0.6rem !important; }
      .canvas-controls-top { padding: 0.35rem 0.55rem !important; }
      .canvas-controls-bot { padding: 0.35rem 0.55rem !important; }
      .mat-info-bar { padding: 0.4rem 0.55rem !important; }
    }
    @media (min-width: 601px) and (max-width: 900px) {
      .cf-panel { flex: 0 0 200px; }
      .hero-title { font-size: 1.5rem !important; }
    }

    .collapsible { overflow: hidden; transition: max-height 0.25s cubic-bezier(0.4,0,0.2,1); }
    .collapsible.open { max-height: 280px; }
    .collapsible.closed { max-height: 0; }

    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 0.85s linear infinite; display: inline-block; }
    @keyframes confetti-fall { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(80px) rotate(360deg);opacity:0} }
    @keyframes success-pop { 0%{transform:scale(0)} 60%{transform:scale(1.15)} 100%{transform:scale(1)} }
    .success-pop { animation: success-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }

    .btn-primary {
      background: #1d4ed8;
      color: #fff;
      border: none;
      border-radius: 7px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      letter-spacing: 0.01em;
    }
    .btn-primary:hover { background: #1e40af; }
    .btn-primary:active { transform: scale(0.98); }
    .btn-ghost {
      background: none;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      color: #64748b;
      transition: all 0.12s;
    }
    .btn-ghost:hover { background: #f1f5f9; border-color: #cbd5e1; }
    input:focus, textarea:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }

    .canvas-floor { background: #E8E4DC; }
    .canvas-wall { background: #F2EFE8; }
  `}</style>
));

FontLoader.displayName = 'FontLoader';

// ─── DESIGN TOKENS — matches primary-blue theme ─────────────────────
const T = {
  bg:           '#f8fafc',
  surface:      '#ffffff',
  surfaceAlt:   '#f1f5f9',
  surfaceDeep:  '#e2e8f0',
  border:       '#e2e8f0',
  borderMed:    '#cbd5e1',
  text:         '#0f172a',
  textMid:      '#334155',
  textMuted:    '#64748b',
  textLight:    '#94a3b8',
  primary:      '#1d4ed8',
  primaryMed:   '#2563eb',
  primaryLight: '#eff6ff',
  primaryBorder:'#bfdbfe',
  primaryText:  '#1e3a8a',
  accent:       '#f59e0b',
  accentLight:  '#fffbeb',
  accentBorder: '#fcd34d',
  success:      '#10b981',
  successLight: '#ecfdf5',
};

// ─── MATERIAL PRESETS ─────────────────────────────────────────────────────────
const MATERIALS = {
  oak:      { name:'Oak',      texture:'Classic Grain',  top:'#E8A84A', front:'#C87830', side:'#A05A18', edge:'#7A4010', hi:'#F8C870', sh:'#6A3808', rough:0.65, refl:0.15, ao:'rgba(80,40,0,0.55)',  grain:'linear'  },
  walnut:   { name:'Walnut',   texture:'Rich Dark',      top:'#7A4838', front:'#5C2C1C', side:'#3C1808', edge:'#280E04', hi:'#9A6048', sh:'#200804', rough:0.55, refl:0.2,  ao:'rgba(30,10,0,0.6)',   grain:'swirl'   },
  maple:    { name:'Maple',    texture:'Fine Smooth',    top:'#F0CFA0', front:'#D4A870', side:'#B07840', edge:'#8A5820', hi:'#FFDFB0', sh:'#7A5018', rough:0.5,  refl:0.25, ao:'rgba(100,60,0,0.5)',  grain:'fine'    },
  leather:  { name:'Leather',  texture:'Luxury Soft',    top:'#A04828', front:'#7A2E10', side:'#551808', edge:'#3C1004', hi:'#C86040', sh:'#300C04', rough:0.85, refl:0.05, ao:'rgba(50,10,0,0.6)',   grain:'pebble'  },
  velvet:   { name:'Velvet',   texture:'Plush Deep',     top:'#7848B8', front:'#5A2898', side:'#3C1070', edge:'#280848', hi:'#9868D8', sh:'#1E0640', rough:0.9,  refl:0.02, ao:'rgba(30,0,80,0.6)',   grain:'fuzz'    },
  metal:    { name:'Metal',    texture:'Industrial',     top:'#C8D8E0', front:'#98B0BC', side:'#607880', edge:'#405868', hi:'#E0EEF4', sh:'#384858', rough:0.25, refl:0.75, ao:'rgba(30,50,60,0.5)',  grain:'brushed' },
  pine:     { name:'Pine',     texture:'Light Warm',     top:'#E0B060', front:'#C09040', side:'#987020', edge:'#705008', hi:'#F0C878', sh:'#584808', rough:0.7,  refl:0.1,  ao:'rgba(70,50,0,0.5)',   grain:'knotty'  },
  ebony:    { name:'Ebony',    texture:'Bold Dark',      top:'#3A3030', front:'#221818', side:'#140C0C', edge:'#0C0808', hi:'#504040', sh:'#080404', rough:0.45, refl:0.3,  ao:'rgba(0,0,0,0.7)',     grain:'subtle'  },
};

const FINISHES = {
  matte:      { label:'Matte',      gloss:0,    topBoost:0,    specOp:0,    },
  satin:      { label:'Satin',      gloss:0.08, topBoost:0.05, specOp:0.12,       },
  glossy:     { label:'Glossy',     gloss:0.22, topBoost:0.12, specOp:0.28,  },
  brushed:    { label:'Brushed',    gloss:0.06, topBoost:0.04, specOp:0.09,     },
  antique:    { label:'Antique',    gloss:0.04, topBoost:0.02, specOp:0.06,         },
  distressed: { label:'Distressed', gloss:0,    topBoost:0,    specOp:0,      },
};

const STYLES = {
  modern:       { name:'Modern',      legH:1.0, legT:0.8, cushF:1.0, backH:1.0,  roomBg:'#F0EDEA', roomFloor:'#D8D4CE', roomAccent:'#B0A898' },
  scandinavian: { name:'Nordic',      legH:1.4, legT:0.6, cushF:0.85,backH:0.9,  roomBg:'#F5F3EE', roomFloor:'#E0DDD7', roomAccent:'#A8A098' },
  industrial:   { name:'Industrial',  legH:1.2, legT:1.3, cushF:0.8, backH:0.85, roomBg:'#E8E4DF', roomFloor:'#C8C4BC', roomAccent:'#7A7060' },
  'mid-century':{ name:'Mid-Century', legH:1.6, legT:0.55,cushF:0.95,backH:0.85, roomBg:'#EDE8E0', roomFloor:'#D4CEC6', roomAccent:'#B89868' },
  bohemian:     { name:'Bohemian',    legH:0.85,legT:1.0, cushF:1.2, backH:1.05, roomBg:'#EDE0D4', roomFloor:'#C8B8A8', roomAccent:'#A07858' },
  rustic:       { name:'Rustic',      legH:0.95,legT:1.5, cushF:1.1, backH:0.95, roomBg:'#EAE0D0', roomFloor:'#C0B098', roomAccent:'#887058' },
};

// ─── ISO ENGINE ───────────────────────────────────────────────────────────────
const ISO = {
  rotate(x, z, angle) {
    const a = angle * Math.PI / 180;
    return { x: x*Math.cos(a) - z*Math.sin(a), z: x*Math.sin(a) + z*Math.cos(a) };
  },
  project(x, y, z, angle=0, sc=44, ox=0, oy=60) {
    const r = this.rotate(x, z, angle);
    return [(r.x - r.z)*0.866*sc + ox, (-y + (r.x + r.z)*0.5)*sc + oy];
  },
  pt(x, y, z, angle, sc, ox, oy) {
    const [px, py] = this.project(x, y, z, angle, sc, ox, oy);
    return `${px.toFixed(2)},${py.toFixed(2)}`;
  },
  face(...pts) { return pts.join(' '); },
};

// ─── SOLID FACE (memoized) ───────────────────────────────────────────────────────────────
const SolidFace = memo(({ pts, fill, darker, lighter, spec=false, grain=false, grainId, grainOp=0 }) => (
  <g>
    <polygon points={pts} fill={fill} stroke={darker} strokeWidth="0.35" strokeLinejoin="round"/>
    {grain && grainId && <polygon points={pts} fill={`url(#${grainId})`} opacity={grainOp}/>}
    {spec && <polygon points={pts} fill={lighter} opacity="0.14"/>}
  </g>
));

SolidFace.displayName = 'SolidFace';

// ─── SVG DEFS (memoized) ─────────────────────────────────────────────────────────────────
const SVGDefs = memo(({ mat, uid, finishSpec, styleData }) => {
  const g = `g_${uid}`;
  const floorColor = styleData?.roomFloor || '#D8D4CE';
  const wallColor  = styleData?.roomBg    || '#F0EDEA';
  return (
    <defs>
      <pattern id={`${g}_linear`} x="0" y="0" width="100" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(14)">
        <line x1="0" y1="0" x2="100" y2="0" stroke={mat.sh} strokeWidth="0.4" opacity="0.55"/>
        <line x1="0" y1="3" x2="100" y2="3" stroke={mat.hi} strokeWidth="0.18" opacity="0.22"/>
        <line x1="0" y1="6" x2="100" y2="6" stroke={mat.sh} strokeWidth="0.5" opacity="0.42"/>
        <line x1="0" y1="9" x2="100" y2="9" stroke={mat.hi} strokeWidth="0.14" opacity="0.18"/>
      </pattern>
      <pattern id={`${g}_swirl`} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M0,40 Q20,18 40,40 T80,40" fill="none" stroke={mat.sh} strokeWidth="0.55" opacity="0.55"/>
        <path d="M0,58 Q24,36 48,58 T80,58" fill="none" stroke={mat.hi} strokeWidth="0.28" opacity="0.28"/>
        <path d="M0,20 Q18,6 36,20 T72,20" fill="none" stroke={mat.sh} strokeWidth="0.35" opacity="0.35"/>
      </pattern>
      <pattern id={`${g}_fine`} x="0" y="0" width="35" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(9)">
        <line x1="0" y1="0" x2="35" y2="0" stroke={mat.sh} strokeWidth="0.15" opacity="0.3"/>
        <line x1="0" y1="2" x2="35" y2="2" stroke={mat.hi} strokeWidth="0.1"  opacity="0.18"/>
      </pattern>
      <pattern id={`${g}_pebble`} x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="1.6" fill={mat.sh} opacity="0.55"/>
        <circle cx="13" cy="11" r="1.1" fill={mat.hi} opacity="0.28"/>
        <circle cx="7" cy="14" r="1.3" fill={mat.sh} opacity="0.45"/>
        <circle cx="16" cy="3" r="0.9" fill={mat.hi} opacity="0.35"/>
      </pattern>
      <pattern id={`${g}_fuzz`} x="0" y="0" width="7" height="7" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="7" y2="7" stroke={mat.hi} strokeWidth="0.4" opacity="0.6"/>
        <line x1="3" y1="0" x2="7" y2="4" stroke={mat.sh} strokeWidth="0.28" opacity="0.5"/>
        <line x1="0" y1="3" x2="4" y2="7" stroke={mat.hi} strokeWidth="0.32" opacity="0.55"/>
      </pattern>
      <pattern id={`${g}_brushed`} x="0" y="0" width="180" height="2.5" patternUnits="userSpaceOnUse" patternTransform="rotate(6)">
        <line x1="0" y1="0" x2="180" y2="0" stroke="#fff" strokeWidth="0.5" opacity="0.28"/>
        <line x1="0" y1="1.5" x2="180" y2="1.5" stroke="#000" strokeWidth="0.3" opacity="0.16"/>
      </pattern>
      <pattern id={`${g}_knotty`} x="0" y="0" width="55" height="55" patternUnits="userSpaceOnUse">
        <line x1="0" y1="12" x2="55" y2="12" stroke={mat.sh} strokeWidth="0.4" opacity="0.45"/>
        <line x1="0" y1="28" x2="55" y2="28" stroke={mat.hi} strokeWidth="0.22" opacity="0.25"/>
        <line x1="0" y1="40" x2="55" y2="40" stroke={mat.sh} strokeWidth="0.35" opacity="0.38"/>
        <circle cx="28" cy="28" r="7" fill="none" stroke={mat.sh} strokeWidth="0.6" opacity="0.5"/>
        <circle cx="28" cy="28" r="3.5" fill="none" stroke={mat.hi} strokeWidth="0.35" opacity="0.35"/>
        <circle cx="28" cy="28" r="1.2" fill={mat.sh} opacity="0.4"/>
      </pattern>
      <pattern id={`${g}_subtle`} x="0" y="0" width="28" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
        <line x1="0" y1="0" x2="28" y2="0" stroke={mat.hi} strokeWidth="0.12" opacity="0.22"/>
        <line x1="0" y1="2.5" x2="28" y2="2.5" stroke={mat.sh} strokeWidth="0.18" opacity="0.32"/>
      </pattern>
      <linearGradient id={`${g}_gloss`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity={finishSpec * 0.6}/>
        <stop offset="40%" stopColor="#fff" stopOpacity={finishSpec * 0.15}/>
        <stop offset="100%" stopColor="#000" stopOpacity={finishSpec * 0.08}/>
      </linearGradient>
      <filter id={`${g}_distress`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
        <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
        <feBlend in="SourceGraphic" in2="gray" mode="multiply" result="blend"/>
        <feComposite in="blend" in2="SourceGraphic" operator="in"/>
      </filter>
      <filter id={`dshadow_${uid}`} x="-30%" y="-20%" width="160%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
        <feOffset dx="2" dy="6" in="blur" result="off"/>
        <feFlood floodColor="#000" floodOpacity="0.22" result="color"/>
        <feComposite in="color" in2="off" operator="in" result="shadow"/>
        <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id={`fshadow_${uid}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#000" stopOpacity="0.28"/>
        <stop offset="60%"  stopColor="#000" stopOpacity="0.1"/>
        <stop offset="100%" stopColor="#000" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id={`${g}_floor`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={floorColor}/>
        <stop offset="100%" stopColor={styleData?.roomAccent || '#B0A898'}/>
      </linearGradient>
      <linearGradient id={`${g}_wall`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={wallColor} stopOpacity="1"/>
        <stop offset="100%" stopColor={floorColor} stopOpacity="1"/>
      </linearGradient>
    </defs>
  );
});

SVGDefs.displayName = 'SVGDefs';

// ─── FURNITURE RENDERER (memoized) ───────────────────────────────────────────────────────
const FurnitureRenderer = memo(({ type, material, style, finish, rotation, zoom }) => {
  const mat  = MATERIALS[material] || MATERIALS.oak;
  const fin  = FINISHES[finish]   || FINISHES.matte;
  const sty  = STYLES[style]      || STYLES.modern;
  const uid  = `${type}_${material}_${finish}_${style}`;
  const gid  = `g_${uid}_${mat.grain}`;
  const sc   = 40 * (zoom || 1);
  const ox   = 0, oy = 52;

  const p = useCallback((x, y, z) => ISO.pt(x, y, z, rotation, sc, ox, oy), [rotation, sc]);

  const box = useCallback((bx, by, bz, w, h, d) => ({
    top:   ISO.face(p(bx,by+h,bz), p(bx+w,by+h,bz), p(bx+w,by+h,bz+d), p(bx,by+h,bz+d)),
    front: ISO.face(p(bx,by,bz),   p(bx+w,by,bz),   p(bx+w,by+h,bz),   p(bx,by+h,bz)),
    right: ISO.face(p(bx+w,by,bz), p(bx+w,by,bz+d), p(bx+w,by+h,bz+d), p(bx+w,by+h,bz)),
    left:  ISO.face(p(bx,by,bz+d), p(bx,by,bz),     p(bx,by+h,bz),     p(bx,by+h,bz+d)),
    back:  ISO.face(p(bx,by,bz+d), p(bx+w,by,bz+d), p(bx+w,by+h,bz+d), p(bx,by+h,bz+d)),
  }), [p]);

  const isGlossy     = fin.gloss > 0.15;
  const isDistressed = finish === 'distressed';
  const isAntique    = finish === 'antique';

  const matTop   = mat.top;
  const matFront = mat.front;

  const Top = useCallback(({b,spec=true,grain=true}) => (
    <g>
      <SolidFace pts={b.top}   fill={matTop}   darker={mat.edge} lighter={mat.hi} spec={spec&&fin.specOp>0} grain={grain} grainId={gid} grainOp={0.55}/>
      {isGlossy && <polygon points={b.top} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp}/>}
    </g>
  ), [matTop, mat.edge, mat.hi, fin.specOp, isGlossy, uid, gid]);

  const Front = useCallback(({b,tint=1}) => (
    <g>
      <SolidFace pts={b.front} fill={matFront} darker={mat.edge} lighter={mat.hi} spec={false} grain={true} grainId={gid} grainOp={0.38*tint}/>
      {isDistressed && <polygon points={b.front} fill={mat.sh} opacity="0.12" filter={`url(#g_${uid}_distress)`}/>}
    </g>
  ), [matFront, mat.edge, mat.hi, mat.sh, isDistressed, uid, gid]);

  const Right = useCallback(({b}) => <SolidFace pts={b.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi} spec={false}/>, [mat.side, mat.edge, mat.hi]);
  const Left  = useCallback(({b}) => <SolidFace pts={b.left}  fill={mat.side}  darker={mat.edge} lighter={mat.hi} spec={false}/>, [mat.side, mat.edge, mat.hi]);

  const Box = useCallback(({bx,by,bz,w,h,d,noTop=false}) => {
    const b = box(bx,by,bz,w,h,d);
    return (
      <g>
        {!noTop && <Top b={b}/>}
        <Front b={b}/>
        <Right b={b}/>
        <Left b={b}/>
      </g>
    );
  }, [box, Top, Front, Right, Left]);

  const Shadow = useCallback(({rx, ry, dx=0, dy=0}) => {
    const [ex, ey] = ISO.project(dx, 0, dy, rotation, sc, ox, oy);
    return <ellipse cx={ex} cy={ey+3} rx={rx*sc} ry={ry*sc} fill={`url(#fshadow_${uid})`}/>;
  }, [rotation, sc, uid]);

  const lh = sty.legH, lt = sty.legT;
  const antiqueOp = isAntique ? 0.25 : 0;

  // Render functions with useCallback
  const renderSofa = useCallback(() => {
    const cf = sty.cushF, bh = sty.backH * 1.9;
    const at = sty.legT * 0.7;
    const base = box(-3.0, 0, -1.35, 6.0, 0.75, 2.7);
    const backF = box(-3.0, 0.75, -1.35, 6.0, bh, 0.65);
    const backCap = box(-3.05, 0.75+bh, -1.4, 6.1, 0.15, 0.75);
    const armL = box(-3.0, 0, -1.35, at, 1.55, 2.7);
    const armR = box(3.0-at, 0, -1.35, at, 1.55, 2.7);
    const armLTop = box(-3.0, 1.55, -1.35, at, 0.1, 2.7);
    const armRTop = box(3.0-at, 1.55, -1.35, at, 0.1, 2.7);
    const cW = (6.0 - 2*at) / 3;
    const cx0 = -3.0 + at;
    const cushH = 0.52 * cf;
    const cushDep = 1.15;
    const cGap = 0.06;
    const cush = [0,1,2].map(i => {
      const cx = cx0 + i*(cW+cGap);
      return { base: box(cx, 0.75, -0.35, cW-cGap, cushH, cushDep), front: box(cx, 0.75, -0.35, cW-cGap, cushH*0.85, 0.08) };
    });
    const bCushH = bh * 0.72 * cf;
    const bCushW = (6.0 - 2*at) / 2;
    const bcush = [0,1].map(i => ({ main: box(cx0 + i*(bCushW+0.05), 0.75, -1.35, bCushW-0.05, bCushH, 0.55) }));
    const legW = 0.28*lt, legD = 0.28*lt;
    const legs = [
      box(-2.85, -lh, -1.2, legW, lh, legD), box(2.85-legW, -lh, -1.2, legW, lh, legD),
      box(-2.85, -lh, 1.1, legW, lh, legD),  box(2.85-legW, -lh, 1.1, legW, lh, legD),
    ];
    return (
      <g filter={`url(#dshadow_${uid})`}>
        <Shadow rx={3.8} ry={0.68}/>
        {legs.map((l,i) => (
          <g key={i}>
            <SolidFace pts={l.front} fill={mat.edge} darker={mat.sh} lighter={mat.hi}/>
            <SolidFace pts={l.right} fill={mat.sh}   darker={mat.sh} lighter={mat.hi}/>
            <SolidFace pts={l.left}  fill={mat.sh}   darker={mat.sh} lighter={mat.hi}/>
            {antiqueOp > 0 && <polygon points={l.front} fill="#8B4513" opacity={antiqueOp}/>}
          </g>
        ))}
        <SolidFace pts={base.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.38}/>
        <SolidFace pts={base.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={base.left}  fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={base.top}   fill={matTop}    darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.45} spec={fin.specOp>0}/>
        {isGlossy && <polygon points={base.top} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp}/>}
        <SolidFace pts={backF.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.35}/>
        <SolidFace pts={backF.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={backF.left}  fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={backCap.top} fill={matTop}   darker={mat.edge} lighter={mat.hi} spec={fin.specOp>0} grain grainId={gid} grainOp={0.38}/>
        {isGlossy && <polygon points={backCap.top} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp * 0.8}/>}
        <SolidFace pts={backCap.front} fill={matFront} darker={mat.edge} lighter={mat.hi}/>
        {[{a:armL,t:armLTop},{a:armR,t:armRTop}].map(({a,t},i) => (
          <g key={i}>
            <SolidFace pts={a.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.38}/>
            <SolidFace pts={a.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
            <SolidFace pts={a.left}  fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
            <SolidFace pts={t.top}   fill={matTop}   darker={mat.edge} lighter={mat.hi} spec={fin.specOp>0} grain grainId={gid} grainOp={0.42}/>
            {isGlossy && <polygon points={t.top} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp}/>}
            <SolidFace pts={t.front} fill={matFront} darker={mat.edge} lighter={mat.hi}/>
          </g>
        ))}
        {bcush.map((c,i) => (
          <g key={i}>
            <SolidFace pts={c.main.front} fill={matTop}   darker={mat.edge} lighter={mat.hi} spec={fin.specOp>0} grain grainId={gid} grainOp={0.3}/>
            <SolidFace pts={c.main.right} fill={matFront} darker={mat.edge} lighter={mat.hi}/>
            <SolidFace pts={c.main.left}  fill={matFront} darker={mat.edge} lighter={mat.hi}/>
            <SolidFace pts={c.main.top}   fill={matTop}   darker={mat.edge} lighter={mat.hi} spec={fin.specOp>0}/>
          </g>
        ))}
        {cush.map((c,i) => (
          <g key={i}>
            <SolidFace pts={c.base.front}  fill={mat.hi}    darker={matFront} lighter={mat.hi} spec={fin.specOp>0} grain grainId={gid} grainOp={0.25}/>
            <SolidFace pts={c.base.right}  fill={matTop}    darker={mat.edge} lighter={mat.hi}/>
            <SolidFace pts={c.base.left}   fill={matTop}    darker={mat.edge} lighter={mat.hi}/>
            <SolidFace pts={c.base.top}    fill={mat.hi}    darker={matFront} lighter="#ffffff" spec={fin.specOp>0} grain grainId={gid} grainOp={0.2}/>
            {isGlossy && <polygon points={c.base.top} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp * 0.5}/>}
            <SolidFace pts={c.front.front} fill={matFront} darker={mat.edge} lighter={mat.hi}/>
          </g>
        ))}
      </g>
    );
  }, [box, Shadow, mat, matFront, matTop, mat.side, mat.edge, mat.sh, mat.hi, fin.specOp, isGlossy, isGlossy, antiqueOp, lh, lt, sty.cushF, sty.backH, sty.legT, uid, gid]);

  const renderBed = useCallback(() => {
    const frameTop = box(-3.8, 0, -2.1, 7.6, 0.7, 4.2);
    const footB = box(3.6, 0, -2.1, 0.5, 1.2, 4.2);
    const footCap = box(3.55, 1.2, -2.15, 0.6, 0.12, 4.3);
    const hbFrame = box(-3.8, 0, -2.15, 0.6, 3.6, 4.3);
    const hbCap   = box(-3.85, 3.6, -2.2, 0.7, 0.18, 4.4);
    const hbP1 = box(-3.7, 0.5, -2.0, 0.35, 2.8, 1.2);
    const hbP2 = box(-3.7, 0.5, -0.7, 0.35, 2.8, 1.2);
    const hbP3 = box(-3.7, 0.5, 0.6,  0.35, 2.8, 1.2);
    const railL = box(-3.8, 0, -2.1, 7.5, 0.45, 0.22);
    const railR = box(-3.8, 0, 1.88, 7.5, 0.45, 0.22);
    const mattBase = box(-3.4, 0.7, -1.85, 6.8, 0.85, 3.7);
    const mattTop  = box(-3.4, 1.55,-1.85, 6.8, 0.18, 3.7);
    const mattSeam = box(-3.4, 1.4, -1.85, 6.8, 0.08, 3.7);
    const blanket  = box(-2.8, 1.73,-1.7,  5.8, 0.4,  3.4);
    const blanketF = box(-2.8, 1.73,-1.7,  5.8, 0.22, 0.12);
    const pil1  = box(-2.4, 1.73,-1.82, 1.65, 0.42, 1.25);
    const pil1F = box(-2.4, 1.73,-1.82, 1.65, 0.42, 0.08);
    const pil2  = box(-0.6, 1.73,-1.82, 1.65, 0.42, 1.25);
    const pil2F = box(-0.6, 1.73,-1.82, 1.65, 0.42, 0.08);
    const lW = 0.28*lt;
    const legs = [
      box(-3.6,-lh*0.85,-1.9, lW,lh*0.85,lW), box(3.3,-lh*0.85,-1.9, lW,lh*0.85,lW),
      box(-3.6,-lh*0.85,1.6,  lW,lh*0.85,lW), box(3.3,-lh*0.85,1.6,  lW,lh*0.85,lW),
    ];
    const PilFill  = '#FDFCFA'; const PilSide = '#EDE9E0'; const PilEdge = '#CCC8BE';
    const BlanFill = matTop; const BlanSide = matFront;
    const MattTop = '#F8F4EC'; const MattSide = '#E8E2D5';
    return (
      <g filter={`url(#dshadow_${uid})`}>
        <Shadow rx={4.8} ry={0.65} dx={-0.2}/>
        {legs.map((l,i)=>(
          <g key={i}>
            <SolidFace pts={l.front} fill={mat.edge}  darker={mat.sh} lighter={mat.hi}/>
            <SolidFace pts={l.right} fill={mat.sh}    darker={mat.sh} lighter={mat.hi}/>
          </g>
        ))}
        <SolidFace pts={frameTop.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.38}/>
        <SolidFace pts={frameTop.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={frameTop.left}  fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={frameTop.top}   fill={matTop}    darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.4}/>
        {isGlossy && <polygon points={frameTop.top} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp}/>}
        <SolidFace pts={railL.front} fill={matFront}  darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.3}/>
        <SolidFace pts={railR.back}  fill={mat.side}   darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={footB.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.38}/>
        <SolidFace pts={footB.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={footCap.top} fill={matTop}    darker={mat.edge} lighter={mat.hi} spec={fin.specOp>0} grain grainId={gid} grainOp={0.4}/>
        {isGlossy && <polygon points={footCap.top} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp}/>}
        <SolidFace pts={footCap.front} fill={matFront} darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={hbFrame.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.38}/>
        <SolidFace pts={hbFrame.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={hbCap.top}     fill={matTop}    darker={mat.edge} lighter={mat.hi} spec={fin.specOp>0} grain grainId={gid} grainOp={0.42}/>
        {isGlossy && <polygon points={hbCap.top} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp}/>}
        <SolidFace pts={hbCap.front} fill={matFront} darker={mat.edge} lighter={mat.hi}/>
        {[hbP1,hbP2,hbP3].map((hp,i)=>(
          <g key={i}>
            <SolidFace pts={hp.front} fill={mat.side}  darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.5}/>
            <SolidFace pts={hp.top}   fill={matTop}    darker={mat.edge} lighter={mat.hi}/>
          </g>
        ))}
        <SolidFace pts={mattBase.front} fill={MattSide} darker="#B8B2A5" lighter="#fff"/>
        <SolidFace pts={mattBase.right} fill={MattSide} darker="#B8B2A5" lighter="#fff"/>
        <SolidFace pts={mattBase.left}  fill={MattSide} darker="#B8B2A5" lighter="#fff"/>
        <SolidFace pts={mattSeam.front} fill="#D0C8B8"  darker="#B8B2A5" lighter="#fff"/>
        <SolidFace pts={mattTop.front}  fill={MattSide} darker="#B8B2A5" lighter="#fff"/>
        <SolidFace pts={mattTop.top}    fill={MattTop}  darker="#C8C2B5" lighter="#fff"/>
        <SolidFace pts={blanket.front}  fill={BlanSide} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.3}/>
        <SolidFace pts={blanket.right}  fill={mat.side} darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={blanket.top}    fill={BlanFill} darker={mat.edge} lighter={mat.hi} spec={fin.specOp>0} grain grainId={gid} grainOp={0.28}/>
        <SolidFace pts={blanketF.front} fill={mat.hi}   darker={matFront} lighter="#fff"/>
        {[[pil1,pil1F],[pil2,pil2F]].map(([pl,pf],i)=>(
          <g key={i}>
            <SolidFace pts={pl.front} fill={PilSide} darker={PilEdge} lighter="#fff"/>
            <SolidFace pts={pl.right} fill={PilSide} darker={PilEdge} lighter="#fff"/>
            <SolidFace pts={pl.left}  fill={PilSide} darker={PilEdge} lighter="#fff"/>
            <SolidFace pts={pl.top}   fill={PilFill} darker={PilEdge} lighter="#fff" spec={fin.specOp>0}/>
            <SolidFace pts={pf.front} fill={PilEdge} darker={PilEdge} lighter="#fff"/>
          </g>
        ))}
      </g>
    );
  }, [box, Shadow, mat, matFront, matTop, mat.side, mat.edge, mat.sh, mat.hi, fin.specOp, isGlossy, isGlossy, lh, lt, uid, gid]);

  const renderTable = useCallback(() => {
    const lhT = lh * 2.5; const legW = 0.3*lt;
    const topSlab  = box(-3.4, 0, -2.0, 6.8, 0.5, 4.0);
    const topEdgeF = box(-3.4,-0.06,-2.0, 6.8, 0.06, 0.08);
    const topEdgeR = box(3.32,-0.06,-2.0, 0.08, 0.06, 4.0);
    const apronFront = box(-3.1, -0.9, -2.0, 6.2, 0.62, 0.2);
    const apronBack  = box(-3.1, -0.9, 1.8,  6.2, 0.62, 0.2);
    const apronLeft  = box(-3.1, -0.9,-1.8,  0.2, 0.62, 3.6);
    const apronRight = box(2.9,  -0.9,-1.8,  0.2, 0.62, 3.6);
    const legs = [
      { b: box(-3.1,-lhT,-1.8, legW,lhT-0.3,legW) }, { b: box(2.8,-lhT,-1.8, legW,lhT-0.3,legW) },
      { b: box(-3.1,-lhT,1.5,  legW,lhT-0.3,legW) }, { b: box(2.8,-lhT,1.5,  legW,lhT-0.3,legW) },
    ];
    const stretchF = box(-2.85,-lhT*0.4,-1.78, 5.7,0.18,0.14);
    const stretchL = box(-2.85,-lhT*0.4,-1.78, 0.14,0.18,3.28);
    return (
      <g filter={`url(#dshadow_${uid})`}>
        <Shadow rx={4.8} ry={0.5} dy={0.2}/>
        <SolidFace pts={stretchF.front} fill={matFront} darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={stretchF.top}   fill={matTop}   darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={stretchL.left}  fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        {legs.map(({b},i)=>(
          <g key={i}>
            <SolidFace pts={b.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.45}/>
            <SolidFace pts={b.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
            <SolidFace pts={b.left}  fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
            {antiqueOp > 0 && <polygon points={b.front} fill="#654321" opacity={antiqueOp}/>}
          </g>
        ))}
        <SolidFace pts={apronLeft.left}   fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={apronLeft.top}    fill={matTop}    darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={apronFront.front} fill={matFront}  darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.38}/>
        <SolidFace pts={apronFront.top}   fill={matTop}    darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={apronRight.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={topSlab.front}  fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.4}/>
        <SolidFace pts={topSlab.right}  fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={topSlab.left}   fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={topSlab.top}    fill={matTop}    darker={mat.edge} lighter={mat.hi} spec={fin.specOp>0} grain grainId={gid} grainOp={0.52}/>
        {isGlossy && <polygon points={topSlab.top} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp}/>}
        <SolidFace pts={topEdgeF.front} fill={mat.hi}   darker={matFront} lighter="#fff"/>
        <SolidFace pts={topEdgeR.right} fill={mat.hi}   darker={matFront} lighter="#fff"/>
      </g>
    );
  }, [box, Shadow, mat, matFront, matTop, mat.side, mat.edge, mat.hi, fin.specOp, isGlossy, antiqueOp, lh, lt, uid, gid]);

  const renderChair = useCallback(() => {
    const lhC = lh * 2.0; const bh = sty.backH * 2.0; const legW = 0.22*lt;
    const seat = box(-1.7, 0, -1.5, 3.4, 0.5, 3.0);
    const seatEdge = box(-1.7,-0.06,-1.5, 3.4, 0.06, 0.08);
    const stileL = box(-1.5, 0.5,-1.6, 0.2, bh, 0.22);
    const stileR = box(1.3,  0.5,-1.6, 0.2, bh, 0.22);
    const rail1 = box(-1.5, 0.5+bh*0.08, -1.55, 2.8, 0.16, 0.12);
    const rail2 = box(-1.5, 0.5+bh*0.42, -1.55, 2.8, 0.16, 0.12);
    const rail3 = box(-1.5, 0.5+bh*0.78, -1.55, 2.8, 0.16, 0.12);
    const crest = box(-1.55, 0.5+bh-0.05,-1.62, 2.9, 0.32, 0.28);
    const spindleXs = [-1.0, -0.18, 0.64];
    const spindles = spindleXs.map(sx => box(sx, 0.5+bh*0.08+0.16, -1.55, 0.12, bh*0.34-0.16, 0.1));
    const legFL = box(-1.5, -lhC, -1.3, legW, lhC, legW);
    const legFR = box(1.28, -lhC, -1.3, legW, lhC, legW);
    const legRL = box(-1.5, -lhC*0.6, 1.2, legW, lhC*0.6+0.5, legW);
    const legRR = box(1.28, -lhC*0.6, 1.2, legW, lhC*0.6+0.5, legW);
    const cushH = 0.38*sty.cushF;
    const cush  = box(-1.6, 0.5,-1.4, 3.2, cushH, 2.8);
    const cushE = box(-1.6, 0.5,-1.4, 3.2, cushH, 0.07);
    const strF = box(-1.3,-lhC*0.45,-1.25, 2.6, 0.14, 0.12);
    const strS = box(-1.3,-lhC*0.45,-1.25, 0.12, 0.14, 2.55);
    return (
      <g filter={`url(#dshadow_${uid})`}>
        <Shadow rx={2.5} ry={0.44}/>
        {[legRL,legRR].map((l,i)=>(
          <g key={`rear-${i}`}>
            <SolidFace pts={l.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.42}/>
            <SolidFace pts={l.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
            <SolidFace pts={l.left}  fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
          </g>
        ))}
        {[stileL,stileR].map((s,i)=>(
          <g key={i}>
            <SolidFace pts={s.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.42}/>
            <SolidFace pts={s.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
          </g>
        ))}
        {[rail1,rail2,rail3].map((r,i)=>(<g key={i}><SolidFace pts={r.front} fill={matFront} darker={mat.edge} lighter={mat.hi}/><SolidFace pts={r.right} fill={mat.side} darker={mat.edge} lighter={mat.hi}/></g>))}
        {spindles.map((s,i)=>(<g key={i}><SolidFace pts={s.front} fill={mat.side} darker={mat.edge} lighter={mat.hi}/></g>))}
        <SolidFace pts={crest.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.38}/>
        <SolidFace pts={crest.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={crest.top}   fill={matTop}    darker={mat.edge} lighter={mat.hi} spec={fin.specOp>0} grain grainId={gid} grainOp={0.42}/>
        {isGlossy && <polygon points={crest.top} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp}/>}
        <SolidFace pts={strS.left}  fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={strF.front} fill={matFront}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={strF.top}   fill={matTop}    darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={seat.front}  fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.4}/>
                <SolidFace pts={seat.right}  fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={seat.left}   fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={seat.top}    fill={matTop}    darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.48} spec={fin.specOp>0}/>
        {isGlossy && <polygon points={seat.top} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp}/>}
        <SolidFace pts={seatEdge.front} fill={mat.hi} darker={matFront} lighter="#fff"/>
        <SolidFace pts={cush.front} fill={mat.hi}    darker={matFront} lighter="#fff" spec={fin.specOp>0}/>
        <SolidFace pts={cush.right} fill={matTop}    darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={cush.left}  fill={matTop}    darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={cush.top}   fill={mat.hi}    darker={matFront} lighter="#fff" spec={fin.specOp>0}/>
        <SolidFace pts={cushE.front} fill={matFront} darker={mat.edge} lighter={mat.hi}/>
        {[legFL,legFR].map((l,i)=>(
          <g key={`front-${i}`}>
            <SolidFace pts={l.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.42}/>
            <SolidFace pts={l.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
            <SolidFace pts={l.left}  fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
          </g>
        ))}
      </g>
    );
  }, [box, Shadow, mat, matFront, matTop, mat.side, mat.edge, mat.hi, fin.specOp, isGlossy, lh, lt, sty.backH, sty.cushF, uid, gid]);

  const renderCabinet = useCallback(() => {
    const plinth   = box(-3.1,-0.5,-2.0, 6.2, 0.5, 4.0);
    const plinthCap= box(-3.0,-0.02,-1.9, 6.0, 0.04, 3.8);
    const body = box(-3.0, 0, -1.9, 6.0, 5.2, 3.8);
    const cornice    = box(-3.15, 5.2,-2.05, 6.3, 0.35, 4.1);
    const corniceTop = box(-3.2,  5.55,-2.1, 6.4, 0.14, 4.2);
    const doorL = box(-2.95, 0.04,-1.92, 2.85, 5.12, 0.14);
    const doorR = box(0.1,   0.04,-1.92, 2.85, 5.12, 0.14);
    const dpL1  = box(-2.78, 0.25,-1.94, 2.5, 2.2, 0.06);
    const dpL2  = box(-2.78, 2.7, -1.94, 2.5, 2.2, 0.06);
    const dpR1  = box(0.28,  0.25,-1.94, 2.5, 2.2, 0.06);
    const dpR2  = box(0.28,  2.7, -1.94, 2.5, 2.2, 0.06);
    const knobL = box(-0.26, 2.5,-2.1, 0.18, 0.18, 0.18);
    const knobR = box(0.08,  2.5,-2.1, 0.18, 0.18, 0.18);
    const brass = '#C8A030'; const brassD = '#906010'; const brassH = '#F0C860';
    return (
      <g filter={`url(#dshadow_${uid})`}>
        <Shadow rx={4.0} ry={0.62} dy={0.2}/>
        <SolidFace pts={plinth.front}    fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={plinth.right}    fill={mat.edge}  darker={mat.sh}   lighter={mat.hi}/>
        <SolidFace pts={plinth.left}     fill={mat.sh}    darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={plinthCap.top}   fill={matTop}    darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.4}/>
        <SolidFace pts={plinthCap.front} fill={matFront}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={body.right} fill={mat.side} darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={body.left}  fill={mat.sh}   darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={doorL.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.42}/>
        {isGlossy && <polygon points={doorL.front} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp * 0.7}/>}
        <SolidFace pts={doorR.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.42}/>
        {isGlossy && <polygon points={doorR.front} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp * 0.7}/>}
        {[dpL1,dpL2,dpR1,dpR2].map((dp,i)=>(<SolidFace key={i} pts={dp.front} fill={mat.side} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.5}/>))}
        <SolidFace pts={knobL.front} fill={brass} darker={brassD} lighter={brassH}/>
        <SolidFace pts={knobL.right} fill={brassD} darker={brassD} lighter={brassH}/>
        <SolidFace pts={knobL.top}   fill={brassH} darker={brassD} lighter={brassH}/>
        <SolidFace pts={knobR.front} fill={brass} darker={brassD} lighter={brassH}/>
        <SolidFace pts={knobR.right} fill={brassD} darker={brassD} lighter={brassH}/>
        <SolidFace pts={knobR.top}   fill={brassH} darker={brassD} lighter={brassH}/>
        <SolidFace pts={cornice.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.38}/>
        <SolidFace pts={cornice.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={cornice.left}  fill={mat.sh}    darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={corniceTop.top}   fill={matTop}    darker={mat.edge} lighter={mat.hi} spec={fin.specOp>0} grain grainId={gid} grainOp={0.45}/>
        {isGlossy && <polygon points={corniceTop.top} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp}/>}
        <SolidFace pts={corniceTop.front} fill={matFront} darker={mat.edge} lighter={mat.hi}/>
      </g>
    );
  }, [box, Shadow, mat, matFront, matTop, mat.side, mat.edge, mat.sh, mat.hi, fin.specOp, isGlossy, uid, gid]);

  const renderDesk = useCallback(() => {
    const topS  = box(-4.2, 0, -2.0, 8.4, 0.5, 4.0);
    const topEF = box(-4.2,-0.06,-2.0, 8.4, 0.06, 0.08);
    const topER = box(4.12,-0.06,-2.0, 0.08, 0.06, 4.0);
    const pedL  = box(-4.1,-3.2,-1.9, 2.6, 3.2, 3.8);
    const drs   = [0,1,2].map(i => ({
      face: box(-4.05, -3.1+i*1.02,-1.95, 2.5, 0.9, 0.12),
      pull: box(-2.98, -2.65+i*1.02,-2.06, 0.28,0.14, 0.1),
    }));
    const pedR  = box(3.1,-3.2,-1.9, 0.55, 3.2, 3.8);
    const modesty = box(-1.5,-3.2,-1.9, 4.6, 3.2, 0.18);
    const grommet = box(1.2,-0.02,-0.5, 0.4, 0.02, 0.4);
    const brass = '#B89020'; const brassD = '#806010'; const brassH = '#E0B840';
    return (
      <g filter={`url(#dshadow_${uid})`}>
        <Shadow rx={5.5} ry={0.55}/>
        <SolidFace pts={modesty.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.3}/>
        <SolidFace pts={modesty.left}  fill={mat.sh}   darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={pedL.front} fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.38}/>
        <SolidFace pts={pedL.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={pedL.left}  fill={mat.sh}    darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={pedR.front} fill={matFront}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={pedR.right} fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        {drs.map(({face,pull},i)=>(
          <g key={i}>
            <SolidFace pts={face.front} fill={mat.hi}    darker={matFront} lighter="#fff" grain grainId={gid} grainOp={0.35}/>
            {isGlossy && <polygon points={face.front} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp * 0.5}/>}
            <SolidFace pts={pull.front} fill={brass}  darker={brassD} lighter={brassH}/>
            <SolidFace pts={pull.top}   fill={brassH} darker={brassD} lighter={brassH}/>
          </g>
        ))}
        <SolidFace pts={topS.front}  fill={matFront} darker={mat.edge} lighter={mat.hi} grain grainId={gid} grainOp={0.4}/>
        <SolidFace pts={topS.right}  fill={mat.side}  darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={topS.left}   fill={mat.sh}    darker={mat.edge} lighter={mat.hi}/>
        <SolidFace pts={topS.top}    fill={matTop}    darker={mat.edge} lighter={mat.hi} spec={fin.specOp>0} grain grainId={gid} grainOp={0.5}/>
        {isGlossy && <polygon points={topS.top} fill={`url(#g_${uid}_gloss)`} opacity={fin.specOp}/>}
        <SolidFace pts={topEF.front} fill={mat.hi}   darker={matFront} lighter="#fff"/>
        <SolidFace pts={topER.right} fill={mat.hi}   darker={matFront} lighter="#fff"/>
        <SolidFace pts={grommet.top} fill="#404040" darker="#202020" lighter="#606060"/>
      </g>
    );
  }, [box, Shadow, mat, matFront, matTop, mat.side, mat.edge, mat.sh, mat.hi, fin.specOp, isGlossy, uid, gid]);

  const renderers = { sofa:renderSofa, bed:renderBed, table:renderTable, chair:renderChair, cabinet:renderCabinet, desk:renderDesk };
  const floorColor = sty.roomFloor || '#D8D4CE';
  const wallColor  = sty.roomBg    || '#F0EDEA';
  const accentColor= sty.roomAccent|| '#B0A898';

  return (
    <svg viewBox="-200 -155 400 315" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',overflow:'visible', contain:'strict'}}>
      <SVGDefs mat={mat} uid={uid} finishSpec={fin.specOp} styleData={sty}/>
      <rect x="-200" y="60" width="400" height="100" fill={`url(#g_${uid}_floor)`}/>
      <g opacity="0.06">
        {Array.from({length:12}).map((_,i)=><line key={`h${i}`} x1="-200" y1={60+i*14} x2="200" y2={60+i*14} stroke={accentColor} strokeWidth="0.6" strokeLinecap="round"/>)}
        {Array.from({length:22}).map((_,i)=><line key={`v${i}`} x1={-198+i*18} y1="60" x2={-198+i*18} y2="150" stroke={accentColor} strokeWidth="0.6" strokeLinecap="round"/>)}
      </g>
      <rect x="-200" y="-155" width="400" height="220" fill={`url(#g_${uid}_wall)`}/>
      <line x1="-200" y1="62" x2="200" y2="62" stroke={accentColor} strokeWidth="0.8" strokeLinecap="round"/>
      <g opacity="0.03">
        {Array.from({length:18}).map((_,i)=><line key={`wh${i}`} x1="-200" y1={-155+i*22} x2="200" y2={-155+i*22} stroke={T.primary} strokeWidth="0.5" strokeLinecap="round"/>)}
        {Array.from({length:22}).map((_,i)=><line key={`wv${i}`} x1={-200+i*19} y1="-155" x2={-200+i*19} y2="62" stroke={T.primary} strokeWidth="0.5" strokeLinecap="round"/>)}
      </g>
      {isDistressed && <rect x="-200" y="-155" width="400" height="315" fill="url(#noise)" opacity="0.04"/>}
      {style === 'bohemian' && <circle cx="-80" cy="-100" r="120" fill="#FFB84080" opacity="0.06"/>}
      {style === 'industrial' && <rect x="-200" y="-155" width="400" height="315" fill="#60606020"/>}
      {(renderers[type] || renderers.sofa)()}
    </svg>
  );
});

FurnitureRenderer.displayName = 'FurnitureRenderer';

// ─── CONFETTI (memoized) ─────────────────────────────────────────────────────────────────
const Confetti = memo(() => {
  const colors = ['#1d4ed8','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899'];
  const pieces = Array.from({length:18}, (_,i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${10 + (i * 5.2) % 80}%`,
    delay: `${(i * 0.12)}s`,
    size: 6 + (i % 4) * 2,
    rot: i * 23,
  }));
  return (
    <div style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:10}}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:'absolute', top:'-10px', left:p.left,
          width:p.size, height:p.size, background:p.color,
          borderRadius: p.id % 3 === 0 ? '50%' : '2px',
          transform:`rotate(${p.rot}deg)`,
          animation:`confetti-fall 1.8s ${p.delay} ease-in forwards`,
          willChange:'transform, opacity'
        }}/>
      ))}
    </div>
  );
});

Confetti.displayName = 'Confetti';

// ─── QUOTE MODAL (memoized) ─────────────────────────────────────────────────────────────
const QuoteModal = memo(({ config, onClose }) => {
  const mat = MATERIALS[config.material] || MATERIALS.oak;
  const sty = STYLES[config.style]       || STYLES.modern;
  const fin = FINISHES[config.finish]    || FINISHES.matte;
  const [form, setForm]     = useState({ name:'', email:'', phone:'', notes:'' });
  const [status, setStatus] = useState('idle');
  const [aiResp, setAiResp] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const orderId = useRef(`FQ-${Math.floor(Math.random()*900000+100000)}`);
  const getEstimatedDelivery = useCallback(() => {
    const d = new Date(); 
    d.setDate(d.getDate() + 45 + Math.floor(Math.random()*30));
    return d.toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'});
  }, []);
  const estimatedDelivery = useRef(getEstimatedDelivery());

  const handleInputChange = useCallback((field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const submit = useCallback(async () => {
    if (!form.name || !form.email) return;
    setStatus('loading'); 
    setAiResp('');
    try {
      const prompt = `You are a luxury custom furniture consultant at FURNIQO. A client has configured a piece.

Configuration:
- Type: ${config.type.charAt(0).toUpperCase()+config.type.slice(1)}
- Style: ${sty.name}
- Material: ${mat.name} (${mat.texture})
- Finish: ${fin.label}
${config.dimensions ? `- Dimensions: ${config.dimensions}` : ''}
- Client: ${form.name}
${form.notes ? `- Notes: ${form.notes}` : ''}

Write 3 warm, professional paragraphs:
1. Personal greeting using their name, referencing their exact choices
2. Poetic description of how this ${mat.name} with ${fin.label} finish will look/feel in real life in an Indian home
3. Realistic price range in ₹ (Indian Rupees) for handcrafted luxury, delivery timeline of 6-10 weeks, and next steps

Max 170 words. No bullet points. Warm, human, luxury tone.`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1000, messages:[{role:'user',content:prompt}] }),
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text;
      if (text) {
        setAiResp(text);
        setStatus('done');
      } else {
        throw new Error('No response');
      }
    } catch {
      setStatus('done');
      setAiResp(`Dear ${form.name}, thank you for choosing FURNIQO for your bespoke ${config.type}.\n\nYour selection of ${mat.name} with a ${fin.label} finish in ${sty.name} style is a truly distinguished choice. The rich warmth of ${mat.name} will bring character and soul to your space, with the ${fin.label} finish lending it just the right sense of refinement.\n\nFor a handcrafted piece of this calibre, our artisans estimate ₹${config.type === 'sofa' ? '1,20,000–1,85,000' : config.type === 'bed' ? '95,000–1,50,000' : config.type === 'desk' ? '65,000–1,10,000' : config.type === 'cabinet' ? '80,000–1,30,000' : '45,000–80,000'} with a crafting timeline of 6–8 weeks. Our design consultant will reach you within 24 hours to finalise dimensions.`);
    }
  }, [form, config, mat, sty, fin]);

  const placeOrder = useCallback(() => {
    setStatus('ordered');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  }, []);

  const handleClose = useCallback(() => onClose(), [onClose]);

  const inpStyle = useMemo(() => ({
    width:'100%', background:T.surfaceAlt, border:`1px solid ${T.border}`,
    borderRadius:7, padding:'7px 10px', fontSize:11, color:T.text, outline:'none',
    fontFamily:"'DM Sans',sans-serif", transition:'border-color 0.15s',
  }), []);

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:'fixed',inset:0,zIndex:300,display:'flex',alignItems:'flex-start',justifyContent:'center',
        padding:'1rem',background:'rgba(0,0,0,0.65)',backdropFilter:'blur(16px)',
        overflowY:'auto',WebkitOverflowScrolling:'touch'}}
      onClick={handleClose}>
      <div style={{position:'fixed',inset:0,backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',opacity:0.6,pointerEvents:'none',zIndex:-1}}/>
      <motion.div
        initial={{scale:0.88,opacity:0,y:24}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.88,opacity:0,y:24}}
        transition={{type:'spring',stiffness:300,damping:28}}
        className="q-inner"
        style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:18,maxWidth:400,width:'100%',
          maxHeight:'88vh',overflowY:'auto',margin:'auto',position:'relative',
          boxShadow:'0 40px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.08)'}}
        onClick={e=>e.stopPropagation()}>
        {showConfetti && <Confetti/>}
        <div style={{height:3,borderRadius:'18px 18px 0 0',background:`linear-gradient(90deg, ${mat.edge}, ${mat.front}, ${mat.top}, ${mat.hi}, ${T.primary}40)`,backgroundSize:'200% 100%'}}/>
        <div style={{padding:'0.9rem 1rem 1rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.7rem'}}>
            <div>
              <h2 className="q-h2" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:400,
                color:T.text,lineHeight:1.2}}>
                {status === 'ordered' ? 'Order Confirmed' : 'Request Quote'}
              </h2>
              <p style={{fontSize:8,color:T.textMuted,marginTop:2,fontFamily:"'DM Mono',monospace",letterSpacing:'0.05em'}}>
                {status === 'ordered' ? `Order ID: ${orderId.current}` : 'AI-personalized'}
              </p>
            </div>
            <button onClick={handleClose} className="btn-ghost" style={{padding:'2px 6px',fontSize:11,borderRadius:5,flexShrink:0}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div style={{background:T.surfaceAlt,borderRadius:8,padding:'0.5rem',marginBottom:'0.7rem',
            border:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:6}}>
            <div style={{display:'flex',gap:1,borderRadius:4,overflow:'hidden',flexShrink:0,height:28,width:36,
              boxShadow:`0 1px 6px ${mat.edge}60`}}>
              {[mat.sh,mat.edge,mat.front,mat.top,mat.hi].map((c,i)=><div key={i} style={{flex:1,background:c}}/>)}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:10,fontWeight:600,color:T.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {config.type.charAt(0).toUpperCase()+config.type.slice(1)} · {sty.name} · {mat.name}
              </p>
              <p style={{fontSize:8,color:T.textMuted,marginTop:1,fontFamily:"'DM Mono',monospace"}}>
                {fin.label} finish{config.dimensions ? ` · ${config.dimensions}` : ''}
              </p>
            </div>
          </div>

          {status === 'ordered' && (
            <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}>
              <div style={{textAlign:'center',padding:'0.3rem 0 0.3rem'}}>
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:300,delay:0.1}}
                  style={{width:48,height:48,borderRadius:'50%',background:`linear-gradient(135deg,${T.success},#059669)`,
                    display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.6rem',
                    boxShadow:`0 4px 12px ${T.success}50,0 0 0 5px ${T.successLight}`}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </motion.div>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:400,color:T.text,marginBottom:2}}>
                  Order Confirmed!
                </h3>
                <p style={{fontSize:10,color:T.textMuted,lineHeight:1.5,marginBottom:'0.6rem'}}>
                  Your bespoke order has been received.
                </p>
              </div>
              <div style={{background:`linear-gradient(135deg,${T.successLight},${T.primaryLight})`,
                border:`1px solid ${T.success}30`,borderRadius:10,padding:'0.6rem',marginBottom:'0.6rem'}}>
                {[['Order ID', orderId.current], ['Client', form.name], ['Email', form.email],
                  ['Piece', `${config.type.charAt(0).toUpperCase()+config.type.slice(1)} · ${sty.name}`],
                  ['Material', `${mat.name} · ${fin.label}`], ['Est. Delivery', estimatedDelivery.current],
                ].map(([k,v])=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'3px 0',borderBottom:`1px solid ${T.border}`}}>
                    <span style={{fontSize:8,color:T.textMuted,fontFamily:"'DM Mono',monospace"}}>{k}</span>
                    <span style={{fontSize:9,fontWeight:500,color:T.textMid,textAlign:'right',maxWidth:'60%',overflow:'hidden',textOverflow:'ellipsis'}}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:5}}>
                <button onClick={handleClose} className="btn-ghost" style={{flex:1,padding:'6px',fontSize:10}}>Close</button>
                <button onClick={handleClose} className="btn-primary" style={{flex:2,padding:'6px',fontSize:10.5}}>Back to Designing</button>
              </div>
            </motion.div>
          )}

          {status === 'done' && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
              <div style={{background:T.surfaceAlt,borderRadius:10,padding:'0.7rem',marginBottom:'0.7rem',
                border:`1px solid ${T.border}`,position:'relative'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${mat.edge},${mat.front},${mat.hi})`}}/>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9.5,fontStyle:'italic',color:T.textMuted,marginBottom:5,marginTop:4}}>Your quote</p>
                <p className="q-aitext" style={{fontSize:10.5,color:T.textMid,lineHeight:1.65,whiteSpace:'pre-line'}}>{aiResp}</p>
              </div>
              <div style={{display:'flex',gap:5}}>
                <button onClick={()=>setStatus('idle')} className="btn-ghost" style={{flex:1,padding:'6px',fontSize:10}}>← Edit</button>
                <button onClick={placeOrder} className="btn-primary" style={{flex:2,padding:'6px',fontSize:10.5}}>Confirm Order</button>
              </div>
            </motion.div>
          )}

          {status === 'loading' && (
            <div style={{textAlign:'center',padding:'1.2rem 0'}}>
              <div style={{width:32,height:32,borderRadius:'50%',border:`2px solid ${T.border}`,borderTopColor:T.primary,margin:'0 auto 0.6rem',animation:'spin 0.8s linear infinite'}}/>
              <p style={{fontSize:11,color:T.textMid}}>Crafting your quote...</p>
            </div>
          )}

          {status === 'idle' && (
            <>
              <div style={{display:'flex',flexDirection:'column',gap:5}}>
                <input type="text" placeholder="Full name *" value={form.name} onChange={handleInputChange('name')}
                  style={inpStyle} onFocus={e=>{e.target.style.borderColor=T.primaryMed}} onBlur={e=>{e.target.style.borderColor=T.border}}/>
                <input type="email" placeholder="Email *" value={form.email} onChange={handleInputChange('email')}
                  style={inpStyle} onFocus={e=>{e.target.style.borderColor=T.primaryMed}} onBlur={e=>{e.target.style.borderColor=T.border}}/>
                <textarea placeholder="Notes (optional)" value={form.notes} onChange={handleInputChange('notes')} rows={2}
                  style={{...inpStyle,resize:'none'}} onFocus={e=>{e.target.style.borderColor=T.primaryMed}} onBlur={e=>{e.target.style.borderColor=T.border}}/>
              </div>
              <button onClick={submit} disabled={!form.name||!form.email}
                className="btn-primary" style={{marginTop:'0.6rem',width:'100%',padding:'7px',fontSize:11,
                  background:form.name&&form.email?`linear-gradient(135deg,${T.primary},${T.primaryMed})`:T.surfaceDeep,
                  cursor:form.name&&form.email?'pointer':'not-allowed'}}>
                Get Quote
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

QuoteModal.displayName = 'QuoteModal';

// ─── COLLAPSIBLE SECTION (memoized) ──────────────────────────────────────────────────────
const Section = memo(({ label, children, defaultOpen=true }) => {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = useCallback(() => setOpen(o => !o), []);
  return (
    <div style={{borderBottom:`1px solid ${T.border}`, marginBottom: 0 }}>
      <button onClick={toggle}
        style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',
          background:'none',border:'none',cursor:'pointer',padding:'0.3rem 0',outline:'none'}}>
        <span style={{fontSize:7.5,fontWeight:600,color:T.textMuted,textTransform:'uppercase',
          letterSpacing:'0.1em',fontFamily:"'DM Mono',monospace"}}>{label}</span>
        <span style={{fontSize:8,color:T.textMuted,transform:open?'rotate(180deg)':'rotate(0deg)',transition:'transform 0.2s'}}>▼</span>
      </button>
      <div className={`collapsible ${open?'open':'closed'}`}>
        {children}
      </div>
    </div>
  );
});

Section.displayName = 'Section';

// ─── CHIP (memoized) ─────────────────────────────────────────────────────────────────────
const Chip = memo(({ selected, onClick, children }) => (
  <button onClick={onClick} className="chip-sm"
    style={{padding:'3px 6px',borderRadius:5,fontSize:9,fontWeight:selected?600:400,
      cursor:'pointer',transition:'all 0.12s',outline:'none',fontFamily:"'DM Sans',sans-serif",
      border:`1px solid ${selected?T.primaryBorder:T.border}`,
      background:selected?T.primaryLight:T.surface,
      color:selected?T.primaryText:T.textMid}}>
    {children}
  </button>
));

Chip.displayName = 'Chip';

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────────────
export default function CustomFurniture() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({ type:'desk', style:'modern', material:'oak', finish:'matte', dimensions:'' });
  const [rotation, setRotation] = useState(-22);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showQuote, setShowQuote] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const dragRef = useRef({ active:false, startX:0, startRot:0 });
  const canvasRef = useRef(null);

  const mat = MATERIALS[config.material] || MATERIALS.oak;
  const sty = STYLES[config.style] || STYLES.modern;
  const fin = FINISHES[config.finish] || FINISHES.matte;

  // Memoized handlers
  const onPointerDown = useCallback(e => {
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    dragRef.current = { active:true, startX:clientX, startRot:rotation };
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, [rotation]);

  const onPointerMove = useCallback(e => {
    if (!dragRef.current.active) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX || dragRef.current.startX;
    setRotation(dragRef.current.startRot + (clientX - dragRef.current.startX) * 0.5);
  }, []);

  const onPointerUp = useCallback(() => { 
    dragRef.current.active = false; 
    setIsDragging(false); 
  }, []);

  const onWheel = useCallback(e => {
    e.preventDefault();
    setZoom(z => Math.max(0.5, Math.min(1.65, z - e.deltaY * 0.001)));
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  const doSpin = useCallback(() => {
    setSpinning(true);
    let t0 = null, r0 = rotation;
    const go = ts => {
      if (!t0) t0 = ts;
      const prog = Math.min((ts - t0) / 2800, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      setRotation(r0 + 360 * eased);
      if (prog < 1) requestAnimationFrame(go); 
      else setSpinning(false);
    };
    requestAnimationFrame(go);
  }, [rotation]);

  const goStep3 = useCallback(() => { 
    setStep(3); 
    doSpin(); 
  }, [doSpin]);

  const reset = useCallback(() => { 
    setStep(1); 
    setConfig({ type:'desk', style:'modern', material:'oak', finish:'matte', dimensions:'' }); 
    setRotation(-22); 
    setZoom(1); 
  }, []);

  const updateConfig = useCallback((key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const setTypeAndNext = useCallback((type) => {
    setConfig(prev => ({ ...prev, type }));
    setTimeout(() => setStep(2), 150);
  }, []);

  const furnitureOpts = useMemo(() => [
    {v:'desk', label:'Desk', icon:Icons.desk},
    {v:'table', label:'Table', icon:Icons.table},
    {v:'bed', label:'Bed', icon:Icons.bed},
    {v:'cabinet', label:'Cabinet', icon:Icons.cabinet},
    {v:'sofa', label:'Sofa', icon:Icons.sofa},
    {v:'chair', label:'Chair', icon:Icons.chair},
  ], []);

  const styleOpts = useMemo(() => Object.entries(STYLES).map(([v,s]) => ({v,label:s.name})), []);
  const matOpts = useMemo(() => Object.entries(MATERIALS).map(([v,m]) => ({v,label:m.name,m})), []);
  const finishOpts = useMemo(() => Object.entries(FINISHES).map(([v,f]) => ({v,label:f.label})), []);
  
  const progress = useMemo(() => [config.style, config.material, config.finish].filter(Boolean).length / 3, [config]);
  const card = useMemo(() => ({ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10 }), []);
  const canvasBg = sty.roomBg || '#EBE8E0';

  return (
    <div style={{background:T.bg,fontFamily:"'DM Sans',sans-serif",width:'100%',overflowX:'hidden'}}>
      <FontLoader/>

      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`, padding:'1.2rem 1rem 1rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0, background:`radial-gradient(ellipse at 50% -10%, ${T.primaryLight} 0%, ${T.primaryLight}60 35%, transparent 65%)`, pointerEvents:'none'}}/>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4}} style={{position:'relative',zIndex:2}}>
          <motion.p initial={{opacity:0,letterSpacing:'0.22em'}} animate={{opacity:1,letterSpacing:'0.1em'}} transition={{delay:0.15}}
            style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:T.primary, marginBottom:6,textTransform:'uppercase',fontWeight:600,letterSpacing:'0.12em'}}>
            FURNIQO · Bespoke Furniture
          </motion.p>
          <motion.h1 initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.22}}
            className="hero-title"
            style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.3rem,3.5vw,2.2rem)', fontWeight:350,color:T.text,lineHeight:1.15,marginBottom:'0.2rem',letterSpacing:'-0.01em'}}>
            Design Your{' '}
            <em style={{fontStyle:'italic',color:T.primary, background:`linear-gradient(120deg,${T.primaryLight} 0%,${T.primaryLight} 40%,transparent 65%)`, padding:'0 0.2rem',display:'inline-block'}}>
              Signature Piece
            </em>
          </motion.h1>
          <motion.p initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
            className="hero-sub"
            style={{color:T.textMid,fontSize:'clamp(0.7rem,2vw,0.8rem)',maxWidth:380,margin:'0 auto',lineHeight:1.5,fontWeight:450}}>
            Configure, preview in live 3D, and receive an AI-personalized quote
          </motion.p>
        </motion.div>
      </div>

      <div className="stepper-bar" style={{background:T.surface,borderBottom:`1px solid ${T.border}`,display:'flex', alignItems:'center',justifyContent:'center',padding:'0.4rem 0.8rem',gap:0}}>
        {[{n:1,l:'Type'},{n:2,l:'Style'},{n:3,l:'Quote'}].map((s,i)=>(
          <React.Fragment key={s.n}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <div style={{width:20,height:20,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center', fontSize:9,fontWeight:600,
                background:step>=s.n?T.primary:T.surfaceAlt, color:step>=s.n?'#fff':T.textMuted,
                border:`1px solid ${step>=s.n?T.primary:T.border}`}}>
                {step>s.n?<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>:s.n}
              </div>
              <span className="step-label" style={{fontSize:7,marginTop:1,color:step>=s.n?T.primary:T.textMuted, fontFamily:"'DM Mono',monospace"}}>{s.l}</span>
            </div>
            {i<2 && <div style={{width:24,height:1.5,background:step>s.n?T.primary:T.border, margin:'0 2px 8px',transition:'background 0.3s'}}/>}
          </React.Fragment>
        ))}
      </div>

      <div className="cf-layout">
        <div className="cf-panel">
          <div className="panel-inner" style={{...card,padding:'0.6rem',overflow:'hidden'}}>
            <AnimatePresence mode="wait">
              {step===1 && (
                <motion.div key="s1" initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-8}} transition={{duration:0.15}}>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontWeight:400, color:T.text,marginBottom:'0.4rem'}}>Choose type</h3>
                  <div className="furniture-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:5,marginBottom:'0.5rem'}}>
                    {furnitureOpts.map(o=>(
                      <button key={o.v} onClick={()=>setTypeAndNext(o.v)}
                        className="furniture-btn"
                        style={{padding:'5px 2px',borderRadius:6,cursor:'pointer',display:'flex',flexDirection:'column', alignItems:'center',gap:2,transition:'all 0.12s',
                          border:`1px solid ${config.type===o.v?T.primaryBorder:T.border}`, background:config.type===o.v?T.primaryLight:T.surface}}>
                        <span className="furniture-icon" style={{width:18,height:18,color:config.type===o.v?T.primary:T.textMid,display:'flex',alignItems:'center',justifyContent:'center',strokeWidth:1.6}}>
                          {React.createElement(o.icon)}
                        </span>
                        <span className="furniture-label" style={{fontSize:8.5,fontWeight:config.type===o.v?600:400, color:config.type===o.v?T.primaryText:T.textMid}}>{o.label}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={()=>setStep(2)} className="btn-primary" style={{width:'100%',padding:'6px',fontSize:10}}>Continue →</button>
                </motion.div>
              )}

              {step===2 && (
                <motion.div key="s2" initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-8}} transition={{duration:0.15}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.3rem'}}>
                    <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontWeight:400,color:T.text}}>Customize</h3>
                    <button onClick={reset} className="btn-ghost" style={{fontSize:8,fontFamily:"'DM Mono',monospace",padding:'1px 4px'}}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    </button>
                  </div>

                  <Section label="Type">
                    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:3,paddingTop:2}}>
                      {furnitureOpts.map(o=><Chip key={o.v} selected={config.type===o.v} onClick={()=>updateConfig('type',o.v)}>{o.label}</Chip>)}
                    </div>
                  </Section>

                  <Section label="Style">
                    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:3,paddingTop:2}}>
                      {styleOpts.map(o=><Chip key={o.v} selected={config.style===o.v} onClick={()=>updateConfig('style',o.v)}>{o.label}</Chip>)}
                    </div>
                  </Section>

                  <Section label="Material">
                    <div className="mat-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:3,paddingTop:2}}>
                      {matOpts.map(o=>(
                        <button key={o.v} onClick={()=>updateConfig('material',o.v)}
                          style={{background:T.surface,border:`1px solid ${config.material===o.v?o.m.front:T.border}`, borderRadius:5,padding:'3px 1px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:1}}>
                          <div className="mat-swatch" style={{width:22,height:22,borderRadius:3,overflow:'hidden',display:'flex',boxShadow:'0 1px 2px rgba(0,0,0,0.15)'}}>
                            {[o.m.edge,o.m.front,o.m.top,o.m.hi].map((c,i)=><div key={i} style={{flex:1,background:c}}/>)}
                          </div>
                          <span className="mat-name" style={{fontSize:7,color:config.material===o.v?T.primaryText:T.textMuted}}>{o.label}</span>
                        </button>
                      ))}
                    </div>
                  </Section>

                  <Section label="Finish">
                    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:3,paddingTop:2}}>
                      {finishOpts.map(o=>(
                        <Chip key={o.v} selected={config.finish===o.v} onClick={()=>updateConfig('finish',o.v)}>{o.label}</Chip>
                      ))}
                    </div>
                  </Section>

                  <Section label="Dimensions" defaultOpen={false}>
                    <input type="text" value={config.dimensions} onChange={e=>updateConfig('dimensions',e.target.value)}
                      placeholder='e.g. 72" × 36" × 30"' style={{width:'100%',background:T.surfaceAlt,border:`1px solid ${T.border}`, borderRadius:5,padding:'4px 6px',fontSize:9,color:T.text,outline:'none',marginTop:2}}/>
                  </Section>

                  <div style={{paddingTop:'0.3rem'}}>
                    <div style={{height:2,background:T.surfaceAlt,borderRadius:1,overflow:'hidden',marginBottom:1}}>
                      <div style={{width:`${progress*100}%`,height:'100%',background:`linear-gradient(90deg,${T.primaryMed},${T.primary})`,borderRadius:1}}/>
                    </div>
                    <p style={{fontSize:7,color:T.textMuted,fontFamily:"'DM Mono',monospace"}}>{Math.round(progress*100)}% configured</p>
                  </div>

                  <button onClick={goStep3} className="btn-primary" style={{marginTop:'0.4rem',width:'100%',padding:'6px',fontSize:10}}>Complete Design ✦</button>
                </motion.div>
              )}

              {step===3 && (
                <motion.div key="s3" initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:0.12}} style={{textAlign:'center'}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:T.primaryLight, border:`1px solid ${T.primaryBorder}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.4rem'}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontWeight:400,color:T.text,marginBottom:1}}>Design Complete</h3>
                  <p style={{fontSize:8,color:T.textMuted,marginBottom:'0.5rem'}}>ready for quote</p>

                  <div style={{background:T.surfaceAlt,borderRadius:7,padding:'0.4rem',marginBottom:'0.5rem',textAlign:'left',border:`1px solid ${T.border}`}}>
                    {[['Type', config.type.charAt(0).toUpperCase()+config.type.slice(1)], ['Style', sty.name], ['Material', mat.name], ['Finish', fin.label], ...(config.dimensions?[['Size',config.dimensions]]:[])].map(([k,v])=>(
                      <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'2px 0',borderBottom:`1px solid ${T.border}`}}>
                        <span style={{fontSize:8,color:T.textMuted}}>{k}</span><span style={{fontSize:9,fontWeight:500,color:T.textMid}}>{v}</span>
                      </div>
                    ))}
                    <div style={{height:3,borderRadius:1,marginTop:4,background:`linear-gradient(90deg,${mat.edge},${mat.sh},${mat.front},${mat.top},${mat.hi})`}}/>
                  </div>

                  <div style={{display:'flex',gap:4}}>
                    <button onClick={reset} className="btn-ghost" style={{flex:1,padding:'5px',fontSize:9}}>Start Over</button>
                    <button onClick={()=>setShowQuote(true)} className="btn-primary" style={{flex:2,padding:'5px',fontSize:10}}>Get Quote</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="cf-canvas">
          <div style={{...card,padding:0,overflow:'hidden'}}>
            <div className="canvas-controls-top" style={{display:'flex',alignItems:'center',justifyContent:'space-between', padding:'0.35rem 0.6rem',borderBottom:`1px solid ${T.border}`,background:T.surface}}>
              <div><p style={{fontSize:10,fontWeight:600,color:T.text}}>3D Preview</p><p style={{fontSize:7,color:T.textMuted,fontFamily:"'DM Mono',monospace"}}>drag · scroll</p></div>
              <div style={{display:'flex',alignItems:'center',gap:4}}>
                <div style={{display:'flex',alignItems:'center',gap:2}}>
                  <button onClick={()=>setZoom(z=>Math.max(0.5,z-0.1))} className="btn-ghost" style={{width:18,height:18,borderRadius:'50%',padding:0,fontSize:12}}>−</button>
                  <span style={{fontSize:7,color:T.textMuted,minWidth:22,textAlign:'center'}}>{Math.round(zoom*100)}%</span>
                  <button onClick={()=>setZoom(z=>Math.min(1.65,z+0.1))} className="btn-ghost" style={{width:18,height:18,borderRadius:'50%',padding:0,fontSize:12}}>+</button>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:2,background:T.surfaceAlt,borderRadius:10,padding:'1px 5px'}}>
                  <div style={{display:'flex',gap:1,height:5,width:10}}>{[mat.edge,mat.front,mat.top,mat.hi].map((c,i)=><div key={i} style={{flex:1,background:c}}/>)}</div>
                  <span style={{fontSize:7,color:T.textMid}}>{mat.name}</span>
                </div>
                <div style={{background:T.primaryLight,borderRadius:9,padding:'1px 5px'}}><span style={{fontSize:7,color:T.primaryText}}>{sty.name}</span></div>
              </div>
            </div>

            <div ref={canvasRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
              className="canvas-h" style={{height:320,cursor:isDragging?'grabbing':'grab',position:'relative',background:canvasBg,overflow:'hidden',userSelect:'none',transition:'background 0.4s'}}>
              <FurnitureRenderer type={config.type} material={config.material} style={config.style} finish={config.finish} rotation={rotation} zoom={zoom}/>
              <div style={{position:'absolute',top:6,left:8,background:'rgba(255,255,255,0.7)',backdropFilter:'blur(6px)',borderRadius:5,padding:'1px 5px'}}>
                <span style={{fontSize:7,color:T.textMuted}}>{sty.name} room</span>
              </div>
              <div style={{position:'absolute',top:6,right:8,background:'rgba(255,255,255,0.7)',backdropFilter:'blur(6px)',borderRadius:5,padding:'1px 5px'}}>
                <span style={{fontSize:7,color:T.textMuted}}>{fin.label}</span>
              </div>
              {spinning && <div style={{position:'absolute',bottom:8,left:'50%',transform:'translateX(-50%)',background:T.surface,borderRadius:12,padding:'1px 8px',border:`1px solid ${T.border}`}}><p style={{fontSize:8,color:T.primary}}>360° view</p></div>}
            </div>

            <div className="canvas-controls-bot" style={{display:'flex',alignItems:'center',justifyContent:'space-between', padding:'0.35rem 0.6rem',borderTop:`1px solid ${T.border}`,background:T.surface}}>
              <div style={{display:'flex',alignItems:'center',gap:2}}>
                <button onClick={()=>setRotation(r=>r-45)} className="btn-ghost" style={{width:20,height:20,borderRadius:'50%',padding:0,fontSize:12}}>←</button>
                <span style={{fontSize:7,color:T.textMuted}}>rotate</span>
                <button onClick={()=>setRotation(r=>r+45)} className="btn-ghost" style={{width:20,height:20,borderRadius:'50%',padding:0,fontSize:12}}>→</button>
              </div>
              <div style={{display:'flex',gap:4}}>
                <button onClick={()=>setRotation(-22)} className="btn-ghost" style={{fontSize:8,padding:'2px 5px'}}>↺</button>
                <button onClick={()=>step===3?setShowQuote(true):goStep3()} className="btn-primary" style={{padding:'3px 8px',fontSize:9}}>{step===3?'Quote':'Complete'}</button>
              </div>
            </div>
          </div>

          <div className="mat-info-bar" style={{marginTop:4,...card,padding:'0.4rem 0.6rem',display:'flex',alignItems:'center',gap:6}}>
            <div style={{display:'flex',borderRadius:4,overflow:'hidden',height:24,width:40}}>
              {[mat.sh,mat.edge,mat.front,mat.top,mat.hi].map((c,i)=><div key={i} style={{flex:1,background:c}}/>)}
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:9,fontWeight:500,color:T.text}}>{mat.name} · <em style={{fontStyle:'italic',color:T.primary}}>{mat.texture}</em></p>
              <p style={{fontSize:7,color:T.textMuted}}>rough {Math.round(mat.rough*100)}% · refl {Math.round(mat.refl*100)}%</p>
            </div>
            <div style={{width:24,height:4,borderRadius:2,background:`linear-gradient(90deg,${mat.edge},${mat.top})`,filter:`brightness(${1+fin.gloss*0.8})`}}/>
          </div>
        </div>
      </div>

      <AnimatePresence>{showQuote && <QuoteModal config={config} onClose={()=>setShowQuote(false)}/>}</AnimatePresence>
    </div>
  );
}
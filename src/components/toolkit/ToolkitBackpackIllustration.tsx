"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

/** Premium open-backpack illustration — three labeled toolkit layers with depth & motion. */
export function ToolkitBackpackIllustration() {
  const uid = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();

  const floatTransition = reduceMotion
    ? undefined
    : { duration: 5, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <motion.div
      className="relative mx-auto w-full max-w-xl"
      role="img"
      aria-label="Open backpack containing school notes, AnyExamEasy highlighted in the center, and testing readiness tools"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={floatTransition}
      >
        <svg
          viewBox="0 0 520 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full drop-shadow-[0_28px_56px_rgba(10,37,64,0.14)]"
        >
          <defs>
            <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="520" y2="480" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f0fdfa" />
              <stop offset="0.55" stopColor="#f8fafc" />
              <stop offset="1" stopColor="#ecfeff" />
            </linearGradient>
            <linearGradient id={`${uid}-pack`} x1="150" y1="90" x2="370" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#245a8a" />
              <stop offset="0.45" stopColor="#1a4468" />
              <stop offset="1" stopColor="#0A2540" />
            </linearGradient>
            <linearGradient id={`${uid}-pack-side`} x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="#0d3254" />
              <stop offset="1" stopColor="#163656" />
            </linearGradient>
            <linearGradient id={`${uid}-flap`} x1="200" y1="60" x2="320" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2d6a9f" />
              <stop offset="1" stopColor="#1e4976" />
            </linearGradient>
            <linearGradient id={`${uid}-lining`} x1="180" y1="150" x2="340" y2="330" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1a3d5c" />
              <stop offset="1" stopColor="#0f2d47" />
            </linearGradient>
            <linearGradient id={`${uid}-hero-glow`} x1="200" y1="180" x2="320" y2="300" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00D4C8" stopOpacity="0.45" />
              <stop offset="1" stopColor="#3B9EFF" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id={`${uid}-card-shine`} x1="168" y1="148" x2="312" y2="276" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="0.4" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id={`${uid}-spot`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(260 200) rotate(90) scale(140 100)">
              <stop stopColor="#00D4C8" stopOpacity="0.22" />
              <stop offset="1" stopColor="#00D4C8" stopOpacity="0" />
            </radialGradient>
            <filter id={`${uid}-soft-glow`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id={`${uid}-card-shadow`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0A2540" floodOpacity="0.18" />
            </filter>
            <filter id={`${uid}-lift`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#00D4C8" floodOpacity="0.35" />
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0A2540" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Canvas */}
          <rect width="520" height="480" rx="36" fill={`url(#${uid}-bg)`} />
          <circle cx="88" cy="72" r="3" fill="#00D4C8" opacity="0.25" />
          <circle cx="432" cy="96" r="2.5" fill="#3B9EFF" opacity="0.3" />
          <circle cx="460" cy="380" r="2" fill="#00D4C8" opacity="0.2" />
          <circle cx="56" cy="360" r="2" fill="#94a3b8" opacity="0.25" />

          {/* Ground shadow */}
          <ellipse cx="260" cy="418" rx="118" ry="16" fill="#0A2540" opacity="0.08" />

          {/* Ambient hero glow */}
          <ellipse cx="260" cy="228" rx="130" ry="96" fill={`url(#${uid}-hero-glow)`} />
          {!reduceMotion && (
            <ellipse cx="260" cy="228" rx="130" ry="96" fill={`url(#${uid}-spot)`} className="toolkit-pulse-glow" />
          )}

          {/* Left depth panel */}
          <path
            d="M148 128c-8 0-14 6-14 14v196c0 8 6 14 14 14v-224z"
            fill={`url(#${uid}-pack-side)`}
            opacity="0.85"
          />
          {/* Right depth panel */}
          <path
            d="M372 128c8 0 14 6 14 14v196c0 8-6 14-14 14v-224z"
            fill="#0a2038"
            opacity="0.7"
          />

          {/* Main body */}
          <path
            d="M148 128c0-32 26-58 58-58h108c32 0 58 26 58 58v218c0 20-16 36-36 36h-152c-20 0-36-16-36-36V128z"
            fill={`url(#${uid}-pack)`}
          />

          {/* Front pocket */}
          <rect x="196" y="318" width="128" height="52" rx="14" fill="#0d3254" opacity="0.55" stroke="#1e4976" strokeWidth="1" />
          <rect x="248" y="334" width="24" height="20" rx="6" fill="#00D4C8" opacity="0.35" />

          {/* Stitching */}
          <path
            d="M168 148h184M168 368h184"
            stroke="#3B9EFF"
            strokeWidth="0.75"
            strokeDasharray="3 5"
            opacity="0.25"
          />

          {/* Open flap (folded back) */}
          <path
            d="M176 88c0-24 20-44 44-44h80c24 0 44 20 44 44v36c-28-8-56-12-84-12s-56 4-84 12V88z"
            fill={`url(#${uid}-flap)`}
          />
          <path
            d="M176 124c28-8 56-12 84-12s56 4 84 12"
            stroke="#00D4C8"
            strokeWidth="1.5"
            opacity="0.4"
          />

          {/* Top handle */}
          <path
            d="M228 44c0-14 12-26 26-26h12c14 0 26 12 26 26"
            stroke="#00D4C8"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.75"
          />
          <rect x="238" y="52" width="44" height="10" rx="5" fill="#00D4C8" opacity="0.85" />

          {/* Inner lining */}
          <rect x="172" y="148" width="176" height="178" rx="18" fill={`url(#${uid}-lining)`} />
          <rect x="184" y="160" width="152" height="154" rx="14" fill="#0a2540" opacity="0.35" />

          {/* Zipper track */}
          <path d="M172 148h176" stroke="#64748b" strokeWidth="2" strokeDasharray="4 3" opacity="0.5" />
          {[...Array(11)].map((_, i) => (
            <rect key={i} x={184 + i * 14} y="143" width="6" height="10" rx="2" fill="#cbd5e1" opacity="0.55" />
          ))}

          {/* Straps + buckles */}
          <path d="M196 128v-32" stroke="#00D4C8" strokeWidth="7" strokeLinecap="round" opacity="0.65" />
          <path d="M324 128v-32" stroke="#00D4C8" strokeWidth="7" strokeLinecap="round" opacity="0.65" />
          <rect x="188" y="88" width="16" height="10" rx="3" fill="#3B9EFF" opacity="0.5" />
          <rect x="316" y="88" width="16" height="10" rx="3" fill="#3B9EFF" opacity="0.5" />

          {/* ── Left item: School Notes ── */}
          <g transform="translate(98, 178)" filter={`url(#${uid}-card-shadow)`}>
            <rect x="0" y="0" width="92" height="114" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Spiral binding */}
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx="10" cy={22 + i * 18} r="3.5" fill="none" stroke="#94a3b8" strokeWidth="1.25" />
            ))}
            <rect x="18" y="14" width="62" height="7" rx="3.5" fill="#64748b" opacity="0.35" />
            <rect x="18" y="30" width="54" height="4" rx="2" fill="#e2e8f0" />
            <rect x="18" y="40" width="58" height="4" rx="2" fill="#e2e8f0" />
            <rect x="18" y="50" width="48" height="4" rx="2" fill="#fef08a" opacity="0.7" />
            <rect x="18" y="60" width="56" height="4" rx="2" fill="#e2e8f0" />
            <rect x="18" y="74" width="52" height="4" rx="2" fill="#e2e8f0" />
            <rect x="18" y="84" width="44" height="4" rx="2" fill="#e2e8f0" />
            <line x1="24" y1="18" x2="24" y2="96" stroke="#bfdbfe" strokeWidth="1" opacity="0.6" />
          </g>
          {/* Callout — School Notes */}
          <g className={reduceMotion ? undefined : "toolkit-callout-left"}>
            <path d="M190 218 L148 198" stroke="#94a3b8" strokeWidth="1.25" strokeDasharray="3 3" opacity="0.6" />
            <rect x="24" y="182" width="118" height="28" rx="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.25" />
            <text x="83" y="200" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">
              Your School Notes
            </text>
          </g>

          {/* ── Center item: AnyExamEasy (hero) ── */}
          <g transform="translate(178, 156)" filter={`url(#${uid}-lift)`}>
            {!reduceMotion && (
              <rect
                x="-6"
                y="-6"
                width="156"
                height="140"
                rx="22"
                fill="none"
                stroke="#00D4C8"
                strokeWidth="2"
                opacity="0.5"
                className="toolkit-pulse-ring"
              />
            )}
            <rect x="0" y="0" width="144" height="128" rx="18" fill="#ffffff" stroke="#00D4C8" strokeWidth="2.5" />
            <rect x="0" y="0" width="144" height="128" rx="18" fill="#00D4C8" opacity="0.07" />
            <rect x="0" y="0" width="144" height="64" rx="18" fill={`url(#${uid}-card-shine)`} opacity="0.55" />
            <circle cx="72" cy="46" r="24" fill="#00D4C8" opacity="0.14" />
            <path
              d="M72 30l5 10h11l-9 7 3 10-10-7-10 7 3-10-9-7h11l5-10z"
              fill="#00D4C8"
            />
            {/* Mini roadmap lines */}
            <rect x="28" y="72" width="88" height="4" rx="2" fill="#e2e8f0" />
            <rect x="28" y="72" width="52" height="4" rx="2" fill="#00D4C8" opacity="0.65" />
            <rect x="28" y="82" width="72" height="3" rx="1.5" fill="#e2e8f0" />
            <text x="72" y="104" textAnchor="middle" fill="#0A2540" fontSize="13.5" fontWeight="700" fontFamily="system-ui, sans-serif">
              AnyExamEasy
            </text>
            <text x="72" y="120" textAnchor="middle" fill="#00b8ad" fontSize="8.5" fontWeight="600" fontFamily="system-ui, sans-serif">
              Practice · Roadmaps · Confidence
            </text>
            {/* Sparkles */}
            {!reduceMotion && (
              <>
                <circle cx="12" cy="20" r="2" fill="#00D4C8" className="toolkit-sparkle" style={{ animationDelay: "0s" }} />
                <circle cx="132" cy="36" r="1.5" fill="#3B9EFF" className="toolkit-sparkle" style={{ animationDelay: "0.6s" }} />
                <circle cx="8" cy="100" r="1.5" fill="#3B9EFF" className="toolkit-sparkle" style={{ animationDelay: "1.2s" }} />
                <circle cx="138" cy="88" r="2" fill="#00D4C8" className="toolkit-sparkle" style={{ animationDelay: "0.3s" }} />
              </>
            )}
          </g>
          {/* Callout — AnyExamEasy */}
          <g className={reduceMotion ? undefined : "toolkit-callout-center"}>
            <path d="M260 156 L260 128" stroke="#00D4C8" strokeWidth="1.5" opacity="0.7" />
            <rect x="188" y="96" width="144" height="28" rx="14" fill="#0A2540" />
            <text x="260" y="114" textAnchor="middle" fill="#00D4C8" fontSize="10.5" fontWeight="700" fontFamily="system-ui, sans-serif">
              ★ Essential prep layer
            </text>
          </g>

          {/* ── Right item: Testing Tools ── */}
          <g transform="translate(330, 178)" filter={`url(#${uid}-card-shadow)`}>
            <rect x="0" y="0" width="92" height="114" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="12" y="12" width="68" height="10" rx="5" fill="#3B9EFF" opacity="0.2" />
            {/* Checklist rows */}
            {[
              { y: 34, checked: true },
              { y: 54, checked: true },
              { y: 74, checked: false },
            ].map(({ y, checked }, i) => (
              <g key={i}>
                <rect x="16" y={y} width="14" height="14" rx="4" fill={checked ? "#00D4C8" : "#f1f5f9"} opacity={checked ? 0.35 : 1} stroke={checked ? "#00D4C8" : "#cbd5e1"} strokeWidth="1" />
                {checked && (
                  <path d={`M19 ${y + 8} l3 3 6-6`} stroke="#00a89e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                )}
                <rect x="36" y={y + 4} width={i === 2 ? 28 : 38} height="4" rx="2" fill="#e2e8f0" />
              </g>
            ))}
            {/* Progress bar */}
            <rect x="16" y="96" width="60" height="5" rx="2.5" fill="#e2e8f0" />
            <rect x="16" y="96" width="44" height="5" rx="2.5" fill="#3B9EFF" opacity="0.55" />
          </g>
          {/* Callout — Testing Tools */}
          <g className={reduceMotion ? undefined : "toolkit-callout-right"}>
            <path d="M330 218 L372 198" stroke="#94a3b8" strokeWidth="1.25" strokeDasharray="3 3" opacity="0.6" />
            <rect x="378" y="182" width="118" height="28" rx="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.25" />
            <text x="437" y="200" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">
              Testing &amp; Readiness
            </text>
          </g>
        </svg>
      </motion.div>

      <style jsx>{`
        @keyframes toolkit-pulse-glow {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.04);
          }
        }
        @keyframes toolkit-pulse-ring {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.03);
          }
        }
        @keyframes toolkit-sparkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes toolkit-callout-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .toolkit-pulse-glow {
          transform-origin: 260px 228px;
          animation: toolkit-pulse-glow 3.5s ease-in-out infinite;
        }
        .toolkit-pulse-ring {
          transform-origin: 72px 64px;
          animation: toolkit-pulse-ring 2.8s ease-in-out infinite;
        }
        .toolkit-sparkle {
          transform-origin: center;
          animation: toolkit-sparkle 2.4s ease-in-out infinite;
        }
        .toolkit-callout-left {
          animation: toolkit-callout-in 0.6s ease-out 0.35s both;
        }
        .toolkit-callout-center {
          animation: toolkit-callout-in 0.6s ease-out 0.15s both;
        }
        .toolkit-callout-right {
          animation: toolkit-callout-in 0.6s ease-out 0.5s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .toolkit-pulse-glow,
          .toolkit-pulse-ring,
          .toolkit-sparkle,
          .toolkit-callout-left,
          .toolkit-callout-center,
          .toolkit-callout-right {
            animation: none;
          }
        }
      `}</style>
    </motion.div>
  );
}

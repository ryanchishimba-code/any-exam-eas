/** Shared SVG gradients and filters for the anatomy atlas. */
export function AtlasDefs() {
  return (
    <defs>
      <linearGradient id="atlas-bg-radial" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="atlas-skin" x1="30%" y1="0%" x2="70%" y2="100%">
        <stop offset="0%" stopColor="#f0d4b8" />
        <stop offset="55%" stopColor="#ddb896" />
        <stop offset="100%" stopColor="#c49a6c" />
      </linearGradient>
      <linearGradient id="atlas-muscle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c96a62" />
        <stop offset="100%" stopColor="#8f3f3a" />
      </linearGradient>
      <linearGradient id="atlas-bone" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#faf8f4" />
        <stop offset="100%" stopColor="#ddd8ce" />
      </linearGradient>
      <filter id="atlas-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.25" />
      </filter>
      <filter id="atlas-selected-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

function ThreatLensLogo({ size = 40, showText = true }) {
  return (
    <div
      className="threatlens-brand"
      style={{ "--logo-size": `${size}px` }}
    >
      <svg
        className="threatlens-shield"
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ThreatLens shield logo"
      >
        <path
          d="M32 4L54 12V28C54 42 45.2 54.4 32 60C18.8 54.4 10 42 10 28V12L32 4Z"
          fill="currentColor"
          opacity="0.16"
        />

        <path
          d="M32 4L54 12V28C54 42 45.2 54.4 32 60C18.8 54.4 10 42 10 28V12L32 4Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        <path
          d="M32 16L23 28L29 28L25 40L41 25L34 25L39 16H32Z"
          fill="currentColor"
        />
      </svg>

      {showText && (
        <span className="threatlens-wordmark">
          ThreatLens
        </span>
      )}
    </div>
  );
}

export default ThreatLensLogo;

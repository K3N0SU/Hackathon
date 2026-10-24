export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="currentColor" />
      <g
        fill="none"
        stroke="var(--background)"
        strokeWidth="5"
        strokeLinecap="round"
      >
        <path d="M32 12C31 30 22 44 12 54" />
        <path d="M32 12V54" />
        <path d="M32 12C33 30 42 44 52 54" />
      </g>
    </svg>
  );
}

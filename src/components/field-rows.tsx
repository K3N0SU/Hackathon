const offsets = [-7, -5, -3, -1, 1, 3, 5, 7];

export function FieldRows({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 800"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2">
        {offsets.map((offset) => (
          <path
            key={offset}
            d={`M500 -40Q${500 + offset * 34} 320 ${500 + offset * 190} 840`}
          />
        ))}
      </g>
    </svg>
  );
}

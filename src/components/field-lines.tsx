const rows = Array.from({ length: 16 }, (_, index) => index);

function furrow(index: number, side: 1 | -1) {
  const spread = (index + 1) / rows.length;
  const startX = 720 + side * (40 + spread * 1100);
  const control = 720 + side * (20 + spread * 260);
  return `M${startX} 900 Q${control} 520 720 320`;
}

export function FieldLines({
  className = "",
  draw = true,
  horizon = true,
}: {
  className?: string;
  draw?: boolean;
  horizon?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {horizon && (
        <path
          d="M0 320H1440"
          pathLength={1}
          className={draw ? "draw" : ""}
          style={{ "--delay": "0.2s" } as React.CSSProperties}
        />
      )}
      {rows.map((index) =>
        ([1, -1] as const).map((side) => (
          <path
            key={`${index}-${side}`}
            d={furrow(index, side)}
            pathLength={1}
            className={draw ? "draw" : ""}
            style={
              {
                "--delay": `${0.3 + index * 0.07}s`,
                opacity: 0.25 + ((rows.length - index) / rows.length) * 0.75,
              } as React.CSSProperties
            }
          />
        )),
      )}
    </svg>
  );
}

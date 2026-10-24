type Layer = {
  fill: string;
  base: number;
  radius: number;
  gap: number;
  shift: string;
  seed: number;
};

const layers: Layer[] = [
  { fill: "#6b4f31", base: 452, radius: 15, gap: 40, shift: "120px", seed: 1 },
  { fill: "#46372a", base: 486, radius: 22, gap: 60, shift: "90px", seed: 2 },
  { fill: "#26301f", base: 528, radius: 32, gap: 90, shift: "55px", seed: 3 },
  { fill: "#0f1d14", base: 578, radius: 46, gap: 132, shift: "20px", seed: 4 },
];

function noise(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

const stars = Array.from({ length: 40 }, (_, index) => ({
  left: `${(noise(index + 40) * 100).toFixed(2)}%`,
  top: `${(noise(index + 90) * 48).toFixed(2)}%`,
  size: index % 5 === 0 ? 3 : 2,
  delay: `${((index % 7) * 0.7).toFixed(1)}s`,
}));

const motes = Array.from({ length: 14 }, (_, index) => ({
  left: `${8 + ((index * 37) % 86)}%`,
  bottom: `${6 + ((index * 17) % 30)}%`,
  delay: `${(index % 6) * 1.3}s`,
  duration: `${7 + (index % 4) * 2}s`,
}));

function Canopies({ layer }: { layer: Layer }) {
  const trees = [];
  let index = 0;
  for (let x = -layer.gap; x < 1440 + layer.gap; x += layer.gap) {
    const size = layer.radius * (0.85 + noise(index + layer.seed * 11) * 0.35);
    const centre = x + (noise(index * 3 + layer.seed) - 0.5) * layer.gap * 0.35;
    const trunk = size * 0.85;
    const crown = layer.base - trunk - size * 0.45;
    trees.push(
      <g key={index}>
        <path
          d={`M${centre - size * 0.06} ${layer.base + 2}L${centre - size * 0.04} ${crown}L${centre + size * 0.04} ${crown}L${centre + size * 0.06} ${layer.base + 2}Z`}
        />
        <circle cx={centre} cy={crown - size * 0.25} r={size * 0.8} />
        <circle
          cx={centre - size * 0.62}
          cy={crown + size * 0.08}
          r={size * 0.6}
        />
        <circle
          cx={centre + size * 0.6}
          cy={crown + size * 0.04}
          r={size * 0.64}
        />
        <circle
          cx={centre + size * 0.1}
          cy={crown + size * 0.22}
          r={size * 0.62}
        />
      </g>,
    );
    index++;
  }
  return (
    <>
      {trees}
      <rect x="0" y={layer.base} width="1440" height={620 - layer.base} />
    </>
  );
}

export function HeroScene({ still = false }: { still?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#08130e_0%,#132219_38%,#3d3122_66%,#a8703a_88%,#d99a4e_100%)]" />
      <div className="absolute bottom-[14%] left-1/2 size-[46rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,#ffd28a_0%,#e9a456_18%,rgba(217,154,78,0.35)_38%,transparent_68%)]" />
      {stars.map((star, index) => (
        <span
          key={index}
          className="twinkle absolute rounded-full bg-amber-50"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
      {layers.map((layer) => (
        <div
          key={layer.seed}
          className={`${still ? "" : "parallax "}absolute inset-x-0 bottom-0 h-[34%] min-h-56`}
          style={{ "--shift": layer.shift } as React.CSSProperties}
        >
          <svg
            viewBox="0 0 1440 620"
            preserveAspectRatio="xMidYMax slice"
            className="absolute bottom-0 left-1/2 h-full w-full min-w-[56rem] -translate-x-1/2"
            fill={layer.fill}
          >
            <Canopies layer={layer} />
          </svg>
        </div>
      ))}
      {motes.map((mote, index) => (
        <span
          key={index}
          className="mote absolute size-1 rounded-full bg-amber-200"
          style={{
            left: mote.left,
            bottom: mote.bottom,
            animationDelay: mote.delay,
            animationDuration: mote.duration,
          }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0b1710] to-transparent" />
      <div className="grain absolute inset-0" />
    </div>
  );
}

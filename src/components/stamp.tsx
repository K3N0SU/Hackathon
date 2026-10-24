export function Stamp({ text }: { text: string }) {
  return (
    <span
      aria-hidden="true"
      className="stamp pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 rounded-md border-[5px] border-danger px-5 py-2 font-display text-5xl font-semibold uppercase tracking-wider text-danger opacity-0 mix-blend-multiply sm:text-6xl"
    >
      {text}
    </span>
  );
}

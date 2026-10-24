import { Mark } from "@/components/mark";
import { samples } from "@/lib/samples";
import { copy } from "@/lib/scan";

const result = samples[0].results.pa;
const text = copy.pa;

export function Phone({ className }: { className?: string }) {
  return (
    <div
      lang="pa"
      className={`w-[19rem] rounded-[2.75rem] border-[10px] border-[#14231a] bg-background p-4 shadow-2xl shadow-black/30 ${className ?? ""}`}
    >
      <div className="mx-auto h-1.5 w-16 rounded-full bg-[#14231a]/20" />
      <div className="mt-3 flex items-center gap-2 font-heading text-lg font-semibold text-primary">
        <Mark className="size-5" />
        Furrow
      </div>
      <span className="mt-4 inline-block rounded-md bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-950">
        {text.signal.caution}
      </span>
      <p className="mt-1.5 font-heading text-lg font-semibold leading-snug">
        {result.product}
      </p>
      <div className="mt-3 rounded-xl bg-primary p-3.5 text-primary-foreground">
        <p className="text-xs opacity-80">{text.reentry}</p>
        <p className="mt-1 font-heading text-base font-semibold leading-snug">
          {result.reentry}
        </p>
      </div>
      <div className="mt-3 rounded-xl bg-red-700 p-3.5 text-white">
        <p className="text-sm font-medium">{result.product}</p>
        <p className="mt-0.5 font-heading text-xl font-semibold tabular-nums">
          11 {text.hoursUnit} 42 {text.minutesUnit} {text.leftWord}
        </p>
      </div>
      <p className="mt-4 font-heading text-base font-semibold">{text.gear}</p>
      <ul className="mt-1 list-disc space-y-1 pl-4 text-sm leading-snug marker:text-primary">
        {result.gear.slice(0, 2).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
